import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/400.css';
/////////////////////////////////////////////
import { EditFormDistributionModal } from './EditFormDistributionModal';
import { ExtendedPageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormDepartmentsList } from './Partials/FormDepartmentList';

export default function Index({ departments, forms, filters }: ExtendedPageProps) {
    const [selectedTerritory, setSelectedTerritory] = useState<string>(filters.territory || 'all');
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedForm, setSelectedForm] = useState<any | null>(null);

    // State to track which form accordions are expanded
    const [expandedForms, setExpandedForms] = useState<Record<string | number, boolean>>({});

    const toggleFormExpand = (formId: string | number) => {
        setExpandedForms(prev => ({
            ...prev,
            [formId]: !prev[formId]
        }));
    };

    const sortedForms = [...forms.data].sort((a, b) => {
        const aHas = (a.departments && a.departments.length > 0);
        const bHas = (b.departments && b.departments.length > 0);
        if (aHas === bHas) return 0;
        return aHas ? -1 : 1;
    });

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

    const handleOpenEditModal = (e: React.MouseEvent, form: any) => {
        e.stopPropagation(); // Prevents toggling accordion expand when clicking +
        setSelectedForm(form);
        setIsEditModalOpen(true);
    };

    return (
        <AuthenticatedLayout>
            <div className="space-y-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {/* Search and Filters Header */}
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

                {/* Accordion Forms List */}
                <div className="space-y-3">
                    {sortedForms.map((form) => {
                        const isExpanded = !!expandedForms[form.id];
                        const hasDepartments = form.departments && form.departments.length > 0;

                        return (
                            <div
                                key={form.id}
                                className="border border-gray-300 bg-white shadow-sm overflow-hidden transition-all duration-150"
                            >
                                {/* Main Form Bar (Matching top rows in your sketch) */}
                                <div
                                    onClick={() => toggleFormExpand(form.id)}
                                    className="flex items-stretch justify-between cursor-pointer bg-white hover:bg-indigo-50/40 transition-colors group select-none min-h-12"
                                >
                                    <div className="flex items-center flex-1 min-w-0">
                                        {/* OKUD / Code Badge */}
                                        <div className="px-4 py-3 bg-gray-100 border-r border-gray-300 text-xs font-mono font-bold text-gray-700 shrink-0 uppercase tracking-tight min-w-25 text-center flex items-center justify-center">
                                            {form.okud || form.code || `ОКУД: ${form.id}`}
                                        </div>

                                        {/* Form Name */}
                                        <div className="px-4 py-3 text-sm font-mono font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                                            {form.name}
                                        </div>
                                    </div>

                                    {/* Action Buttons Right Side */}
                                    <div className="flex items-center gap-2 pr-3 shrink-0">

                                        {/* Accordion Toggle Indicator */}
                                        <div className="w-8 h-8 flex items-center justify-center text-gray-600 group-hover:text-indigo-600 font-mono text-xs">
                                            {isExpanded ? '▲' : '▼'}
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <FormDepartmentsList form={form} onOpenEditModal={handleOpenEditModal} />
                                )}
                            </div>
                        );
                    })}
                </div>

                <EditFormDistributionModal
                    isOpen={isEditModalOpen}
                    onClose={() => { setIsEditModalOpen(false); setSelectedForm(null); }}
                    departments={departments}
                    form={selectedForm}
                />
            </div>
        </AuthenticatedLayout>
    );
}