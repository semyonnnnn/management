import { useRef, useState } from "react";
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

// One column template shared by the header and every row, so they always line up.
// Must stay a full literal string so Tailwind can detect the class.
const GRID_COLS =
    "grid grid-cols-[minmax(12rem,3fr)_minmax(8rem,1fr)_minmax(7rem,1fr)_minmax(16rem,2fr)_minmax(6rem,1fr)]";

// Same scrollbar look for the body. The header gets only the width part (see below),
// so both reserve an identical gutter on the right.
const SCROLLBAR_BODY =
    "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 " +
    "[&::-webkit-scrollbar-track]:bg-indigo-50/30 " +
    "[&::-webkit-scrollbar-thumb]:bg-indigo-500 " +
    "hover:[&::-webkit-scrollbar-thumb]:bg-indigo-600";

// Declared outside ModalDetails so typing in the search box doesn't remount it
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
    const [query, setQuery] = useState("");
    // The header lives outside the scrolling body now, so we move it by hand
    // to follow the body's horizontal scroll (see onScroll below)
    const headerRef = useRef<HTMLDivElement>(null);

    const totalCalc = forms.reduce((sum, f) => sum + f.final, 0);
    const color = getColor(levelPercent);

    // Local filtering only: works on the forms already passed in, no requests
    const q = query.trim().toLowerCase();
    const visibleForms = q
        ? forms.filter(f =>
            `${f.name} ${f.indicators} ${f.reports} ${f.coeff} ${f.final}`.toLowerCase().includes(q)
        )
        : forms;

    console.log("FORMS:", forms);

    const closeModal = () => {
        setQuery("");
        setShowModal(false);
    };

    const terr_local = {
        'ekb': 'Екатеринбург',
        'krg': 'Курган'
    };

    return (
        <Modal show={showModal} onClose={closeModal} maxWidth="">
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
                                onClick={closeModal}
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

                        {/* Bar above the column headers: count | search | total */}
                        <div className="flex items-center gap-6 px-3 py-2 bg-indigo-50 border-b border-indigo-200/50 font-mono text-[15px] text-gray-500">
                            <div className="whitespace-nowrap">
                                форм:{" "}
                                <span className="font-bold text-indigo-600">
                                    {q ? `${visibleForms.length} / ${forms.length}` : forms.length}
                                </span>
                            </div>

                            <div className="relative flex-1 max-w-sm mx-auto">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder="поиск..."
                                    className="w-full bg-transparent border-0 border-b-2 border-indigo-600 rounded-none px-0 py-1 pr-7 text-sm font-mono text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none focus:border-indigo-600"
                                />
                                {query !== "" && (
                                    <button
                                        type="button"
                                        onClick={() => setQuery("")}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-indigo-700 transition-colors"
                                        aria-label="Очистить поиск"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div className="whitespace-nowrap font-bold text-indigo-700">
                                итог:{" "}
                                <span className="font-bold text-indigo-600">
                                    {totalCalc.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                </span>
                            </div>
                        </div>

                        {/* HEADER: a separate box above the scrolling body, so the body's vertical
                            scrollbar starts under it. overflow-x-hidden = it never shows its own
                            scrollbar, it only moves when the body scrolls (headerRef).
                            [scrollbar-gutter:stable] + the w-2 rule reserve the same 8px on the right
                            that the body's scrollbar takes, so the columns stay aligned.
                            relative z-10 keeps the shadow above the first rows. */}
                        <div
                            ref={headerRef}
                            className="relative z-10 shrink-0 overflow-x-hidden [scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-2 bg-indigo-100 border-b border-indigo-200 shadow-sm"
                        >
                            <div className={`${GRID_COLS} w-full min-w-196 font-mono font-bold text-indigo-700 text-[15px] uppercase tracking-wide text-nowrap`}>
                                <div className="px-3 py-2.5">ФОРМА</div>
                                <div className="px-3 py-2.5 text-left bg-indigo-200/60 border-l border-indigo-300">ПОКАЗАТЕЛЕЙ</div>
                                <div className="px-3 py-2.5 text-left border-l border-indigo-300">ОТЧЁТЫ</div>
                                <div className="px-3 py-2.5 text-left bg-indigo-200/60 border-l border-indigo-300">КОЭФФИЦИЕНТЫ [K1..K6]</div>
                                <div className="px-3 py-2.5 text-left border-l border-indigo-300">РАСЧЁТ</div>
                            </div>
                        </div>

                        {/* BODY: the only thing that scrolls, so both scrollbars belong to it */}
                        <div
                            className={`flex-1 min-h-0 overflow-auto [scrollbar-gutter:stable] ${SCROLLBAR_BODY}`}
                            onScroll={e => {
                                // Copy the body's horizontal position onto the header
                                if (headerRef.current) headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
                            }}
                        >
                            <div className="w-full min-w-196 divide-y divide-indigo-100 text-nowrap">

                                {visibleForms.map(f => {
                                    return (
                                        <div
                                            key={f.id}
                                            className={`${GRID_COLS} odd:bg-white even:bg-indigo-50/60 hover:bg-indigo-100/70 transition-colors text-sm font-mono text-gray-900`}
                                        >
                                            <div className="px-3 py-2 text-gray-900 truncate flex items-center" title={f.name}>
                                                <span className="truncate">{f.name}</span>
                                            </div>
                                            <div className="px-3 py-2 text-gray-600 bg-indigo-100/50 border-l border-indigo-200 flex items-center">
                                                {f.indicators}
                                            </div>
                                            <div className="px-3 py-2 text-gray-600 border-l border-indigo-200 flex items-center">
                                                {f.reports_count}
                                            </div>
                                            <div className="px-3 py-2 text-gray-600 bg-indigo-100/50 border-l border-indigo-200 flex items-center">
                                                {f.coeff}
                                            </div>
                                            <div className="px-3 py-2 font-bold text-gray-900 border-l border-indigo-200 flex items-center">
                                                {f.final}
                                            </div>
                                        </div>
                                    );
                                })}

                                {visibleForms.length === 0 && (
                                    <div className="px-3 py-6 text-center text-sm font-mono text-gray-500">
                                        Ничего не найдено
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export { ModalDetails };