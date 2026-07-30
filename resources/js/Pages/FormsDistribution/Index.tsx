import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/400.css';
////////////////////////////////////////////////////
import { EditFormDistributionModal } from './EditFormDistributionModal';
import { ExtendedPageProps, PaginationLink } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormList } from './Partials/FormList';
import { FlashMessage } from '@/components/custom/FlashMessage';

// Helper to translate default Laravel pagination labels
const translatePaginationLabel = (label: string): string => {
    if (label.includes('Previous')) return '&laquo; Назад';
    if (label.includes('Next')) return 'Вперед &raquo;';
    return label;
};

export default function Index({ departments, forms, filters, links }: ExtendedPageProps) {
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedForm, setSelectedForm] = useState<any | null>(null);
    const [expandedFormId, setExpandedFormId] = useState<number | null>();

    // Support links from either top-level prop or nested forms object
    const paginationLinks = links || forms?.links || [];

    const toggleFormExpand = (formId: number) => {
        setExpandedFormId(prev => (prev === formId ? null : formId));
    };

    const sortedForms = [...forms.data].sort((a, b) => {
        const aHas = (a.departments && a.departments.length > 0);
        const bHas = (b.departments && b.departments.length > 0);
        if (aHas === bHas) return 0;
        return aHas ? -1 : 1;
    });

    const applyFilters = (search: string) => {
        router.get(
            window.location.pathname,
            {
                search: search || undefined,
            },
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
                                placeholder="Поиск по форме..."
                                className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-300 text-sm font-mono font-bold text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-0 placeholder-gray-400/70 transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(''); applyFilters(''); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-mono text-xs uppercase font-bold cursor-pointer"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Accordion Forms List */}
                <div className="space-y-3">
                    {sortedForms.map((form, index) => {
                        const isExpanded = expandedFormId === form.id;

                        return (
                            <FormList
                                index={index}
                                key={form.id}
                                isExpanded={isExpanded}
                                toggleFormExpand={toggleFormExpand}
                                form={form}
                                allDepartments={departments}
                            />
                        );
                    })}
                </div>

                {/* Pagination Controls */}
                {paginationLinks && paginationLinks.length > 3 && (
                    <div className="bg-white border border-slate-300 p-2 flex justify-center items-center shadow-sm">
                        <div className="flex gap-1">
                            {paginationLinks.map((link: any, k: number) => {
                                const translatedLabel = translatePaginationLabel(link.label);
                                if (link.url === null) {
                                    return (
                                        <div
                                            key={k}
                                            className="px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-50 border border-slate-200 select-none flex items-center"
                                            dangerouslySetInnerHTML={{ __html: translatedLabel }}
                                        />
                                    );
                                }
                                return (
                                    <button
                                        key={k}
                                        onClick={() => router.get(link.url!, {}, { preserveState: true, preserveScroll: true })}
                                        className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer border ${link.active
                                            ? 'bg-indigo-600 border-indigo-600 text-white'
                                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: translatedLabel }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                <FlashMessage />

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