import React from "react";
import { TotalLoadCardProps } from "@/types";

// 1. Color logic: 50% to 75% (100%-150% load) is Green. Below is Yellow. Above is Red.
function getGradientColor(percent: number) {
    if (percent < 50) {
        return "from-amber-400 via-amber-500 to-orange-500";
    } else if (percent <= 75) {
        return "from-emerald-400 via-emerald-500 to-teal-500";
    } else {
        return "from-rose-500 via-red-500 to-red-600";
    }
}

function getStatusText(percent: number) {
    if (percent < 50) return "МАЛАЯ ЗАГРУЗКА";
    if (percent <= 75) return "ОПТИМАЛЬНО";
    return "ПЕРЕГРУЗКА";
}

function getStatusIcon(percent: number) {
    if (percent < 50) return "↓";
    if (percent <= 75) return "✓";
    return "⚠";
}

export const TotalLoadCard: React.FC<TotalLoadCardProps> = ({ loads }) => {
    return (
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 shadow-sm">
            {/* Header */}
            <div className="border-b border-indigo-200/50">
                <div className="px-6 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h6 className="text-xl font-mono font-bold text-gray-900 tracking-tighter">
                                ОБЩАЯ_НАГРУЗКА
                            </h6>
                        </div>
                        <div className="text-[10px] font-mono text-indigo-600 bg-white/60 backdrop-blur-sm px-3 py-1 border border-indigo-200/50">
                            РЕАЛЬНОЕ_ВРЕМЯ
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {loads.map((load) => (
                        <div
                            key={load.id}
                            className="group relative bg-white/90 backdrop-blur-sm border border-indigo-200/50 hover:border-indigo-300/70 hover:shadow-xl transition-all duration-300"
                        >
                            {/* Visual Center Marker (100% Load Point) */}
                            <div className="absolute inset-y-0 left-1/2 w-px bg-indigo-200/30 z-0" />

                            <div className="absolute top-0 left-0 w-0 h-0 border-t-[35px] border-r-[35px] border-t-indigo-100/80 border-r-transparent"></div>

                            <div className="p-5 relative z-10">
                                <div className="flex items-center justify-between mb-5">
                                    <span className="text-[11px] font-mono font-bold text-indigo-500 tracking-wider">
                                        {load.label.toUpperCase()}
                                    </span>
                                    <div className={`text-[10px] font-mono font-bold px-2 py-0.5 ${load.percent < 50 ? 'bg-amber-500 text-white' :
                                        load.percent <= 75 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                                        }`}>
                                        {getStatusIcon(load.percent)}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="text-5xl font-mono font-black text-gray-900 tracking-tighter leading-none">
                                        {load.value.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] font-mono text-indigo-400 mt-2 tracking-wider uppercase">
                                        ЕДИНИЦ
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-mono text-indigo-400 tracking-wider uppercase">
                                            ТЕКУЩАЯ ДОЛЯ
                                        </span>
                                        <span className={`text-sm font-mono font-bold ${load.percent < 50 ? 'text-amber-600' :
                                            load.percent <= 75 ? 'text-emerald-600' : 'text-rose-600'
                                            }`}>
                                            {load.percent * 2}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-indigo-100/80 h-2 border border-indigo-200/30">
                                        <div
                                            className={`h-full bg-gradient-to-r ${getGradientColor(load.percent)}`}
                                            style={{
                                                width: `${load.percent}%`,
                                                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                                            }}
                                        />
                                    </div>
                                    <div className="pt-2.5">
                                        <div className={`text-[9px] font-mono font-bold tracking-wider ${load.percent < 50 ? 'text-amber-600' :
                                            load.percent <= 75 ? 'text-emerald-600' : 'text-rose-600'
                                            }`}>
                                            {getStatusText(load.percent)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};