import React from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Icon } from '../../components/Icon';
import { MOCK_DRAMAS } from '../../constants';
import { useI18n } from '../../i18n';

export const Dashboard: React.FC = () => {
    const { t, localizeSeries } = useI18n();
    const topDramas = MOCK_DRAMAS.slice(0, 3).map(localizeSeries);

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
                {/* Mobile Date Filters */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar md:hidden">
                    <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-lg bg-primary text-white text-xs font-bold shadow-md">{t('admin.dashboard.today')}</button>
                    <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-lg bg-white dark:bg-white/5 border border-primary/10 text-xs font-bold">{t('admin.dashboard.days7')}</button>
                    <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-lg bg-white dark:bg-white/5 border border-primary/10 text-xs font-bold">{t('admin.dashboard.days30')}</button>
                </div>

                {/* Header Text (Desktop) */}
                <div className="hidden md:block">
                    <h2 className="text-2xl font-extrabold text-[#1b0e12] dark:text-white">{t('admin.dashboard.overviewTitle')}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.dashboard.overviewSubtitle')}</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-white dark:bg-white/5 p-4 md:p-6 rounded-2xl border border-primary/5 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                             <div className="size-10 md:size-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center">
                                <Icon name="payments" className="text-xl md:text-2xl" />
                            </div>
                            <span className="text-emerald-500 text-[10px] md:text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{t('admin.dashboard.revenue')}</p>
                        <h3 className="text-xl md:text-2xl font-extrabold mt-1 text-[#1b0e12] dark:text-white">$12.4k</h3>
                    </div>

                    <div className="bg-white dark:bg-white/5 p-4 md:p-6 rounded-2xl border border-primary/5 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                             <div className="size-10 md:size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Icon name="group" className="text-xl md:text-2xl" />
                            </div>
                            <span className="text-emerald-500 text-[10px] md:text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+8%</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{t('admin.dashboard.newUsers')}</p>
                        <h3 className="text-xl md:text-2xl font-extrabold mt-1 text-[#1b0e12] dark:text-white">2,840</h3>
                    </div>

                     <div className="bg-white dark:bg-white/5 p-4 md:p-6 rounded-2xl border border-primary/5 shadow-sm hidden md:block">
                        <div className="flex justify-between items-start mb-2">
                             <div className="size-10 md:size-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                                <Icon name="visibility" className="text-xl md:text-2xl" />
                            </div>
                            <span className="text-emerald-500 text-[10px] md:text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+24%</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{t('admin.dashboard.activeViewers')}</p>
                        <h3 className="text-xl md:text-2xl font-extrabold mt-1 text-[#1b0e12] dark:text-white">12.5k</h3>
                    </div>

                     <div className="bg-white dark:bg-white/5 p-4 md:p-6 rounded-2xl border border-primary/5 shadow-sm hidden md:block">
                        <div className="flex justify-between items-start mb-2">
                             <div className="size-10 md:size-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center">
                                <Icon name="play_circle" className="text-xl md:text-2xl" />
                            </div>
                            <span className="text-rose-500 text-[10px] md:text-xs font-bold bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full">-2.4%</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{t('admin.dashboard.watchTime')}</p>
                        <h3 className="text-xl md:text-2xl font-extrabold mt-1 text-[#1b0e12] dark:text-white">12,840</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart Section */}
                    <div className="lg:col-span-2 bg-white dark:bg-white/5 p-5 md:p-8 rounded-2xl border border-primary/5 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h4 className="text-lg font-bold text-[#1b0e12] dark:text-white">{t('admin.dashboard.revenueTrend')}</h4>
                                <p className="text-xs text-gray-400">{t('admin.dashboard.avgRevenuePerHour')}</p>
                            </div>
                            <Icon name="trending_up" className="text-primary" />
                        </div>
                        <div className="relative h-48 md:h-64 w-full">
                            {/* Simple SVG Chart */}
                            <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                        <stop offset="0%" stopColor="#e8306e" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#e8306e" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M0,250 Q100,220 200,240 T400,150 T600,180 T800,80 T1000,100 L1000,300 L0,300 Z" fill="url(#gradient)" />
                                <path d="M0,250 Q100,220 200,240 T400,150 T600,180 T800,80 T1000,100" fill="none" stroke="#e8306e" strokeWidth="4" />
                            </svg>
                        </div>
                         <div className="flex justify-between mt-4 text-xs text-gray-400 font-bold uppercase">
                            <span>08:00</span>
                            <span>12:00</span>
                            <span>16:00</span>
                            <span>20:00</span>
                        </div>
                    </div>

                    {/* Top Performing */}
                    <div className="bg-white dark:bg-white/5 p-5 md:p-8 rounded-2xl border border-primary/5 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-lg font-bold text-[#1b0e12] dark:text-white">{t('admin.dashboard.topDramas')}</h4>
                            <span className="text-primary text-sm font-bold cursor-pointer">{t('common.viewAll')}</span>
                        </div>
                        <div className="space-y-4">
                            {topDramas.map((drama, i) => (
                                <div key={drama.id} className="flex items-center gap-3 md:gap-4">
                                    <div className="size-14 md:size-16 rounded-lg bg-gray-200 dark:bg-white/10 overflow-hidden shrink-0">
                                        <img src={drama.thumbnail} alt={drama.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-[#1b0e12] dark:text-white truncate">{drama.title}</h4>
                                        <p className="text-xs text-gray-400 truncate">
                                            {t('admin.dashboard.viewsCr', { views: drama.views, cr: Math.floor(Math.random() * 20 + 70) })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary text-sm">${(Math.random() * 3000 + 1000).toFixed(0)}</p>
                                        <p className={`text-[10px] font-bold ${i === 2 ? 'text-red-500' : 'text-emerald-500'}`}>{i === 2 ? '-2%' : '+15%'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                            {t('admin.dashboard.fullAnalytics')}
                        </button>
                    </div>
                </div>

                {/* Growth Insights */}
                <div className="rounded-2xl bg-primary p-6 md:p-8 text-white shadow-xl shadow-primary/20 overflow-hidden relative">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg md:text-xl mb-1">{t('admin.dashboard.growthInsights')}</h3>
                        <p className="text-sm opacity-90 mb-6">{t('admin.dashboard.monthlyGoal')}</p>
                        <div className="w-full bg-white/20 h-2 md:h-3 rounded-full overflow-hidden mb-2">
                            <div className="bg-white h-full w-[85%] rounded-full shadow-lg"></div>
                        </div>
                        <div className="flex justify-between text-xs md:text-sm font-bold">
                            <span>{t('admin.dashboard.currentGoal')}</span>
                            <span>{t('admin.dashboard.goalTarget')}</span>
                        </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 size-40 bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </AdminLayout>
    );
};
