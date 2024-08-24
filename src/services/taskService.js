import axios from 'axios';

const API_URL = 'https://tash-manager-server-mu.vercel.app/api/tasks/';

export const getTasks = () => {
  return axios.get(API_URL, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
};

export const createTask = (taskData) => {
  return axios.post(API_URL, taskData, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
};

export const updateTask = (taskId, taskData) => {
    return axios.put(`${API_URL}${taskId}`, taskData, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    });
  };

export const deleteTask = (taskId) => {
  return axios.delete(`${API_URL}${taskId}`, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
};
