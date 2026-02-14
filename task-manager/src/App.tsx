import "./App.css";
import { useState, useEffect } from "react";
import type { Task } from "./types";

function App() {
  // State: Holds the list of tasks and form inputs

  const [tasks, setTasks] = useState<Task[]>([]);

  const [text, setText] = useState<string>("");

  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editDueDate, setEditDueDate] = useState("");
  // Save to Local Storage whenever 'tasks' changes
  useEffect(() => {
    fetch("/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // "This is an array of objects" (<Task[]>): This is used for early development
  // const [tasks, setTasks] = useState<Task[]>([
  //   {
  //     id: 1,
  //     title: "Setup the Project",
  //     isCompleted: true,
  //     priority: "high",
  //     createdAt: 1716300000000,
  //   },
  //   {
  //     id: 2,
  //     title: "Build the Task list",
  //     isCompleted: false,
  //     priority: "medium",
  //     createdAt: 1716300000000,
  //   },
  // ]);

  // --- NEW: Function to delete a task ---
  // we tell the server "Delete ID #5", wait for confirmation, then update the screen.
  const deleteTask = (id: number) => {
    fetch(`/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        // Only remove from screen if server delete was successful
        setTasks(tasks.filter((t) => t.id !== id));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  // Function to add Task
  const addTask = () => {
    if (text.trim() === "") return;

    const newTask = {
      title: text,
      priority: priority,
      dueDate: dueDate || null,
    }; // We will fix priority later

    fetch("/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((savedTask) => {
        // Add the task (that came back from the server) to the UI
        setTasks([...tasks, savedTask]);
        setText("");
        setPriority("medium"); // Reset dropdown to default
        setDueDate(""); // Reset Date Picker
      })
      .catch((err) => console.error("Error adding task:", err));
  };

  // Toggle Completion - We tell the server "Flip ID #5", then update the screen.
  const toggleTask = (id: number) => {
    fetch(`/tasks/${id}`, {
      method: "PATCH", // Matches our Rust .patch() route
    })
      .then(() => {
        // Update local state to match server
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task,
          ),
        );
      })
      .catch((error) => console.error("Error toggling task:", error));
  };

  // Helper to choose color based on priority
  const getBorderColor = (p: string) => {
    if (p === "high") return "border-red-500";
    if (p === "medium") return "border-yellow-500";
    return "border-green-500"; // Low
  };

  // Enter Edit Mode
  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || ""); // Load Existing Date
  };

  // Cancel Edit Mode
  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  // Save Changes (Talk to Backend)
  const saveEdit = (id: number) => {
    fetch(`/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editText,
        priority: editPriority,
        dueDate: editDueDate || null,
      }),
    })
      .then((res) => {
        if (res.ok) {
          // Update the UI locally
          setTasks(
            tasks.map((t) =>
              t.id === id
                ? {
                    ...t,
                    title: editText,
                    priority: editPriority,
                    dueDate: editDueDate,
                  }
                : t,
            ),
          );
          cancelEditing(); // Close the input box
        }
      })
      .catch((err) => console.error("Error updating task:", err));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">🚀 Task Manager</h1>

      {/* --- NEW: The Input Form --- */}
      <div
        className={`bg-white p-4 rounded-lg shadow border-l-4 ${getBorderColor(priority)} w-full max-w-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:bg-gray-50 transition`}
      >
        {/* Container for Input + Dropdown + Button */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          {/* 1. The Text Box */}
          <input
            type="text"
            placeholder="What needs to be done?"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />

          {/* 2. The Priority Dropdown (NEW) */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Date Picker */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white"
          />

          {/* 3. The Add Button */}
          <button
            onClick={addTask}
            className="self-end sm:self-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-bold whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </div>

      {/* 2. The Grid: A layout to hold screen cards  */}
      <div className="flex flex-col gap-4">
        {/* 3. The loop: We map over the array */}
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white p-4 rounded-lg shadow border-l-4 ${getBorderColor(task.priority)} w-full max-w-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition`}
          >
            {/* CHECK: Are we editing THIS task? */}
            {editingId === task.id ? (
              // --- EDIT MODE ---
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  className="border p-1 rounded w-full"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <select
                  className="border p-1 rounded"
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input
                  type="date"
                  className="border p-1 rounded"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // --- VIEW MODE (Normal) ---
              <>
                <div
                  className="w-full sm:w-auto break-words cursor-pointer"
                  onClick={() => toggleTask(task.id)}
                >
                  <h3
                    className={`text-lg font-bold ${task.isCompleted ? "line-through text-gray-400" : "text-gray-800"}`}
                  >
                    {task.title}
                  </h3>
                  <div className="text-xs mt-1 font-bold text-gray-500 uppercase">
                    {task.priority} •{" "}
                    {task.isCompleted ? "✅ Done" : "⏳ Pending"}
                    {/* 👇 Display Date if it exists */}
                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        📅 {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* EDIT BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(task);
                    }}
                    className="text-blue-500 hover:bg-blue-100 p-2 rounded"
                  >
                    ✏️
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="text-red-600 hover:bg-red-100 p-2 rounded"
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
