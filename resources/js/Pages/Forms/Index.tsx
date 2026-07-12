import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/400.css';
import { AddFormModal } from './AddFormModal';
import { OkvedModal } from './OkvedModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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
    version_id: number;
    is_consolidated: boolean;
    created_at: string;
    updated_at: string;
    okveds?: string[];
}

interface LocalFormItem {
    id: number;
    name: string;
    total: string;
    indicators: string;
    reports: string;
    k1: string;
    k2: string;
    k3: string;
    k4: string;
    k5: string;
    k6: string;
    version_id: number;
    is_consolidated: boolean;
    created_at: string;
    updated_at: string;
    okveds?: string[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface FormsProp {
    data: FormItem[];
    total: number;
    links: PaginationLink[];
}

interface Props {
    forms: FormsProp;
    filters: {
        search?: string;
    };
}

export default function Index({ forms, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isOkvedModalOpen, setIsOkvedModalOpen] = useState<boolean>(false);
    const [selectedFormId, setSelectedFormId] = useState<number | null>(null);

    const [localForms, setLocalForms] = useState<LocalFormItem[]>([]);
    const [initialForms, setInitialForms] = useState<FormItem[]>(forms.data);

    const extractedVersionId = forms.data[0]?.version_id || 0;

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
            okveds: item.okveds || []
        }));
    };

    useEffect(() => {
        setLocalForms(mapToLocalState(forms.data));
        setInitialForms(forms.data);
    }, [forms.data]);

    const applyFilters = (search: string) => {
        router.get(
            window.location.pathname,
            { search: search || undefined },
            { preserveState: true, replace: true }
        );
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery !== (filters.search || '')) {
                applyFilters(searchQuery);
            }
        }, 400);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const formatDateRu = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleInputChange = (id: number, field: keyof LocalFormItem, value: any) => {
        setLocalForms(prev => prev.map(form => {
            if (form.id === id) {
                let cleanValue = value;
                if (['indicators', 'reports', 'total'].includes(field as string) && typeof value === 'string') {
                    cleanValue = value.replace(/\D/g, '');
                } else if (['k1', 'k2', 'k3', 'k4', 'k5', 'k6'].includes(field as string) && typeof value === 'string') {
                    cleanValue = value.replace(/[^0-9.]/g, '');
                    const parts = cleanValue.split('.');
                    if (parts.length > 2) {
                        cleanValue = parts[0] + '.' + parts.slice(1).join('');
                    }
                }
                return { ...form, [field]: cleanValue };
            }
            return form;
        }));
    };

    const getChangedForms = () => {
        return localForms.filter(current => {
            const original = initialForms.find(f => f.id === current.id);
            if (!original) return false;

            // Изменения в okveds сознательно игнорируются для плашки несохраненных изменений
            return current.name !== original.name ||
                current.is_consolidated !== !!original.is_consolidated ||
                Number(current.total) !== original.total ||
                Number(current.indicators) !== original.indicators ||
                Number(current.reports) !== original.reports ||
                Number(current.k1) !== original.k1 ||
                Number(current.k2) !== original.k2 ||
                Number(current.k3) !== original.k3 ||
                Number(current.k4) !== original.k4 ||
                Number(current.k5) !== original.k5 ||
                Number(current.k6) !== original.k6;
        });
    };

    const hasChanges = getChangedForms().length > 0;

    const handleCancelAllChanges = () => {
        setLocalForms(mapToLocalState(initialForms));
    };

    const handleApplyAllChanges = () => {
        const changedList = getChangedForms().map(form => ({
            ...form,
            total: Number(form.total) || 0,
            indicators: Number(form.indicators) || 0,
            reports: Number(form.reports) || 0,
            k1: Number(form.k1) || 0,
            k2: Number(form.k2) || 0,
            k3: Number(form.k3) || 0,
            k4: Number(form.k4) || 0,
            k5: Number(form.k5) || 0,
            k6: Number(form.k6) || 0,
            okveds: form.okveds || []
        }));

        router.put('/forms', { forms: changedList }, {
            preserveState: true,
            onSuccess: () => { }
        });
    };

    const handleOpenOkved = (id: number) => {
        setSelectedFormId(id);
        setIsOkvedModalOpen(true);
    };

    const activeFormIndex = selectedFormId !== null ? localForms.findIndex(f => f.id === selectedFormId) : null;
    const activeDeptIndex = activeFormIndex !== null ? 0 : null;

    const syntheticFormBridge = {
        data: {
            forms: localForms.map(f => ({
                ...f,
                departments: [{ name: f.name, okveds: f.okveds || [] }]
            }))
        },
        processing: false,
        setData: (callback: any) => {
            const currentFakeState = {
                forms: localForms.map(f => ({
                    ...f,
                    departments: [{ name: f.name, okveds: f.okveds || [] }]
                }))
            };
            const nextFakeState = callback(currentFakeState);
            if (activeFormIndex !== null) {
                const updatedOkveds = nextFakeState.forms[activeFormIndex].departments[0].okveds;
                setLocalForms(prev => prev.map((f, idx) =>
                    idx === activeFormIndex ? { ...f, okveds: updatedOkveds } : f
                ));
            }
        },
        put: (url: string, options: any) => {
            if (options?.onSuccess) {
                options.onSuccess();
            }
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="space-y-3 text-base relative pb-16" style={{ fontFamily: "'JetBrains Mono', monospace" }}>

                <div className="bg-white border-2 border-gray-900 p-3 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="border-l-4 border-indigo-600 pl-3">
                            <div className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
                                Редактор форм <span className="text-indigo-600">[{forms.total}]</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
                        >
                            <span className="text-lg font-normal">+</span> Создать форму
                        </button>
                    </div>

                    <div className="flex gap-3 items-center">
                        <div className="relative w-64 sm:w-80">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Поиск по названию..."
                                className="w-full pl-3 pr-8 py-2 bg-white border-2 border-gray-900 text-sm font-bold text-gray-900 focus:outline-none focus:border-indigo-600 placeholder-gray-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(''); applyFilters(''); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg uppercase font-bold cursor-pointer"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white border-2 border-gray-900 overflow-hidden shadow-sm">
                    <div className="hidden lg:grid grid-cols-12 gap-2 bg-gray-100 border-b-2 border-gray-900 p-2 text-xs font-bold uppercase text-gray-700 tracking-wider">
                        <div className="col-span-3">Наименование формы конфигурации</div>
                        <div className="col-span-1 text-center">Показ.</div>
                        <div className="col-span-1 text-center">Отчеты</div>
                        <div className="col-span-1 text-center">Итого</div>
                        <div className="col-span-4 text-center">Установленные коэффициенты (K1 - K6)</div>
                        <div className="col-span-1 text-center">Режим</div>
                        {/* <div className="col-span-1 text-right">Настройка</div> */}
                    </div>

                    <div className="divide-y-2 divide-gray-200">
                        {localForms.map((form) => (
                            <div
                                key={form.id}
                                className="p-3 pb-6 hover:bg-indigo-50/10 transition-colors duration-150 relative border-b-2 border-gray-200"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
                                    <div className="col-span-1 lg:col-span-3">
                                        <label className="lg:hidden text-[10px] font-bold text-gray-400 uppercase block mb-0.5">
                                            Наименование формы
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => handleInputChange(form.id, 'name', e.target.value)}
                                            className="w-full px-2 py-1.5 border border-gray-400 focus:border-indigo-600 focus:outline-none text-lg font-bold text-gray-950 bg-white"
                                        />
                                    </div>

                                    <div className="col-span-1 lg:col-span-1">
                                        <label className="lg:hidden text-[10px] font-bold text-gray-400 uppercase block mb-0.5">
                                            Показ.
                                        </label>
                                        <input
                                            type="text"
                                            value={form.indicators}
                                            onChange={(e) => handleInputChange(form.id, 'indicators', e.target.value)}
                                            className="w-full px-1 py-1.5 text-center border border-gray-400 focus:border-indigo-600 focus:outline-none text-base font-bold text-gray-900 bg-white"
                                        />
                                    </div>

                                    <div className="col-span-1 lg:col-span-1">
                                        <label className="lg:hidden text-[10px] font-bold text-gray-400 uppercase block mb-0.5">
                                            Отчеты
                                        </label>
                                        <input
                                            type="text"
                                            value={form.reports}
                                            onChange={(e) => handleInputChange(form.id, 'reports', e.target.value)}
                                            className="w-full px-1 py-1.5 text-center border border-gray-400 focus:border-indigo-600 focus:outline-none text-base font-bold text-gray-900 bg-white"
                                        />
                                    </div>

                                    <div className="col-span-1 lg:col-span-1">
                                        <label className="lg:hidden text-[10px] font-bold text-gray-400 uppercase block mb-0.5">
                                            Итого
                                        </label>
                                        <input
                                            type="text"
                                            value={form.total}
                                            onChange={(e) => handleInputChange(form.id, 'total', e.target.value)}
                                            className="w-full px-1 py-1.5 text-center border border-gray-400 focus:border-indigo-600 focus:outline-none text-base font-bold text-gray-900 bg-white"
                                        />
                                    </div>

                                    <div className="col-span-1 lg:col-span-4">
                                        <label className="lg:hidden text-[10px] font-bold text-gray-400 uppercase block mb-0.5">
                                            Коэффициенты (K1 - K6)
                                        </label>
                                        <div className="grid grid-cols-6 gap-1 bg-gray-50 p-1 border border-gray-300">
                                            {(['k1', 'k2', 'k3', 'k4', 'k5', 'k6'] as const).map((key) => (
                                                <div key={key} className="flex flex-col items-center">
                                                    <span className="text-[9px] text-gray-500 font-bold uppercase">{key}</span>
                                                    <input
                                                        type="text"
                                                        value={form[key]}
                                                        onChange={(e) => handleInputChange(form.id, key, e.target.value)}
                                                        className="w-full p-1 text-center border border-gray-300 focus:border-indigo-600 focus:outline-none text-sm font-bold text-indigo-700 bg-white"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-1 lg:col-span-1 flex lg:justify-center items-center py-1">
                                        <label className="flex items-center gap-2 cursor-pointer select-none font-bold text-sm text-gray-800 uppercase">
                                            <input
                                                type="checkbox"
                                                checked={form.is_consolidated}
                                                onChange={(e) => handleInputChange(form.id, 'is_consolidated', e.target.checked)}
                                                className="w-5 h-5 border-2 border-gray-900 text-indigo-600 focus:ring-0 focus:ring-offset-0 transition-transform active:scale-95 cursor-pointer"
                                            />
                                            <span className="lg:hidden">Сводная</span>
                                            <span className="hidden lg:inline text-xs">Сводная</span>
                                        </label>
                                    </div>

                                    {/* <div className="col-span-1 lg:col-span-1 flex lg:justify-end items-center">
                                        <button
                                            onClick={() => handleOpenOkved(form.id)}
                                            className="w-full lg:w-auto px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border-2 border-gray-900 text-gray-900 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                                        >
                                            ОКВЭД
                                        </button>
                                    </div> */}
                                </div>

                                <div className="absolute bottom-0 right-0 text-[10px] font-bold text-gray-400 flex items-center gap-4 uppercase tracking-wider select-none bg-gray-200 px-4 py-0.5 border-t border-l border-gray-300">
                                    <span>Создано: <span className="text-gray-700">{formatDateRu(form.created_at)}</span></span>
                                    <span>Обновлено: <span className="text-gray-700">{formatDateRu(form.updated_at)}</span></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {forms.links && forms.links.length > 3 && (
                    <div className="bg-white border-2 border-gray-900 p-2 flex justify-center items-center shadow-sm">
                        <div className="flex gap-1 bg-white border border-gray-300 p-0.5">
                            {forms.links.map((link, k) => {
                                if (link.url === null) return <div key={k} className="px-2.5 py-1 text-xs font-bold text-gray-300 select-none" dangerouslySetInnerHTML={{ __html: link.label }} />;
                                return (
                                    <button
                                        key={k}
                                        onClick={() => router.get(link.url!, {}, { preserveState: true })}
                                        className={`px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${link.active ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                <AddFormModal
                    isConsolidated={true}
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    versionId={extractedVersionId}
                />

                {/* <OkvedModal
                    isOpen={isOkvedModalOpen}
                    onClose={() => setIsOkvedModalOpen(false)}
                    activeFormIndex={activeFormIndex}
                    activeDeptIndex={activeDeptIndex}
                    form={syntheticFormBridge}
                /> */}

                {hasChanges && (
                    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-40 bg-white border-3 border-indigo-600 p-3 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
                        <div className="flex flex-col gap-2">
                            <div className="text-xs font-bold uppercase text-gray-900 tracking-wider">
                                Обнаружены несохраненные изменения ({getChangedForms().length})
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={handleCancelAllChanges}
                                    className="px-3 py-1.5 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={handleApplyAllChanges}
                                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-md"
                                >
                                    Применить
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}