# 📝 Full Stack Task Manager (Rust + React + Docker)

![Status](https://img.shields.io/badge/status-active-success)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

A high-performance, containerized Task Management application built to demonstrate a modern microservices architecture. It features a **Rust (Axum)** backend for speed and safety, a **React (TypeScript)** frontend for a responsive UI, and is fully orchestrated using **Docker Compose** with an **Nginx Reverse Proxy**.

## 🚀 Key Features

* **⚡ High Performance Backend:** Built with Rust and Axum for near-instant response times.
* **⚛️ Modern Frontend:** React with TypeScript and Vite for a type-safe, fast user experience.
* **🐳 Fully Containerized:** Runs anywhere (Linux, Mac, Windows) with a single command via Docker Compose.
* **💾 Data Persistence:** Docker Volumes ensure tasks survive container restarts and updates.
* **🛡️ Nginx Reverse Proxy:** Custom Nginx configuration handles routing between Frontend and Backend, eliminating CORS issues and enabling easy deployment.
* **📱 Mobile Compatible:** API routing allows the app to be accessed securely from mobile devices via tunneling (e.g., Cloudflare).

---

## 🏗️ Architecture

The application uses a multi-container Docker setup orchestrated by Docker Compose:

| Service | Technology | Internal Port | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + Nginx | `80` | Serves static assets and proxies API requests. |
| **Backend** | Rust (Axum) | `3000` | REST API handling business logic and DB operations. |
| **Database** | SQLite | N/A | Embedded SQL database with persistent file storage. |

### The Reverse Proxy Pattern
Instead of the frontend calling the backend directly (which causes CORS and network issues in production), **Nginx** acts as the traffic controller:
1.  **Browser Request:** User visits `/` → Nginx serves the **React App**.
2.  **API Request:** React requests `/tasks` → Nginx internally proxies this to `http://backend:3000/tasks`.

---

## 🛠️ Tech Stack

### **Frontend**
* **Library:** React 18
* **Language:** TypeScript
* **Build Tool:** Vite
* **HTTP Client:** Fetch API (configured for relative paths)

### **Backend**
* **Language:** Rust 🦀
* **Framework:** Axum
* **Database:** SQLite (via `rusqlite`)
* **Serialization:** Serde (JSON)

### **DevOps & Infrastructure**
* **Containerization:** Docker & Dockerfile (Multi-stage builds)
* **Orchestration:** Docker Compose
* **Web Server:** Nginx (Alpine Linux based)

---

## 🏁 Getting Started

### Prerequisites
* [Docker](https://www.docker.com/) and Docker Compose installed.
* *Note: You do NOT need Rust or Node.js installed locally to run this app.*

### Installation & Running

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/task-manager.git](https://github.com/YOUR_USERNAME/task-manager.git)
    cd task-manager
    ```

2.  **Run with Docker Compose**
    This command builds the images (Rust & Node) and starts the services in detached mode.
    ```bash
    docker compose up -d --build
    ```

3.  **Access the App**
    Open your browser and navigate to:
    ```
    http://localhost:8080
    ```

### Stopping the App
To stop the containers but keep your data:
```bash
docker compose down

```

### Cleaning Up (Optional)

To delete containers and reclaim space (this does **not** delete your database file):

```bash
docker system prune

```

---

## 📂 Project Structure

```bash
.
├── docker-compose.yml      # The orchestration config (Services, Networks, Volumes)
├── task-manager/           # Frontend (React)
│   ├── Dockerfile          # Multi-stage build (Node Build -> Nginx Serve)
│   ├── nginx.conf          # Reverse proxy configuration
│   ├── src/                # React Source Code
│   └── package.json
└── task-server/            # Backend (Rust)
    ├── Dockerfile          # Rust build steps (Builder -> Runtime)
    ├── src/                # Rust Source Code (main.rs, handlers, models)
    ├── Cargo.toml
    └── tasks.db            # Persistent database file (mapped via volume)

```

---

## 🧪 API Documentation

The backend exposes a RESTful API accessible via the Nginx proxy at `/tasks`.

| Method | Endpoint | Description | Request Body Example |
| --- | --- | --- | --- |
| `GET` | `/tasks` | Retrieve all tasks | N/A |
| `POST` | `/tasks` | Create a new task | `{ "title": "Learn Rust", "completed": false }` |
| `DELETE` | `/tasks/:id` | Delete a task | N/A |

---

## 🐛 Common Troubleshooting

**1. "Internal Server Error" / Tasks not loading**

* Check the logs: `docker compose logs -f`
* Ensure the backend container is running: `docker ps`

**2. Database persistence issues**

* Ensure your `docker-compose.yml` volume mapping points to the correct local path for `tasks.db`.
* Check file permissions on your local `tasks.db` file.

**3. "Network Error" on Mobile**

* Ensure you are accessing the app via the machine's IP address or a tunnel (like Cloudflare), not `localhost`.
* Verify that your frontend `fetch` calls use relative paths (e.g., `/tasks`) instead of hardcoded `http://localhost:3000`.

---

## 📜 License

This project is open source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

```

```
