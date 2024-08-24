import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';

const TaskList = ({ tasks, onEditTask, onDeleteTask, onUpdateTaskStatus }) => {
  const handleStatusChange = (taskId, newStatus) => {
    onUpdateTaskStatus(taskId, newStatus);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Task List
      </Typography>
      {tasks.map((task) => (
        <Card key={task._id} variant="outlined" sx={{ mb: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" component="h3">
              {task.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {task.description || 'No description provided.'}
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In-Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
            <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => onEditTask(task)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => onDeleteTask(task._id)}
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Paper>
  );
};

export default TaskList;
