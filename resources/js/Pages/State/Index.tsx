import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';

interface DepartmentState {
    id: string | number;
    territory: string;
    name: string;
    state: number;
}

interface StatePageProps extends PageProps {
    state: DepartmentState[];
}

export default function Index({ state }: StatePageProps) {
    const [selectedTerritory, setSelectedTerritory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const territoryColor = {
        ekb: "bg-indigo-100 text-indigo-700 border border-indigo-200",
        krg: "bg-purple-100 text-purple-700 border border-purple-200",
    };

    const filteredState = useMemo(() => {
        return state.filter((dept) => {
            const matchTerritory = selectedTerritory === "all" || dept.territory === selectedTerritory;
            const matchSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchTerritory && matchSearch;
        });
    }, [state, selectedTerritory, searchQuery]);

    return (
        <AuthenticatedLayout>
            <div className="space-y-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>

                <div className="bg-white border border-indigo-200/50 p-1.5 flex flex-col md:flex-row gap-2 justify-between items-stretch md:items-center shadow-sm">
                    <div className="flex flex-1 items-center justify-between">
                        <div className="text-3xl font-bold text-gray-900 uppercase tracking-tight flex items-center gap-1.5 shrink-0">
                            ШТАТНОЕ
                            <span className="text-indigo-600">
                                [{filteredState.length}]
                            </span>
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
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 font-mono text-lg font-bold cursor-pointer"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-0.5 bg-white border border-gray-300 p-0.5 shrink-0">
                        {["all", "ekb", "krg"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setSelectedTerritory(t)}
                                className={`uppercase px-2 py-1 text-sm font-mono font-bold tracking-wider transition-all duration-150 cursor-pointer ${selectedTerritory === t
                                    ? "bg-indigo-600 text-white border border-indigo-600"
                                    : "bg-white text-gray-600 border border-transparent hover:bg-gray-200"
                                    }`}
                            >
                                {t === 'all' ? 'ВСЕ' : t === 'ekb' ? 'ЕКАТЕРИНБУРГ' : 'КУРГАН'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm border border-indigo-200/50">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-indigo-50/80 border-b border-indigo-200/80">
                                <tr className="align-bottom">
                                    <th className="text-left px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 tracking-wider uppercase">ОТДЕЛ</th>
                                    {selectedTerritory === 'all' && (
                                        <th className="text-left px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 tracking-wider uppercase w-40">ТЕРРИТОРИЯ</th>
                                    )}
                                    <th className="text-right px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 tracking-wider uppercase w-32">ШТАТНОЕ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredState.map((dept, index) => (
                                    <tr
                                        key={dept.id}
                                        className={`border-b border-indigo-900/10 transition-colors hover:bg-indigo-50/50 ${index % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'
                                            }`}
                                    >
                                        <td className="px-1.5 py-1 text-base font-bold text-gray-900 leading-none align-middle">
                                            {dept.name}
                                        </td>
                                        {selectedTerritory === 'all' && (
                                            <td className="px-1.5 py-1 align-middle">
                                                <div className={`px-1.5 py-0 text-[11px] font-mono font-bold tracking-wider w-fit uppercase ${territoryColor[dept.territory as keyof typeof territoryColor] || "bg-gray-200 text-gray-800"
                                                    }`}>
                                                    {dept.territory === "ekb" ? "ЕКАТЕРИНБУРГ" : dept.territory === "krg" ? "КУРГАН" : dept.territory}
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-1.5 py-1 text-right align-middle">
                                            <div className="inline-flex items-center justify-center bg-indigo-50/80 border border-indigo-200 px-2 py-0 min-w-[2.5rem]">
                                                <span className="font-mono text-xl font-bold text-indigo-800 leading-none">
                                                    {dept.state}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredState.length === 0 && (
                                    <tr>
                                        <td colSpan={selectedTerritory === 'all' ? 3 : 2} className="p-4 text-center">
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

            </div>
        </AuthenticatedLayout>
    );
}