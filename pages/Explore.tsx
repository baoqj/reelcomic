import React, { useState } from 'react';
import { GENRES } from '../constants';
import { DramaCard } from '../components/DramaCard';
import { Icon } from '../components/Icon';
import { useSeriesCatalog } from '../hooks/useSeriesCatalog';

export const Explore: React.FC = () => {
    const [activeGenre, setActiveGenre] = useState("All Genres");
    const { series, loading } = useSeriesCatalog();

    const filteredDramas = activeGenre === "All Genres" 
        ? series 
        : series.filter(d => d.tags.includes(activeGenre));

    return (
        <div className="pt-24 px-4 md:px-10 max-w-[1440px] mx-auto min-h-screen">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <nav className="flex items-center gap-2 text-primary/60 text-xs font-bold uppercase tracking-widest mb-2">
                        <span>Categories</span>
                        <Icon name="chevron_right" className="text-xs" />
                        <span className="text-primary">{activeGenre}</span>
                    </nav>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 text-gray-900 dark:text-white">Anime Short Dramas</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Explore episodes between 60 and 120 seconds.</p>
                </div>
                
                <div className="relative group">
                    <button className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm font-bold shadow-sm hover:border-primary/30 transition-all text-gray-700 dark:text-gray-200">
                        <Icon name="sort" className="text-lg" />
                        Sort: Newest
                        <Icon name="expand_more" className="text-lg" />
                    </button>
                </div>
            </div>

            {/* Genre Pills */}
            <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 hide-scrollbar">
                {GENRES.map((genre) => (
                    <button 
                        key={genre}
                        onClick={() => setActiveGenre(genre)}
                        className={`flex-none px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                            activeGenre === genre 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                            : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-primary/40'
                        }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4 mb-20">
                {/* Just duplicating the mock data to fill the grid visually as per design */}
                {[...filteredDramas, ...filteredDramas, ...filteredDramas].map((drama, idx) => (
                    <div key={`${drama.id}-${idx}`} className="w-full">
                        <DramaCard drama={drama} />
                    </div>
                ))}
            </div>

            {loading && (
                <p className="text-center text-sm text-gray-400 mb-6">Loading latest catalog...</p>
            )}
            
            <div className="flex justify-center mb-20">
                 <button className="px-10 py-3 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-colors">
                    Load More Titles
                 </button>
            </div>
        </div>
    );
};
