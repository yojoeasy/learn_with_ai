# 📁 System Design #06 — File Storage System
> **Like**: Google Drive, Dropbox, AWS S3, OneDrive  
> **Difficulty**: ⭐⭐⭐ | **Teaches**: Chunking, Deduplication, CDN, Object Storage

---

## 📋 Requirements

### Functional Requirements
- Upload files of any size (up to 10 GB)
- Download files
- Create folders, move/copy/delete files
- Share files (public link or invite specific users)
- File versioning (keep last 10 versions)
- Sync across multiple devices
- Search files by name

### Non-Functional Requirements
- **Users**: 100 million users, 10 million DAU
- **Data**: Each user gets 15 GB free → 100M × 15 GB = **1.5 exabytes**
- **Peak Traffic**: 10,000 uploads/sec, 50,000 downloads/sec
- **Availability**: 99.99% — users expect files always accessible
- **Durability**: 99.999999999% (11 nines) — files must NEVER be lost
- **Budget**: High (storage is the biggest cost)
- **Tech**: Node.js, AWS S3, PostgreSQL, Redis, Kafka, CDN

---

## 1. 🏛️ High-Level Architecture

```
[User's Browser / Mobile / Desktop Client]
         │         │
         │         └── Chunk large files before upload
         │
         ▼
[API Gateway]  ← Auth + Rate Limiting
         │
    ┌────┴────────────────────────────────────┐
    │                                         │
    ▼                                         ▼
[Metadata Service]              [Upload/Download Service]
 (What files exist,              (Handles actual bytes)
  permissions, structure)                │
         │                               │
         ▼                               ▼
  [PostgreSQL]                   [AWS S3 / Object Store]
  (file metadata)                (actual file bytes)
         │                               │
         ▼                               ▼
    [Redis Cache]              [CDN - CloudFront]
    (hot metadata)             (serve files globally)
         │
    [Kafka Events]
    → Virus Scan
    → Thumbnail Generation
    → Search Indexing
    → Sync Notification
```

### Key Insight: Separate Metadata from Data
```
Metadata Service   → Handles WHO has WHAT file (fast DB queries)
Storage Service    → Handles WHERE the bytes are (S3/object store)

This separation allows:
✓ Scale each independently
✓ SQL for metadata queries (search, permissions, versioning)
✓ Object store for raw bytes (infinite scale, cheap)
```

---

## 2. 🗄️ Database Design

### Files Table (PostgreSQL)
```sql
CREATE TABLE files (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id        UUID NOT NULL,           -- who uploaded
    parent_id       UUID REFERENCES files(id),  -- folder it's in (null = root)
    
    name            VARCHAR(255) NOT NULL,
    mime_type       VARCHAR(100),
    size_bytes      BIGINT NOT NULL,
    
    -- Where the actual bytes live
    storage_key     VARCHAR(500),            -- S3 key or NULL (for folders)
    checksum        VARCHAR(64),             -- SHA-256 of content (for dedup)
    
    is_folder       BOOLEAN DEFAULT FALSE,
    is_deleted      BOOLEAN DEFAULT FALSE,   -- soft delete (trash)
    deleted_at      TIMESTAMPTZ,
    
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(owner_id, parent_id, name)        -- no duplicate names in same folder
);

CREATE INDEX idx_owner_parent ON files(owner_id, parent_id) WHERE NOT is_deleted;
CREATE INDEX idx_checksum ON files(checksum) WHERE NOT is_deleted;  -- for dedup
```

### File Versions Table
```sql
CREATE TABLE file_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id         UUID REFERENCES files(id),
    version_number  INTEGER NOT NULL,       -- 1, 2, 3...
    storage_key     VARCHAR(500) NOT NULL,  -- S3 key for this version
    size_bytes      BIGINT NOT NULL,
    checksum        VARCHAR(64),
    uploader_id     UUID,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(file_id, version_number)
);
```

### Shares / Permissions Table
```sql
CREATE TABLE shares (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id         UUID REFERENCES files(id),
    
    -- Who has access
    share_type      VARCHAR(20),  -- 'public_link' | 'user' | 'anyone_with_link'
    shared_with     UUID,         -- user_id if type = 'user'
    share_token     VARCHAR(64) UNIQUE,  -- random token for links
    
    permission      VARCHAR(10),  -- 'view' | 'edit' | 'admin'
    
    expires_at      TIMESTAMPTZ,  -- null = never
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. 📤 Upload Flow — The Core Challenge

### Small Files (< 5 MB): Simple Upload
```
1. Client → POST /api/upload/initiate  (get presigned URL)
2. API returns: S3 presigned URL (valid 1 hour)
3. Client → PUT directly to S3 (bypasses our servers!)
4. S3 stores file → triggers notif → our webhook
5. We store metadata in PostgreSQL
6. Return file info to client

Why presigned URL?
→ Files don't pass through our API servers
→ Saves bandwidth cost + server memory
→ Handles large files efficiently
```

### Large Files (> 5 MB): Chunked Multipart Upload
```
Client-side chunking:
  - Split file into 5 MB chunks
  - Upload chunks in parallel (4 at a time)
  - Retry failed chunks individually
  - Assemble on S3 when all chunks uploaded

Step-by-step:
1. Client: POST /api/upload/multipart/initiate
   Response: { uploadId: "s3-upload-id-123", fileId: "uuid" }

2. Client splits 500MB file into 100 × 5MB chunks

3. For each chunk:
   GET /api/upload/multipart/presigned-url
   { uploadId, partNumber: 1...100 }
   Response: { presignedUrl: "s3://..." }
   Client → PUT chunk directly to S3

4. Client: POST /api/upload/multipart/complete
   { uploadId, parts: [{partNumber, etag}, ...] }

5. S3 assembles chunks → single file
6. We store metadata

Benefits:
✓ Resumable (crash on part 50 → resume from 51)
✓ Parallel upload → faster for large files
✓ No size limit
```

---

## 4. 🔌 API Structure

```
POST /api/upload/initiate              → Get presigned URL for upload
POST /api/upload/multipart/initiate   → Start chunked upload
GET  /api/upload/multipart/url        → Get presigned URL for chunk
POST /api/upload/multipart/complete   → Assemble chunks
POST /api/upload/confirm              → Confirm file metadata after upload

GET  /api/files                        → List files/folders (paginated)
GET  /api/files/:id                    → File/folder metadata
GET  /api/files/:id/download          → Get download URL
DELETE /api/files/:id                  → Move to trash
POST /api/files/:id/restore           → Restore from trash
PUT  /api/files/:id                    → Rename / move
POST /api/folders                      → Create folder

GET  /api/files/:id/versions          → List versions
GET  /api/files/:id/versions/:vId/download → Download specific version

POST /api/shares                       → Create share link
GET  /api/shares/:token               → Access shared file
DELETE /api/shares/:shareId           → Revoke share

GET  /api/search?q=resume.pdf         → Search files by name
GET  /api/storage/usage               → Used / total quota
```

---

## 5. 🔄 Deduplication — Saving Storage Space

```
Problem: 1M users upload the same popular PDF → store 1M copies?

Solution: Content-Addressed Storage

Before storing:
1. Compute SHA-256 hash of file content → "abc123def456..."
2. Check: Does this hash already exist in storage?
3. If YES: Store only a reference (metadata), not the bytes!
4. If NO: Upload to S3 with key = hash, then store metadata

SELECT storage_key FROM files WHERE checksum = 'abc123def456';
-- If found: reuse this S3 object, just create a new metadata row

Result: 
→ Same file uploaded by 1M users = 1 physical copy in S3
→ Massive storage savings!
→ Used by Dropbox (saved petabytes!)

Security Note: Don't dedup user files across different users
by default (privacy concern). Consider dedup only within a user's
account, or for common files (standard libraries, templates).
```

---

## 6. 🖼️ Processing Pipeline (Async)

```
After upload → Kafka event "file.uploaded" triggers:

1. Virus Scanner (ClamAV / AWS Macie)
   → Scan file for malware
   → If infected: quarantine + notify user

2. Thumbnail Generator (for images/PDFs)
   → Lambda function
   → Generate 3 sizes: 64px, 256px, 1024px
   → Store in S3: /thumbnails/{fileId}/thumb_256.jpg

3. Text Extractor (for search)
   → PDFs, Word docs → extract text
   → Index in Elasticsearch for full-text search

4. Sync Notifier
   → "File changed" → push to all user's connected devices
   → Delta sync: send only changed chunks

All async → user doesn't wait for these → faster upload experience
```

---

## 7. ⚡ Caching Strategy

| Data | Cache | TTL | Reason |
|------|-------|-----|--------|
| File metadata | Redis | 5 min | Most accessed files |
| Folder listings | Redis | 2 min | Changes on upload/delete |
| Storage usage | Redis | 5 min | Avoid COUNT every time |
| Download presigned URLs | Client | 1 hour | Avoid re-fetching |
| Thumbnails | CDN | Permanent | Content-addressed URLs |

```javascript
// CDN for downloads (CloudFront + S3)
// Generate presigned URL with short TTL
async function getDownloadUrl(fileId, userId) {
    const file = await getFileMetadata(fileId, userId);  // check permissions
    
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: file.storage_key,
        ResponseContentDisposition: `attachment; filename="${file.name}"`
    });
    
    // Presigned URL valid for 1 hour
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
```

---

## 8. 🔄 Device Sync Strategy

```
Problem: User edits file on desktop → how does mobile know to sync?

Solution: Delta Sync + Long Polling / WebSocket

1. Each file/folder has a "cursor" (change_token):
   - Monotonically increasing number
   - Changes on every modification

2. Client stores its last_known_cursor

3. Client polls: GET /api/sync/changes?since=cursor_12345
   Response: list of changes since that cursor
   
4. Client applies changes locally

Conflict Resolution:
  User edits file on mobile (offline) AND desktop → both connect
  → "Last write wins" or "Create conflict copy" (Dropbox-style)
  → Conflict copy: "report (Ravi's conflicted copy 2026-03-04).pdf"
```

---

## 9. 📈 Scaling Strategy

### Storage
```
AWS S3:
- Virtually unlimited storage
- 11 nines durability (replication across 3+ AZs)
- Lifecycle policies: Move old files to S3 Glacier (90% cheaper)
  - 0-30 days: S3 Standard (fast access)
  - 31-90 days: S3 Infrequent Access
  - 90+ days: S3 Glacier (archive)
- Intelligent Tiering: Auto-moves based on access patterns
```

### Database
```
PostgreSQL:
- Partition files table by owner_id (each user = own shard)
- Index on checksum for dedup lookups
- Full-text search via PostgreSQL trigrams or Elasticsearch
- Read replicas for listing files
```

### API Servers
```
Stateless → horizontally scale
Upload heavy: memory not an issue (presigned URLs bypass server)
Download heavy: served from S3/CDN directly
API: only handles metadata queries → PostgreSQL is the bottleneck
```

---

## 10. 🔒 Security Considerations

| Threat | Mitigation |
|--------|-----------|
| **Unauthorized access** | Signed URLs expire in 1 hour |
| **Malicious file upload** | Virus scan every file before serving |
| **Path traversal** | Store files by UUID, not user-provided names |
| **Storage quota abuse** | Hard quota enforcement before upload |
| **Accidental deletion** | Soft delete (trash) → 30-day recovery |
| **Data loss** | S3 versioning + Cross-region replication |
| **Ransomware** | S3 Object Lock (WORM) for critical data |
| **GDPR deletion** | Hard delete within 30 days of request |

---

## 11. ⚠️ Bottlenecks & Tradeoffs

| Issue | Problem | Solution |
|-------|---------|---------|
| **1.5 exabytes** | Massive cost | Use storage tiers + compression |
| **Large file upload** | Timeout, network failure | Chunked multipart upload + resume |
| **DB at 100M files per user** | Slow queries | Partition by user_id + indexing |
| **Sync conflicts** | Offline edits | Conflict copy or CRDT |
| **Versioning storage** | 10 versions × 100M files | Only version changed chunks (delta) |
| **Search at scale** | Full-text search of PDFs | Async text extraction + Elasticsearch |
| **Hot user files** | Celebrity's public file = 1M downloads | CDN handles this automatically |

---

## 📝 Summary Box

```
┌──────────────────────────────────────────────────────┐
│  FILE STORAGE — KEY DECISIONS                        │
│                                                      │
│  Storage:    AWS S3 (11 nines durability)            │
│  Metadata:   PostgreSQL (queries, ACL, versioning)   │
│  Upload:     Presigned URLs (bypass servers)         │
│  Large:      Chunked multipart upload                │
│  Dedup:      SHA-256 content hash (save costs)       │
│  CDN:        CloudFront for downloads                │
│  Processing: Async Kafka (virus scan, thumbnails)    │
│  Sync:       Delta sync with cursors                 │
│  Lifecycle:  S3 Glacier for cold storage             │
└──────────────────────────────────────────────────────┘
```

**← Previous**: [Notification System](./05-Notification-System.md) | **Next**: [Social Media Feed →](./07-Social-Media-Feed.md)
