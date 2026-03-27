import Modal from "@/components/custom/Modal";
import { ModalDetailsProps } from "@/types";
import { useState } from "react";

const ModalDetails = ({
    showModal,
    setShowModal,
    departmentName,
    territory,
    staffCount,
    totalLoad,
    loadPerStaff,
    forms,
}: ModalDetailsProps) => {

    const totalCalc = forms.reduce((sum, f) => sum + f.calc, 0);

    // Mock workload percentage (to be replaced with backend data)
    const [workloadPercent] = useState(68); // Example: 68% workload

    // Color function based on workload percentage
    const getWorkloadColor = (percent: number) => {
        if (percent < 50) return "#10b981"; // emerald-500
        if (percent < 75) return "#f59e0b"; // amber-500
        return "#f43f5e"; // rose-500
    };

    const getWorkloadStatus = (percent: number) => {
        if (percent < 50) return "ОПТИМАЛЬНО";
        if (percent < 75) return "УМЕРЕННО";
        return "КРИТИЧНО";
    };

    // Circular progress component
    const CircularProgress = ({ percent, size = 100, strokeWidth = 8 }: { percent: number; size?: number; strokeWidth?: number }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;
        const color = getWorkloadColor(percent);

        return (
            <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
                <svg className="transform -rotate-90" width={size} height={size}>
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress circle */}
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
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="font-mono text-[20px] font-bold" style={{ color: color }}>
                        {percent}%
                    </span>
                    <span className="font-mono text-[8px] text-gray-500 tracking-wider uppercase">ЗАГРУЗКА</span>
                </div>
            </div>
        );
    };

    return (
        <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="2xl">
            <div className="bg-white border border-indigo-200/50">

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Department Header */}
                    {/* Department Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500"></div>
                            <p className="font-mono text-[12px] font-bold text-indigo-700 tracking-wider">
                                {departmentName}
                            </p>
                        </div>

                        {/* Status Badge and Close Button Container */}
                        <div className="flex items-center gap-3">
                            {/* Workload Status Badge */}
                            <div className={`px-3 py-1 border ${workloadPercent < 50 ? 'border-emerald-200 bg-emerald-50' :
                                workloadPercent < 75 ? 'border-amber-200 bg-amber-50' : 'border-rose-200 bg-rose-50'
                                }`}>
                                <span className={`font-mono text-[10px] font-bold tracking-wider ${workloadPercent < 50 ? 'text-emerald-700' :
                                    workloadPercent < 75 ? 'text-amber-700' : 'text-rose-700'
                                    }`}>
                                    {getWorkloadStatus(workloadPercent)}
                                </span>
                            </div>

                            {/* Close Button */}
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

                    {/* Metrics and Workload Visual */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        {/* Metrics Container - using flex layout instead of grid */}
                        <div className="md:col-span-2 relative overflow-hidden border border-indigo-200/50 bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/30">

                            {/* subtle top accent */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-400/70 via-indigo-300/40 to-transparent" />

                            {/* Metrics as divs in flex container - full height */}
                            <div className="flex flex-col h-full">
                                {/* First row - 2 divs - takes 50% height */}
                                <div className="flex flex-1 border-b border-indigo-200/40">
                                    <div className="flex-1 px-4 py-3 min-w-0 flex flex-col justify-center">
                                        <div className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider uppercase mb-1 whitespace-nowrap">
                                            ТЕРРИТОРИЯ
                                        </div>
                                        <div className="font-mono text-[13px] font-bold truncate text-gray-900">
                                            {territory}
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

                                {/* Second row - 2 divs - takes 50% height */}
                                <div className="flex flex-1">
                                    <div className="flex-1 px-4 py-3 min-w-0 flex flex-col justify-center">
                                        <div className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider uppercase mb-1 whitespace-nowrap">
                                            СУММАРНАЯ НАГРУЗКА
                                        </div>
                                        <div className="font-mono text-[13px] font-bold truncate text-indigo-700">
                                            {totalLoad.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="w-px bg-indigo-200/40"></div>
                                    <div className="flex-1 px-4 py-3 min-w-0 flex flex-col justify-center">
                                        <div className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider uppercase mb-1 whitespace-nowrap">
                                            НАГРУЗКА / СОТРУДНИКА
                                        </div>
                                        <div className="font-mono text-[13px] font-bold truncate text-indigo-700">
                                            {loadPerStaff.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* subtle bottom accent */}
                            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
                        </div>

                        {/* Circular Workload */}
                        <div className="relative flex items-center justify-center border border-indigo-200/50 bg-gradient-to-br from-indigo-50/40 to-white p-5">

                            {/* subtle glow */}
                            <div className="absolute inset-0 bg-indigo-100/20 blur-2xl opacity-40" />

                            <CircularProgress
                                percent={workloadPercent}
                                size={120}
                                strokeWidth={10}
                            />

                        </div>

                    </div>

                    {/* Additional Workload Details */}
                    <div className="grid grid-cols-3 gap-3 border border-indigo-200/50 p-3 bg-indigo-50/20">
                        <div className="text-center">
                            <div className="text-[8px] font-mono text-gray-500 tracking-wider uppercase">НОРМАТИВ</div>
                            <div className="font-mono text-[11px] font-bold text-gray-700">100%</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[8px] font-mono text-gray-500 tracking-wider uppercase">ТЕКУЩАЯ</div>
                            <div className={`font-mono text-[11px] font-bold ${workloadPercent < 50 ? 'text-emerald-600' :
                                workloadPercent < 75 ? 'text-amber-600' : 'text-rose-600'
                                }`}>
                                {workloadPercent}%
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-[8px] font-mono text-gray-500 tracking-wider uppercase">РЕЗЕРВ</div>
                            <div className="font-mono text-[11px] font-bold text-gray-700">{100 - workloadPercent}%</div>
                        </div>
                    </div>

                    {/* Forms Table */}
                    <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-indigo-50 to-transparent border border-indigo-200/50">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-500"></div>
                                <p className="font-mono text-[11px] font-bold text-indigo-700 tracking-wider">
                                    ФОРМЫ НАГРУЗКИ
                                </p>
                            </div>
                            <div className="flex gap-4 text-[10px] font-mono text-gray-500">
                                <span>ФОРМ: <span className="font-bold text-gray-900">{forms.length}</span></span>
                                <span>СУММА: <span className="font-bold text-indigo-600">{totalCalc.toFixed(1)}</span></span>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-indigo-200/50">
                                <thead className="bg-indigo-100/60 border-b border-indigo-200/70">
                                    <tr className="divide-x divide-indigo-200/60">
                                        <th className="px-3 py-2 text-left text-[10px] font-mono font-bold text-indigo-700 uppercase">ФОРМА</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-mono font-bold text-indigo-700 uppercase">ПОКАЗАТЕЛЕЙ</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-mono font-bold text-indigo-700 uppercase">КОЛ-ВО ОТЧЁТОВ</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-mono font-bold text-indigo-700 uppercase">КОЭФ. (K1..K6)</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-mono font-bold text-indigo-700 uppercase">РАСЧЁТ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-indigo-100/60">
                                    {forms.map((f) => (
                                        <tr key={f.id} className="hover:bg-indigo-50/40 transition-colors divide-x divide-indigo-100">
                                            <td className="px-3 py-2 font-mono text-[11px] text-gray-900">{f.form}</td>
                                            <td className="px-3 py-2 font-mono text-[11px] text-gray-600 bg-indigo-50/40">{f.indicators}</td>
                                            <td className="px-3 py-2 font-mono text-[11px] text-gray-600">{f.reports}</td>
                                            <td className="px-3 py-2 font-mono text-[11px] text-gray-600 bg-indigo-50/40">{f.coeff}</td>
                                            <td className="px-3 py-2 font-mono text-[11px] font-bold text-gray-900">{f.calc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t border-indigo-300/60 bg-indigo-100/40">
                                    <tr className="divide-x divide-indigo-200">
                                        <td colSpan={4} className="px-3 py-2 font-mono text-[11px] font-bold text-gray-900 uppercase tracking-wider text-right">ИТОГО</td>
                                        <td className="px-3 py-2 font-mono text-[12px] font-bold text-indigo-700">{totalCalc.toFixed(1)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export { ModalDetails };