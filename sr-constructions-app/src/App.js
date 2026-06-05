import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AllProjects from './pages/AllProjects';
import AllOngoing from './pages/AllOngoing';
import ProjectDetail from './pages/ProjectDetail';
import OngoingDetail from './pages/OngoingDetail';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminContacts from './admin/AdminContacts';
import AdminProjects from './admin/AdminProjects';
import AdminOngoing from './admin/AdminOngoing';
import AdminProjectEdit from './admin/AdminProjectEdit';
import AdminOngoingEdit from './admin/AdminOngoingEdit';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/ongoing" element={<AllOngoing />} />
        <Route path="/ongoing/:id" element={<OngoingDetail />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/:id" element={<AdminProjectEdit />} />
          <Route path="ongoing" element={<AdminOngoing />} />
          <Route path="ongoing/:id" element={<AdminOngoingEdit />} />
        </Route>
        {/* Public site */}
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
