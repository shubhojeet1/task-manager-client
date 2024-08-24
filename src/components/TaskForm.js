import React, { useState, useEffect } from 'react';
import { createTask, updateTask } from '../services/taskService';
import { TextField, Button, Box, Alert, Typography, Paper } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const TaskForm = ({
  addTask,
  editTask,
  taskToEdit,
  clearTaskToEdit,
  showAlert,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.dueDate.split('T')[0]);
    } else {
      clearForm();
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !dueDate) {
      setError('Title and Due Date are required.');
      return;
    }

    const taskData = {
      title,
      description,
      dueDate,
    };

    try {
      if (taskToEdit) {
        const res = await updateTask(taskToEdit._id, taskData);
        editTask(res.data);
        showAlert('Task updated successfully!', 'success');
      } else {
        const res = await createTask(taskData);
        addTask(res.data);
        showAlert('Task created successfully!', 'success');
      }
      clearForm();
    } catch (err) {
      setError('Failed to save task. Please try again.');
      console.error('Error saving task:', err);
      showAlert('Failed to save task. Please try again.', 'error');
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setError('');
    if (taskToEdit) clearTaskToEdit();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#ffffff', borderRadius: '12px' }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2" gutterBottom color="secondary.dark">
          {taskToEdit ? 'Edit Task' : 'Create a New Task'}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          variant="outlined"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Due Date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={taskToEdit ? <SaveIcon /> : <AddCircleOutlineIcon />}
          >
            {taskToEdit ? 'Update Task' : 'Add Task'}
          </Button>
          {taskToEdit && (
            <Button
              onClick={clearForm}
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskForm;
