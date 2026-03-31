import Modal from "@/components/custom/Modal";
import { ModalDetailsProps } from "@/types";

const getColor = (percent: number) => {
    if (percent < 50) return "#f59e0b";
    if (percent <= 100) return "#10b981";
    if (percent <= 150) return "#22c55e";
    if (percent <= 175) return "#f43f5e";
    return "#991b1b";
};

const getStatusText = (percent: number) => {
    if (percent < 50) return "МАЛАЯ ЗАГРУЗКА";
    if (percent <= 100) return "ОПТИМАЛЬНО";
    if (percent <= 175) return "ПЕРЕГРУЗКА";
    return "КРИТИЧЕСКАЯ";
};

const ModalDetails = ({
    showModal,
    setShowModal,
    departmentName,
    territory,
    staffCount,
    totalLoad,
    loadPerStaff,
    forms,
    levelPercent,
}: ModalDetailsProps) => {
    const totalCalc = forms.reduce((sum, f) => sum + f.final, 0);
    const color = getColor(levelPercent);

    const CircularProgress = ({
        percent,
        size = 100,
        strokeWidth = 8
    }: { percent: number; size?: number; strokeWidth?: number }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const visualPercent = Math.min(percent, 200) / 2;
        const offset = circumference - (visualPercent / 100) * circumference;
        const color = getColor(percent);

        return (
            <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-500 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-[20px] font-bold" style={{ color }}>
                        {percent.toFixed(0)}%
                    </span>
                    <span className="font-mono text-[8px] text-gray-500 tracking-wider uppercase">
                        ЗАГРУЗКА
                    </span>
                </div>
                <div className="absolute inset-y-0 left-1/2 w-px bg-gray-300/40" />
            </div>
        );
    };

    const maxPercent = 200;

    return (
        <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="2xl">
            <div className="bg-white border border-indigo-200/50 h-[600px] flex flex-col">
                <div className="p-6 flex-1 flex flex-col space-y-6 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500"></div>
                            <p className="font-mono text-[12px] font-bold text-indigo-700 tracking-wider">
                                {departmentName}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div
                                className="px-3 py-1 border"
                                style={{ borderColor: color, backgroundColor: `${color}15` }}
                            >
                                <span className="font-mono text-[10px] font-bold tracking-wider" style={{ color }}>
                                    {getStatusText(levelPercent)}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-7 h-7 bg-white border border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-2 relative overflow-hidden border border-indigo-200/50 bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/30">
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-400/70 via-indigo-300/40 to-transparent" />
                            <div className="flex flex-col h-full">
                                <div className="flex flex-1 border-b border-indigo-200/40">
                                    <div className="flex-1 px-4 py-3 min-w-0 flex flex-col justify-center">
                                        <div className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider uppercase mb-1 whitespace-nowrap">
                                            ТЕРРИТОРИЯ
                                        </div>
                                        <div className="font-mono text-[13px] font-bold truncate text-gray-900">{territory}</div>
                                    </div>
                                    <div className="w-px bg-indigo-200/40"></div>
                                    <div className="flex-1 px-4 py-3 min-w-0 flex flex-col justify-center">
                                        <div className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider uppercase mb-1 whitespace-nowrap">
                                            СОТРУДНИКОВ
                                        </div>
                                        <div className="font-mono text-[13px] font-bold truncate text-gray-900">{staffCount}</div>
                                    </div>
                                </div>

                                <div className="flex flex-1">
                                    <div className="flex-1 px-4 py-3 min-w-0 flex flex-col justify-center">
                                        <div className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider uppercase mb-1 whitespace-nowrap">
                                            СУММАРНАЯ НАГРУЗКА
                                        </div>
                                        <div className="font-mono text-[13px] font-bold truncate text-indigo-700">{totalLoad.toLocaleString()}</div>
                                    </div>
                                    <div className="w-px bg-indigo-200/40"></div>
                                    <div className="flex-1 px-4 py-3 min-w-0 flex flex-col justify-center">
                                        <div className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider uppercase mb-1 whitespace-nowrap">
                                            НАГРУЗКА / СОТРУДНИКА
                                        </div>
                                        <div className="font-mono text-[13px] font-bold truncate text-indigo-700">{loadPerStaff.toLocaleString()}</div>
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

                    <div className="grid grid-cols-3 gap-3 border border-indigo-200/50 p-3 bg-indigo-50/20">
                        <div className="text-center">
                            <div className="text-[8px] font-mono text-gray-500 tracking-wider uppercase">НОРМАТИВ</div>
                            <div className="font-mono text-[11px] font-bold text-gray-700">100%</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[8px] font-mono text-gray-500 tracking-wider uppercase">ТЕКУЩАЯ</div>
                            <div className="font-mono text-[11px] font-bold" style={{ color }}>
                                {Math.min(levelPercent, maxPercent)}%
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-[8px] font-mono text-gray-500 tracking-wider uppercase">РЕЗЕРВ</div>
                            <div className="font-mono text-[11px] font-bold text-gray-700">
                                {Math.max(maxPercent - levelPercent, 0)}%
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col border border-indigo-200/50 rounded-md overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-indigo-50 border-b border-indigo-200/50">
                            <div className="flex gap-4 text-sm font-mono text-gray-500 justify-between w-full">
                                <div>
                                    форм: <span className="font-bold text-indigo-600">{forms.length}</span>
                                </div>
                                <div className="flex justify-end font-mono text-sm font-bold text-indigo-700">
                                    итог: <span className="font-bold text-indigo-600">{totalCalc.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-indigo-100 sticky top-0 z-10">
                                    <tr className="divide-x divide-indigo-200/60">
                                        <th className="px-3 py-2 text-left text-[10px] font-mono font-bold text-indigo-700 uppercase">ФОРМА</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-mono font-bold text-indigo-700 uppercase">ПОКАЗАТЕЛЕЙ</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-mono font-bold text-indigo-700 uppercase">КОЛ-ВО ОТЧЁТОВ</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-mono font-bold text-indigo-700 uppercase">КОЭФ. (K1..K6)</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-mono font-bold text-indigo-700 uppercase">РАСЧЁТ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {forms.map(f => (
                                        <tr key={f.id} className="hover:bg-indigo-50/40 transition-colors divide-x divide-indigo-100">
                                            <td className="px-3 py-2 font-mono text-[11px] text-gray-900">{f.name}</td>
                                            <td className="px-3 py-2 font-mono text-[11px] text-gray-600 bg-indigo-50/40">{f.indicators}</td>
                                            <td className="px-3 py-2 font-mono text-[11px] text-gray-600">{f.reports}</td>
                                            <td className="px-3 py-2 font-mono text-[11px] text-gray-600 bg-indigo-50/40">{f.coeff}</td>
                                            <td className="px-3 py-2 font-mono text-[11px] font-bold text-gray-900">{f.final}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export { ModalDetails };