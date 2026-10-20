import { useState, useEffect, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import { AddFormModal } from './AddFormModal';
import { FormRow } from './FormRow';
import { DepartmentsModal } from './DepartmentsModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FlashMessage } from '@/components/custom/FlashMessage';
import { Confirmation } from './Partials/Confirmation';
import { EmptyActions } from '@/components/custom/EmptyAction';
import { Search } from '@/components/custom/Search';
import { NotFound } from '@/components/custom/NotFound';
import { Pagination } from '@/components/custom/Pagination';
import { SyncButton } from '@/components/custom/SyncButton';
import { SyncTimestamp } from '@/components/custom/SyncTimestamp';

export interface FormDepartment {
    code: string;                // string, not number: values like "9к" and "20ке" exist
    name: string;
    territory: 'ekb' | 'krg';    // same two values DeptTable uses for its badge colors
}

export interface FormItem {
    id: number;
    okud: string;
    name: string;
    period: 'годовая' | 'полугодовая' | 'квартальная' | 'месячная';
    indicators: number;
    k1: number;
    k2: number;
    k3: number;
    k4: number;
    k5: number;
    k6: number;
    reports_count: number;
    is_consolidated: boolean;
    departments: FormDepartment[];  // empty array when the form has no departments
    created_at: string;             // ISO strings, because JSON has no Date type
    updated_at: string;
}

// Exported so FormRow and DepartmentsModal use this exact type instead of keeping copies.
// Every field redeclared below with a different type must be listed in Omit.
export interface LocalFormItem extends Omit<FormItem, 'period' | 'indicators' | 'k1' | 'k2' | 'k3' | 'k4' | 'k5' | 'k6'> {
    okud: string;
    period: string;
    indicators: string;
    k1: string;
    k2: string;
    k3: string;
    k4: string;
    k5: string;
    k6: string;
    reports_count: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    forms: {
        data: FormItem[];
        total: number;
        links: PaginationLink[];
    };
    filters: {
        search?: string;
        territory?: string;
    };
    periods: ('годовая' | 'полугодовая' | 'квартальная' | 'месячная')[];
    isEmpty: boolean;
    timestamp: string;
}

export default function Index({ forms, filters, periods, isEmpty, timestamp }: Props) {
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [formToDelete, setFormToDelete] = useState<LocalFormItem | null>(null);
    const [localForms, setLocalForms] = useState<LocalFormItem[]>([]);
    const [initialForms, setInitialForms] = useState<FormItem[]>(forms.data);

    // Store only the id of the form whose departments are open, not the form object.
    // An object copy would go stale after edits or a reload; an id is re-resolved
    // from localForms on every render (see selectedForm below).
    const [selectedFormId, setSelectedFormId] = useState<number | null>(null);

    const { setData, put, processing, reset, delete: destroy } = useForm<{ forms: any[] }>({
        forms: [],
    });

    // Separate useForm instance for the upload — kept independent from the
    // row-editing 'forms' useForm above so uploading a file can never
    // collide with (or get wiped by) in-progress row edits.
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { processing: uploadProcessing } = useForm<{ file: File | null }>({
        file: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;

        // Use router.post directly to pass the file payload synchronously
        router.post(route('forms.upload'), { file }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

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
            ...item, // carries `departments` along into local state
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
            reports_count: item.reports_count,
            is_consolidated: !!item.is_consolidated,
        }));
    };

    useEffect(() => {
        setLocalForms(mapToLocalState(forms.data));
        setInitialForms(forms.data);
    }, [forms.data]);

    const applyFilters = (search: string) => {
        router.get(
            window.location.pathname,
            {
                search: search || undefined,
                // keep the territory filter: undefined values are omitted from the URL by Inertia
                territory: filters.territory || undefined,
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
            current.reports_count !== original.reports_count ||
            current.is_consolidated !== !!original.is_consolidated
        );
    };

    // Helper function to calculate all changed items consistently
    const getChangedForms = (currentLocalForms: LocalFormItem[]) => {
        return currentLocalForms
            .filter(current => {
                const original = initialForms.find(f => f.id === current.id);
                if (!original) return false;
                return isFormChanged(current, original);
            })
            // `departments` is display-only, so it is stripped from the PUT /forms payload
            .map(({ departments, ...form }) => ({
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

        setLocalForms(prevLocalForms => {
            const updatedLocal = prevLocalForms.map(form =>
                form.id === id ? { ...form, [field]: value } : form
            );

            // Calculate and sync changes using the freshly updated local array state
            const changedItems = getChangedForms(updatedLocal);
            setData('forms', changedItems);

            return updatedLocal;
        });
    };

    const handleDelete = (form: LocalFormItem) => {
        setFormToDelete(form);
    };

    const confirmDelete = () => {
        if (!formToDelete) return;

        const targetId = formToDelete.id;

        setLocalForms(prevForms => {
            const nextForms = prevForms.filter(f => f.id !== targetId);
            setData('forms', getChangedForms(nextForms));
            return nextForms;
        });

        setInitialForms(prevInitial => prevInitial.filter(f => f.id !== targetId));
        setFormToDelete(null);

        destroy(route('forms.delete', { id: targetId }), {
            preserveScroll: true,
        });
    };

    const changedFormsList = getChangedForms(localForms);
    const hasChanges = changedFormsList.length > 0;

    const filteredForms = localForms.filter(form =>
        form.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (form.okud !== null && form.okud !== undefined && String(form.okud).includes(searchQuery.trim()))
    );

    // Resolved from the id on every render. If the form disappears (deleted, page
    // changed), this becomes null and the modal closes by itself.
    const selectedForm = localForms.find(f => f.id === selectedFormId) ?? null;

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

    const displayQuery = searchQuery.length > 20 ? `${searchQuery.slice(0, 20)}…` : searchQuery;

    const canRenderPagination = (filteredForms.length > 0) && !isEmpty;

    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                <div className="flex gap-40 items-center justify-between py-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl text-nowrap font-bold text-slate-900 tracking-tight">
                            РЕДАКТОР ФОРМ <span className="text-indigo-600">[{forms.total}]</span>
                        </h1>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-3 py-2 text-nowrap bg-indigo-600 text-white text-md font-bold uppercase hover:bg-indigo-700 cursor-pointer"
                        >
                            + Создать форму
                        </button>

                        <SyncButton />
                        <SyncTimestamp
                            timestamp={timestamp}
                        />
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={uploadProcessing}
                        />
                        <button
                            type="button"
                            disabled={uploadProcessing}
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-2 text-nowrap bg-emerald-600 text-white text-md font-bold uppercase hover:bg-emerald-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploadProcessing ? 'Загрузка...' : 'Импорт из файла'}
                        </button>
                    </div>

                    <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder='поиск по форме' />
                </div>

                <div className="border border-slate-300 overflow-x-auto custom-scrollbar">
                    <div className="min-w-max flex border-b border-slate-300 bg-slate-100 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                        <div className={`w-28 shrink-0 p-2 ${borderRightSlate300} text-center bg-sky-200/80 text-sky-900`}>
                            ОКУД
                        </div>
                        <div className={`flex-1 min-w-[320px] px-3 py-2 ${borderRightSlate300} bg-orange-200/70 text-orange-900`}>
                            Наименование формы
                        </div>
                        {/* Departments header: w-24 must match the cell width in FormRow */}
                        <div className={`w-24 shrink-0 p-2 ${borderRightSlate300} text-center bg-orange-100/80 text-orange-900`}>
                            отделы
                        </div>
                        <div className={`w-36 px-3 py-2 ${borderRightSlate300} bg-cyan-200/70 text-cyan-900`}>
                            Количество отчётов
                        </div>
                        <div className={`w-40 shrink-0 p-2 ${borderRightSlate300} text-center bg-emerald-200/60 text-emerald-900`}>
                            Период
                        </div>
                        <div className={`w-40 shrink-0 p-2 ${borderRightSlate300} text-center bg-rose-200/70 text-rose-900`}>
                            Показателей в форме
                        </div>

                        {['K1', 'K2', 'K3', 'K4', 'K5', 'K6'].map((k) => (
                            <div key={k} className={`w-20 shrink-0 p-2 ${borderRightSlate200} text-center`}>
                                {k}
                            </div>
                        ))}

                        <div className="w-20 shrink-0 p-2 text-center text-slate-600 font-bold uppercase">
                            действие
                        </div>
                    </div>

                    <div className="min-w-max divide-y divide-slate-200">
                        {filteredForms.map((form, rowIndex) => (
                            <FormRow
                                key={form.id}
                                form={form}
                                rowIndex={rowIndex}
                                periods={periods}
                                handleInputChange={handleInputChange}
                                onDelete={handleDelete}
                                // the state setter is stable between renders, which matters
                                // because FormRow's memo comparator ignores handler props
                                onShowDepartments={setSelectedFormId}
                                inputCellClasses={inputCellClasses}
                                borderRightSlate300={borderRightSlate300}
                                borderRightSlate200={borderRightSlate200}
                            />
                        ))}
                        {isEmpty && <div className="flex min-h-162.5 items-center justify-center">
                            <EmptyActions route_path='forms.upload' warning="таблица форм пуста" onAddButtonClick={() => setIsAddModalOpen(true)} />
                        </div>}
                        {(!isEmpty && filteredForms.length == 0) && (
                            <NotFound warning={`форма '${displayQuery}' не найдена!`} />
                        )}
                    </div>
                </div>

                <Pagination links={forms.links} isVisible={canRenderPagination} />

                <FlashMessage />

                <AddFormModal periods={periods} isConsolidated={true} isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

                {/* One modal for the whole table, not one per row */}
                <DepartmentsModal
                    form={selectedForm}
                    onClose={() => setSelectedFormId(null)}
                />

                <Confirmation
                    show={!!formToDelete}
                    onClose={() => setFormToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Удаление формы"
                    message={`Вы действительно хотите удалить форму "${formToDelete?.name || ''}"?`}
                />

                {hasChanges && (
                    <div className="fixed bottom-4 right-4 bg-white border border-slate-300 p-4 shadow-xl z-50">
                        <div className="text-lg font-bold uppercase mb-2">Изменения [{changedFormsList.length}]</div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="bg-gray-200 px-4 py-2 font-bold cursor-pointer text-2xl"
                            >
                                отменить
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="bg-indigo-600 text-white px-4 py-2 font-bold cursor-pointer text-2xl"
                            >
                                {processing ? 'Сохранение...' : 'применить'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}