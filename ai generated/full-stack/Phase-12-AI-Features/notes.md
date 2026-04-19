# 🤖 Phase 12: Advanced AI Features

## AI in Modern Web Development

AI features are now a competitive requirement in modern applications. This phase covers:
1. **OpenAI API** — text generation, embeddings, function calling
2. **LangChain** — building AI pipelines and agents
3. **Vector Databases** — semantic search with Pinecone
4. **Vercel AI SDK** — streaming AI responses in Next.js
5. **RAG** — Retrieval-Augmented Generation

---

# 🧠 OpenAI API

## Setup
```bash
npm install openai
```

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
```

## Text Generation — Chat Completions

```typescript
// Basic chat completion
async function chat(userMessage: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",               // or gpt-3.5-turbo, gpt-4-turbo
    messages: [
      {
        role: "system",            // sets AI behavior/persona
        content: "You are a helpful assistant that speaks in a professional tone."
      },
      {
        role: "user",              // user's message
        content: userMessage
      }
    ],
    temperature: 0.7,              // 0 = deterministic, 2 = creative
    max_tokens: 500,               // max response length
    presence_penalty: 0.1,         // discourage repeating topics
    frequency_penalty: 0.1         // discourage repeating words
  });

  return response.choices[0].message.content;
}

// Multi-turn conversation (maintain history)
async function multiTurnChat() {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: "You are a coding tutor." }
  ];

  // Add user message
  messages.push({ role: "user", content: "Explain closures in JavaScript" });

  const reply1 = await openai.chat.completions.create({
    model: "gpt-4o",
    messages
  });

  // Add assistant's reply to history
  messages.push(reply1.choices[0].message);

  // Continue conversation
  messages.push({ role: "user", content: "Can you give me an example?" });

  const reply2 = await openai.chat.completions.create({
    model: "gpt-4o",
    messages // includes full conversation history
  });

  return reply2.choices[0].message.content;
}
```

## Streaming Responses

```typescript
// Stream the response token by token (better UX — no waiting)
async function streamChat(userMessage: string) {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: userMessage }],
    stream: true
  });

  let fullResponse = "";
  
  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(token);   // print each token as it arrives
    fullResponse += token;
  }
  
  return fullResponse;
}

// In Express (Server-Sent Events):
app.get("/api/chat/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: req.query.message as string }],
    stream: true
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
  }

  res.write("data: [DONE]\n\n");
  res.end();
});
```

## Function Calling (Tool Use)

```typescript
// Function calling lets the AI call YOUR functions with structured arguments
const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get current weather for a city",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "City name, e.g. 'Mumbai'"
          },
          units: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "Temperature units"
          }
        },
        required: ["city"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_database",
      description: "Search for products in the database",
      parameters: {
        type: "object",
        properties: {
          query:    { type: "string" },
          category: { type: "string" },
          maxPrice: { type: "number" }
        },
        required: ["query"]
      }
    }
  }
];

// Your actual functions
const availableFunctions: { [key: string]: Function } = {
  get_weather: async ({ city, units = "celsius" }) => {
    const response = await fetch(`https://api.weather.com?city=${city}`);
    return await response.json();
  },
  search_database: async ({ query, category, maxPrice }) => {
    const products = await db.select().from(productsTable)
      .where(like(productsTable.name, `%${query}%`));
    return products;
  }
};

async function chatWithTools(userMessage: string) {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "user", content: userMessage }
  ];

  // First call — might request tool use
  let response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    tools,
    tool_choice: "auto"  // let model decide when to use tools
  });

  // Handle tool calls in a loop (model might call multiple tools)
  while (response.choices[0].finish_reason === "tool_calls") {
    const toolCalls = response.choices[0].message.tool_calls!;
    
    // Add assistant's tool call request to history
    messages.push(response.choices[0].message);

    // Execute each tool call
    for (const toolCall of toolCalls) {
      const args = JSON.parse(toolCall.function.arguments);
      const result = await availableFunctions[toolCall.function.name](args);
      
      // Add tool result to history
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result)
      });
    }

    // Call again with tool results
    response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      tools
    });
  }

  return response.choices[0].message.content;
}

// Example:
// User: "What's the weather in Mumbai and find me a laptop under ₹50000?"
// Model calls: get_weather(Mumbai) AND search_database(laptop, maxPrice: 50000)
// Gets results, incorporates them, returns natural language answer
```

## Embeddings — Semantic Search

```typescript
// Embeddings convert text to a vector of numbers.
// Similar texts → similar vectors (small distance in vector space)
// Use for: semantic search, recommendations, finding similar content

// Generate embedding
async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",   // 1536 dimensions, fast, cheap
    input: text
  });
  return response.data[0].embedding;
}

// Cosine similarity — measure how similar two vectors are (0 to 1)
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Store embeddings in PostgreSQL (with pgvector extension!)
// CREATE EXTENSION vector;
// In schema:
// embedding vector(1536)    → pgvector data type

// Semantic search:
async function semanticSearch(query: string, limit = 10) {
  const queryEmbedding = await getEmbedding(query);
  
  // Find most similar documents using cosine similarity
  const results = await db.execute(`
    SELECT id, title, content,
           1 - (embedding <=> $1::vector) AS similarity
    FROM documents
    ORDER BY embedding <=> $1::vector  -- <=> is cosine distance
    LIMIT $2
  `, [JSON.stringify(queryEmbedding), limit]);
  
  return results;
}
```

---

# 🔗 LangChain

## What is LangChain?
LangChain is a framework for building LLM-powered applications. It provides:
- **Chains** — sequence of operations
- **Agents** — AI that chooses which tools to use
- **Memory** — conversation history management
- **Retrievers** — fetch relevant documents
- **Prompts** — structured prompt management

```bash
npm install langchain @langchain/openai @langchain/community
```

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Basic LangChain chain
const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.7
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant. Answer in {language}."],
  ["human", "{question}"]
]);

const outputParser = new StringOutputParser();

// Chain = prompt | model | parser
const chain = prompt.pipe(model).pipe(outputParser);

const result = await chain.invoke({
  language: "Hindi",
  question: "What is photosynthesis?"
});
console.log(result); // Answer in Hindi!

// Streaming
const stream = await chain.stream({
  language: "English",
  question: "Explain quantum computing"
});

for await (const chunk of stream) {
  process.stdout.write(chunk);
}
```

---

# 🗄️ Vector Database — Pinecone

```bash
npm install @pinecone-database/pinecone
```

```typescript
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pinecone.index("my-index");

// Upsert vectors (insert or update)
await index.upsert([
  {
    id: "doc-1",
    values: await getEmbedding("React is a UI library"),
    metadata: { source: "react-docs", title: "Introduction to React", url: "https://react.dev" }
  },
  {
    id: "doc-2", 
    values: await getEmbedding("Vue.js is a progressive JavaScript framework"),
    metadata: { source: "vue-docs", title: "Vue.js Guide" }
  }
]);

// Query (semantic search)
const queryVector = await getEmbedding("how to build components");
const results = await index.query({
  vector: queryVector,
  topK: 5,                        // Return top 5 most similar
  includeMetadata: true,
  filter: { source: "react-docs" } // optional metadata filter
});

// Process results
results.matches.forEach(match => {
  console.log(`Score: ${match.score?.toFixed(3)} | ${match.metadata?.title}`);
});
```

---

# 📨 RAG — Retrieval-Augmented Generation

RAG = Retrieve relevant info from your database + Augment the AI's prompt with it = Better, accurate answers

```
User's Question
    ↓
Convert to Embedding
    ↓
Search Vector DB (find similar docs)
    ↓
Retrieve Top K Documents
    ↓
Add documents to LLM prompt as context
    ↓
LLM generates answer based on YOUR data
    ↓
Accurate, grounded response (no hallucination)
```

```typescript
async function ragChat(userQuestion: string) {
  // 1. Embed the user's question
  const questionEmbedding = await getEmbedding(userQuestion);

  // 2. Find similar documents in Pinecone
  const results = await pineconeIndex.query({
    vector: questionEmbedding,
    topK: 5,
    includeMetadata: true
  });

  // 3. Extract relevant text from results
  const context = results.matches
    .filter(m => (m.score || 0) > 0.75)  // only sufficiently similar
    .map(m => m.metadata?.content)
    .join("\n\n---\n\n");

  // 4. Build augmented prompt
  const augmentedPrompt = `
You are a helpful assistant. Answer the user's question based ONLY on the 
provided context. If the answer cannot be found in the context, say so 
honestly — don't make things up.

Context:
${context}

User Question: ${userQuestion}
`;

  // 5. Send to LLM with retrieved context
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: augmentedPrompt }]
  });

  return response.choices[0].message.content;
}
```

---

# ⚡ Vercel AI SDK — Streaming in Next.js

```bash
npm install ai @ai-sdk/openai
```

```typescript
// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";     // run on edge for lower latency

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: "You are a helpful coding assistant.",
    messages,
    temperature: 0.7
  });

  return result.toDataStreamResponse(); // streams to client automatically
}

// components/Chat.tsx
"use client";
import { useChat } from "ai/react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat"
  });

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map(m => (
          <div key={m.id} className={`message ${m.role}`}>
            <span className="role">{m.role === "user" ? "You" : "AI"}:</span>
            <p>{m.content}</p>
          </div>
        ))}
        {isLoading && <div className="typing-indicator">AI is typing...</div>}
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}
```

---

# 🖼️ Image Generation — DALL-E 3

```typescript
// Generate an image
async function generateImage(prompt: string) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    size: "1024x1024",           // 1024x1024, 1024x1792, 1792x1024
    quality: "hd",               // standard or hd
    style: "vivid",              // vivid or natural
    n: 1
  });

  return response.data[0].url;
}

// In a Next.js route:
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const imageUrl = await generateImage(prompt);
  return Response.json({ url: imageUrl });
}
```
