import { useState, useMemo } from 'react';
import { Head, useForm, InertiaFormProps } from '@inertiajs/react';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/400.css';
////////////////////////////////////////////////////////////////
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Department } from '@/types';
import { AddDepartment } from './AddDepartment';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { DepartmentRow } from './DepartmentRow';

interface StatePageProps extends PageProps {
    departments: Department[] | null;
}

export default function Index({ departments }: StatePageProps) {
    // const [data.departments, setData] = useState<DepartmentState[]>(departments || []);
    const [selectedTerritory, setSelectedTerritory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Department | null>(null);

    const { put, setData, data } = useForm({
        departments: departments
    });


    const hasChanges = useMemo(() => {
        return JSON.stringify(data.departments) !== JSON.stringify(departments);
    }, [data.departments, departments]);

    const filteredState = useMemo(() => {
        if (!data.departments) return [];
        return data.departments.filter((dept) => {
            const matchTerritory = selectedTerritory === "all" || dept.territory === selectedTerritory;
            const matchSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchTerritory && matchSearch;
        });
    }, [data.departments, selectedTerritory, searchQuery]);

    const handleApply = () => {
        put(route('state.update'));
    };

    const handleReset = () => {
        setData({ departments: departments || [] });
    };

    const handleDeleteConfirm = () => {
        if (!itemToDelete) return;
        // @ts-ignore
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
                            <div className="text-3xl font-bold text-gray-900 uppercase tracking-tight">
                                ШТАТНОЕ <span className="text-indigo-600">[{filteredState.length}]</span>
                            </div>
                            <div className="relative flex-1 max-w-md mr-28">
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

                    <div className="bg-white/90 backdrop-blur-sm border border-indigo-200/50 w-full overflow-hidden">
                        <div className="flex bg-indigo-50/80 border-b border-indigo-200/80 items-center">
                            <div className="w-24 px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 border-r border-indigo-200">КОД</div>
                            <div className="flex-1 px-1.5 py-1 text-sm font-mono font-bold text-indigo-700">ОТДЕЛ</div>
                            <div className="w-24 px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 text-right">ШТАТНОЕ</div>
                            <div className="w-40 px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 text-right">ТЕРРИТОРИЯ</div>
                            <div className="w-24"></div>
                        </div>
                        <div className="flex flex-col">
                            {filteredState.map((dept, index) => (
                                <DepartmentRow
                                    key={dept.id}
                                    dept={dept}
                                    index={index}
                                    setData={setData}
                                    onDelete={(d) => { setItemToDelete(d); setIsDeleting(true); }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {isAdding && <AddDepartment handleCancel={() => setIsAdding(false)} />}
                <DeleteConfirmationModal show={isDeleting} onClose={() => { setIsDeleting(false); setItemToDelete(null); }} onConfirm={handleDeleteConfirm} item={itemToDelete} />

                <button onClick={() => setIsAdding(!isAdding)} className="fixed bottom-8 right-8 w-12 h-12 bg-indigo-600 text-white shadow-xl flex items-center justify-center text-5xl hover:bg-indigo-700 transition-all z-50 cursor-pointer">
                    +
                </button>

                {hasChanges && (
                    <div className="fixed bottom-24 right-8 z-50 bg-white border border-indigo-600 shadow-2xl p-4 flex gap-2">
                        <button onClick={handleReset} className="bg-gray-200 px-4 py-2 font-bold cursor-pointer">отменить</button>
                        <button onClick={handleApply} className="bg-indigo-600 text-white px-4 py-2 font-bold cursor-pointer">применить</button>
                    </div>
                )}
            </AuthenticatedLayout>
        </>
    );
}