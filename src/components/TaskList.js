import React, { useState } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';

const TaskList = ({ tasks, onEditTask, onDeleteTask, onUpdateTaskStatus }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOption, setSortOption] = useState('dueDate');

  const handleStatusChange = (taskId, newStatus) => {
    onUpdateTaskStatus(taskId, newStatus);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const filterTasks = (tasks) => {
    return tasks.filter((task) => {
      if (filterStatus === 'all') return true;
      return task.status === filterStatus;
    });
  };

  const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      if (sortOption === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const filteredAndSortedTasks = sortTasks(filterTasks(tasks));

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 3 },
        mt: 4,
        backgroundColor: '#f4f6f8',
        borderRadius: '12px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2" sx={{ mb: { xs: 2, md: 0 } }}>
          Task List
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' },
            gap: 2,
          }}
        >
          <FormControl variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={handleFilterChange}
              label="Filter by Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In-Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortOption}
              onChange={handleSortChange}
              label="Sort by"
            >
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="title">Title</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      {filteredAndSortedTasks.map((task) => (
        <Card
          key={task._id}
          variant="outlined"
          sx={{
            mb: 2,
            boxShadow: 3,
            borderRadius: '12px',
          }}
        >
          <CardContent>
            <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
              {task.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {task.description || 'No description provided.'}
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
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
            <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
              <EventIcon sx={{ mr: 1, color: 'gray' }} />
              <Typography variant="body2" color="textSecondary">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => onEditTask(task)}
                sx={{ borderRadius: '8px', width: { xs: '100%', sm: 'auto' } }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => onDeleteTask(task._id)}
                sx={{ borderRadius: '8px', width: { xs: '100%', sm: 'auto' } }}
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
