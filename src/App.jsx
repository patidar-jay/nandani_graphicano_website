import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProjectDetail from './pages/ProjectDetail';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
        <Route path="/login.html" element={<Login />} />
        <Route path="/admin.html" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
