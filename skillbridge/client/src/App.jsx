import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ExploreSkills from './pages/ExploreSkills';
import SkillDetails from './pages/SkillDetails';
import AddSkill from './pages/AddSkill';
import MySkills from './pages/MySkills';
import EditSkill from './pages/EditSkill';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main className="main-content container" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/skills" element={<ExploreSkills />} />
            <Route path="/skills/:id" element={<SkillDetails />} />
            <Route path="/add-skill" element={<AddSkill />} />
            <Route path="/my-skills" element={<MySkills />} />
            <Route path="/skills/edit/:id" element={<EditSkill />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
