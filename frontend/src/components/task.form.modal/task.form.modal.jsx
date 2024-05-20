import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import './task.form.modal.css'

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
      <DialogTitle>{task ? "تعديل المهمة" : "إضافة مهمة"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="العنوان"
            type="text"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            InputProps={{
              style: { direction: "rtl" }
            }}
            InputLabelProps={{
              style: { direction: "rtl" }
            }}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="الوصف"
            type="text"
            fullWidth
            value={formData.description}
            onChange={handleChange}
          />
          <DialogActions>
            <Button onClick={onCancel}>إلغاء العملية</Button>
            <Button type="submit">{task ? "حفظ" : "إضافة"}</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TaskFormModal;
