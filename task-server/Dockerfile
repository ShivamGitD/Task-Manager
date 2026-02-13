# --- Stage 1: The Builder (Heavyweight) ---
# We use the official Rust image to compile the code
FROM rust:latest as builder

# Set the working directory inside the container
WORKDIR /app

# Copy all your project files (. is current dir on laptop, . is /app in container)
COPY . .

# Build the app in release mode (Optimized for speed)
# This creates the binary at /app/target/release/task-server
RUN cargo build --release

# --- Stage 2: The Runner (Lightweight) ---
# We start fresh with a tiny Linux image (Debian Slim)
FROM debian:bookworm-slim

# Install necessary system libraries (SSL for https, SQLite for DB)
RUN apt-get update && apt-get install -y libssl-dev sqlite3 ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy ONLY the compiled binary from the 'builder' stage
COPY --from=builder /app/target/release/task-server /usr/local/bin/task-server

# Set the startup command
CMD ["task-server"]
