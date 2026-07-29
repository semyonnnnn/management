import React, { useState, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/400.css';
import { EditFormDistributionModal } from './EditFormDistributionModal';
import { MinDep, ExtendedPageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormList } from './Partials/FormList';

export default function Index({ departments, forms, filters }: ExtendedPageProps) {
    const [selectedTerritory, setSelectedTerritory] = useState<string>(filters.territory || 'all');
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedForm, setSelectedForm] = useState<any | null>(null);
    const [expandedForms, setExpandedForms] = useState<Record<string | number, boolean>>({});

    // 2. USEFORM DATA TRACKING (exclusively for sending to Route::put('/forms_distribution'))
    const { data, setData, put, processing } = useForm({
        form_id: null as any,
        departments: departments as MinDep[],
    });

    const toggleFormExpand = (formId: number) => {
        setExpandedForms(prev => ({
            ...prev,
            [formId]: !prev[formId]
        }));
    };

    // Trigger backend update via Inertia PUT request
    const handleSaveBackend = (formId: number, deptValues: MinDep[]) => {
        setData((prev: { form_id: any; departments: MinDep[] }) => ({
            ...prev,
            form_id: formId,
            departments: deptValues as MinDep[],
        }));

        // Execute the PUT request with the updated payload
        put(route('forms_distribution.update'), {
            preserveScroll: true,
        });
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
        e.stopPropagation();
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

                        return (
                            <FormList
                                key={form.id}
                                isExpanded={isExpanded}
                                toggleFormExpand={toggleFormExpand}
                                form={form}
                                allDepartments={departments}
                                onOpenEditModal={handleOpenEditModal}
                                onSaveBackend={handleSaveBackend}
                                processing={processing}
                            />
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