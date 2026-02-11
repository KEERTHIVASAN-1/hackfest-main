import React from 'react';
import { useHackathon } from '../../context/HackathonContext';
import TimelineSlot from './TimelineSlot';
import LoadingSpinner from '../common/LoadingSpinner';
import { Calendar } from 'lucide-react';

export default function VerticalTimeline() {
    const { timeline, activeSlot, loading } = useHackathon();

    if (loading) {
        return (
            <div className="py-8 flex justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!timeline || timeline.length === 0) {
        return (
            <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-8 text-center shadow-lg shadow-secondary/5">
                <Calendar className="mx-auto h-12 w-12 text-secondary/50" />
                <p className="mt-2 text-gray-600 text-sm font-medium">No schedule added yet.</p>
            </div>
        );
    }

    const activeId = activeSlot?._id || activeSlot?.id;

    return (
        <div className="py-2">
            <div className="space-y-0">
                {timeline.map((slot) => (
                    <TimelineSlot
                        key={slot._id || slot.id}
                        slot={slot}
                        isActive={(slot._id || slot.id) === activeId}
                    />
                ))}
            </div>
        </div>
    );
}
