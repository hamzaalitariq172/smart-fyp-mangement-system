import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const StudentProjects = lazy(() => import('./pages/student/StudentProjects'));
const NewProject = lazy(() => import('./pages/student/NewProject'));
const StudentTasks = lazy(() => import('./pages/student/StudentTasks'));
const StudentMeetings = lazy(() => import('./pages/student/StudentMeetings'));
const StudentReports = lazy(() => import('./pages/student/StudentReports'));
const StudentChat = lazy(() => import('./pages/student/StudentChat'));
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'));
const StudentProgress = lazy(() => import('./pages/student/StudentProgress'));
const StudentEditProject = lazy(() => import('./pages/student/StudentEditProject'));

const SupervisorDashboard = lazy(() => import('./pages/supervisor/SupervisorDashboard'));
const SupervisorProjects = lazy(() => import('./pages/supervisor/SupervisorProjects'));
const SupervisorStudents = lazy(() => import('./pages/supervisor/SupervisorStudents'));
const SupervisorTasks = lazy(() => import('./pages/supervisor/SupervisorTasks'));
const SupervisorMeetings = lazy(() => import('./pages/supervisor/SupervisorMeetings'));
const SupervisorReports = lazy(() => import('./pages/supervisor/SupervisorReports'));
const SupervisorChat = lazy(() => import('./pages/supervisor/SupervisorChat'));
const SupervisorProfile = lazy(() => import('./pages/supervisor/SupervisorProfile'));
const CalendarView = lazy(() => import('./pages/supervisor/CalendarView'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminSupervisors = lazy(() => import('./pages/admin/AdminSupervisors'));
const AdminAnnouncements = lazy(() => import('./pages/admin/AdminAnnouncements'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminDepartments = lazy(() => import('./pages/admin/AdminDepartments'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminGenerateReports = lazy(() => import('./pages/admin/AdminGenerateReports'));
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage'));

const LazyRoute = ({ children }) => <Suspense fallback={<LoadingSpinner fullScreen />}>{children}</Suspense>;

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <ErrorBoundary>
              <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LazyRoute><Login /></LazyRoute>} />
                <Route path="/register" element={<LazyRoute><Register /></LazyRoute>} />
                <Route path="/forgot-password" element={<LazyRoute><ForgotPassword /></LazyRoute>} />
                <Route path="/reset-password/:token" element={<LazyRoute><ResetPassword /></LazyRoute>} />
              </Route>

              <Route
                element={
                  <ProtectedRoute roles={['student']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/student/dashboard" element={<LazyRoute><StudentDashboard /></LazyRoute>} />
                <Route path="/student/projects" element={<LazyRoute><StudentProjects /></LazyRoute>} />
                <Route path="/student/new-project" element={<LazyRoute><NewProject /></LazyRoute>} />
                <Route path="/student/progress" element={<LazyRoute><StudentProgress /></LazyRoute>} />
                <Route path="/student/edit-project/:id" element={<LazyRoute><StudentEditProject /></LazyRoute>} />
                <Route path="/student/tasks" element={<LazyRoute><StudentTasks /></LazyRoute>} />
                <Route path="/student/meetings" element={<LazyRoute><StudentMeetings /></LazyRoute>} />
                <Route path="/student/reports" element={<LazyRoute><StudentReports /></LazyRoute>} />
                <Route path="/student/chat" element={<LazyRoute><StudentChat /></LazyRoute>} />
                <Route path="/student/profile" element={<LazyRoute><StudentProfile /></LazyRoute>} />
                <Route path="/notifications" element={<LazyRoute><NotificationsPage /></LazyRoute>} />
              </Route>

              <Route
                element={
                  <ProtectedRoute roles={['supervisor']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/supervisor/dashboard" element={<LazyRoute><SupervisorDashboard /></LazyRoute>} />
                <Route path="/supervisor/projects" element={<LazyRoute><SupervisorProjects /></LazyRoute>} />
                <Route path="/supervisor/students" element={<LazyRoute><SupervisorStudents /></LazyRoute>} />
                <Route path="/supervisor/tasks" element={<LazyRoute><SupervisorTasks /></LazyRoute>} />
                <Route path="/supervisor/meetings" element={<LazyRoute><SupervisorMeetings /></LazyRoute>} />
                <Route path="/supervisor/calendar" element={<LazyRoute><CalendarView /></LazyRoute>} />
                <Route path="/supervisor/reports" element={<LazyRoute><SupervisorReports /></LazyRoute>} />
                <Route path="/supervisor/chat" element={<LazyRoute><SupervisorChat /></LazyRoute>} />
                <Route path="/supervisor/profile" element={<LazyRoute><SupervisorProfile /></LazyRoute>} />
                <Route path="/notifications" element={<LazyRoute><NotificationsPage /></LazyRoute>} />
              </Route>

              <Route
                element={
                  <ProtectedRoute roles={['admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin/dashboard" element={<LazyRoute><AdminDashboard /></LazyRoute>} />
                <Route path="/admin/users" element={<LazyRoute><AdminUsers /></LazyRoute>} />
                <Route path="/admin/projects" element={<LazyRoute><AdminProjects /></LazyRoute>} />
                <Route path="/admin/supervisors" element={<LazyRoute><AdminSupervisors /></LazyRoute>} />
                <Route path="/admin/departments" element={<LazyRoute><AdminDepartments /></LazyRoute>} />
                <Route path="/admin/reports" element={<LazyRoute><AdminReports /></LazyRoute>} />
                <Route path="/admin/messages" element={<LazyRoute><AdminMessages /></LazyRoute>} />
                <Route path="/admin/generate-reports" element={<LazyRoute><AdminGenerateReports /></LazyRoute>} />
                <Route path="/admin/announcements" element={<LazyRoute><AdminAnnouncements /></LazyRoute>} />
                <Route path="/admin/settings" element={<LazyRoute><AdminSettings /></LazyRoute>} />
                <Route path="/notifications" element={<LazyRoute><NotificationsPage /></LazyRoute>} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            </ErrorBoundary>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
