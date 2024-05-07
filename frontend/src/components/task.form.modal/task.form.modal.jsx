import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

function TaskFormModal({ onSave, onCancel, task }) {
  const [formData, setFormData] = useState({
    title: task ? task.title : "",
    description: task ? task.description : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onClose={onCancel}>
      <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={formData.description}
            onChange={handleChange}
          />
          <DialogActions>
            <Button type="submit">{task ? "Save" : "Add"}</Button>
            <Button onClick={onCancel}>Cancel</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TaskFormModal;
