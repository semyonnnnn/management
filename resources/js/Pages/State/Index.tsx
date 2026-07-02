import React, { useState } from "react";
import { PageProps } from "@/types";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Department {
    id: number;
    name: string;
    state: number;
}

interface StateProps extends PageProps {
    state: Department[];
    filters?: {
        search?: string;
    };
}

export default function Index({ auth, state }: StateProps) {
    const [searchQuery, setSearchQuery] = useState<string>('');

    // FIX: Filter the incoming prop directly in memory on every render
    const filteredDepartments = state.filter((dept) =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <div className="py-2 px-4 max-w-7xl mx-auto space-y-2">

                {/* Control Panel Console Block Header */}
                <div className="bg-white border border-indigo-200 p-3 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center rounded-none">
                    <div className="flex items-center gap-3">
                        <div className="w-fit h-7 px-2 bg-indigo-600 flex items-center justify-center text-white text-xs font-bold font-mono shrink-0 rounded-none">
                            СТАТИСТИКА
                        </div>
                        <div className="text-sm font-bold text-gray-900 uppercase tracking-tight font-mono">
                            {/* Shows the count of the currently filtered results */}
                            ОБЗОР ПОДРАЗДЕЛЕНИЙ <span className="text-indigo-600">[{filteredDepartments.length}]</span>
                        </div>
                    </div>

                    {/* Interactive Text Search */}
                    <div className="relative w-full sm:w-72">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск по названию..."
                            className="w-full pl-3 pr-8 py-1 bg-white border border-gray-300 text-sm font-mono font-bold text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-0 placeholder-gray-400 transition-colors rounded-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-mono text-sm font-bold cursor-pointer"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Interface Block */}
                <div className="bg-white border border-indigo-200 rounded-none">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-indigo-100">
                            <thead className="bg-indigo-50">
                                <tr>
                                    <th className="text-left p-1.5 text-xs font-mono font-bold text-indigo-600 tracking-wider uppercase">ОТДЕЛ / СЕКТОР</th>
                                    <th className="text-left p-1.5 text-xs font-mono font-bold text-indigo-600 tracking-wider uppercase">штатное</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Map over the locally filtered array */}
                                {filteredDepartments.map((dept, index) => (
                                    <tr key={dept.id} className={`border-b border-indigo-100 transition-all hover:bg-indigo-50/40 ${index % 2 === 0 ? 'bg-indigo-50/20' : ''}`}>
                                        <td className="p-1.5 text-sm font-medium text-gray-900 font-mono">
                                            {dept.name}
                                        </td>
                                        <td className="p-1.5 text-sm font-medium text-gray-900 font-mono">
                                            {dept.state}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredDepartments.length === 0 && (
                        <div className="p-6 text-center text-sm font-bold text-gray-400 border-t border-indigo-100 bg-white uppercase tracking-widest font-mono rounded-none">
                            Данные по запросу отсутствуют
                        </div>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}