import React from 'react';
import { MOCK_DRAMAS } from '../constants';
import { DramaCard } from '../components/DramaCard';
import { Icon } from '../components/Icon';

export const Playlist: React.FC = () => {
    // Simulating a playlist with some mock data
    const playlistDramas = [MOCK_DRAMAS[0], MOCK_DRAMAS[2], MOCK_DRAMAS[4]];

    return (
        <div className="w-full min-h-screen pt-20 px-4 md:px-10 max-w-[1440px] mx-auto pb-24">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Icon name="video_library" className="text-2xl" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Playlist</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{playlistDramas.length} Series saved</p>
                </div>
            </div>

            {playlistDramas.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
                    {playlistDramas.map((drama) => (
                        <div key={drama.id} className="relative group">
                            <DramaCard drama={drama} />
                            <button className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 backdrop-blur-sm">
                                <Icon name="delete" className="text-[16px]" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="size-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Icon name="playlist_add" className="text-4xl" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your playlist is empty</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-6">
                        Save shows you want to watch later by clicking the "Add to List" button on any series.
                    </p>
                </div>
            )}
        </div>
    );
};