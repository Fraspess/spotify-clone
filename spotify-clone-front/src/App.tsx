import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home'; 
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchPage />} /> 
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;