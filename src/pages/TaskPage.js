import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../services/taskService';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Container, Box, Typography, Snackbar, Alert, Paper } from '@mui/material';

const socket = io('https://tash-manager-server-mu.vercel.app');

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [serverError, setServerError] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        setTasks(res.data);
      } catch (err) {
        setServerError(
          err.response?.data?.msg || 'Failed to load tasks. Please try again.'
        );
      }
    };

    fetchTasks();

    // Socket.io event listeners
    socket.on('taskAdded', (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
      showAlert('Task created successfully!', 'success');
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
      showAlert('Task updated successfully!', 'success');
    });

    socket.on('taskDeleted', (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      showAlert('Task deleted successfully!', 'success');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
  };

  const handleClearTaskToEdit = () => {
    setTaskToEdit(null);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      showAlert('Task deleted successfully!', 'success');
    } catch (err) {
      showAlert('Failed to delete task. Please try again.', 'error');
      console.error('Error deleting task:', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await updateTask(taskId, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? res.data : task
        )
      );
      showAlert('Task status updated successfully!', 'success');
    } catch (err) {
      showAlert('Failed to update task status. Please try again.', 'error');
      console.error('Error updating task status:', err);
    }
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Task Manager
        </Typography>
        {serverError && (
          <Box mb={2}>
            <Alert severity="error">{serverError}</Alert>
          </Box>
        )}
        <TaskForm
          addTask={handleAddTask}
          editTask={(updatedTask) =>
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task._id === updatedTask._id ? updatedTask : task
              )
            )
          }
          taskToEdit={taskToEdit}
          clearTaskToEdit={handleClearTaskToEdit}
          showAlert={showAlert}
        />
        <TaskList
          tasks={tasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTaskStatus={handleUpdateTaskStatus}
        />
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TaskPage;
