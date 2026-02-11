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
                isCompleted && 'border-secondary/20',
                isUpcoming && 'border-gray-200'
            )}
        >
            {/* Bullet: only active slot has the blinking ring */}
            <div
                className={clsx(
                    'absolute left-0 top-0 -translate-x-1/2 flex items-center justify-center',
                    'w-5 h-5 rounded-full border-2 bg-white transition-all duration-300',
                    isActive && 'border-secondary timeline-live-blink shadow-[0_0_10px_rgba(212,175,55,0.5)] scale-110',
                    isCompleted && 'border-secondary/30 bg-secondary/10',
                    isUpcoming && 'border-gray-300'
                )}
            >
                {isCompleted && (
                    <CheckCircle2 className="w-3 h-3 text-secondary/70" />
                )}
                {isActive && (
                    <span className="absolute w-2 h-2 rounded-full bg-secondary" />
                )}
                {isUpcoming && (
                    <Circle className="w-2 h-2 text-gray-400" />
                )}
            </div>

            {/* Card */}
            <div
                className={clsx(
                    'rounded-xl p-4 transition-all duration-300 border',
                    isActive &&
                        'bg-white border-secondary shadow-lg shadow-secondary/10 timeline-live-glow',
                    isCompleted &&
                        'bg-secondary/5 border-secondary/10 opacity-80 hover:opacity-100 hover:bg-white hover:border-secondary/30 hover:shadow-md hover:shadow-secondary/5',
                    isUpcoming && 'bg-white border-gray-200 shadow-sm hover:border-secondary/30 hover:shadow-md hover:shadow-secondary/5'
                )}
            >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3
                        className={clsx(
                            'font-bold text-base',
                            isActive && 'text-gray-900',
                            isCompleted && 'text-gray-500 line-through decoration-secondary/40',
                            isUpcoming && 'text-gray-700'
                        )}
                    >
                        {slot.activity}
                    </h3>
                    {/* Only the active slot shows the LIVE badge — and it's the only thing that blinks */}
                    {isActive && (
                        <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-black bg-secondary timeline-live-blink shadow-sm"
                            aria-label="Current time slot"
                        >
                            LIVE
                        </span>
                    )}
                </div>
                <div
                    className={clsx(
                        'flex items-center gap-2 mt-2 text-sm',
                        isActive ? 'text-secondary font-medium' : 'text-gray-500'
                    )}
                >
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>
                        {format(fromDate, 'h:mm a')} – {format(toDate, 'h:mm a')}
                    </span>
                    <span className="text-secondary/30">·</span>
                    <span>{format(fromDate, 'MMM d')}</span>
                </div>
            </div>
        </div>
    );
}
