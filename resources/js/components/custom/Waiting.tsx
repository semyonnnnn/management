import { useEffect, useState } from 'react';

const BLOCKS = 20;

// `progress` (0-100) is optional. Pass it only if the backend reports real progress.
const Waiting = ({ progress }: { progress?: number }) => {
    const [fake, setFake] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        // Bar eases toward 90% and never reaches it, since we can't know when the sync ends.
        // The parent unmounts the overlay when the request finishes.
        const bar = setInterval(() => setFake((p) => p + (90 - p) * 0.04), 200);
        // The timer is real: it only counts how long this overlay has been visible.
        const clock = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => {
            clearInterval(bar);
            clearInterval(clock);
        };
    }, []);

    const value = progress ?? fake;
    const filled = Math.floor((value / 100) * BLOCKS);

    return (
        // Light tinted backdrop instead of black, to match the page's lavender gradient
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            {/* Same structure as the notification: 2px indigo border + hard offset shadow, no rounding */}
            <div className="w-full max-w-md mx-4 border-2 border-indigo-600 bg-white font-mono shadow-[6px_6px_0_0_rgba(79,70,229,0.35)]">
                {/* Header strip: title on the left, bracketed status tag on the right */}
                <div className="flex items-center justify-between border-b border-indigo-200 bg-indigo-50 px-3 py-2 text-[11px] font-bold uppercase tracking-widest">
                    <span className="text-teal-700">Системное уведомление</span>
                    <span className="text-indigo-600">[Ожидание]</span>
                </div>

                <div className="p-4">
                    <div className="text-sm font-bold uppercase tracking-wider text-slate-900">
                        Синхронизация баз данных...
                    </div>

                    {/* Segmented bar: square blocks like the "+" buttons in the list.
                        Percentage is shown only when it's real (progress prop passed). */}
                    <div className="mt-4 flex gap-[3px]">
                        {Array.from({ length: BLOCKS }, (_, i) => (
                            <div
                                key={i}
                                className={`h-4 flex-1 border border-indigo-600 transition-colors duration-200 ${i < filled
                                    ? 'bg-indigo-600'
                                    : i === filled
                                        ? 'animate-pulse bg-indigo-300' // the block currently "charging"
                                        : 'bg-indigo-50'
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-wider text-slate-500">
                        <span className="tabular-nums">Прошло: {seconds} с</span>
                        {progress !== undefined && (
                            <span className="font-bold tabular-nums text-indigo-600">
                                {Math.floor(progress)}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Waiting };