import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/400.css';
import { AddFormModal } from './AddFormModal';
import { EditFormModal } from './EditFormModal';
import { ExtendedPageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ departments, forms, versionId, filters }: ExtendedPageProps) {
    const [selectedTerritory, setSelectedTerritory] = useState<string>(filters.territory || 'all');
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedForm, setSelectedForm] = useState<any | null>(null);

    const sortedForms = [...forms.data].sort((a, b) => {
        const aHas = !!a.department_id;
        const bHas = !!b.department_id;
        if (aHas === bHas) return 0;
        return aHas ? -1 : 1;
    });

    const territoryBadge: Record<string, string> = {
        ekb: 'text-indigo-600/90 font-mono text-sm font-bold tracking-tight bg-indigo-50/60 px-2.5 py-1 border border-indigo-100',
        krg: 'text-purple-600/90 font-mono text-sm font-bold tracking-tight bg-purple-50/60 px-2.5 py-1 border border-purple-100',
    };

    const localTerritoryName: Record<string, string> = {
        ekb: 'Екатеринбург',
        krg: 'Курган'
    };

    const applyFilters = (search: string, territory: string) => {
        router.get(
            window.location.pathname,
            {
                search: search || undefined,
                territory: territory !== 'all' ? territory : undefined
            },
            { preserveState: true, replace: true }
        );
    };

    useEffect(() => {
        setSelectedTerritory(filters.territory || 'all');
    }, [filters.territory]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery !== (filters.search || '')) {
                applyFilters(searchQuery, selectedTerritory);
            }
        }, 400);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const handleTerritoryChange = (territory: string) => {
        setSelectedTerritory(territory);
        applyFilters(searchQuery, territory);
    };

    const handleFormCardClick = (form: any) => {
        setSelectedForm(form);
        setIsEditModalOpen(true);
    };

    return (
        <AuthenticatedLayout>
            <div className="space-y-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <div className="bg-white border border-indigo-200/50 p-6 flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center shadow-sm">
                    <div className="flex items-stretch gap-4">
                        <div className="border-l-6 border-indigo-600 pl-4 flex items-center">
                            <div className="text-2xl font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                                Формы
                                <span className="text-indigo-600">[{forms.total}]</span>
                                {filters.search && (
                                    <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200/70 px-2 py-0.5 tracking-wider animate-pulse">
                                        [ВашПоиск]
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-1 bg-white/60 backdrop-blur-md hover:bg-white/90 border border-indigo-200 text-indigo-600 hover:text-indigo-700 hover:border-indigo-400 font-mono text-md font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-1.5 shadow-sm/50"
                        >
                            <span className="text-2xl font-normal text-indigo-500/80">+</span>
                            Добавить форму
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                        <div className="relative flex-1 md:w-80">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Поиск по форме или ведомству..."
                                className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-300 text-sm font-mono font-bold text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-0 placeholder-gray-400/70 transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(''); applyFilters('', selectedTerritory); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-mono text-xs uppercase font-bold cursor-pointer"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <div className="flex gap-1.5 bg-white border border-gray-300 p-1 shrink-0">
                            {['all', 'ekb', 'krg'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => handleTerritoryChange(t)}
                                    className={`uppercase px-4 py-2 text-xs font-mono font-bold tracking-wider transition-all duration-150 cursor-pointer ${selectedTerritory === t
                                        ? 'bg-indigo-600 text-white border border-indigo-600'
                                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {t === 'all' ? 'ВСЕ' : t.toUpperCase() === 'EKB' ? 'екатеринбург' : 'курган'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {sortedForms.map((form, index) => {
                        const isFirstNoDept = !form.department_id && (index === 0 || !!sortedForms[index - 1].department_id);

                        return (
                            <React.Fragment key={form.id}>
                                {isFirstNoDept && (
                                    <div className="col-span-full py-8 flex items-center gap-4">
                                        <div className="h-px flex-1 bg-indigo-600" />
                                        <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest px-2">
                                            Без ведомства
                                        </span>
                                        <div className="h-px flex-1 bg-indigo-600" />
                                    </div>
                                )}
                                <div
                                    onClick={() => handleFormCardClick(form)}
                                    className="bg-white/90 backdrop-blur-sm border border-indigo-200/80 flex flex-col justify-between hover:border-indigo-400 transition-colors duration-200 shadow-sm group cursor-pointer"
                                >
                                    <div className="p-4 bg-slate-50/60 border-b border-gray-200/60 min-h-[4.2rem] flex items-center">
                                        <div className="text-sm font-bold text-gray-600 uppercase tracking-tight leading-snug line-clamp-2" title={form.resolvedDeptName}>
                                            {form.resolvedDeptName || 'БЕЗ ВЕДОМСТВА'}
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="text-xl font-bold text-gray-950 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors line-clamp-3" title={form.name}>
                                            {form.name}
                                        </div>
                                        <div className="grid grid-cols-3 gap-1.5 pt-2">
                                            <div className="bg-indigo-50/30 border border-indigo-100/70 p-2 text-center">
                                                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider mb-0.5">ПОКАЗ.</span>
                                                <span className="text-base font-bold text-gray-900 tracking-tighter">{form.indicators}</span>
                                            </div>
                                            <div className="bg-indigo-50/30 border border-indigo-100/70 p-2 text-center">
                                                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider mb-0.5">ОТЧЕТЫ</span>
                                                <span className="text-base font-bold text-gray-900 tracking-tighter">{form.reports}</span>
                                            </div>
                                            <div className="bg-indigo-50/30 border border-indigo-100/70 p-2 text-center flex flex-col justify-center items-center">
                                                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider mb-0.5">КЭФ</span>
                                                <span className="text-base font-bold text-indigo-600 tracking-tighter">{form.coeff}</span>
                                            </div>
                                        </div>
                                        {form.resolvedTerritory && form.resolvedTerritory !== 'all' && (
                                            <div className="flex justify-end pt-1">
                                                <div className={territoryBadge[form.resolvedTerritory as keyof typeof territoryBadge] || ''}>
                                                    {localTerritoryName[form.resolvedTerritory as keyof typeof localTerritoryName] || form.resolvedTerritory}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>

                {forms.data.length === 0 && (
                    <div className="p-12 text-center text-sm font-bold text-gray-400 border border-dashed border-indigo-200 bg-white/50 uppercase tracking-widest font-mono">
                        Данные по запросу отсутствуют
                    </div>
                )}

                {forms.links && forms.links.length > 3 && (
                    <div className="bg-white border border-indigo-200/50 p-4 flex justify-center items-center shadow-sm">
                        <div className="flex gap-1 bg-white border border-gray-300 p-1">
                            {forms.links.map((link, k) => {
                                if (link.url === null) return <div key={k} className="px-3 py-1.5 text-[11px] font-mono font-bold text-gray-300 border border-transparent select-none" dangerouslySetInnerHTML={{ __html: link.label }} />;
                                return (
                                    <button
                                        key={k}
                                        onClick={() => router.get(link.url!, {}, { preserveState: true })}
                                        className={`px-3 py-1.5 text-[11px] font-mono font-bold transition-all duration-150 cursor-pointer ${link.active ? 'bg-indigo-600 text-white border border-indigo-600' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                <AddFormModal isConsolidated={true} isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} departments={departments} versionId={versionId} />
                <EditFormModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedForm(null); }} departments={departments} versionId={versionId} form={selectedForm} />
            </div>
        </AuthenticatedLayout>
    );
}