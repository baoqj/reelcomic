import React from 'react';
import { Drama } from '../types';
import { Icon } from './Icon';
import { useNavigate } from 'react-router-dom';

interface DramaCardProps {
    drama: Drama;
    showBadge?: string;
}

export const DramaCard: React.FC<DramaCardProps> = ({ drama, showBadge }) => {
    const navigate = useNavigate();

    return (
        <div 
            className="group cursor-pointer w-[140px] md:w-[180px] flex-shrink-0"
            onClick={() => navigate(`/details/${drama.id}`)}
        >
            <div className="relative aspect-[3/4.5] rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-primary/20 transition-all duration-300">
                <img 
                    src={drama.thumbnail} 
                    alt={drama.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {showBadge && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold tracking-wider rounded uppercase shadow-sm">
                        {showBadge}
                    </div>
                )}
                
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-white text-[10px] font-bold">
                    {drama.totalEpisodes} EPS
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="size-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                         <Icon name="play_arrow" className="text-white text-2xl" filled />
                    </div>
                </div>
            </div>
            
            <h4 className="font-bold text-sm mb-1 truncate group-hover:text-primary transition-colors text-gray-900 dark:text-gray-100">
                {drama.title}
            </h4>
            
            <div className="flex items-center gap-1.5 text-xs">
                <Icon name="star" className="text-primary text-[14px]" filled />
                <span className="font-bold text-gray-700 dark:text-gray-300">{drama.rating}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 dark:text-gray-400 truncate">{drama.tags[0]}</span>
            </div>
        </div>
    );
};
