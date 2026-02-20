import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useI18n } from '../i18n';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useI18n();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-[#1b0e12] dark:text-white font-sans fixed inset-0 z-50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 border-r border-primary/10 bg-white dark:bg-[#1b0e12] flex-col shrink-0">
                <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Icon name="movie_filter" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold leading-none">ReelComic</h2>
                        <p className="text-primary text-[10px] font-bold uppercase tracking-wider mt-0.5">{t('admin.portal')}</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar py-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary/40 px-3 mb-2">{t('admin.mainMenu')}</p>
                    
                    <div 
                        onClick={() => navigate('/admin')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${isActive('/admin') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-primary/5 hover:text-primary'}`}
                    >
                        <Icon name="dashboard" className="text-[20px]" />
                        {t('admin.menuDashboard')}
                    </div>

                    <div 
                        onClick={() => navigate('/admin/content')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${isActive('/admin/content') || isActive('/admin/dramas') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-primary/5 hover:text-primary'}`}
                    >
                        <Icon name="video_library" className="text-[20px]" />
                        {t('admin.menuContentManagement')}
                    </div>

                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer">
                        <Icon name="group" className="text-[20px]" />
                        {t('admin.menuUserManagement')}
                    </div>
                    
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer">
                        <Icon name="payments" className="text-[20px]" />
                        {t('admin.menuSubscriptions')}
                    </div>

                     <p className="text-[10px] font-bold uppercase tracking-wider text-primary/40 px-3 mb-2 mt-6">{t('admin.analytics')}</p>
                     <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer">
                        <Icon name="monitoring" className="text-[20px]" />
                        {t('admin.menuPerformance')}
                    </div>
                </nav>

                <div className="p-4 border-t border-primary/10">
                     <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-primary/5">
                        <div className="size-9 rounded-full bg-primary/20 overflow-hidden">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiwI59yj-s1ij4_xQ2Er-FoskyrJhb2LFpg23RIT2EdM44EaBzGImrBkbrFkUpD8hdAXz-SW7b0oghryoLuudzYJi38q_NDy01oyMWpszH72UQyJMXiswIBcKf12kRNDPRVEpmHwmC4WNWh6Yz71dnFPU3xD52RcZdPwAj3ZIjj7tsqD02YZomlEIif4KWq0VgZk6d-A7wjpptBO7QScgXNNELNVKMdzVJzCpXpKA5cK-OPNVAcKG9CBZJd52OlzT16TXrHJ8A-U4" alt="Admin" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold truncate">Admin Pinky</p>
                            <p className="text-[10px] text-gray-400 uppercase">Super Admin</p>
                        </div>
                        <Icon name="settings" className="text-gray-400 text-sm" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-30 flex items-center bg-white/80 dark:bg-[#1b0e12]/80 backdrop-blur-md px-4 py-3 justify-between border-b border-primary/10">
                     <div className="flex items-center gap-3">
                        <div className="size-9 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Icon name="movie_filter" className="text-xl" />
                        </div>
                        <h2 className="text-lg font-bold leading-none">{t('admin.mobileDashboardTitle')}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher compact />
                        <div className="size-9 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                             <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiwI59yj-s1ij4_xQ2Er-FoskyrJhb2LFpg23RIT2EdM44EaBzGImrBkbrFkUpD8hdAXz-SW7b0oghryoLuudzYJi38q_NDy01oyMWpszH72UQyJMXiswIBcKf12kRNDPRVEpmHwmC4WNWh6Yz71dnFPU3xD52RcZdPwAj3ZIjj7tsqD02YZomlEIif4KWq0VgZk6d-A7wjpptBO7QScgXNNELNVKMdzVJzCpXpKA5cK-OPNVAcKG9CBZJd52OlzT16TXrHJ8A-U4" alt="Admin" />
                        </div>
                    </div>
                </header>

                 {/* Desktop Header (Search & Actions) */}
                <header className="hidden md:flex h-16 border-b border-primary/10 bg-white/80 dark:bg-[#1b0e12]/80 backdrop-blur-md items-center justify-between px-8 shrink-0">
                    <div className="flex items-center flex-1 max-w-md">
                        <div className="relative w-full group">
                            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                placeholder={t('admin.searchContent')}
                                className="w-full bg-gray-100 dark:bg-white/5 border-none focus:ring-2 focus:ring-primary/20 rounded-lg py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <button className="size-10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors relative">
                            <Icon name="notifications" />
                            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-white dark:border-[#1b0e12]"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-24 md:pb-8">
                    {children}
                </div>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#1b0e12]/95 backdrop-blur-md border-t border-primary/10 px-6 py-3 flex justify-between items-center z-50">
                    <div onClick={() => navigate('/admin')} className={`flex flex-col items-center gap-1 ${isActive('/admin') ? 'text-primary' : 'text-gray-400'}`}>
                        <Icon name="dashboard" filled={isActive('/admin')} />
                        <span className="text-[10px] font-bold uppercase">{t('admin.mobileHome')}</span>
                    </div>
                    <div onClick={() => navigate('/admin/content')} className={`flex flex-col items-center gap-1 ${isActive('/admin/content') || isActive('/admin/dramas') ? 'text-primary' : 'text-gray-400'}`}>
                        <Icon name="movie" filled={isActive('/admin/content') || isActive('/admin/dramas')} />
                        <span className="text-[10px] font-bold uppercase">{t('admin.mobileDramas')}</span>
                    </div>
                     <div className="flex flex-col items-center gap-1 text-gray-400">
                        <Icon name="analytics" />
                        <span className="text-[10px] font-bold uppercase">{t('admin.mobileStats')}</span>
                    </div>
                     <div className="flex flex-col items-center gap-1 text-gray-400">
                        <Icon name="settings" />
                        <span className="text-[10px] font-bold uppercase">{t('admin.mobileSettings')}</span>
                    </div>
                </nav>
            </main>
        </div>
    );
};
