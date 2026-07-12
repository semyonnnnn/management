import React, { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import { AddDepartment } from './AddDepartment';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface DepartmentState {
    id: string | number;
    code: string;
    okud: string;
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
    versions: Version[]; // Added versions array coming from backend/Inertia
}

export default function Index({ state, versions }: StatePageProps) {
    const [selectedTerritory, setSelectedTerritory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<DepartmentState | null>(null);

    // TRACKS CURRENT ACTIVE EDIT ID
    const [editingId, setEditingId] = useState<string | number | null>(null);

    const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
        code: '',
        version_id: '', // Used version_id for consistency with backend
        name: '',
        territory: 'ekb',
        state: 0,
    });

    const territoryColor = {
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

    // MAPS ROW VALUES TO FORM OBJECT AND TRIGGERS INPUTS
    const startEditing = (dept: DepartmentState) => {
        setEditingId(dept.id);
        setData({
            code: dept.code,
            version_id: dept.okud || '', // Bound backend version context
            name: dept.name,
            territory: dept.territory,
            state: dept.state,
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        reset();
    };

    // SUBMITS TO PUT ROUTE
    const handleUpdate = (e: React.FormEvent, id: string | number) => {
        e.preventDefault();
        put(route('state.update', id), {
            onSuccess: () => {
                setEditingId(null);
                reset();
            }
        });
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('state.create'), {
            onSuccess: () => {
                reset();
                setIsAdding(false);
            }
        });
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

                    {/* Table View */}
                    <div className="bg-white/90 backdrop-blur-sm border border-indigo-200/50">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-indigo-50/80 border-b border-indigo-200/80">
                                    <tr className="align-bottom">
                                        <th className="text-left px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 tracking-wider uppercase border-r border-indigo-200 w-24">КОД</th>
                                        <th className="text-left px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 tracking-wider uppercase border-r border-indigo-200 w-32">ОКУД</th>
                                        <th className="text-left px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 tracking-wider uppercase">ОТДЕЛ</th>
                                        <th className="text-right px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 tracking-wider uppercase w-44">ШТАТНОЕ</th>
                                        {selectedTerritory === 'all' && (
                                            <th className="text-right px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 tracking-wider uppercase w-40">ТЕРРИТОРИЯ</th>
                                        )}
                                        <th className="w-24"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredState.map((dept, index) => {
                                        const isRowEditing = editingId === dept.id;
                                        return (
                                            <tr
                                                key={dept.id}
                                                className={`border-b border-indigo-900/10 transition-colors hover:bg-indigo-50/50 ${index % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}`}
                                            >
                                                {/* CODE */}
                                                <td className="px-1.5 py-1 text-base font-bold text-indigo-700 leading-none align-middle border-r border-indigo-200 bg-indigo-50/30">
                                                    {dept.code}
                                                </td>

                                                {/* OKUD FIELD INPUT */}
                                                <td className="px-1.5 py-1 text-base font-bold text-gray-700 leading-none align-middle border-r border-indigo-200">
                                                    {isRowEditing ? (
                                                        <select
                                                            value={data.version_id}
                                                            onChange={(e) => setData('version_id', e.target.value)}
                                                            className="w-full px-1 py-0.5 font-mono text-sm font-bold border border-indigo-400 bg-white text-gray-900 focus:outline-none focus:ring-0"
                                                        >
                                                            <option value="" disabled>Выберите...</option>
                                                            {versions?.map(version => (
                                                                <option key={version.id} value={version.id}>
                                                                    {version.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        dept.okud || '—'
                                                    )}
                                                </td>

                                                {/* NAME */}
                                                <td className="px-1.5 py-1 text-base font-bold text-gray-900 leading-none align-middle">
                                                    {dept.name}
                                                </td>

                                                {/* STATE FIELD INPUT */}
                                                <td className="px-1.5 py-1 text-right align-middle">
                                                    {isRowEditing ? (
                                                        <div className="inline-flex items-center justify-end w-full">
                                                            <input
                                                                type="number"
                                                                value={data.state}
                                                                onChange={(e) => setData('state', parseInt(e.target.value) || 0)}
                                                                className="w-20 px-1 py-0.5 text-right font-mono text-sm font-bold border border-indigo-400 bg-white text-indigo-900 focus:outline-none focus:ring-0"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center justify-center bg-indigo-50/80 border border-indigo-200 px-2 py-0 min-w-10">
                                                            <span className="font-mono text-xl font-bold text-indigo-800 leading-none">
                                                                {dept.state}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* TERRITORY */}
                                                {selectedTerritory === 'all' && (
                                                    <td className="px-1.5 py-1 align-middle flex justify-end">
                                                        <div className={`px-2 py-0.5 text-[11px] font-mono font-bold tracking-wider uppercase text-left w-fit ${territoryColor[dept.territory as keyof typeof territoryColor] || "bg-gray-200 text-gray-800"}`}>
                                                            {dept.territory === "ekb" ? "ЕКАТЕРИНБУРГ" : dept.territory === "krg" ? "КУРГАН" : dept.territory}
                                                        </div>
                                                    </td>
                                                )}

                                                {/* CONTROLS SWITCH */}
                                                <td className="px-1.5 py-1 text-right align-middle whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {isRowEditing ? (
                                                            <>
                                                                <button
                                                                    onClick={(e) => handleUpdate(e, dept.id)}
                                                                    disabled={processing}
                                                                    className="px-1.5 py-0.5 bg-emerald-600 border border-emerald-700 text-white hover:bg-emerald-700 text-xs font-bold cursor-pointer uppercase transition-all"
                                                                >
                                                                    ОК
                                                                </button>
                                                                <button
                                                                    onClick={cancelEditing}
                                                                    className="px-1.5 py-0.5 bg-gray-500 border border-gray-600 text-white hover:bg-gray-600 text-xs font-bold cursor-pointer uppercase transition-all"
                                                                >
                                                                    ОТМЕНА
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => startEditing(dept)}
                                                                    className="w-7 h-7 flex items-center justify-center bg-indigo-50 border border-indigo-300 text-indigo-600 hover:bg-indigo-100 transition-all cursor-pointer font-bold text-xs"
                                                                >
                                                                    РЕД.
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setItemToDelete(dept);
                                                                        setIsDeleting(true);
                                                                    }}
                                                                    className="w-7 h-7 flex items-center justify-center bg-pink-100 border border-red-300 text-red-600 hover:bg-pink-200 transition-all cursor-pointer font-bold"
                                                                >
                                                                    ×
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredState.length === 0 && (
                                        <tr>
                                            <td colSpan={selectedTerritory === 'all' ? 6 : 5} className="p-4 text-center">
                                                <div className="text-base font-bold text-gray-400 border border-dashed border-indigo-200 bg-white/50 py-2 uppercase tracking-widest font-mono">
                                                    ДАННЫЕ ОТСУТСТВУЮТ
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {isAdding && (
                        <AddDepartment
                            handleCancel={() => {
                                reset();
                                setIsAdding(false);
                            }}
                            data={data}
                            setData={setData}
                            // Remove or comment out the versions line below:
                            // versions={versions} 
                            processing={processing}
                            handleAdd={handleAdd}
                        />
                    )}
                </div>

                <DeleteConfirmationModal
                    show={isDeleting}
                    onClose={() => {
                        setIsDeleting(false);
                        setItemToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    item={itemToDelete}
                />

                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="fixed bottom-8 right-8 w-12 h-12 bg-indigo-600 text-white shadow-xl flex items-center justify-center text-5xl hover:bg-indigo-700 transition-all z-50 cursor-pointer"
                >
                    +
                </button>
            </AuthenticatedLayout>
        </>
    );
}