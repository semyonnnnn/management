import Modal from "@/components/custom/Modal";
import { ModalDetailsProps } from "@/types";
import { ModalDetailsSummary } from "./ModalDetailsSummary";

const getColor = (percent: number) => {
    if (percent < 50) return "#f59e0b";  // Amber
    if (percent <= 100) return "#10b981"; // Emerald
    if (percent <= 150) return "#22c55e"; // Green
    if (percent <= 175) return "#f43f5e"; // Rose
    return "#991b1b";                     // Red
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
    fixedOptimalLoad
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

        const visualPercent = Math.min(percent, 100);
        const offset = circumference - (visualPercent / 100) * circumference;
        const strokeColor = getColor(percent);

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
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-500 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-[20px] font-bold" style={{ color: strokeColor }}>
                        {percent.toFixed(0)}%
                    </span>
                    <span className="font-mono text-[8px] text-gray-500 tracking-wider uppercase">
                        ЗАГРУЗКА
                    </span>
                </div>
            </div>
        );
    };

    const terr_local = {
        'ekb': 'Екатеринбург',
        'krg': 'Курган'
    };

    return (
        <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="">
            <div className="bg-white border border-indigo-200/50 h-auto max-h-[90vh] flex flex-col">
                <div className="p-6 flex-1 flex flex-col space-y-6 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500"></div>
                            <p className="font-mono text-[12px] font-bold text-indigo-700 tracking-wider pr-10">
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

                    {/* Summary Card Metrics Panel */}
                    <ModalDetailsSummary
                        territory={territory}
                        terr_local={terr_local}
                        staffCount={staffCount}
                        totalLoad={totalLoad}
                        loadPerStaff={loadPerStaff}
                        levelPercent={levelPercent}
                        fixedOptimalLoad={fixedOptimalLoad}
                        color={color}
                        CircularProgress={CircularProgress}
                    />

                    {/* Table Parent Layout Container */}
                    <div className="flex-1 flex flex-col border border-indigo-200/50 rounded-md rounded-br-none overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-indigo-50 border-b border-indigo-200/50">
                            <div className="flex text-[15px] gap-4 text-sm font-mono text-gray-500 justify-between w-full">
                                <div>
                                    форм: <span className="font-bold text-indigo-600">{forms.length}</span>
                                </div>
                                <div className="flex justify-end font-mono text-sm font-bold text-indigo-700">
                                    итог: <span className="font-bold text-indigo-600">{totalCalc.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                </div>
                            </div>
                        </div>

                        {/* FIXED: Changed inner view wrappers to allow smooth horizontal auto-scrolling 
                          if total custom cell metrics exceed the modal boundary.
                        */}
                        <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0
                                    [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2
                                    [&::-webkit-scrollbar-track]:bg-indigo-50/30
                                    [&::-webkit-scrollbar-thumb]:bg-indigo-500
                                    hover:[&::-webkit-scrollbar-thumb]:bg-indigo-600">

                            {/* Force internal block matrix to keep absolute width matching total structural width */}
                            <div className="min-w-max divide-y divide-indigo-100">

                                {/* TABLE HEADER BLOCK */}
                                <div className="sticky top-0 z-20 flex items-center bg-indigo-100 border-b border-indigo-200 font-mono font-bold text-indigo-700 text-[15px] uppercase tracking-wide shadow-sm pr-2">
                                    <div className="w-48 min-w-[192px] px-3 py-2.5">ФОРМА</div>
                                    <div className="w-32 min-w-[128px] px-3 py-2.5 text-left">ПОКАЗАТЕЛЕЙ</div>
                                    <div className="w-28 min-w-[112px] px-3 py-2.5 text-left">ОТЧЁТЫ</div>
                                    <div className="w-36 min-w-[144px] px-3 py-2.5 text-left">КОЭФ. (K1..K6)</div>
                                    <div className="w-24 min-w-[96px] px-3 py-2.5 text-left">РАСЧЁТ</div>
                                    <div className="w-24 min-w-[96px] px-3 py-2.5 text-left">ДЕЙСТВИЯ</div>
                                </div>

                                {/* TABLE ROWS LOOP */}
                                {forms.map(f => (
                                    <div key={f.id} className="flex items-center hover:bg-indigo-50/40 transition-colors text-sm font-mono text-gray-900 pr-2">
                                        {/* FIXED: Replaced flex-1 truncate with explicit bounding parameters matching header matrix */}
                                        <div className="w-48 min-w-[192px] px-3 py-2 text-gray-900 truncate" title={f.name}>
                                            {f.name}
                                        </div>
                                        <div className="w-32 min-w-[128px] px-3 py-2 text-gray-600 bg-indigo-50/20 self-stretch flex items-center">
                                            {f.indicators}
                                        </div>
                                        <div className="w-28 min-w-[112px] px-3 py-2 text-gray-600 self-stretch flex items-center">
                                            {f.reports}
                                        </div>
                                        <div className="w-36 min-w-[144px] px-3 py-2 text-gray-600 bg-indigo-50/20 self-stretch flex items-center">
                                            {f.coeff}
                                        </div>
                                        <div className="w-24 min-w-[96px] px-3 py-2 font-bold text-gray-900 self-stretch flex items-center">
                                            {f.final}
                                        </div>
                                        <div className="w-24 min-w-[96px] px-3 py-2 text-gray-500 self-stretch flex items-center">
                                            test
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export { ModalDetails };