import { useState, useEffect } from "react";
import "./App.css";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [updatedTask, setUpdatedTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/items");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (newTask) {
      try {
        const response = await fetch("http://localhost:5000/api/item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item: newTask }),
        });
        const data = await response.json();
        setTasks([
          ...tasks,
          { _id: data._id, item: newTask, completed: false },
        ]);
        setNewTask("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/item/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateTask = async (id) => {
    if (updatedTask) {
      try {
        await fetch(`http://localhost:5000/api/item/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item: updatedTask }),
        });
        setTasks(
          tasks.map((task) =>
            task._id === id ? { ...task, item: updatedTask } : task
          )
        );
        setEditingTask(null);
        setUpdatedTask("");
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/item/${id}/completed`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !completed }),
        }
      );
      if (!response.ok) {
        console.error("Failed to toggle task completion:", response.statusText);
        return;
      }
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  return (
    <div className="container">
      <h3 className="h3">To-Do List Application</h3>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter your text"
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {editingTask === task._id ? (
              <>
                <input
                  type="text"
                  value={updatedTask}
                  onChange={(e) => setUpdatedTask(e.target.value)}
                  placeholder="Update task"
                />
                <div className="button-container">
                  <button
                    className="save-button"
                    onClick={() => updateTask(task._id)}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setEditingTask(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="task-item">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task._id, task.completed)}
                />
                <span className={task.completed ? "completed-task" : ""}>
                  {task.item}
                </span>
                <div className="icons">
                  <FaPen onClick={() => setEditingTask(task._id)} />
                  <MdDelete onClick={() => deleteTask(task._id)} />
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
