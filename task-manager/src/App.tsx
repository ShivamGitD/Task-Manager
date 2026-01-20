import "./App.css";
import { useState, useEffect } from "react";
import type { Task } from "./types";

function App() {
  // State: Holds the list of tasks and form inputs

  // Initialize State from Local Storage (Read FIRST, default to empty array if nothing found)
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("my-tasks");
    if (saved) {
      return JSON.parse(saved); // Convert String -> Array
    }
    return []; // Default to empty if first time
  });

  const [text, setText] = useState<string>("");

  // Save to Local Storage whenever 'tasks' changes
  useEffect(() => {
    localStorage.setItem("my-tasks", JSON.stringify(tasks));
  }, [tasks]);

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
  // We use .filter() to create a NEW array without deleted item
  const deleteTask = (idToDelete: number) => {
    // "Keep every task where the ID is not the one we want to delete"
    const updatedTasks = tasks.filter((task) => task.id !== idToDelete);
    setTasks(updatedTasks); // Update the state
  };

  // Function to add Task
  const addTask = () => {
    if (!text) return; // Don't add empty tasks

    const newTask: Task = {
      id: Date.now(),
      title: text,
      isCompleted: false,
      priority: "medium", // Default to medium for now
      createdAt: Date.now(),
    };

    // add to list using Spread operator
    setTasks([...tasks, newTask]);

    // Clearing the input
    setText("");
  };

  // Toggle Completion
  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          // Create a Copy with the boolean flipped
          return { ...task, isCompleted: !task.isCompleted };
        }
        return task; // return other tasks unchanged
      }),
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">🚀 Task Manager</h1>

      {/* --- NEW: The Input Form --- */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 w-full max-w-lg">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            type="text"
            placeholder="What needs to be done?"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()} // Allow pressing "Enter"
          />
          <button
            onClick={addTask}
            className="self-end sm:self-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold whitespace-nowrap"
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
            key={task.id} // React needs unique key for loops
            // Adding cursor pointer to show it's clickable
            className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 w-full max-w-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:bg-gray-50 transition"
            // Adding onClick toggle (only if they don't click the delete button)
            onClick={() => toggleTask(task.id)}
          >
            <div className="w-full sm:w-auto break-words">
              <h3
                className={`text-lg font-bold ${task.isCompleted ? "line-through text-gray-400" : "text-gray-800"}`}
              >
                {task.title}
              </h3>
              <div className="text-xs mt-1 font-bold text-gray-500 uppercase">
                {task.priority} • {task.isCompleted ? "✅ Done" : "⏳ Pending"}
              </div>
            </div>

            <button
              // Stop the "Delete" click from bubbling up to the "Toggle" click
              onClick={(e) => {
                e.stopPropagation(); // CRITICAL LINE: ithout this, clicking "Delete" would count as clicking the "Task Card"
                // it would toggle the task AND delete it at the same time. This line stops the click from "bubbling up."

                deleteTask(task.id);
              }}
              className="self-end sm:self-auto bg-red-100 text-red-600 px-3 py-1 rounded hover::bg-red-200 transition text-sm font-bold"
            >
              Delete 🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
