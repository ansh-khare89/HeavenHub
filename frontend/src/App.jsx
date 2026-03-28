import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { BookingsPage } from './pages/BookingsPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { HostDashboardPage } from './pages/HostDashboardPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { PropertyDetailPage } from './pages/PropertyDetailPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />

        <Route element={<ProtectedRoute roles={['GUEST']} />}>
          <Route path="/bookings" element={<BookingsPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['HOST']} />}>
          <Route path="/host/dashboard" element={<HostDashboardPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
