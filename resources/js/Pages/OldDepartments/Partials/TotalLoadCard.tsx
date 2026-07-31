import React from "react";
import { TotalLoadCardProps } from "@/types";

const lower_value = 80;
const upper_value = 100;

function getGradientColor(percent: number) {
    if (percent < lower_value) return "from-amber-400 via-amber-500 to-orange-500";
    if (percent <= upper_value) return "from-emerald-400 via-emerald-500 to-teal-500";
    return "from-rose-500 via-red-500 to-red-600";
}

function getStatusText(percent: number) {
    if (percent < lower_value) return "малая нагрузка";
    if (percent <= upper_value) return "оптимально";
    return "большая нагрузка";
}

function getStatusIcon(percent: number) {
    if (percent < lower_value) return "↓";
    if (percent <= upper_value) return "✓";
    return "⚠";
}

export const TotalLoadCard: React.FC<TotalLoadCardProps> = ({ loads = [] }) => {
    // 1. Extract baseline value safely
    const baselineTotal = loads[0]?.load_per_person || 0;

    // 2. Map to a new array without mutating incoming props directly
    const computedLoads = loads.map((load, index) => {
        let percent = 0;

        if (index === 0) {
            // Set 100% for baseline if total > 0, otherwise fallback to 0%
            percent = baselineTotal > 0 ? 100 : 0;
        } else if (baselineTotal > 0) {
            // Calculate percentage relative to baseline
            const currentValue = load.load_per_person || 0;
            const rawPercent = (100 * currentValue) / baselineTotal;
            percent = Math.round(rawPercent * 10) / 10;
        }

        // Final guard to eliminate any stray NaN or Infinity
        const safePercent = Number.isFinite(percent) ? percent : 0;

        return {
            ...load,
            percent: safePercent,
        };
    });

    return (
        <div className="bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 shadow-sm">
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {computedLoads.map((load) => {
                        const safeValue = load.value || 0;
                        const safePersonLoad = load.load_per_person || 0;
                        const displayPercent = Math.round(load.percent);

                        return (
                            <div key={load.id} className="group relative bg-white/90 backdrop-blur-sm border border-indigo-200/50 hover:border-indigo-300 transition-all duration-300">
                                {/* Visual Center Marker */}
                                <div className="absolute inset-y-0 left-1/2 w-px bg-indigo-200/40 z-0" />
                                <div className="absolute top-0 left-0 w-0 h-0 border-t-35 border-r-35 border-t-indigo-100/80 border-r-transparent"></div>

                                <div className="p-5 relative z-10">
                                    <div className="flex items-center justify-between mb-5">
                                        <span className="text-[12px] font-mono font-bold text-indigo-500 tracking-wider">
                                            {(load.label || "").toUpperCase()}
                                        </span>
                                        <div className={`text-[10px] font-mono font-bold px-2 py-0.5 text-white ${displayPercent < lower_value ? 'bg-amber-500' : displayPercent <= upper_value ? 'bg-emerald-500' : 'bg-rose-500'
                                            }`}>
                                            {getStatusIcon(displayPercent)}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-5xl font-mono font-black text-gray-900 tracking-tighter leading-none">
                                            {safeValue.toLocaleString()}
                                        </div>
                                        <div className="text-[10px] font-mono text-indigo-900 mt-2 tracking-wider uppercase">показателей</div>
                                    </div>
                                    <div className="text-3xl">{Math.round(safePersonLoad).toLocaleString()}</div>

                                    <div className="space-y-2.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] font-mono text-indigo-800 tracking-wider uppercase">средняя нагрузка на человека</span>
                                        </div>

                                        {/* Progress Bar Container */}
                                        <div className="relative w-full bg-indigo-100/80 h-2 border border-indigo-200/30 overflow-hidden">
                                            <div className="absolute left-1/4 top-0 w-px h-full bg-yellow-300 z-10" />
                                            <div className="absolute left-1/2 top-0 w-px h-full bg-yellow-500 z-10" />
                                            <div className="absolute left-3/4 top-0 w-px h-full bg-yellow-500 z-10" />

                                            <div
                                                className={`h-full bg-linear-to-r ${getGradientColor(displayPercent)}`}
                                                style={{
                                                    width: `${Math.min(Math.max(displayPercent, 0), 100)}%`,
                                                    transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                                                }}
                                            />
                                        </div>

                                        <div className="pt-1 flex justify-between">
                                            <div className={`text-[12px] font-mono font-bold tracking-wider ${displayPercent < lower_value ? 'text-amber-600' : displayPercent <= upper_value ? 'text-emerald-600' : 'text-rose-600'
                                                }`}>
                                                {getStatusText(displayPercent)}
                                            </div>
                                            <div className={`text-sm font-mono font-bold ${displayPercent < lower_value ? 'text-amber-600' : displayPercent <= upper_value ? 'text-emerald-600' : 'text-rose-600'
                                                }`}>
                                                {displayPercent}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};