import React from 'react';
import { MOCK_DRAMAS, MOCK_USER_PROFILE } from '../constants';
import { Icon } from '../components/Icon';
import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '../hooks/useAuthSession';

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const continueWatching = MOCK_DRAMAS.slice(0, 3);
    const { user } = useAuthSession();
    if (!user) {
        return (
            <div className="min-h-screen pt-24 px-4 md:px-10 flex items-start justify-center">
                <div className="max-w-xl w-full bg-white dark:bg-[#2d181e] rounded-2xl border border-primary/10 p-8 text-center">
                    <h2 className="text-2xl font-extrabold mb-3 text-gray-900 dark:text-white">请先登录账户</h2>
                    <p className="text-gray-500 mb-6">登录后可同步观看历史、VIP权益和设备进度。</p>
                    <button
                        onClick={() => navigate('/auth')}
                        className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
                    >
                        前往登录 / 注册
                    </button>
                </div>
            </div>
        );
    }
    const profile = {
        id: user.id,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl || MOCK_USER_PROFILE.avatarUrl,
        email: user.email,
        vipExpiresAt: 'N/A',
      };

    return (
        <div className="w-full min-h-screen pt-20 px-4 md:px-20 lg:px-40 pb-20">
            <div className="max-w-[1280px] mx-auto w-full">
                
                {/* Profile Header Card */}
                <div className="bg-white dark:bg-[#2d181e] rounded-xl p-6 md:p-8 shadow-sm border border-primary/5 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start justify-between relative z-10">
                        <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
                            <div className="relative">
                                <div className="size-24 md:size-32 rounded-full border-4 border-white dark:border-background-dark shadow-lg overflow-hidden">
                                    <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-gradient-to-tr from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white dark:border-background-dark shadow-sm">
                                    VIP
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 justify-center md:justify-start">
                                    {profile.displayName}
                                    <Icon name="verified" filled className="text-primary text-xl" />
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">User ID: {profile.id}</p>
                                <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                                    <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <Icon name="calendar_month" className="text-[14px]" /> 
                                        VIP Member until {profile.vipExpiresAt?.slice(0, 10)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-md hover:bg-primary/90 transition-all active:scale-95">
                                <Icon name="edit" className="text-[18px]" /> Edit Profile
                            </button>
                            <button className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-lg font-bold text-sm border border-transparent hover:border-primary/20 transition-all">
                                <Icon name="share" className="text-[18px]" />
                            </button>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                        <div className="text-center md:text-left">
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Followers</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white mt-1">1.2k</p>
                        </div>
                        <div className="text-center md:text-left border-l border-gray-100 dark:border-white/5 pl-4 md:pl-8">
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Following</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white mt-1">342</p>
                        </div>
                        <div className="text-center md:text-left border-l border-gray-100 dark:border-white/5 pl-4 md:pl-8">
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Minutes Watched</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white mt-1">1,420m</p>
                        </div>
                        <div className="text-center md:text-left border-l border-gray-100 dark:border-white/5 pl-4 md:pl-8">
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Global Rank</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white mt-1">Top 5%</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content Area */}
                    <div className="flex-1 space-y-6">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 dark:border-white/10 gap-8 overflow-x-auto hide-scrollbar">
                            <button className="flex items-center gap-2 border-b-2 border-primary text-primary pb-3 font-bold text-sm whitespace-nowrap">
                                <Icon name="grid_view" className="text-[18px]" /> Overview
                            </button>
                            <button className="flex items-center gap-2 border-b-2 border-transparent text-gray-500 hover:text-primary pb-3 font-bold text-sm whitespace-nowrap transition-colors">
                                <Icon name="history" className="text-[18px]" /> History
                            </button>
                            <button className="flex items-center gap-2 border-b-2 border-transparent text-gray-500 hover:text-primary pb-3 font-bold text-sm whitespace-nowrap transition-colors">
                                <Icon name="bookmark" className="text-[18px]" /> My List
                            </button>
                        </div>

                        {/* Watch History / Continue Watching */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Continue Watching</h3>
                                <span className="text-primary text-xs font-bold hover:underline cursor-pointer">View All</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {continueWatching.map((drama, idx) => (
                                    <div key={idx} className="group cursor-pointer" onClick={() => navigate(`/player/${drama.id}`)}>
                                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-200 dark:bg-white/5">
                                            <img src={drama.poster} alt={drama.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                                                    <div className="bg-primary h-full" style={{ width: `${Math.random() * 80 + 20}%` }}></div>
                                                </div>
                                                <p className="text-white text-[10px] mt-1 font-medium">Ep {Math.floor(Math.random() * 10) + 1} of {drama.totalEpisodes}</p>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Icon name="play_circle" filled className="text-white text-5xl drop-shadow-lg" />
                                            </div>
                                        </div>
                                        <h4 className="mt-2 text-sm font-bold truncate text-gray-900 dark:text-white">{drama.title}</h4>
                                        <p className="text-xs text-gray-500 truncate">Watched 2h ago</p>
                                    </div>
                                ))}
                                {/* Explore Slot */}
                                <div onClick={() => navigate('/categories')} className="flex flex-col items-center justify-center aspect-[3/4] rounded-lg border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                                    <div className="text-center p-4">
                                        <Icon name="add_circle" className="text-gray-400 group-hover:text-primary transition-colors text-3xl mb-2" />
                                        <p className="text-xs font-bold text-gray-400 group-hover:text-primary">Discover More</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Account Settings Mini List */}
                        <section className="bg-white dark:bg-[#2d181e] rounded-xl overflow-hidden border border-gray-100 dark:border-white/5">
                            <div className="p-4 border-b border-gray-100 dark:border-white/5">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">Account Security</h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-white/5">
                                <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer group transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                            <Icon name="mail" className="text-[20px]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Email Address</p>
                                            <p className="text-xs text-gray-500">{profile.email}</p>
                                        </div>
                                    </div>
                                    <Icon name="chevron_right" className="text-gray-400 group-hover:text-primary" />
                                </div>
                                <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer group transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                                            <Icon name="key" className="text-[20px]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Password</p>
                                            <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                                        </div>
                                    </div>
                                    <Icon name="chevron_right" className="text-gray-400 group-hover:text-primary" />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <div className="w-full lg:w-80 space-y-6">
                        {/* Wallet Card */}
                        <div className="bg-gradient-to-br from-[#e8306e] to-[#ff7da8] rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                <Icon name="account_balance_wallet" className="text-8xl" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-white/80 text-xs font-bold uppercase tracking-widest">My Balance</p>
                                <div className="flex items-end gap-1 mt-2 mb-6">
                                    <span className="text-4xl font-black">1,250</span>
                                    <span className="text-sm font-medium mb-1 opacity-90">Coins</span>
                                </div>
                                <button 
                                    onClick={() => navigate('/subscription')}
                                    className="w-full py-3 bg-white text-primary rounded-lg font-bold text-sm shadow-md hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <Icon name="add_circle" className="text-[20px]" /> Recharge Now
                                </button>
                            </div>
                        </div>

                        {/* VIP Benefits List */}
                        <div className="bg-white dark:bg-[#2d181e] rounded-xl p-5 border border-yellow-500/30 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-lg">
                                    <Icon name="workspace_premium" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">VIP Benefits</h3>
                            </div>
                            <ul className="space-y-3 mb-5">
                                {['Ad-free experience', '4K Ultra HD quality', 'Early access to episodes', 'Exclusive VIP badges'].map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                        <Icon name="check_circle" filled className="text-green-500 text-[18px]" /> {benefit}
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => navigate('/subscription')}
                                className="w-full py-2 text-primary border border-primary/20 rounded-lg text-xs font-bold hover:bg-primary/5 transition-all"
                            >
                                Manage Subscription
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
