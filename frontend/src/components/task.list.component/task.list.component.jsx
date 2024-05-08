import React, { useState } from "react";
import "./task.list.component.css";
import {
  Box,
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
} from "@mui/material";

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
              <TableCell>العنوان</TableCell>
              <TableCell>الوصف</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>العمليات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.task_id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>
                  <select
                    value={task.completed ? "completed" : "Not Completed"}
                    onChange={(e) => {
                      const updatedTask = {
                        ...task,
                        completed:
                          e.target.value === "completed" ? true : false,
                      };
                      onStatusUpdate(updatedTask);
                    }}
                  >
                    <option value="completed">Completed</option>
                    <option value="Not Completed">Not Completed</option>
                  </select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => onEditTask(task.task_id, task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleDeleteConfirmationOpen(task.task_id)}
                  >
                    Delete
                  </Button>
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
