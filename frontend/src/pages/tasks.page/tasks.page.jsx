import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiFilter } from "react-icons/fi";
import { FiPlus, FiSearch } from "react-icons/fi";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import TaskFormModal from "../../components/task.form.modal/task.form.modal";
import Navbar from "../../components/nav.component/nav.component";
import TaskList from "../../components/task.list.component/task.list.component";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import TaskFilter from "../../components/filter.component/filter.component";
import "./task.page.css";

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTask, setModalTask] = useState(null);
  const [searchStatus, setSearchStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(15);

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

  const handleTasksPerPageChange = (event) => {
    setTasksPerPage(event.target.value);
    setCurrentPage(1);
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className="body-container">
      <Navbar />
      <div className="body">
        <Container className="table">
          <Box className="table-header">
            <Box>
              <TaskFilter
                searchStatus={searchStatus}
                handleSearchChange={handleFilterChange}
              />
            </Box>
            <Box className="search-box">
              <TextField
                type="text"
                placeholder="البحث"
                value={searchText}
                onChange={handleSearchTextChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <FiSearch />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                className="add-task"
                onClick={handleAddTask}
                endIcon={<FiPlus />}
              >
                <span>إضافة مهمة</span>
              </Button>
            </Box>
          </Box>
          {/* Add Tasks List */}
          <TaskList
            tasks={currentTasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onStatusUpdate={handleChangeTaskStatus}
          />
          <Stack spacing={2} mt={2} justifyContent="center" alignItems="center">
            <p>
              1-{tasksPerPage} {tasks.length} of
            </p>
            {/* Select dropdown for choosing tasks per page */}
            <span>عدد الصفوف في الصفحة</span>
            <Select
              value={tasksPerPage}
              onChange={handleTasksPerPageChange}
              variant="outlined"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
            <Pagination
              count={Math.ceil(filteredTasks.length / tasksPerPage)}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Stack>
        </Container>
      </div>
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
