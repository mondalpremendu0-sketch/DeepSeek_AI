# DeepSeek_AI

# DeepSeek-Gemini Workspace Backend (MERN Stack Architecture)

A production-ready, high-performance AI orchestration backend built using Node.js, Express, and Socket.io. This system interfaces directly with the **Google Gemini API**, utilizing advanced prompt injection techniques to replicate DeepSeek's famous multi-stage reasoning engine. It splits and streams thinking processes (`<think>` blocks) and final text outputs in real time.

---

## 🏗️ Architectural Core Highlights

- **Protocol Decoupling Optimization:** Business logic (Express REST endpoints) is separated cleanly from networking transport layers (Socket.io WebSockets). Standard endpoints handle administration data states, while a single long-lived TCP connection manages low-latency token streaming.
- **Relational Database Durability:** Implements a One-to-Many relational referencing pattern between `ChatSessions` and `Messages`. This pattern breaks document boundaries and completely circumvents MongoDB's strict **16MB document size limit**.
- **Sub-Millisecond Query Indexing:** Database schemas are structured with advanced compound indexing keys to guarantee high-performance chronological conversation lookups as the data logs scale.
- **UX-Shielded Background Persistence:** Employs an asynchronous, non-blocking background execution routine to log streams to MongoDB. The server fires the `stream_done` signal to the frontend client **first**, completely bypassing data-write latency and eliminating user-end lag.

---

## 📁 Project Directory Blueprints

The backend codebase utilizes an enterprise-grade modular layout separating concerns logically inside the `src/` directory:

```text
backend/
├── .env                  # Secure Environment Configuration Crypt
├── server.js             # Network Executive Entry Point (HTTP Wrapper & WebSocket Boot)
└── src/
    ├── app.js            # Express Business Logic & REST Routing Configurations
    ├── config/
    │   └── db.js         # Mongoose Database Ecosystem Pool Wrapper
    ├── controllers/
    │   └── chat.controller.js  # REST Administrative State Controllers (CRUD)
    ├── model/
    │   ├── chatSession.model.js # Lightweight Session Metadata Collection Schema
    │   └── message.model.js     # Heavy Conversational Text & Latency Log Schema
    ├── routes/
    │   └── chat.route.js  # Versioned Endpoint Mapper
    ├── service/
    │   └── ai.service.js  # Isolated LLM Vendor Core Gateway (Gemini API)
    └── sockets/
        └── server.socket.js # Live Token Streaming Parser State Machine Controller
```
