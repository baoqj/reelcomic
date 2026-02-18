import React, { useState, useEffect } from 'react';
import { HashRouter, Navigate, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Details } from './pages/Details';
import { Player } from './pages/Player';
import { Profile } from './pages/Profile';
import { Shop } from './pages/Shop';
import { Playlist } from './pages/Playlist';
import { Dashboard } from './pages/admin/Dashboard';
import { DramaContent } from './pages/admin/DramaContent';
import { Icon } from './components/Icon';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide main header on admin pages
    if (location.pathname.startsWith('/admin')) return null;

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-background-dark/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-4'}`}>
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <Icon name="play_circle" className="text-xl" />
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-primary uppercase hidden sm:block">ReelComic</h1>
                    </div>
                    
                    <nav className="hidden md:flex items-center gap-6">
                        <span onClick={() => navigate('/')} className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors text-gray-800 dark:text-gray-200">Home</span>
                        <span onClick={() => navigate('/categories')} className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors text-gray-800 dark:text-gray-200">Categories</span>
                        <span onClick={() => navigate('/playlist')} className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors text-gray-800 dark:text-gray-200">Playlist</span>
                        <span onClick={() => navigate('/subscription')} className="text-sm font-semibold cursor-pointer text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                            <Icon name="workspace_premium" className="text-lg"/> VIP
                        </span>
                         <span onClick={() => navigate('/admin')} className="text-sm font-semibold cursor-pointer text-gray-500 hover:text-primary transition-colors">Admin</span>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                     <div className="relative hidden sm:block">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="bg-primary/5 dark:bg-white/10 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary w-48 transition-all"
                        />
                    </div>
                    <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <Icon name="notifications" className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <div 
                        className="size-9 rounded-full bg-gray-200 overflow-hidden border border-gray-300 cursor-pointer"
                        onClick={() => navigate('/profile')}
                    >
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmb-yf6EQQFvyhjwxGBl_j3xxRqGDPpTt9WVfyLNXV1fA1TCOibNquZsN8Y-S0Z7ugoR09asa2gSJwdwLyKjQVfP9XlQIJ0sfSWiTfGLpNqWFa0_I9g5fKaRPcqh1FJLDWSN-FUBnWUesu7vYnej53ASMm4WiKZVTt1KZldNuX9Zlt13A15iRAIICZSD6GL5KUgRK6wqdYYam0-LohXeOQn12L__DqIgVEqX80kIIgBrWahLEKRx1RpgDoSgW-zAK19xTkxFGwoFQ" alt="User" className="w-full h-full object-cover"/>
                    </div>
                </div>
            </div>
        </header>
    );
};

const MobileNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide mobile nav on admin pages
    if (location.pathname.startsWith('/admin')) return null;

    const isActive = (paths: string[]) => paths.includes(location.pathname);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-lg border-t border-gray-200 dark:border-white/5 pb-6 pt-3 px-6 md:hidden">
            <div className="flex justify-between items-center">
                <div onClick={() => navigate('/')} className={`flex flex-col items-center gap-1 w-1/5 ${isActive(['/']) ? 'text-primary' : 'text-gray-400'}`}>
                    <Icon name="home" filled={isActive(['/'])} />
                    <span className="text-[10px] font-bold">Home</span>
                </div>
                <div onClick={() => navigate('/categories')} className={`flex flex-col items-center gap-1 w-1/5 ${isActive(['/categories', '/explore']) ? 'text-primary' : 'text-gray-400'}`}>
                    <Icon name="explore" filled={isActive(['/categories', '/explore'])} />
                    <span className="text-[10px] font-bold">Categories</span>
                </div>
                <div onClick={() => navigate('/playlist')} className={`flex flex-col items-center gap-1 w-1/5 ${isActive(['/playlist']) ? 'text-primary' : 'text-gray-400'}`}>
                    <Icon name="video_library" filled={isActive(['/playlist'])} />
                    <span className="text-[10px] font-bold">Playlist</span>
                </div>
                 <div onClick={() => navigate('/subscription')} className={`flex flex-col items-center gap-1 w-1/5 ${isActive(['/subscription', '/shop']) ? 'text-primary' : 'text-gray-400'}`}>
                    <Icon name="workspace_premium" filled={isActive(['/subscription', '/shop'])} />
                    <span className="text-[10px] font-bold">VIP</span>
                </div>
                 <div onClick={() => navigate('/profile')} className={`flex flex-col items-center gap-1 w-1/5 ${isActive(['/profile']) ? 'text-primary' : 'text-gray-400'}`}>
                    <Icon name="person" filled={isActive(['/profile'])} />
                    <span className="text-[10px] font-bold">Profile</span>
                </div>
            </div>
        </nav>
    );
};

const MainContainer: React.FC<{children: React.ReactNode}> = ({children}) => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');
    
    return (
        <div className={`min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white ${isAdmin ? '' : 'pb-20 md:pb-0'}`}>
            {children}
        </div>
    )
}

const App: React.FC = () => {
    return (
        <HashRouter>
            <ScrollToTop />
            <MainContainer>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categories" element={<Explore />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/details/:id" element={<Details />} />
                    <Route path="/player/:id" element={<Player />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/subscription" element={<Shop />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/playlist" element={<Playlist />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/content" element={<DramaContent />} />
                    <Route path="/admin/dramas" element={<DramaContent />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <MobileNav />
            </MainContainer>
        </HashRouter>
    );
};

export default App;
