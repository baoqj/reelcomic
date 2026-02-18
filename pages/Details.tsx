import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_DRAMAS } from '../constants';
import { Icon } from '../components/Icon';

export const Details: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const drama = MOCK_DRAMAS.find(d => d.id === id) || MOCK_DRAMAS[0];
    const statusLabel = drama.status === 'ongoing' ? 'Ongoing' : 'Completed';

    return (
        <div className="w-full min-h-screen pb-20">
            {/* Header/Backdrop */}
            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
                <div className="absolute inset-0">
                    <img src={drama.thumbnail} className="w-full h-full object-cover opacity-60" alt="Backdrop" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/40 dark:via-background-dark/80 to-transparent"></div>
                </div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-20 max-w-[1440px] mx-auto">
                     <div className="flex items-center gap-3 mb-4">
                        <span className="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded tracking-wider uppercase">Hot Series</span>
                        <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                            <Icon name="star" filled className="text-base" /> {drama.rating}
                        </div>
                        <span className="text-gray-500 dark:text-white/60 text-sm font-medium">{drama.views} Views</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-none">
                        {drama.title}
                    </h1>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(`/player/${drama.id}`)}
                            className="bg-primary hover:bg-primary/90 text-white px-10 py-3.5 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
                        >
                            <Icon name="play_arrow" filled />
                            Play Now
                        </button>
                        <button className="bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 backdrop-blur-md text-gray-900 dark:text-white px-6 py-3.5 rounded-full font-bold transition-colors">
                            Add to List
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-20 mt-12 flex flex-col lg:flex-row gap-12">
                {/* Synopsis & Info */}
                <div className="lg:w-1/3 space-y-8">
                     <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About the Drama</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Genres</p>
                                <div className="flex flex-wrap gap-2">
                                    {drama.tags.map(g => (
                                        <span key={g} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{g}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                    <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                                    {statusLabel} ({drama.episodes.length} / {drama.totalEpisodes} Episodes)
                                </p>
                            </div>
                             <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cast</p>
                                <div className="flex flex-col gap-3">
                                    {drama.cast.length > 0 ? drama.cast.map(c => (
                                        <div key={c.name} className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-gray-200 overflow-hidden">
                                                <img src={c.avatar} alt={c.name} className="w-full h-full object-cover"/>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{c.name}</p>
                                                <p className="text-[10px] text-gray-500 uppercase">{c.role}</p>
                                            </div>
                                        </div>
                                    )) : <p className="text-sm text-gray-500">Cast info unavailable</p>}
                                </div>
                            </div>
                        </div>
                     </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                     <div className="mb-10">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Synopsis</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                            {drama.synopsis}
                        </p>
                     </div>

                     <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Episodes</h3>
                        <div className="flex gap-2">
                             <button className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-white hover:bg-primary/10 hover:text-primary transition-colors">
                                <Icon name="sort" />
                             </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {drama.episodes.length > 0 ? drama.episodes.map((ep) => (
                            <div 
                                key={ep.id} 
                                onClick={() => navigate(`/player/${drama.id}`)}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-white/5 relative mb-2">
                                    <img src={ep.thumbnail} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${ep.isLocked ? 'grayscale opacity-40' : ''}`} alt={ep.title} />
                                    {ep.isLocked ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Icon name="lock" className="text-white/60 text-3xl" />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                            <Icon name="play_circle" filled className="text-white text-3xl" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-1 right-1 px-1 bg-black/60 rounded text-[10px] text-white font-mono">{ep.duration}</div>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Episode {ep.number}</p>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{ep.title}</p>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-10 text-gray-500">No episodes available yet.</div>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};
