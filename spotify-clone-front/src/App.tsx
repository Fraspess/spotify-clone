import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/authpage/AuthPage.tsx';
import MainLayout from './layouts/MainLayout';
import Home from './pages/home/Home.tsx'; 
import SearchPage from './pages/searchpage/SearchPage.tsx';
import ProfilePage from './pages/profilepage/ProfilePage.tsx';
import AllAlbumsPage from './pages/allalbumspage/AllAlbumsPage.tsx';
import Oauth2GoogleCallback from "./components/oauth2/Oauth2GoogleCallback.tsx";
import ConfirmRegisterPage from "./pages/confirmRegisterPage/ConfirmRegisterPage.tsx";
import AlbumPage from './pages/albumpage/albumpage.tsx';
import FavoriteSongsPage from './pages/favouritesongpage/favouritesongspage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/confirm-register" element={<ConfirmRegisterPage/>} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchPage />} /> 
          
          <Route path="profile" element={<ProfilePage />} />
          <Route path="/favorite-songs" element={<FavoriteSongsPage />} />
          <Route path="all-albums" element={<AllAlbumsPage />} />
          <Route path="/album/:id" element={<AlbumPage />} />
          
          <Route path="/oauth2/callback" element={<Oauth2GoogleCallback/>}/>


        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;