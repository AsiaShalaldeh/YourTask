import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [searchStatus, setSearchStatus] = useState('all');
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchStatus(event.target.value);
  };

  const handleAddTask = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/tasks/', {
        title: newTaskTitle,
        description: newTaskDescription,
        completed: false,
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/tasks/${taskId}/`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const handleEditTask = async (taskId, updatedTask) => {
    try {
      await axios.put(`http://127.0.0.1:8000/tasks/${taskId}/`, updatedTask);
      setEditingTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error.message);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (searchStatus === 'all') {
      return true;
    } else {
      return task.completed === (searchStatus === 'completed');
    }
  });

  return (
    <div>
      <h1>Tasks</h1>
      <div>
        <label htmlFor="searchStatus">Search by Status:</label>
        <select id="searchStatus" value={searchStatus} onChange={handleSearchChange}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="notcompleted">Not Completed</option>
        </select>
      </div>
      <form onSubmit={handleAddTask}>
        <input type="text" placeholder="Title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required />
        <input type="text" placeholder="Description" value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} required />
        <button type="submit">Add Task</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.task_id}>
              <td>{editingTaskId === task.task_id ? (
                <input type="text" value={task.title} onChange={(e) => handleEditTask(task.task_id, { title: e.target.value })} />
              ) : (
                task.title
              )}</td>
              <td>{editingTaskId === task.task_id ? (
                <input type="text" value={task.description} onChange={(e) => handleEditTask(task.task_id, { description: e.target.value })} />
              ) : (
                task.description
              )}</td>
              <td>{task.completed ? 'Completed' : 'Not Completed'}</td>
              <td>{editingTaskId === task.task_id ? (
                <button onClick={() => handleEditTask(task.task_id, { title: task.title, description: task.description })}>Save</button>
              ) : (
                <button onClick={() => setEditingTaskId(task.task_id)}>Edit</button>
              )}</td>
              <td><button onClick={() => handleDeleteTask(task.task_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TasksPage;
