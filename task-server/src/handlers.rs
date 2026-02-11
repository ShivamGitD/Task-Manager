use crate::model::{CreateTask, Task, UpdateTask};
use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use sqlx::sqlite::SqlitePool; // Import the models we just made

// GET /tasks
pub async fn get_tasks(State(pool): State<SqlitePool>) -> Json<Vec<Task>> {
    let tasks = sqlx::query_as::<_, Task>("SELECT * FROM tasks")
        .fetch_all(&pool)
        .await
        .unwrap_or(vec![]);
    Json(tasks)
}

// POST /tasks
pub async fn create_task(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateTask>,
) -> Result<Json<Task>, StatusCode> {
    let id = sqlx::query(
        "INSERT INTO tasks (title, priority, is_completed, created_at) VALUES (?, ?, ?, ?)",
    )
    .bind(&payload.title)
    .bind(&payload.priority)
    .bind(false)
    .bind(1716300000000i64)
    .execute(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    .last_insert_rowid();

    let new_task = Task {
        id,
        title: payload.title,
        priority: payload.priority,
        is_completed: false,
        created_at: 1716300000000,
    };

    Ok(Json(new_task))
}

// DELETE /tasks/:id
pub async fn delete_task(State(pool): State<SqlitePool>, Path(id): Path<i64>) -> StatusCode {
    sqlx::query("DELETE FROM tasks WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
        .map(|_| StatusCode::OK)
        .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR)
}

// PATCH /tasks/:id
pub async fn toggle_task(State(pool): State<SqlitePool>, Path(id): Path<i64>) -> StatusCode {
    sqlx::query("UPDATE tasks SET is_completed = NOT is_completed WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
        .map(|_| StatusCode::OK)
        .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR)
}

// PUT /tasks/:id
pub async fn update_task(
    State(pool): State<SqlitePool>,
    Path(id): Path<i64>,
    Json(payload): Json<UpdateTask>,
) -> StatusCode {
    sqlx::query("UPDATE tasks SET title = ?, priority = ? WHERE id = ?")
        .bind(&payload.title)
        .bind(&payload.priority)
        .bind(id)
        .execute(&pool)
        .await
        .map(|_| StatusCode::OK)
        .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR)
}
