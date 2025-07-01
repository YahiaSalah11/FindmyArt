import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import PaintingDetailPage from './pages/PaintingDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/painting/:id" element={<PaintingDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;