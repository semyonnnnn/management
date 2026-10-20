import React from 'react';
import { CustomSelect } from '@/components/custom/CustomSelect';
// `import type` is erased at build time, so there is no runtime cycle with Index.tsx
import type { LocalFormItem } from './Index';

interface FormRowProps {
    form: LocalFormItem;
    rowIndex: number;
    periods: ('годовая' | 'полугодовая' | 'квартальная' | 'месячная')[];
    handleInputChange: (id: number, field: keyof LocalFormItem, rawValue: string) => void;
    onDelete: (form: LocalFormItem) => void;
    onShowDepartments: (id: number) => void;
    inputCellClasses: string;
    borderRightSlate300: string;
    borderRightSlate200: string;
}

export const FormRow = React.memo(function FormRow({
    form,
    rowIndex,
    periods,
    handleInputChange,
    onDelete,
    onShowDepartments,
    inputCellClasses,
    borderRightSlate300,
    borderRightSlate200,
}: FormRowProps) {
    const isEven = rowIndex % 2 === 0;
    const baseRowBg = isEven ? 'bg-indigo-50/30' : 'bg-white';

    const okudBg = isEven ? 'bg-sky-50/70' : 'bg-sky-100/50';
    const nameBg = isEven ? 'bg-orange-50/70' : 'bg-orange-100/50';
    const deptsBg = isEven ? 'bg-orange-50/40' : 'bg-orange-100/30';
    const periodBg = isEven ? 'bg-emerald-50/70' : 'bg-emerald-100/50';
    const indicatorsBg = isEven ? 'bg-rose-50/70' : 'bg-rose-100/60';

    const deptCount = form.departments.length;
    // A form with no departments contributes to nobody's workload, so it is
    // painted red to stand out from normal (orange) buttons
    const deptButtonColors = deptCount === 0
        ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
        : 'border-orange-300 bg-white/60 text-orange-900 hover:bg-orange-200/60';

    return (
        <div
            key={form.id}
            className={`group/row flex w-full items-center text-sm text-slate-900 ${baseRowBg} hover:bg-slate-100/80 transition-colors duration-150`}
        >
            {/* OKUD Column */}
            <div className={`w-28 shrink-0 ${inputCellClasses} ${borderRightSlate300} ${okudBg} group-hover/row:bg-sky-200/40 focus-within:bg-sky-200/90`}>
                <input
                    type="text"
                    value={form.okud}
                    onChange={(e) => handleInputChange(form.id, 'okud', e.target.value)}
                    placeholder="00000000"
                    className="w-full py-0.5 text-center focus:outline-none border-b border-sky-300 focus:border-sky-700 font-mono font-bold text-xs text-sky-950 transition-colors bg-transparent"
                />
            </div>

            {/* Name Column - Fixed min-w logic to exactly match the header */}
            <div className={`flex-1 min-w-[320px] ${inputCellClasses} ${borderRightSlate300} ${nameBg} group-hover/row:bg-orange-200/40 focus-within:bg-orange-200/90`}>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleInputChange(form.id, 'name', e.target.value)}
                    className="w-full py-0.5 focus:outline-none border-b border-orange-300 focus:border-orange-700 font-semibold text-xs text-orange-950 transition-colors bg-transparent"
                />
            </div>

            {/* Departments Column: a div acting as a button (icon on top, count below) */}
            <div className={`w-24 shrink-0 ${inputCellClasses} ${borderRightSlate300} ${deptsBg} group-hover/row:bg-orange-200/40`}>
                <div
                    // role + tabIndex + key handler make a div behave like a real button
                    // for keyboard users (Enter / Space)
                    role="button"
                    tabIndex={0}
                    title="Показать отделы формы"
                    onClick={() => onShowDepartments(form.id)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault(); // Space would otherwise scroll the page
                            onShowDepartments(form.id);
                        }
                    }}
                    className={`flex flex-col items-center justify-center gap-0.5 py-0.5 border cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 ${deptButtonColors}`}
                >
                    {/* same "building" icon the departments table uses in its header */}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {/* "отд." avoids Russian plural forms (1 отдел / 2 отдела / 5 отделов) */}
                    <span className="text-[9px] leading-none font-mono font-bold uppercase">{deptCount} отд.</span>
                </div>
            </div>

            {/* reports_count */}
            <div className={`w-36 ${inputCellClasses} ${borderRightSlate300} bg-cyan-50 group-hover/row:bg-cyan-200/40 focus-within:bg-cyan-200/90`}>
                <input
                    type="text"
                    value={form.reports_count}
                    onChange={(e) => handleInputChange(form.id, 'reports_count', e.target.value)}
                    className="w-full py-0.5 text-center focus:outline-none border-b border-cyan-300 focus:border-cyan-700 font-semibold text-xs text-cyan-950 transition-colors bg-transparent"
                />
            </div>

            {/* Period Column */}
            <div className={`w-40 shrink-0 ${inputCellClasses} ${borderRightSlate300} ${periodBg} group-hover/row:bg-emerald-200/40 focus-within:bg-emerald-200/90`}>
                <CustomSelect
                    variant='green'
                    value={form.period}
                    onChange={(val) => handleInputChange(form.id, 'period', val)}
                    options={periods.map((p) => ({ id: p, name: p }))}
                    defaultText="—"
                />
            </div>

            {/* Indicators Column */}
            <div className={`w-40 shrink-0 ${inputCellClasses} ${borderRightSlate200} ${indicatorsBg} group-hover/row:bg-rose-200/60 focus-within:bg-rose-200`}>
                <input
                    type="text"
                    value={form.indicators}
                    onChange={(e) => handleInputChange(form.id, 'indicators', e.target.value)}
                    className="w-full py-0.5 text-center focus:outline-none border-b border-rose-300 focus:border-rose-700 text-rose-950 font-black transition-colors bg-transparent"
                />
            </div>

            {/* Coefficients K1-K6 */}
            {(['k1', 'k2', 'k3', 'k4', 'k5', 'k6'] as const).map((k, idx) => (
                <div key={k} className={`w-20 shrink-0 ${inputCellClasses} ${idx < 5 ? borderRightSlate200 : borderRightSlate300} group-hover/row:bg-indigo-100/40 focus-within:bg-indigo-100`}>
                    <input
                        type="text"
                        value={form[k]}
                        onChange={(e) => handleInputChange(form.id, k, e.target.value)}
                        className="w-full py-0.5 text-center focus:outline-none border-b border-slate-300 focus:border-indigo-700 text-indigo-950 font-black text-[11px] transition-colors bg-transparent"
                    />
                </div>
            ))}

            {/* ACTION/DELETE CELL */}
            <div className="w-20 shrink-0 px-1 flex justify-center items-center">
                <button
                    type="button"
                    onClick={() => onDelete(form)}
                    className="w-6 h-6 flex items-center justify-center bg-pink-100 border cursor-pointer border-red-300 text-2xl leading-none text-center text-red-600 transition-all hover:bg-pink-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                >
                    ×
                </button>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.form === nextProps.form &&
        prevProps.rowIndex === nextProps.rowIndex &&
        prevProps.periods === nextProps.periods
    );
});