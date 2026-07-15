import React, { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import { AddDepartment } from './AddDepartment';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { DepartmentRow } from './DepartmentRow';

interface DepartmentState {
    id: string | number;
    code: string;
    territory: string;
    name: string;
    state: number;
}

interface Version {
    id: number;
    name: string;
}

interface StatePageProps extends PageProps {
    state: DepartmentState[] | null;
    versions: Version[];
}

export default function Index({ state, versions }: StatePageProps) {
    const [selectedTerritory, setSelectedTerritory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<DepartmentState | null>(null);

    const { data, setData, put, delete: destroy, processing, reset } = useForm({
        code: '',
        version_id: '',
        name: '',
        territory: 'ekb',
        state: 0,
    });

    const territoryColor: Record<string, string> = {
        ekb: "bg-indigo-100 text-indigo-700 border border-indigo-200",
        krg: "bg-purple-100 text-purple-700 border border-purple-200",
    };

    const filteredState = useMemo(() => {
        if (!state) return [];
        return state.filter((dept) => {
            const matchTerritory = selectedTerritory === "all" || dept.territory === selectedTerritory;
            const matchSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchTerritory && matchSearch;
        });
    }, [state, selectedTerritory, searchQuery]);

    const handleUpdate = (e: React.FormEvent, id: string | number) => {
        e.preventDefault();
        // @ts-ignore
        put(route('state.update', id));
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
                    {/* Upper Filter Panel */}
                    <div className="bg-white border border-indigo-200/50 p-1.5 flex flex-col md:flex-row gap-2 justify-between items-stretch md:items-center shadow-sm">
                        <div className="flex flex-1 items-center justify-between">
                            <div className="text-3xl font-bold text-gray-900 uppercase tracking-tight flex items-center gap-1.5 shrink-0">
                                ШТАТНОЕ
                                <span className="text-indigo-600">[{filteredState.length}]</span>
                            </div>
                            <div className="relative flex-1 max-w-md mr-28">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="ПОИСК ПО ОТДЕЛУ..."
                                    className="w-full pl-2 pr-8 py-1 bg-gray-50/50 border border-gray-300 text-base font-mono font-bold text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-0 placeholder-gray-400 uppercase transition-colors"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 font-mono text-lg font-bold cursor-pointer">×</button>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-0.5 bg-white border border-gray-300 p-0.5 shrink-0">
                            {["all", "ekb", "krg"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedTerritory(t)}
                                    className={`uppercase px-2 py-1 text-sm font-mono font-bold tracking-wider transition-all duration-150 cursor-pointer ${selectedTerritory === t ? "bg-indigo-600 text-white border border-indigo-600" : "bg-white text-gray-600 border border-transparent hover:bg-gray-200"}`}
                                >
                                    {t === 'all' ? 'ВСЕ' : t === 'ekb' ? 'ЕКАТЕРИНБУРГ' : 'КУРГАН'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Div-based Table View */}
                    <div className="bg-white/90 backdrop-blur-sm border border-indigo-200/50 w-full overflow-hidden">
                        {/* Header */}
                        <div className="flex bg-indigo-50/80 border-b border-indigo-200/80 items-center">
                            <div className="w-24 px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 tracking-wider uppercase border-r border-indigo-200">КОД</div>
                            <div className="flex-1 px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 tracking-wider uppercase">ОТДЕЛ</div>
                            <div className="w-44 px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 tracking-wider uppercase text-right">ШТАТНОЕ</div>
                            {selectedTerritory === 'all' && (
                                <div className="w-40 px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 tracking-wider uppercase text-right">ТЕРРИТОРИЯ</div>
                            )}
                            <div className="w-24"></div>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col">
                            {filteredState.map((dept, index) => (
                                <DepartmentRow
                                    key={dept.id}
                                    dept={dept}
                                    index={index}
                                    versions={versions}
                                    territoryColor={territoryColor}
                                    showTerritory={selectedTerritory === 'all'}
                                    form={{ data, setData, processing }}
                                    handleUpdate={handleUpdate}
                                    onDelete={(d: any) => { setItemToDelete(d); setIsDeleting(true); }}
                                />
                            ))}
                            {filteredState.length === 0 && (
                                <div className="p-4 text-center border-t border-indigo-900/10">
                                    <div className="text-base font-bold text-gray-400 border border-dashed border-indigo-200 bg-white/50 py-2 uppercase tracking-widest font-mono">
                                        ДАННЫЕ ОТСУТСТВУЮТ
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isAdding && <AddDepartment handleCancel={() => setIsAdding(false)} />}
                <DeleteConfirmationModal show={isDeleting} onClose={() => { setIsDeleting(false); setItemToDelete(null); }} onConfirm={handleDeleteConfirm} item={itemToDelete} />

                <button onClick={() => setIsAdding(!isAdding)} className="fixed bottom-8 right-8 w-12 h-12 bg-indigo-600 text-white shadow-xl flex items-center justify-center text-5xl hover:bg-indigo-700 transition-all z-50 cursor-pointer">
                    +
                </button>
            </AuthenticatedLayout>
        </>
    );
}