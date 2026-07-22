import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { AddFormModal } from './AddFormModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface FormItem {
    id: number;
    okud: string | null;
    name: string;
    period: string | null;
    indicators: number | null;
    k1: number | null;
    k2: number | null;
    k3: number | null;
    k4: number | null;
    k5: number | null;
    k6: number | null;
    is_consolidated: boolean;
    created_at: string;
    updated_at: string;
}

interface LocalFormItem extends Omit<FormItem, 'indicators' | 'k1' | 'k2' | 'k3' | 'k4' | 'k5' | 'k6'> {
    okud: string;
    period: string;
    indicators: string;
    k1: string;
    k2: string;
    k3: string;
    k4: string;
    k5: string;
    k6: string;
}

interface Props {
    forms: {
        data: FormItem[];
        total: number;
    };
    filters: {
        search?: string;
    };
    periods: ('годовая' | 'полугодовая' | 'квартальная' | 'месячная')[];
}

export default function Index({ forms, filters, periods }: Props) {
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [localForms, setLocalForms] = useState<LocalFormItem[]>([]);
    const [initialForms, setInitialForms] = useState<FormItem[]>(forms.data);

    const { setData, put, processing, reset } = useForm<{ forms: any[] }>({
        forms: [],
    });

    const formatInitialValue = (val: number | null | undefined, isFloat = false): string => {
        if (val === null || val === undefined) return '';
        if (isFloat) {
            const num = Number(val);
            return Number.isInteger(num) ? num.toFixed(1) : String(num);
        }
        return String(val);
    };

    const mapToLocalState = (items: FormItem[]): LocalFormItem[] => {
        return items.map(item => ({
            ...item,
            okud: item.okud !== null && item.okud !== undefined ? String(item.okud) : '',
            name: item.name || '',
            period: item.period || '',
            indicators: formatInitialValue(item.indicators),
            k1: formatInitialValue(item.k1, true),
            k2: formatInitialValue(item.k2, true),
            k3: formatInitialValue(item.k3, true),
            k4: formatInitialValue(item.k4, true),
            k5: formatInitialValue(item.k5, true),
            k6: formatInitialValue(item.k6, true),
            is_consolidated: !!item.is_consolidated,
        }));
    };

    useEffect(() => {
        setLocalForms(mapToLocalState(forms.data));
        setInitialForms(forms.data);
    }, [forms.data]);

    const parsePayloadValue = (val: string, isFloat = false) => {
        if (val.trim() === '' || val === '.') return null;
        return isFloat ? parseFloat(val) : parseInt(val, 10);
    };

    const isFormChanged = (current: LocalFormItem, original: FormItem): boolean => {
        const normOkudCurrent = current.okud.trim() === '' ? null : current.okud.trim();
        const normOkudOrig = original.okud !== null && original.okud !== undefined ? String(original.okud) : null;

        const normPeriodCurrent = current.period.trim() === '' ? null : current.period.trim();
        const normPeriodOrig = original.period !== null && original.period !== undefined ? String(original.period) : null;

        return (
            normOkudCurrent !== normOkudOrig ||
            current.name !== original.name ||
            normPeriodCurrent !== normPeriodOrig ||
            parsePayloadValue(current.indicators) !== original.indicators ||
            parsePayloadValue(current.k1, true) !== original.k1 ||
            parsePayloadValue(current.k2, true) !== original.k2 ||
            parsePayloadValue(current.k3, true) !== original.k3 ||
            parsePayloadValue(current.k4, true) !== original.k4 ||
            parsePayloadValue(current.k5, true) !== original.k5 ||
            parsePayloadValue(current.k6, true) !== original.k6 ||
            current.is_consolidated !== !!original.is_consolidated
        );
    };

    const handleInputChange = (id: number, field: keyof LocalFormItem, rawValue: string) => {
        let value = rawValue;

        if (field === 'okud') {
            if (value !== '' && (!/^\d*$/.test(value) || value.length > 8)) return;
        } else if (field === 'indicators') {
            if (value !== '' && !/^(0|[1-9]\d*)$/.test(value)) return;
        } else if (['k1', 'k2', 'k3', 'k4', 'k5', 'k6'].includes(field)) {
            if (value === '.') value = '0.';
            if (value !== '' && !/^(0(\.\d*)?|[1-9]\d*(\.\d*)?)$/.test(value)) return;
        }

        const updatedLocal = localForms.map(form =>
            form.id === id ? { ...form, [field]: value } : form
        );

        setLocalForms(updatedLocal);

        const changedItems = updatedLocal
            .filter(current => {
                const original = initialForms.find(f => f.id === current.id);
                if (!original) return false;
                return isFormChanged(current, original);
            })
            .map(form => ({
                ...form,
                okud: form.okud.trim() === '' ? null : form.okud,
                period: form.period.trim() === '' ? null : form.period,
                indicators: parsePayloadValue(form.indicators),
                k1: parsePayloadValue(form.k1, true),
                k2: parsePayloadValue(form.k2, true),
                k3: parsePayloadValue(form.k3, true),
                k4: parsePayloadValue(form.k4, true),
                k5: parsePayloadValue(form.k5, true),
                k6: parsePayloadValue(form.k6, true),
            }));

        setData('forms', changedItems);
    };

    const getChangedForms = () => {
        return localForms.filter(current => {
            const original = initialForms.find(f => f.id === current.id);
            return original && isFormChanged(current, original);
        });
    };

    const hasChanges = getChangedForms().length > 0;

    const filteredForms = localForms.filter(form =>
        form.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (form.okud !== null && form.okud !== undefined && String(form.okud).includes(searchQuery.trim()))
    );

    const handleSubmit = () => {
        put('/forms', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const handleCancel = () => {
        setLocalForms(mapToLocalState(initialForms));
        setData('forms', []);
    };

    const inputCellClasses = "px-1.5 py-1 transition-colors duration-150";
    const borderRightSlate300 = "border-r border-slate-300";
    const borderRightSlate200 = "border-r border-slate-200";

    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-medium text-slate-900 tracking-tight">
                            РЕДАКТОР ФОРМ <span className="text-indigo-600">[{forms.total}]</span>
                        </h1>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase hover:bg-indigo-700 cursor-pointer"
                        >
                            + Создать форму
                        </button>
                    </div>

                    <div className="relative flex items-center">
                        <svg
                            className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск по ОКУД или наименованию..."
                            className="w-64 pl-8 pr-3 py-3 border border-slate-300 text-xs focus:outline-none focus:border-indigo-600 transition-colors"
                        />
                    </div>
                </div>

                <div className="border border-slate-300 overflow-x-auto">
                    <div className="min-w-275 grid grid-cols-12 border-b border-slate-300 bg-slate-100 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                        {/* OKUD Header - Sky Tint */}
                        <div className={`col-span-1 p-2 ${borderRightSlate300} text-center bg-sky-200/80 text-sky-900`}>
                            ОКУД
                        </div>
                        {/* Name Header - Orange Tint */}
                        <div className={`col-span-3 px-3 py-2 ${borderRightSlate300} bg-orange-200/70 text-orange-900`}>
                            Наименование формы
                        </div>
                        {/* Period Header - Emerald Tint */}
                        <div className={`col-span-1 p-2 ${borderRightSlate300} text-center bg-emerald-200/60 text-emerald-900`}>
                            Период
                        </div>
                        {/* Indicators Header - Rose Tint */}
                        <div className={`col-span-1 p-2 ${borderRightSlate300} text-center bg-rose-200/70 text-rose-900`}>
                            Показатели
                        </div>

                        {['K1', 'K2', 'K3', 'K4', 'K5', 'K6'].map((k, idx) => (
                            <div key={k} className={`col-span-1 p-2 ${idx < 5 ? borderRightSlate300 : ''} text-center`}>
                                {k}
                            </div>
                        ))}
                    </div>

                    <div className="min-w-275 divide-y divide-slate-200">
                        {filteredForms.map((form, rowIndex) => {
                            const isEven = rowIndex % 2 === 0;
                            const baseRowBg = isEven ? 'bg-indigo-50/30' : 'bg-white';

                            // Muted palette column background classes using orange for name
                            const okudBg = isEven ? 'bg-sky-50/70' : 'bg-sky-100/50';
                            const nameBg = isEven ? 'bg-orange-50/70' : 'bg-orange-100/50';
                            const periodBg = isEven ? 'bg-emerald-50/70' : 'bg-emerald-100/50';
                            const indicatorsBg = isEven ? 'bg-rose-50/70' : 'bg-rose-100/60';

                            return (
                                <div
                                    key={form.id}
                                    className={`group/row grid grid-cols-12 items-center text-sm text-slate-900 ${baseRowBg} hover:bg-slate-100/80 transition-colors duration-150`}
                                >
                                    {/* OKUD Column */}
                                    <div className={`col-span-1 ${inputCellClasses} ${borderRightSlate300} ${okudBg} group-hover/row:bg-sky-200/40 focus-within:bg-sky-200/90`}>
                                        <input
                                            type="text"
                                            value={form.okud}
                                            onChange={(e) => handleInputChange(form.id, 'okud', e.target.value)}
                                            placeholder="00000000"
                                            className="w-full py-0.5 text-center focus:outline-none border-b border-sky-300 focus:border-sky-700 font-mono font-bold text-xs text-sky-950 transition-colors bg-transparent"
                                        />
                                    </div>

                                    {/* Name Column */}
                                    <div className={`col-span-3 ${inputCellClasses} ${borderRightSlate300} ${nameBg} group-hover/row:bg-orange-200/40 focus-within:bg-orange-200/90`}>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => handleInputChange(form.id, 'name', e.target.value)}
                                            className="w-full py-0.5 focus:outline-none border-b border-orange-300 focus:border-orange-700 font-semibold text-orange-950 transition-colors bg-transparent"
                                        />
                                    </div>

                                    {/* Period Column */}
                                    <div className={`col-span-1 ${inputCellClasses} ${borderRightSlate300} ${periodBg} group-hover/row:bg-emerald-200/40 focus-within:bg-emerald-200/90`}>
                                        <select
                                            value={form.period}
                                            onChange={(e) => handleInputChange(form.id, 'period', e.target.value)}
                                            className="w-full py-0.5 text-center focus:outline-none border-b border-emerald-300 focus:border-emerald-700 text-xs text-emerald-950 font-medium transition-colors bg-transparent cursor-pointer"
                                        >
                                            <option value="">—</option>
                                            {periods.map((p) => (
                                                <option key={p} value={p}>
                                                    {p}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Indicators Column */}
                                    <div className={`col-span-1 ${inputCellClasses} ${borderRightSlate200} ${indicatorsBg} group-hover/row:bg-rose-200/60 focus-within:bg-rose-200`}>
                                        <input
                                            type="text"
                                            value={form.indicators}
                                            onChange={(e) => handleInputChange(form.id, 'indicators', e.target.value)}
                                            className="w-full py-0.5 text-center focus:outline-none border-b border-rose-300 focus:border-rose-700 text-rose-950 font-black transition-colors bg-transparent"
                                        />
                                    </div>

                                    {(['k1', 'k2', 'k3', 'k4', 'k5', 'k6'] as const).map((k, idx) => (
                                        <div key={k} className={`col-span-1 ${inputCellClasses} ${idx < 5 ? borderRightSlate200 : ''} group-hover/row:bg-indigo-100/40 focus-within:bg-indigo-100`}>
                                            <input
                                                type="text"
                                                value={form[k]}
                                                onChange={(e) => handleInputChange(form.id, k, e.target.value)}
                                                className="w-full py-0.5 text-center focus:outline-none border-b border-slate-300 focus:border-indigo-700 text-indigo-950 font-black text-xs transition-colors bg-transparent"
                                            />
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <AddFormModal isConsolidated={true} isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

                {hasChanges && (
                    <div className="fixed bottom-4 right-4 bg-white border border-slate-300 p-4 shadow-xl z-50">
                        <div className="text-xs font-bold uppercase mb-2">Изменения ({getChangedForms().length})</div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-3 py-1 border border-slate-300 text-xs uppercase hover:bg-slate-50 cursor-pointer"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="px-3 py-1 bg-indigo-600 text-white text-xs uppercase hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                            >
                                {processing ? 'Сохранение...' : 'Принять'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}