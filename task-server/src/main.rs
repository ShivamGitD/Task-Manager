use axum::{
    Router,
    routing::{delete, get},
};
use sqlx::sqlite::SqlitePool;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

// Tell Rust about our new files
mod handlers;
mod model;

#[tokio::main]
async fn main() {
    let db_url = std::env::var("DATABASE_URL").unwrap_or("sqlite://tasks.db?mode=rwc".to_string());
    let pool = SqlitePool::connect(&db_url)
        .await
        .expect("Failed to connect to DB");

    // Create the DB table if it doesn't exist
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            is_completed BOOLEAN NOT NULL DEFAULT 0,
            priority TEXT NOT NULL,
            due_date TEXT,
            created_at INTEGER NOT NULL
        )",
    )
    .execute(&pool)
    .await
    .expect("Failed to create table");

    // Define Routes using the functions from 'handlers.rs'
    let app = Router::new()
        .route(
            "/tasks",
            get(handlers::get_tasks).post(handlers::create_task),
        )
        .route(
            "/tasks/{id}",
            delete(handlers::delete_task)
                .patch(handlers::toggle_task)
                .put(handlers::update_task),
        )
        .layer(CorsLayer::permissive())
        .with_state(pool);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("Server listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
