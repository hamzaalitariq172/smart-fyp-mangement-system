import axios from 'axios';

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
  const user = getStoredUser();
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  resetPassword: (token, data) => API.put(`/auth/reset-password/${token}`, data),
};

export const userAPI = {
  getAll: (params) => API.get('/users', { params }),
  getById: (id) => API.get(`/users/${id}`),
  create: (data) => API.post('/users', data),
  update: (id, data) => API.put(`/users/${id}`, data),
  delete: (id) => API.delete(`/users/${id}`),
  getSupervisors: () => API.get('/users/supervisors'),
  getStudents: () => API.get('/users/students'),
};

export const projectAPI = {
  getAll: (params) => API.get('/projects', { params }),
  getById: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post('/projects', data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
  requestSupervisor: (id, data) => API.post(`/projects/${id}/request-supervisor`, data),
  approve: (id, data) => API.put(`/projects/${id}/approve`, data),
  addFeedback: (id, data) => API.post(`/projects/${id}/feedback`, data),
  uploadDocument: (id, data) =>
    API.post(`/projects/${id}/upload`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  assignSupervisor: (id, data) => API.put(`/projects/${id}/assign-supervisor`, data),
  getStats: () => API.get('/projects/stats'),
  getMyProjects: (params) => API.get('/projects', { params }),
};

export const taskAPI = {
  getAll: (params) => API.get('/tasks', { params }),
  getById: (id) => API.get(`/tasks/${id}`),
  create: (data) => API.post('/tasks', data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  delete: (id) => API.delete(`/tasks/${id}`),
  getMyTasks: (params) => API.get('/tasks', { params }),
};

export const meetingAPI = {
  getAll: () => API.get('/meetings'),
  create: (data) => API.post('/meetings', data),
  update: (id, data) => API.put(`/meetings/${id}`, data),
  delete: (id) => API.delete(`/meetings/${id}`),
  getMyMeetings: () => API.get('/meetings'),
};

export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  markAllAsRead: () => API.put('/notifications/read-all'),
  getUnreadCount: () => API.get('/notifications/unread-count'),
};

export const reportAPI = {
  getAll: () => API.get('/reports'),
  submit: (data) =>
    API.post('/reports', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  review: (id, data) => API.put(`/reports/${id}/review`, data),
  download: (id) => API.get(`/reports/${id}/download`, { responseType: 'blob' }),
};

export const announcementAPI = {
  getAll: () => API.get('/announcements'),
  create: (data) => API.post('/announcements', data),
  update: (id, data) => API.put(`/announcements/${id}`, data),
  delete: (id) => API.delete(`/announcements/${id}`),
};

export const messageAPI = {
  getConversations: () => API.get('/messages/conversations'),
  createConversation: (data) => API.post('/messages/conversations', data),
  getMessages: (convId) => API.get(`/messages/conversations/${convId}/messages`),
  sendMessage: (convId, data) => API.post(`/messages/conversations/${convId}/messages`, data),
};

export const departmentAPI = {
  getAll: () => API.get('/departments'),
  getById: (id) => API.get(`/departments/${id}`),
  create: (data) => API.post('/departments', data),
  update: (id, data) => API.put(`/departments/${id}`, data),
  delete: (id) => API.delete(`/departments/${id}`),
};

export const milestoneAPI = {
  getAll: (params) => API.get('/milestones', { params }),
  create: (data) => API.post('/milestones', data),
  update: (id, data) => API.put(`/milestones/${id}`, data),
  delete: (id) => API.delete(`/milestones/${id}`),
};

export const weeklyReportAPI = {
  getAll: (params) => API.get('/weekly-reports', { params }),
  create: (data) => API.post('/weekly-reports', data),
  update: (id, data) => API.put(`/weekly-reports/${id}`, data),
  delete: (id) => API.delete(`/weekly-reports/${id}`),
};

export const calendarAPI = {
  getEvents: () => API.get('/calendar'),
};

export const reportGenAPI = {
  generate: (params) => API.get('/reports/generate', { params }),
};

export const deadlineAPI = {
  check: () => API.get('/deadlines'),
};

export const fileAPI = {
  getFiles: (projectId) => API.get(`/projects/${projectId}/files`),
  download: (projectId, docId) => API.get(`/projects/${projectId}/files/${docId}/download`, { responseType: 'blob' }),
  delete: (projectId, docId) => API.delete(`/projects/${projectId}/files/${docId}`),
};

export const dashboardAPI = {
  getAdmin: () => API.get('/dashboard/admin'),
  getSupervisor: () => API.get('/dashboard/supervisor'),
  getStudent: () => API.get('/dashboard/student'),
};

export default API;
