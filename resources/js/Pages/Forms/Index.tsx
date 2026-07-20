import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { AddFormModal } from './AddFormModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// The source of truth (Backend/SQL representation)
interface FormItem {
    id: number;
    name: string;
    total: number;
    indicators: number;
    reports: number;
    k1: number;
    k2: number;
    k3: number;
    k4: number;
    k5: number;
    k6: number;
    is_consolidated: boolean;
    created_at: string; // From SQL
    updated_at: string; // From SQL
}

// The editable interface (UI representation)
// Omitting created_at/updated_at because they are read-only
interface LocalFormItem extends Omit<FormItem, 'total' | 'indicators' | 'reports' | 'k1' | 'k2' | 'k3' | 'k4' | 'k5' | 'k6'> {
    total: string;
    indicators: string;
    reports: string;
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
}

export default function Index({ forms, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [localForms, setLocalForms] = useState<LocalFormItem[]>([]);
    const [initialForms, setInitialForms] = useState<FormItem[]>(forms.data);

    const mapToLocalState = (items: FormItem[]): LocalFormItem[] => {
        return items.map(item => ({
            ...item,
            name: item.name || '',
            total: String(item.total ?? 0),
            indicators: String(item.indicators ?? 0),
            reports: String(item.reports ?? 0),
            k1: String(item.k1 ?? 0),
            k2: String(item.k2 ?? 0),
            k3: String(item.k3 ?? 0),
            k4: String(item.k4 ?? 0),
            k5: String(item.k5 ?? 0),
            k6: String(item.k6 ?? 0),
            is_consolidated: !!item.is_consolidated,
            // okveds: item.okveds || []
        }));
    };

    useEffect(() => {
        setLocalForms(mapToLocalState(forms.data));
        setInitialForms(forms.data);
    }, [forms.data]);

    const handleInputChange = (id: number, field: keyof LocalFormItem, value: any) => {
        setLocalForms(prev => prev.map(form => (form.id === id ? { ...form, [field]: value } : form)));
    };

    const getChangedForms = () => {
        return localForms.filter(current => {
            const original = initialForms.find(f => f.id === current.id);
            return original && (current.name !== original.name || current.total !== String(original.total) || current.is_consolidated !== !!original.is_consolidated);
        });
    };

    const hasChanges = getChangedForms().length > 0;

    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-medium text-slate-900 tracking-tight">
                            РЕДАКТОР ФОРМ <span className="text-indigo-600">[{forms.total}]</span>
                        </h1>
                        <button onClick={() => setIsAddModalOpen(true)} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase hover:bg-indigo-700">
                            + Создать форму
                        </button>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск по названию..."
                        className="w-64 px-3 py-1 border border-slate-300 text-xs focus:outline-none"
                    />
                </div>

                <div className="border border-slate-300">
                    <div className="grid grid-cols-12 border-b border-slate-300 bg-slate-50 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                        <div className="col-span-4 p-2 border-r border-slate-300">Наименование формы</div>
                        <div className="col-span-1 p-2 border-r border-slate-300 text-center">Показ.</div>
                        <div className="col-span-1 p-2 border-r border-slate-300 text-center">Отчеты</div>
                        <div className="col-span-1 p-2 border-r border-slate-300 text-center">Итого</div>
                        <div className="col-span-4 p-2 border-r border-slate-300 text-center">Коэффициенты (K1 - K6)</div>
                        <div className="col-span-1 p-2 text-center">Режим</div>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {localForms.map((form) => (
                            <div key={form.id} className="grid grid-cols-12 items-center text-sm text-slate-900">
                                <div className="col-span-4 p-2 border-r border-slate-200">
                                    <input type="text" value={form.name} onChange={(e) => handleInputChange(form.id, 'name', e.target.value)} className="w-full focus:outline-none" />
                                </div>
                                <div className="col-span-1 p-2 border-r border-slate-200 text-center">{form.indicators}</div>
                                <div className="col-span-1 p-2 border-r border-slate-200 text-center">{form.reports}</div>
                                <div className="col-span-1 p-2 border-r border-slate-200 text-center">{form.total}</div>
                                <div className="col-span-4 p-2 border-r border-slate-200 grid grid-cols-6 text-center text-indigo-700 font-bold text-xs">
                                    {['k1', 'k2', 'k3', 'k4', 'k5', 'k6'].map(k => <div key={k}>{form[k as keyof LocalFormItem]}</div>)}
                                </div>
                                <div className="col-span-1 p-2 text-center">
                                    <input type="checkbox" checked={form.is_consolidated} onChange={(e) => handleInputChange(form.id, 'is_consolidated', e.target.checked)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <AddFormModal isConsolidated={true} isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

                {hasChanges && (
                    <div className="fixed bottom-4 right-4 bg-white border border-slate-300 p-4 shadow-lg z-50">
                        <div className="text-xs font-bold uppercase mb-2">Изменения ({getChangedForms().length})</div>
                        <div className="flex gap-2">
                            <button onClick={() => setLocalForms(mapToLocalState(initialForms))} className="px-3 py-1 border border-slate-300 text-xs uppercase">Отмена</button>
                            <button
                                onClick={() => {
                                    // Map to a clean object structure that matches what your backend expects
                                    const payload = getChangedForms().map(form => ({
                                        id: form.id,
                                        name: form.name,
                                        total: Number(form.total),
                                        indicators: Number(form.indicators),
                                        reports: Number(form.reports),
                                        k1: Number(form.k1),
                                        k2: Number(form.k2),
                                        k3: Number(form.k3),
                                        k4: Number(form.k4),
                                        k5: Number(form.k5),
                                        k6: Number(form.k6),
                                        is_consolidated: form.is_consolidated
                                    }));

                                    router.put('/forms', { forms: payload });
                                }}
                                className="px-3 py-1 bg-indigo-600 text-white text-xs uppercase"
                            >
                                Применить
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}