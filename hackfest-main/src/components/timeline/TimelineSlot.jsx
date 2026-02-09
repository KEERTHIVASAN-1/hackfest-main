import React from 'react';
import { format, isPast, isFuture } from 'date-fns';
import clsx from 'clsx';
import { Clock, CheckCircle2, Circle } from 'lucide-react';

export default function TimelineSlot({ slot, isActive }) {
    const fromDate = new Date(slot.from);
    const toDate = new Date(slot.to);
    const isCompleted = !isActive && isPast(toDate);
    const isUpcoming = !isActive && isFuture(fromDate);

    return (
        <div
            className={clsx(
                'relative pl-10 pb-8 last:pb-0',
                'border-l-2 transition-colors duration-300',
                isActive && 'border-secondary',
                isCompleted && 'border-gray-800',
                isUpcoming && 'border-gray-700'
            )}
        >
            {/* Bullet: only active slot has the blinking ring */}
            <div
                className={clsx(
                    'absolute left-0 top-0 -translate-x-1/2 flex items-center justify-center',
                    'w-5 h-5 rounded-full border-2 bg-black',
                    isActive && 'border-secondary timeline-live-blink shadow-[0_0_10px_rgba(212,175,55,0.5)]',
                    isCompleted && 'border-gray-700 bg-gray-900',
                    isUpcoming && 'border-gray-600'
                )}
            >
                {isCompleted && (
                    <CheckCircle2 className="w-3 h-3 text-gray-500" />
                )}
                {isActive && (
                    <span className="absolute w-2 h-2 rounded-full bg-secondary" />
                )}
                {isUpcoming && (
                    <Circle className="w-2 h-2 text-gray-500" />
                )}
            </div>

            {/* Card */}
            <div
                className={clsx(
                    'rounded-xl p-4 transition-all duration-300 border',
                    isActive &&
                        'bg-gradient-to-br from-secondary/20 to-black/80 border-secondary/50 shadow-[0_0_15px_rgba(212,175,55,0.15)] timeline-live-glow',
                    isCompleted &&
                        'bg-gray-900/50 border-gray-800 opacity-60 hover:opacity-100',
                    isUpcoming && 'bg-black/40 border-gray-800 shadow-sm hover:border-gray-600'
                )}
            >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3
                        className={clsx(
                            'font-bold text-base',
                            isActive && 'text-secondary',
                            isCompleted && 'text-gray-500 line-through decoration-gray-700',
                            isUpcoming && 'text-gray-300'
                        )}
                    >
                        {slot.activity}
                    </h3>
                    {/* Only the active slot shows the LIVE badge — and it's the only thing that blinks */}
                    {isActive && (
                        <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-black bg-secondary timeline-live-blink shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                            aria-label="Current time slot"
                        >
                            LIVE
                        </span>
                    )}
                </div>
                <div
                    className={clsx(
                        'flex items-center gap-2 mt-2 text-sm',
                        isActive ? 'text-secondary/80' : 'text-gray-500'
                    )}
                >
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>
                        {format(fromDate, 'h:mm a')} – {format(toDate, 'h:mm a')}
                    </span>
                    <span className="text-gray-600">·</span>
                    <span>{format(fromDate, 'MMM d')}</span>
                </div>
            </div>
        </div>
    );
}
