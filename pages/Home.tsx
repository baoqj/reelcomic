import React from 'react';
import { DramaCard } from '../components/DramaCard';
import { Icon } from '../components/Icon';
import { useNavigate } from 'react-router-dom';
import { useSeriesCatalog } from '../hooks/useSeriesCatalog';

export const Home: React.FC = () => {
    const { series } = useSeriesCatalog();
    const featuredDrama = series[1] || series[0];
    const navigate = useNavigate();

    if (!featuredDrama) return null;

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
                <img 
                    src={featuredDrama.poster} 
                    alt={featuredDrama.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 to-transparent"></div>

                <div className="absolute bottom-0 left-0 p-6 md:p-12 lg:p-20 max-w-2xl flex flex-col justify-end h-full">
                    <span className="inline-block px-3 py-1 mb-4 text-[10px] md:text-xs font-bold tracking-widest uppercase bg-primary text-white rounded w-fit shadow-lg shadow-primary/30">
                        Featured Short
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
                        {featuredDrama.title}
                    </h1>
                    <p className="text-white/80 text-sm md:text-lg mb-8 line-clamp-2 md:line-clamp-none leading-relaxed">
                        {featuredDrama.synopsis}
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => navigate(`/player/${featuredDrama.id}`)}
                            className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
                        >
                            <Icon name="play_arrow" filled />
                            Watch Now
                        </button>
                        <button 
                             onClick={() => navigate(`/details/${featuredDrama.id}`)}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 border border-white/20 transition-colors"
                        >
                            <Icon name="info" />
                            Details
                        </button>
                    </div>
                </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-10 space-y-12">
                {/* New Releases */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                             <Icon name="new_releases" className="text-primary" />
                            New Releases
                        </h3>
                        <span className="text-primary text-sm font-bold cursor-pointer hover:underline">View All</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                        {series.map((drama, idx) => (
                            <DramaCard key={drama.id} drama={drama} showBadge={idx === 0 ? 'New EP' : undefined} />
                        ))}
                    </div>
                </section>

                {/* Trending */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                            <Icon name="trending_up" className="text-primary" />
                            Trending Now
                        </h3>
                         <div className="flex gap-2">
                            <button className="size-8 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                                <Icon name="chevron_left" />
                            </button>
                            <button className="size-8 rounded-full border border-gray-300 dark:border-white/20 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                                <Icon name="chevron_right" />
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                        {[...series].reverse().map((drama, idx) => (
                            <DramaCard key={drama.id} drama={drama} showBadge={idx === 0 ? '#1 Trending' : undefined} />
                        ))}
                    </div>
                </section>

                {/* Categories Grid (Visual filler) */}
                <section>
                     <div className="flex items-center gap-2 mb-6">
                        <Icon name="category" className="text-primary" />
                        <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white">Popular Genres</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {['Romance', 'Action', 'Fantasy', 'Sci-Fi', 'Thriller', 'Comedy'].map((genre, idx) => (
                             <div key={idx} className="group cursor-pointer relative aspect-[16/9] rounded-xl overflow-hidden bg-primary/10">
                                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg drop-shadow-md">{genre}</span>
                                </div>
                             </div>
                        ))}
                    </div>
                </section>
            </div>
            
             <footer className="mt-20 border-t border-gray-200 dark:border-white/10 py-12 bg-white dark:bg-white/5">
                <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center gap-6">
                    <h2 className="text-2xl font-extrabold text-primary uppercase">ReelComic</h2>
                    <p className="text-sm text-gray-500 text-center max-w-md">
                        Short anime episodes, premium streaming, and creator-friendly publishing in one place.
                    </p>
                    <div className="flex gap-6 text-sm font-bold text-gray-400">
                        <span className="hover:text-primary cursor-pointer">Privacy</span>
                        <span className="hover:text-primary cursor-pointer">Terms</span>
                        <span className="hover:text-primary cursor-pointer">Contact</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-6">© 2026 ReelComic Studio.</p>
                </div>
            </footer>
        </div>
    );
};
