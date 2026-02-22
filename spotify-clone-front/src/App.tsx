import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home'; 
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import AllAlbumsPage from './pages/AllAlbumsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchPage />} /> 
          
          <Route path="profile" element={<ProfilePage />} />

          <Route path="all-albums" element={<AllAlbumsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;