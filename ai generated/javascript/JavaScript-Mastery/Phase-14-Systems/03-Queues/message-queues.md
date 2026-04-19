# Topic 03: Message Queues & Event-Driven Architecture

## 1. The Deep Dive: Why Message Queues (MQ)?
In a monolithic system, if User A uploads a video, the server hangs until the video is processed. In an Event-Driven system, we use a **Queue**.

- **Producer**: The web server. It says "Here is a video job," drops it in the queue, and immediately tells the user "Processing started!"
- **Queue**: A persistent buffer (RabbitMQ, Redis/BullMQ, Kafka).
- **Consumer (Worker)**: A separate Node.js process (maybe on another machine) that picks up jobs and does the heavy lifting.

## 2. Dealing with Backpressure
If 1000 users upload videos but you only have 2 Workers, the queue will grow.
- **Scaling**: A message queue allows you to simply spin up more Worker containers to handle the spike, without changing your web server code.

## 3. Internal Working (Ack/Nack)
Message Queues ensure **Reliability**:
- **Ack (Acknowledge)**: Consumer tells the queue "I finished the job, you can delete it."
- **Nack (Negative Ack)**: Consumer says "I failed or crashed." The queue then puts the job back for another worker to try.

## 4. Visual Mental Model: The Post Office
- **Direct Call**: You drive to your friend's house and wait for them to finish reading a 500-page book you gave them.
- **Message Queue**: You drop the book in a Post Office Box (The Queue). A postal worker (The Consumer) picks it up later, reads it, and sends a postcard (Event) when done. You are free to go about your day.

---

## 5. Senior-Level Implementation: BullMQ (Redis-based)

```javascript
/**
 * 1. PRODUCER (In your Web API)
 */
const { Queue } = require('bullmq');
const videoQueue = new Queue('video_processing');

async function handleUpload(req) {
    // Drop heavy task into the queue
    await videoQueue.add('encode_720p', { 
        userId: 123, 
        file: 'movie.mp4' 
    }, {
        attempts: 3, // Auto-retry if worker crashes
        backoff: 5000 // Wait 5s before retry
    });
    
    return "Job Queued!";
}

/**
 * 2. CONSUMER (In a separate Worker process)
 */
const { Worker } = require('bullmq');

const worker = new Worker('video_processing', async (job) => {
    console.log(`[WORKER] Processing: ${job.id}`);
    
    // Simulate heavy work
    await new Promise(r => setTimeout(r, 5000));
    
    return { success: true, url: 'https://cdn.com/res.mp4' };
});

worker.on('completed', (job) => {
    console.log(`[EVENT] Job ${job.id} finished successfully!`);
});
```

---

## 6. Patterns & Anti-Patterns
- **Anti-Pattern**: Using a MQ for simple CRUD. If it takes < 100ms, don't queue it.
- **Pattern**: **Dead Letter Queue (DLQ)**. If a job fails 5 times, move it to a special "Poison Queue" for manual inspection by developers.

## 7. Interview Questions (Q&A)
**Q: What is "Horizontal Scaling" vs "Vertical Scaling"?**
**A**: Vertical is giving one machine more RAM/CPU. Horizontal is adding more machines. Message Queues are the backbone of Horizontal scaling.

**Q: How do you handle "Duplicate Messages"?**
**A**: **Idempotency**. Ensure that if a worker processes the same job twice (due to a network glitch), the result in the DB stays the same.

## 8. Real-world Challenge
1. **Challenge**: Take our "Plugin System" from Phase 9. Integrate a Queue so that every plugin hook is executed as an asynchronous background job.
2. **Challenge**: Research the **Outbox Pattern**. How does it ensure that a Database Save and a Message Queue Publish happen as a single atomic transaction?
