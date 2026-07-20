import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/400.css';
import { EditFormModal } from './EditFormDistributionModal';
import { ExtendedPageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ departments, forms, filters }: ExtendedPageProps) {
    const [selectedTerritory, setSelectedTerritory] = useState<string>(filters.territory || 'all');
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedForm, setSelectedForm] = useState<any | null>(null);

    const sortedForms = [...forms.data].sort((a, b) => {
        const aHas = (a.departments && a.departments.length > 0);
        const bHas = (b.departments && b.departments.length > 0);
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
                        const hasDepartments = form.departments && form.departments.length > 0;
                        const prevHasDepartments = index > 0 && sortedForms[index - 1].departments && sortedForms[index - 1].departments.length > 0;
                        const isFirstNoDept = !hasDepartments && (index === 0 || prevHasDepartments);

                        return (
                            <React.Fragment key={form.id}>
                                {isFirstNoDept && (
                                    <div className="col-span-full py-8 flex items-center gap-4">
                                        <div className="h-px flex-1 bg-indigo-600" />
                                        <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest px-2">Без отдела</span>
                                        <div className="h-px flex-1 bg-indigo-600" />
                                    </div>
                                )}
                                <div
                                    onClick={() => handleFormCardClick(form)}
                                    className="bg-white/90 backdrop-blur-sm border border-indigo-200/80 flex flex-col justify-between hover:border-indigo-400 transition-colors duration-200 shadow-sm group cursor-pointer"
                                >
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

                                        <div
                                            className="text-sm font-bold text-gray-600 uppercase tracking-tight leading-snug line-clamp-2"
                                            title={form.departments?.length > 0 ? form.departments.map((d: any) => d.name).join(', ') : 'БЕЗ ВЕДОМСТВА'}
                                        >
                                            {form.departments?.length > 0 ? form.departments.map((d: any) => d.name).join(', ') : 'БЕЗ ВЕДОМСТВА'}
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

                <EditFormModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedForm(null); }} departments={departments} form={selectedForm} />
            </div>
        </AuthenticatedLayout>
    );
}