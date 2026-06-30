import React from "react";

interface LoadSummaryPanelProps {
    territory: string;
    terr_local: Record<string, string>;
    staffCount: number;
    totalLoad: number;
    loadPerStaff: number;
    levelPercent: number;
    fixedOptimalLoad: number;
    color: string;
    CircularProgress: React.ComponentType<{ percent: number; size?: number; strokeWidth?: number }>;
}

const ModalDetailsSummary = ({
    territory,
    terr_local,
    staffCount,
    totalLoad,
    loadPerStaff,
    levelPercent,
    fixedOptimalLoad,
    color,
    CircularProgress,
}: LoadSummaryPanelProps) => {
    const maxPercent = 100;
    const currentReserve = Math.max(0, maxPercent - levelPercent);

    return (
        <div className="flex flex-col space-y-6">
            {/* Top Grid: Core Info & Visual Progress Indicator */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 relative overflow-hidden border border-indigo-200/50 bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/30">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-400/70 via-indigo-300/40 to-transparent" />
                    <div className="flex flex-col h-full">
                        <div className="flex flex-1 border-b border-indigo-200/40">
                            <div className="flex-1 px-4 py-3 min-w-0 flex flex-col justify-center">
                                <div className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider uppercase mb-1 whitespace-nowrap">
                                    ТЕРРИТОРИЯ
                                </div>
                                <div className="font-mono text-[13px] font-bold truncate text-gray-900">
                                    {terr_local[territory as keyof typeof terr_local] || territory}
                                </div>
                            </div>
                            <div className="w-px bg-indigo-200/40"></div>
                            <div className="flex-1 px-4 py-3 min-w-0 flex flex-col justify-center">
                                <div className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider uppercase mb-1 whitespace-nowrap">
                                    СОТРУДНИКОВ
                                </div>
                                <div className="font-mono text-[13px] font-bold truncate text-gray-900">
                                    {staffCount}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-1">
                            <div className="flex-1 px-4 py-3 min-w-0 flex flex-col justify-center">
                                <div className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider uppercase mb-1 whitespace-nowrap">
                                    СУММАРНАЯ НАГРУЗКА, показателей
                                </div>
                                <div className="font-mono text-[13px] font-bold truncate text-indigo-700">
                                    {totalLoad.toLocaleString()}
                                </div>
                            </div>
                            <div className="w-px bg-indigo-200/40"></div>
                            <div className="flex-1 px-4 py-3 min-w-0 flex flex-col justify-center">
                                <div className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider uppercase mb-1 whitespace-nowrap">
                                    НАГРУЗКА на 1 СОТРУДНИКА,<br /> показателей
                                </div>
                                <div className="font-mono text-[13px] font-bold truncate text-indigo-700">
                                    {loadPerStaff.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
                </div>

                <div className="relative flex items-center justify-center border border-indigo-200/50 bg-gradient-to-br from-indigo-50/40 to-white p-5">
                    <div className="absolute inset-0 bg-indigo-100/20 blur-2xl opacity-40" />
                    <CircularProgress percent={levelPercent} size={120} strokeWidth={10} />
                </div>
            </div>

            {/* Bottom Grid: Load Limit Assessment Status Metrics */}
            <div className="grid grid-cols-3 gap-3 border border-indigo-200/50 p-3 bg-indigo-50/20">
                <div className="text-center">
                    <div className="text-[12px] font-mono text-gray-900 tracking-wider uppercase">средняя нагрузка по управлению</div>
                    <div className="font-mono text-[16px] font-bold text-gray-700">{Math.round(fixedOptimalLoad).toLocaleString()}</div>
                </div>
                <div className="text-center">
                    <div className="text-[12px] font-mono text-gray-900 tracking-wider uppercase">ТЕКУЩАЯ</div>
                    <div className="font-mono text-[16px] font-bold" style={{ color }}>
                        {levelPercent}%
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-[12px] font-mono text-gray-900 tracking-wider uppercase">РЕЗЕРВ</div>
                    <div className="font-mono text-[16px] font-bold text-gray-700">
                        {currentReserve}%
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ModalDetailsSummary };