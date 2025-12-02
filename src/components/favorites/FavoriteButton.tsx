"use client";

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
    nannyId: string;
    initialFavorite?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
    onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({ 
    nannyId, 
    initialFavorite = false, 
    size = 'md',
    showLabel = false,
    className,
    onToggle 
}: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialFavorite);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(!initialFavorite);

    useEffect(() => {
        // Check favorite status on mount if not provided
        if (!initialFavorite) {
            checkFavoriteStatus();
        }
    }, [nannyId]);

    const checkFavoriteStatus = async () => {
        try {
            const result = await api.favorites.check(nannyId);
            setIsFavorite(result.isFavorite);
        } catch (error) {
            console.error('Failed to check favorite status:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isLoading) return;

        setIsLoading(true);
        try {
            if (isFavorite) {
                await api.favorites.remove(nannyId);
                setIsFavorite(false);
                onToggle?.(false);
            } else {
                await api.favorites.add(nannyId);
                setIsFavorite(true);
                onToggle?.(true);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    if (isChecking) {
        return (
            <button
                className={cn(
                    "flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all",
                    sizeClasses[size],
                    className
                )}
                disabled
            >
                <Heart 
                    size={iconSizes[size]} 
                    className="text-neutral-300 animate-pulse" 
                />
            </button>
        );
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={cn(
                "flex items-center justify-center gap-2 rounded-full transition-all",
                showLabel 
                    ? "px-4 py-2 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md border border-neutral-200" 
                    : cn("bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md", sizeClasses[size]),
                isLoading && "opacity-50 cursor-not-allowed",
                className
            )}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
            <Heart 
                size={iconSizes[size]} 
                className={cn(
                    "transition-all duration-300",
                    isFavorite 
                        ? "text-red-500 fill-red-500 scale-110" 
                        : "text-neutral-400 hover:text-red-400"
                )}
            />
            {showLabel && (
                <span className={cn(
                    "text-sm font-medium",
                    isFavorite ? "text-red-500" : "text-neutral-600"
                )}>
                    {isFavorite ? "Favorited" : "Favorite"}
                </span>
            )}
        </button>
    );
}
