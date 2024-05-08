import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiFilter } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import TaskFormModal from "../../components/task.form.modal/task.form.modal";
import Navbar from "../../components/nav.component/nav.component";
import TaskList from "../../components/task.list.component/task.list.component";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import TaskFilter from "../../components/filter.component/filter.component";

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTask, setModalTask] = useState(null);
  const [searchStatus, setSearchStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    fetchTasks();
  }, []);

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
      await axios.delete(`http://127.0.0.1:8000/tasks/${taskId}/`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  // define debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // debounced search function
  const debouncedSearch = debounce((text) => {
    setSearchText(text);
  }, 500);

  const handleSearchTextChange = (event) => {
    const { value } = event.target;
    debouncedSearch(value);
  };

  const handleFilterChange = (event) => {
    setSearchStatus(event.target.value);
  };

  //   const handleSearchTextChange = (event) => {
  //     setSearchText(event.target.value);
  //   };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      searchStatus === "all" ||
      task.completed === (searchStatus === "completed");

    const textMatch =
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase());

    return statusMatch && textMatch;
  });

  const handleAddTask = () => {
    setShowModal(true);
    setModalTask(null);
  };

  const handleEditTask = (taskId, task) => {
    setShowModal(true);
    setModalTask({ id: taskId, ...task });
  };

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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div>
      <Navbar />
      <Container>
        <Box mt={4}>
          <Box display="flex" alignItems="center" mb={2}>
            <TaskFilter
              searchStatus={searchStatus}
              handleSearchChange={handleFilterChange}
            />
          </Box>
          <Box mb={2}>
            <TextField
              type="text"
              placeholder="Search by task title or description"
              value={searchText}
              onChange={handleSearchTextChange}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      onClick={handleAddTask}
                      endIcon={<FiPlus style={{ marginRight: "15px" }} />}
                    >
                      Add Task
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <TaskList
            tasks={currentTasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onStatusUpdate={handleChangeTaskStatus}
          />
          <Stack spacing={2} mt={2} justifyContent="center" alignItems="center">
            <Pagination
              count={Math.ceil(filteredTasks.length / tasksPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </Box>
      </Container>
      {showModal && (
        <TaskFormModal
          onSave={handleSaveTask}
          onCancel={handleCloseModal}
          task={modalTask}
        />
      )}
    </div>
  );
}

export default TasksPage;
