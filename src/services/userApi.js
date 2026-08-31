import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const userApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// If your backend wraps responses like { data: [...] }, unwrap it here
// instead of touching the slice/reducer.
const unwrap = (response) =>
  Array.isArray(response.data?.data) || (response.data?.data && typeof response.data.data === 'object')
    ? response.data.data
    : response.data;

export const getUsersApi = async () => {
  const response = await userApi.get('/users');
  return unwrap(response);
};

export const getUserByIdApi = async (id) => {
  const response = await userApi.get(`/users/${id}`);
  return unwrap(response);
};

export const createUserApi = async (payload) => {
  const response = await userApi.post('/users', payload);
  return unwrap(response);
};

export const updateUserApi = async (id, payload) => {
  const response = await userApi.put(`/users/${id}`, payload);
  return unwrap(response);
};

export const deleteUserApi = async (id) => {
  await userApi.delete(`/users/${id}`);
  return id;
};

export default userApi;
