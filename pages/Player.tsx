import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_DRAMAS } from '../constants';
import { Icon } from '../components/Icon';

export const Player: React.FC = () => {
    const { id } = useParams();
    const drama = MOCK_DRAMAS.find(d => d.id === id) || MOCK_DRAMAS[0];
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="w-full min-h-screen pt-16 lg:pt-20 bg-black text-white flex justify-center">
            <div className="max-w-[1600px] w-full flex flex-col lg:flex-row h-[calc(100vh-80px)]">
                
                {/* Video Container - Emulate Vertical Video focus */}
                <div className="flex-1 bg-gray-900 relative flex items-center justify-center overflow-hidden">
                    {/* Blurred background for wide screens */}
                    <div className="absolute inset-0">
                        <img src={drama.thumbnail} className="w-full h-full object-cover blur-3xl opacity-30" alt="blur-bg" />
                    </div>

                    {/* The Player Frame (9:16 aspect ratio emulation) */}
                    <div className="relative h-full aspect-[9/16] max-h-full bg-black shadow-2xl mx-auto flex items-center justify-center group">
                        <img src={drama.thumbnail} className="w-full h-full object-cover opacity-80" alt="Video Placeholder" />
                        
                        {/* Fake Controls */}
                        <div className="absolute inset-0 flex items-center justify-center">
                             <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="size-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform group-hover:opacity-100 opacity-100 lg:opacity-0"
                             >
                                <Icon name={isPlaying ? "pause" : "play_arrow"} filled className="text-4xl" />
                             </button>
                        </div>

                        {/* Top Overlay */}
                        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                             <div className="flex justify-between items-start">
                                 <div>
                                     <h2 className="font-bold text-lg leading-tight">{drama.title}</h2>
                                     <p className="text-xs text-white/70">Episode 1</p>
                                 </div>
                                 <span className="px-2 py-1 bg-primary text-[10px] font-bold rounded uppercase">HD</span>
                             </div>
                        </div>

                        {/* Bottom Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer">
                                <div className="w-1/3 h-full bg-primary rounded-full relative">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-4">
                                     <Icon name="skip_previous" className="cursor-pointer hover:text-primary" />
                                     <Icon name={isPlaying ? "pause" : "play_arrow"} filled className="cursor-pointer hover:text-primary" />
                                     <Icon name="skip_next" className="cursor-pointer hover:text-primary" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-primary">
                                        <Icon name="favorite" />
                                        <span className="text-[10px]">12K</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-primary">
                                        <Icon name="comment" />
                                        <span className="text-[10px]">450</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-primary">
                                        <Icon name="share" />
                                        <span className="text-[10px]">Share</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Episodes & Comments) - Hidden on mobile portrait, shown below or right on larger */}
                <div className="lg:w-[400px] w-full bg-surface-dark border-l border-white/5 flex flex-col h-full overflow-hidden">
                    <div className="flex border-b border-white/10">
                        <button className="flex-1 py-4 text-sm font-bold text-primary border-b-2 border-primary bg-white/5">Episodes</button>
                        <button className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-white">Comments (450)</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        <div className="flex justify-between items-center mb-2 px-2">
                             <span className="text-xs font-bold text-gray-400">{drama.totalEpisodes} Episodes</span>
                             <span className="text-xs font-bold text-primary cursor-pointer">Unlocks available</span>
                        </div>

                        {drama.episodes.length > 0 ? drama.episodes.map((ep) => (
                            <div key={ep.id} className={`flex gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors ${ep.number === 1 ? 'bg-primary/10 border border-primary/20' : ''}`}>
                                <div className="relative w-24 aspect-video rounded overflow-hidden bg-black flex-shrink-0">
                                    <img src={ep.thumbnail} className={`w-full h-full object-cover ${ep.isLocked ? 'grayscale opacity-50' : ''}`} alt="thumb" />
                                    {ep.number === 1 && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Icon name="equalizer" filled className="text-primary animate-pulse" />
                                        </div>
                                    )}
                                    {ep.isLocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <Icon name="lock" className="text-white text-lg" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex justify-between">
                                        <p className={`text-xs font-bold uppercase mb-1 ${ep.number === 1 ? 'text-primary' : 'text-gray-400'}`}>Episode {ep.number}</p>
                                        <span className="text-[10px] text-gray-500">{ep.duration}</span>
                                    </div>
                                    <p className={`text-sm font-medium truncate ${ep.number === 1 ? 'text-white' : 'text-gray-300'}`}>{ep.title}</p>
                                </div>
                            </div>
                        )) : (
                            // Fallback if no episodes in mock
                             Array.from({length: 10}).map((_, i) => (
                                <div key={i} className="flex gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                                     <div className="relative w-24 aspect-video rounded overflow-hidden bg-white/10 flex-shrink-0 flex items-center justify-center">
                                         <Icon name="play_arrow" className="text-gray-500" />
                                     </div>
                                     <div className="flex-1">
                                         <p className="text-xs font-bold text-gray-400 uppercase mb-1">Episode {i+1}</p>
                                         <p className="text-sm font-medium text-gray-300">Chapter Title {i+1}</p>
                                     </div>
                                </div>
                             ))
                        )}
                    </div>
                    
                    {/* Unlock Banner */}
                    <div className="p-4 border-t border-white/10 bg-gradient-to-r from-primary/20 to-purple-500/20">
                        <button className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all">
                            <Icon name="stars" filled />
                            Unlock All Episodes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};