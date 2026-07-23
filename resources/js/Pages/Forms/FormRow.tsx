import React from 'react';
import { CustomSelect } from '@/components/custom/CustomSelect';

interface LocalFormItem {
    id: number;
    okud: string;
    name: string;
    period: string;
    indicators: string;
    k1: string;
    k2: string;
    k3: string;
    k4: string;
    k5: string;
    k6: string;
    is_consolidated: boolean;
    created_at: string;
    updated_at: string;
}

interface FormRowProps {
    form: LocalFormItem;
    rowIndex: number;
    periods: ('годовая' | 'полугодовая' | 'квартальная' | 'месячная')[];
    handleInputChange: (id: number, field: keyof LocalFormItem, rawValue: string) => void;
    onDelete: (form: LocalFormItem) => void;
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
    inputCellClasses,
    borderRightSlate300,
    borderRightSlate200,
}: FormRowProps) {
    const isEven = rowIndex % 2 === 0;
    const baseRowBg = isEven ? 'bg-indigo-50/30' : 'bg-white';

    const okudBg = isEven ? 'bg-sky-50/70' : 'bg-sky-100/50';
    const nameBg = isEven ? 'bg-orange-50/70' : 'bg-orange-100/50';
    const periodBg = isEven ? 'bg-emerald-50/70' : 'bg-emerald-100/50';
    const indicatorsBg = isEven ? 'bg-rose-50/70' : 'bg-rose-100/60';

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
            <div className={`w-25.5 shrink-0 ${inputCellClasses} ${borderRightSlate200} ${indicatorsBg} group-hover/row:bg-rose-200/60 focus-within:bg-rose-200`}>
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