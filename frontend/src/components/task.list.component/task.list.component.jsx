import React, { useState } from "react";
import "./task.list.component.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CheckCircle } from "@mui/icons-material";

const TaskList = ({ tasks, onEditTask, onDeleteTask, onStatusUpdate }) => {
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);

  const handleDeleteConfirmationOpen = (taskId) => {
    setTaskIdToDelete(taskId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setTaskIdToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteTask = () => {
    onDeleteTask(taskIdToDelete);
    handleDeleteConfirmationClose();
  };

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="head">#</TableCell>
              <TableCell className="head">العنوان</TableCell>
              <TableCell className="head">الوصف</TableCell>
              <TableCell className="head">الحالة</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow key={task.task_id}>
                {/* Display green check icon for completed tasks */}
                <TableCell>
                  {task.completed && <CheckCircle style={{ color: "green" }} />}
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>
                  <Select
                    className="select-status"
                    value={task.completed ? "completed" : "Not Completed"}
                    onChange={(e) => {
                      const updatedTask = {
                        ...task,
                        completed:
                          e.target.value === "completed" ? true : false,
                      };
                      onStatusUpdate(updatedTask);
                    }}
                    style={{
                      backgroundColor: task.completed ? "#b4ffb4" : "white",
                      color: task.completed ? "black" : "black",
                    }}
                  >
                    <MenuItem className="completed" value="completed">
                      مكتملة
                    </MenuItem>
                    <MenuItem value="Not Completed">غير مكتملة</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {/* Edit button */}
                  <IconButton
                    onClick={() => onEditTask(task.task_id, task)}
                    aria-label="Edit"
                  >
                    <EditIcon />
                  </IconButton>

                  {/* Delete button */}
                  <IconButton
                    onClick={() => handleDeleteConfirmationOpen(task.task_id)}
                    aria-label="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* delete confirmation dialog */}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteConfirmationClose}
      >
        <img
          src={process.env.PUBLIC_URL + "images/delete.png"}
          alt="حدف المهمة"
          className="del-image"
        />
        <DialogTitle>هل حقا تود حدف المهمة؟</DialogTitle>
        <DialogContent>
          <DialogContentText>
            أنت على وشك حدف هذه المهمة. إدا قمت بالاستمرار في هذه العملية سيتم
            حدف هده المهمة من قائمة المهام
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose} color="primary">
            إلغاء العملية
          </Button>
          <Button onClick={handleDeleteTask} color="primary">
            حدف المهمة
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskList;
