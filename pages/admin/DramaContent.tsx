import React from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Icon } from '../../components/Icon';
import { MOCK_DRAMAS } from '../../constants';

export const DramaContent: React.FC = () => {
    return (
        <AdminLayout>
             <div className="max-w-7xl mx-auto">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1b0e12] dark:text-white tracking-tight">Drama Management</h1>
                        <p className="text-primary/60 font-medium text-sm md:text-base">Manage short-series metadata, episodes, posters, and stream status.</p>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all active:scale-95">
                        <Icon name="cloud_upload" />
                        Upload New Drama
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-white/5 p-4 rounded-xl shadow-sm border border-primary/5 mb-6 flex flex-col md:flex-row gap-4">
                    <div className="grid grid-cols-2 md:flex md:flex-1 gap-4">
                         <div className="flex-1">
                            <label className="text-[10px] font-bold text-primary uppercase mb-1 block">Category</label>
                            <div className="relative">
                                <select className="w-full bg-primary/5 border-none focus:ring-primary/20 rounded-lg text-sm text-[#1b0e12] dark:text-white font-semibold py-2 appearance-none pl-3 pr-8">
                                    <option>All Genres</option>
                                    <option>Shonen</option>
                                    <option>Shojo</option>
                                </select>
                                <Icon name="expand_more" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-primary uppercase mb-1 block">Status</label>
                             <div className="relative">
                                <select className="w-full bg-primary/5 border-none focus:ring-primary/20 rounded-lg text-sm text-[#1b0e12] dark:text-white font-semibold py-2 appearance-none pl-3 pr-8">
                                    <option>All Status</option>
                                    <option>ongoing</option>
                                    <option>completed</option>
                                </select>
                                <Icon name="expand_more" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                            </div>
                        </div>
                         <div className="flex-1 col-span-2 md:col-span-1">
                            <label className="text-[10px] font-bold text-primary uppercase mb-1 block">Sort By</label>
                            <div className="relative">
                                <select className="w-full bg-primary/5 border-none focus:ring-primary/20 rounded-lg text-sm text-[#1b0e12] dark:text-white font-semibold py-2 appearance-none pl-3 pr-8">
                                    <option>Latest Updated</option>
                                    <option>Total Views</option>
                                </select>
                                <Icon name="expand_more" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                            </div>
                        </div>
                    </div>
                     <button className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                        <Icon name="filter_list" />
                         <span className="md:hidden">Filters</span>
                         <span className="hidden md:inline">More Filters</span>
                    </button>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block bg-white dark:bg-white/5 rounded-xl shadow-sm border border-primary/5 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-primary/5 bg-primary/[0.02]">
                                <th className="px-6 py-4 text-[11px] font-bold text-primary/50 uppercase tracking-widest">Cover</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-primary/50 uppercase tracking-widest">Drama Info</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-primary/50 uppercase tracking-widest text-center">Episodes</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-primary/50 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-primary/50 uppercase tracking-widest">Last Update</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-primary/50 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {MOCK_DRAMAS.map((drama) => (
                                <tr key={drama.id} className="group hover:bg-primary/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-24 rounded-lg overflow-hidden ring-1 ring-primary/10 group-hover:ring-primary/30 transition-all shadow-sm">
                                            <img src={drama.thumbnail} alt={drama.title} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-[#1b0e12] dark:text-white group-hover:text-primary transition-colors">{drama.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase">{drama.tags[0]}</span>
                                                <span className="text-[10px] text-primary/40 font-medium">{drama.tags.slice(1).join(', ')}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex flex-col">
                                            <span className="text-sm font-bold text-[#1b0e12] dark:text-white">{drama.episodes.length} / {drama.totalEpisodes}</span>
                                            <div className="w-16 h-1 bg-primary/10 rounded-full mt-1 overflow-hidden">
                                                <div className="bg-primary h-full rounded-full" style={{ width: `${(drama.episodes.length / drama.totalEpisodes) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${drama.status === 'ongoing' ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-gray-400'}`}>
                                            {drama.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-semibold text-primary/60">Oct 24, 2023</p>
                                        <p className="text-[10px] text-primary/30">14:32 PM</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="size-8 rounded-lg bg-primary/5 text-primary/60 hover:bg-primary hover:text-white transition-all flex items-center justify-center">
                                                <Icon name="edit" className="text-[18px]" />
                                            </button>
                                            <button className="size-8 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                                                <Icon name="delete" className="text-[18px]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {/* Pagination */}
                    <div className="px-6 py-4 bg-primary/[0.02] border-t border-primary/5 flex items-center justify-between">
                        <p className="text-xs font-semibold text-primary/50">Showing 1-10 of 248 dramas</p>
                        <div className="flex items-center gap-1">
                            <button className="size-8 flex items-center justify-center rounded-lg text-primary/40 hover:bg-primary/10 transition-colors">
                                <Icon name="chevron_left" />
                            </button>
                            <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold shadow-sm">1</button>
                            <button className="size-8 flex items-center justify-center rounded-lg text-primary/60 text-xs font-bold hover:bg-primary/10 transition-colors">2</button>
                            <button className="size-8 flex items-center justify-center rounded-lg text-primary/60 text-xs font-bold hover:bg-primary/10 transition-colors">3</button>
                            <span className="text-primary/30 px-1">...</span>
                            <button className="size-8 flex items-center justify-center rounded-lg text-primary/60 text-xs font-bold hover:bg-primary/10 transition-colors">24</button>
                            <button className="size-8 flex items-center justify-center rounded-lg text-primary/40 hover:bg-primary/10 transition-colors">
                                <Icon name="chevron_right" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {MOCK_DRAMAS.map((drama) => (
                        <div key={drama.id} className="flex items-center gap-4 p-3 bg-white dark:bg-white/5 rounded-xl border border-primary/5 shadow-sm">
                            <div className="relative shrink-0">
                                <div className="w-20 h-28 rounded-lg overflow-hidden border border-primary/10">
                                    <img src={drama.thumbnail} className="w-full h-full object-cover" alt={drama.title} />
                                </div>
                                {drama.status === 'ongoing' && (
                                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary/90 backdrop-blur-sm text-[10px] text-white font-bold rounded">HOT</div>
                                )}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <h3 className="font-bold text-base text-[#1b0e12] dark:text-white truncate">{drama.title}</h3>
                                <div className="flex gap-1.5 mt-1 mb-2">
                                    <span className="text-[10px] px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded uppercase font-bold">{drama.tags[0]}</span>
                                    <span className="text-[10px] px-2 py-0.5 bg-white dark:bg-white/10 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/10 rounded uppercase font-bold">
                                        {drama.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mt-auto">
                                    <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                                        <Icon name="edit_square" className="text-[18px]" />
                                        <span className="text-[10px] font-bold">EDIT</span>
                                    </button>
                                    <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                                        <Icon name="delete" className="text-[18px]" />
                                        <span className="text-[10px] font-bold">DELETE</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             <button className="md:hidden fixed bottom-24 right-6 size-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20">
                <Icon name="add" className="text-3xl" />
            </button>
        </AdminLayout>
    );
};
