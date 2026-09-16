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
import { Search } from '@/components/custom/Search';
import { EmptyActions } from '@/components/custom/EmptyAction';
import { NotFound } from '@/components/custom/NotFound';
import { Pagination } from '@/components/custom/Pagination';

// Helper to translate default Laravel pagination labels
const translatePaginationLabel = (label: string): string => {
    if (label.includes('Previous')) return '&laquo; Назад';
    if (label.includes('Next')) return 'Вперед &raquo;';
    return label;
};

export default function Index({ departments, forms, filters, links, isEmpty }: ExtendedPageProps) {
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

    const displayQuery = searchQuery.length > 20 ? `${searchQuery.slice(0, 20)}…` : searchQuery;
    const canRenderPagination = (sortedForms.length > 0) && !isEmpty;

    return (
        <AuthenticatedLayout>
            <div className="space-y-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {/* Search and Filters Header */}
                <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder='поиск по форме' />

                {/* Accordion Forms List */}
                <div className="space-y-1 border border-slate-300 min-h-fit">
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
                    {isEmpty && <EmptyActions route_path='forms.upload' warning="таблица распределения форм пуста" onAddButtonClick={() => { }} isManualOptional={true} />}

                    {!isEmpty && sortedForms.length === 0 && <NotFound warning={`форма '${displayQuery}' не найдена!`} />}
                </div>


                <Pagination links={forms.links} isVisible={canRenderPagination} />

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