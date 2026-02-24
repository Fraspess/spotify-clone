import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Player from '../components/Footer/Player.tsx';
import Topbar from '../components/topbar/Topbar';

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
            <div className="flex-1 flex flex-col m-2 ml-0 overflow-hidden bg-gradient-to-b from-bg-elevated to-bg-main rounded-xl border border-border-subtle/10 shadow-2xl">
                <Topbar />
            <main className="flex-1 overflow-y-auto p-6 pt-2">
            <Outlet />
            </main>
            </div>
      </div>
      <Player />
    </div>
  );
};

export default MainLayout;