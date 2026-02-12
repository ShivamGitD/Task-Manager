use serde::{Deserialize, Serialize};
use sqlx::FromRow;

// We added 'pub' to the struct and its fields so handlers.rs can use them
#[derive(Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    pub id: i64,
    pub title: String,
    pub is_completed: bool,
    pub priority: String,
    pub due_date: Option<String>,
    pub created_at: i64,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateTask {
    pub title: String,
    pub priority: String,
    pub due_date: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateTask {
    pub title: String,
    pub priority: String,
    pub due_date: Option<String>,
}
