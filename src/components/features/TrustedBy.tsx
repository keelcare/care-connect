"use client";

import React from 'react';
import Image from 'next/image';

export const TrustedBy: React.FC = () => {
    const users = [
        { name: "Sarah M.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
        { name: "David K.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
        { name: "Jessica T.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
        { name: "Michael R.", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
        { name: "Emily W.", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
        { name: "James L.", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
        { name: "Anna P.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
        { name: "Robert H.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
    ];

    // Quadruple the array to ensure enough width for large screens and smooth looping
    const scrollingUsers = [...users, ...users, ...users, ...users];

    return (
        <section className="py-16 bg-neutral-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
                <p className="text-neutral-500 font-medium uppercase tracking-widest text-sm">Trusted by thousands of families</p>
            </div>

            <div className="relative w-full">
                {/* Gradient Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-neutral-50 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-neutral-50 to-transparent z-10"></div>

                {/* Infinite Scroll Container */}
                <div className="flex gap-12 animate-scroll-infinite">
                    {scrollingUsers.map((user, index) => (
                        <div key={index} className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border border-neutral-100 flex-shrink-0">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                    src={user.image}
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-neutral-800 whitespace-nowrap">{user.name}</span>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <i key={star} className="lni lni-star-filled text-yellow-400 text-[10px]"></i>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
