import React, { useMemo } from 'react';

interface SyncTimestampProps {
    timestamp: string | Date | null | undefined;
    timezone?: string;
}

export const SyncTimestamp: React.FC<SyncTimestampProps> = ({
    timestamp,
    timezone = 'Asia/Yekaterinburg'
}) => {
    const formattedTimestamp = useMemo(() => {
        if (!timestamp || timestamp === 'пусто') return 'пусто';

        // Normalize SQLite/MySQL "YYYY-MM-DD HH:mm:ss" to ISO UTC format by adding 'T' and 'Z'
        const normalizedString = typeof timestamp === 'string' && timestamp.includes(' ') && !timestamp.endsWith('Z')
            ? timestamp.replace(' ', 'T') + 'Z'
            : timestamp;

        const date = new Date(normalizedString);
        if (isNaN(date.getTime())) return 'пусто';

        try {
            const formatter = new Intl.DateTimeFormat('en-CA', {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });

            const parts = formatter.formatToParts(date);
            const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';

            return `${getPart('year')}-${getPart('month')}-${getPart('day')} ${getPart('hour')}:${getPart('minute')}`;
        } catch (e) {
            return 'пусто';
        }
    }, [timestamp, timezone]);

    return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-semibold tracking-wider text-indigo-900 shadow-sm uppercase select-none shrink-0">
            {/* Clock Icon */}
            <svg
                className="w-3.5 h-3.5 text-indigo-400 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="whitespace-nowrap">{formattedTimestamp}</span>
        </div>
    );
};