import React, { useState, useEffect } from "react";
import axios from "axios";
import { useEmail } from "../../components/providers/email.provider";
import { FiFilter } from "react-icons/fi";
import api from "../../interceptor/axios";
import {useLocation} from 'react-router-dom';
import TaskFormModal from "../../components/task.form.modal/task.form.modal";

function TasksPage() {
  const { email } = useEmail();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTask, setModalTask] = useState(null);
  const [searchStatus, setSearchStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const location = useLocation();

  const handleAddTask = () => {
    setShowModal(true);
    setModalTask(null);
  };

  const handleEditTask = (taskId, task) => {
    setShowModal(true);
    setModalTask({ id: taskId, ...task });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // use search params here

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/tasks/");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      console.log(taskId);
      await axios.delete(`http://127.0.0.1:8000/tasks/${taskId}/`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchStatus(event.target.value);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      searchStatus === "all" ||
      task.completed === (searchStatus === "completed");

    const textMatch =
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase());

    return statusMatch && textMatch;
  });

  // handle catching errors
  const handleSaveTask = async (task) => {
    if (modalTask) {
      // Edit existing task
      await axios.patch(`http://127.0.0.1:8000/tasks/${modalTask.id}/`, task);
    } else {
      // Add new task
      await axios.post("http://127.0.0.1:8000/tasks/", task);
    }
    fetchTasks();
    setShowModal(false);
  };

  const handleChangeTaskStatus = async (updatedTask) => {
    try {
      console.log(updatedTask);
      await axios.patch(
        `http://127.0.0.1:8000/tasks/${updatedTask.task_id}/`,
        updatedTask
      );
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error.message);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h1>Tasks</h1>
      <div>
        {/* Filter by status */}
        <FiFilter />
        <select
          id="searchStatus"
          value={searchStatus}
          onChange={handleSearchChange}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="notcompleted">Not Completed</option>
        </select>
      </div>
      <div>
        {/* Search input */}
        <input
          type="text"
          placeholder="Search by task title or description"
          value={searchText}
          onChange={handleSearchTextChange}
        />
      </div>
      <div>{/* Search input */}</div>
      {/* Add Task button */}
      <button onClick={handleAddTask}>Add Task</button>
      {/* Task list */}
      <table>
        {/* Table headers */}
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.task_id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <select
                  value={task.completed ? "completed" : "Not Completed"}
                  onChange={(e) => {
                    const updatedTask = {
                      ...task,
                      completed: e.target.value === "completed" ? true : false,
                    };
                    handleChangeTaskStatus(updatedTask);
                  }}
                >
                  <option value="completed">Completed</option>
                  <option value="Not Completed">Not Completed</option>
                </select>
              </td>
              <td>
                {/* Edit button */}
                <button onClick={() => handleEditTask(task.task_id, task)}>
                  Edit
                </button>
              </td>
              <td>
                {/* Delete button */}
                <button onClick={() => handleDeleteTask(task.task_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Task form modal */}
      {showModal && (
        <TaskFormModal
          onSave={handleSaveTask}
          onCancel={handleCancel}
          task={modalTask}
        />
      )}
    </div>
  );
}

export default TasksPage;
