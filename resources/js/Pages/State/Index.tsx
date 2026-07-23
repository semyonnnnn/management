import { useState, useMemo, useEffect, useCallback } from 'react';
import { Head, useForm } from '@inertiajs/react';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/400.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Department } from '@/types';
import { AddDepartment } from './AddDepartment';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { DepartmentRow } from './DepartmentRow';
import { FlashMessage } from '@/components/custom/FlashMessage';
import { DatePicker } from '@/components/custom/DatePicker';

interface StatePageProps extends PageProps {
    departments: Department[] | null;
    date: string | null;
}

export default function Index({ departments, date: initialDate }: StatePageProps) {
    const [localDepartments, setLocalDepartments] = useState<Department[]>([]);
    const [localDate, setLocalDate] = useState<string | null>(initialDate || null);
    const [selectedTerritory, setSelectedTerritory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Department | null>(null);

    const [localErrors, setLocalErrors] = useState<Record<string, Record<string, string>>>({});

    const { put, delete: destroy, setData, data, errors, processing } = useForm<{
        departments: Department[];
        date: string | null;
    }>({
        departments: [],
        date: null,
    });

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const mapped: Record<string, Record<string, string>> = {};
            const errorsRecord = errors as Record<string, string>;

            Object.keys(errorsRecord).forEach((key) => {
                const match = key.match(/^departments\.(\d+)\.(.+)$/);
                if (match) {
                    const index = parseInt(match[1], 10);
                    const field = match[2];
                    const dept = data.departments[index];
                    if (dept) {
                        if (!mapped[dept.id]) {
                            mapped[dept.id] = {};
                        }
                        mapped[dept.id][field] = errorsRecord[key];
                    }
                }
            });
            setLocalErrors(mapped);
        } else {
            setLocalErrors({});
        }
    }, [errors, data.departments]);

    useEffect(() => {
        if (departments) {
            setLocalDepartments(prevLocal => {
                if (data.departments.length > 0) {
                    return prevLocal.map(localDept => {
                        const incoming = departments.find(d => d.id === localDept.id);
                        const isDirty = data.departments.some(d => d.id === localDept.id);
                        return isDirty ? localDept : (incoming || localDept);
                    });
                }
                return departments;
            });
        } else {
            setLocalDepartments([]);
        }
    }, [departments, data.departments]);

    useEffect(() => {
        setLocalDate(initialDate || null);
    }, [initialDate]);

    const handleDateChange = (newDate: string | undefined) => {
        const updatedDate = newDate || null;
        setLocalDate(updatedDate);

        if (initialDate !== updatedDate) {
            setData('date', updatedDate);
        } else {
            setData('date', null);
        }
    };

    // Memoized to retain referential stability and prevent re-rendering unaffected children
    const handleDepartmentChange = useCallback((updatedDept: Department) => {
        setLocalDepartments(prevLocal => {
            const nextLocal = prevLocal.map(d => d.id === updatedDept.id ? updatedDept : d);
            const originalList = departments || [];

            const diffOnly = nextLocal.filter(localDept => {
                const originalDept = originalList.find(d => d.id === localDept.id);
                if (!originalDept) return true;
                return JSON.stringify(localDept) !== JSON.stringify(originalDept);
            });

            setData('departments', diffOnly);
            return nextLocal;
        });

        setLocalErrors(prev => {
            if (prev[updatedDept.id]) {
                const copy = { ...prev };
                delete copy[updatedDept.id];
                return copy;
            }
            return prev;
        });
    }, [departments, setData]);

    // Extracted into a stable callback rather than an inline anonymous function
    const handleDeleteClick = useCallback((d: Department) => {
        setItemToDelete(d);
        setIsDeleting(true);
    }, []);

    const hasChanges = useMemo(() => {
        return data.departments.length > 0 || data.date !== null;
    }, [data.departments, data.date]);

    const changes = data.departments?.length + (data.date ? 1 : 0);

    const filteredState = useMemo(() => {
        return localDepartments.filter((dept) => {
            const matchTerritory = selectedTerritory === "all" || dept.territory === selectedTerritory;
            const matchSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchTerritory && matchSearch;
        });
    }, [localDepartments, selectedTerritory, searchQuery]);

    const handleSubmit = () => {
        put(route('state.update'), {
            onSuccess: () => {
                setData('departments', []);
                setData('date', null);
                setLocalErrors({});
            }
        });
    };

    const handleCancel = () => {
        setLocalDepartments(departments || []);
        setLocalDate(initialDate || null);
        setData('departments', []);
        setData('date', null);
        setLocalErrors({});
    };

    const handleDeleteConfirm = () => {
        if (!itemToDelete) return;
        destroy(route('state.destroy', itemToDelete.id), {
            onSuccess: () => {
                setIsDeleting(false);
                setItemToDelete(null);
            }
        });
    };

    return (
        <>
            <Head title="Штатное" />
            <AuthenticatedLayout>
                <div className="space-y-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    <div className="bg-white border border-indigo-200/50 p-1.5 flex flex-col md:flex-row gap-2 justify-between items-stretch shadow-sm">
                        <div className="flex flex-1 items-center justify-between">
                            <div className='flex gap-4'>
                                <div className="text-3xl font-bold text-gray-900 uppercase tracking-tight">
                                    ШТАТНОЕ <span className="text-indigo-600">[{filteredState.length}]</span>
                                </div>
                                <DatePicker date={localDate} setDate={handleDateChange} className='w-fit!' />
                            </div>
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="ПОИСК ПО ОТДЕЛУ..."
                                    className="w-full pl-2 pr-8 py-1 bg-gray-50/50 border border-gray-300 text-base font-mono font-bold text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-0 uppercase transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex gap-0.5 bg-white border border-gray-300 p-0.5">
                            {["all", "ekb", "krg"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedTerritory(t)}
                                    className={`uppercase px-2 py-1 text-sm font-mono font-bold tracking-wider cursor-pointer ${selectedTerritory === t ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-200"}`}
                                >
                                    {t === 'all' ? 'ВСЕ' : t === 'ekb' ? 'ЕКАТЕРИНБУРГ' : 'КУРГАН'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/90 uppercase backdrop-blur-sm border border-indigo-200/50 w-full overflow-hidden">
                        <div className="flex bg-indigo-50/80 border-b border-indigo-200/80 items-center">
                            <div className="w-24 px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 border-r border-indigo-200">КОД</div>
                            <div className="flex-1 px-1.5 py-1 text-sm font-mono font-bold text-indigo-700">ОТДЕЛ</div>
                            <div className="w-24 px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 text-right border-r">ШТАТНОЕ</div>
                            <div className="w-40 px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 text-right">ТЕРРИТОРИЯ</div>
                            <div className="w-24"></div>
                        </div>
                        <div className="flex flex-col">
                            {filteredState.map((dept, index) => (
                                <DepartmentRow
                                    key={dept.id}
                                    dept={dept}
                                    index={index}
                                    onDeptChange={handleDepartmentChange}
                                    onDelete={handleDeleteClick}
                                    // Notice: passing undefined instead of {} prevents object reference churning
                                    rowErrors={localErrors[dept.id]}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <FlashMessage />

                <AddDepartment
                    isOpen={isAdding}
                    handleCancel={() => setIsAdding(false)}
                />
                <DeleteConfirmationModal show={isDeleting} onClose={() => { setIsDeleting(false); setItemToDelete(null); }} onConfirm={handleDeleteConfirm} item={itemToDelete} />

                <button onClick={() => setIsAdding(!isAdding)} className="fixed bottom-8 right-8 w-12 h-12 bg-indigo-600 text-white shadow-xl flex items-center justify-center text-5xl hover:bg-indigo-700 transition-all z-50 cursor-pointer">
                    +
                </button>

                {hasChanges && (
                    <div className="fixed bottom-4 right-4 bg-white border border-slate-300 p-4 shadow-xl z-50">
                        <div className="text-lg font-bold uppercase mb-2">Изменения [{changes}]</div>
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
            </AuthenticatedLayout>
        </>
    );
}