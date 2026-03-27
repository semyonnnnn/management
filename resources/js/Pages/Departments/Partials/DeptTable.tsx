import React, { useState } from "react";
import { DeptTableProps } from "@/types";
import { ModalDetails } from "./ModalDetails";

const DeptTable: React.FC<DeptTableProps> = ({
    departments,
    toggleEditMode,
    printProtocol,
    openDeptDetail,
    changeStaff,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedDept, setSelectedDept] = useState<any>(null);
    const [selectedTerritory, setSelectedTerritory] = useState<string>("all");

    const levelColor = {
        low: "bg-emerald-500",
        medium: "bg-amber-500",
        high: "bg-rose-500",
    };

    const territoryColor = {
        ekb: "bg-indigo-100 text-indigo-700 border border-indigo-200",
        krg: "bg-purple-100 text-purple-700 border border-purple-200",
    };

    const handleOpenModal = (dept: any) => {
        setSelectedDept(dept);
        setShowModal(true);
    };

    // Filter departments based on selected territory
    const filteredDepartments = selectedTerritory === "all"
        ? departments
        : departments.filter(dept => dept.territory === selectedTerritory);

    // Territory filter options
    const territoryFilters = [
        { value: "all", label: "ВСЕ" },
        { value: "ekb", label: "ЕКАТЕРИНБУРГ" },
        { value: "krg", label: "КУРГАН" },
    ];

    return (
        <div className="bg-white/80 backdrop-blur-sm border border-indigo-200/50">
            {/* Header */}
            <div className="border-b border-indigo-200/50">
                <div className="px-5 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h5 className="text-sm font-mono font-bold text-gray-900 tracking-tighter">
                                НАГРУЗКА_ПО_ПОДРАЗДЕЛЕНИЯМ
                            </h5>
                        </div>

                        {/* Territory Filter */}
                        <div className="flex gap-2">
                            {territoryFilters.map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => setSelectedTerritory(filter.value)}
                                    className={`px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider transition-all duration-200 ${selectedTerritory === filter.value
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400/30"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-indigo-50/50 border-b border-indigo-200/50">
                        <tr>
                            <th className="text-left p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">ОТДЕЛ</th>
                            <th className="text-left p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">ТЕРРИТОРИЯ</th>
                            <th className="text-center p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">СОТРУДНИКОВ</th>
                            <th className="text-right p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">СУММАРНАЯ_НАГРУЗКА</th>
                            <th className="text-right p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">НАГРУЗКА/СОТРУДНИКА</th>
                            <th className="p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">УРОВЕНЬ</th>
                            <th className="p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">ДЕЙСТВИЯ</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredDepartments.map((dept) => (
                            <tr
                                key={dept.id}
                                className="border-b border-indigo-100/50 hover:bg-indigo-50/30 transition-colors"
                            >
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="text-[12px] font-mono text-gray-900">
                                            {dept.name}
                                        </span>
                                    </div>
                                </td>

                                <td className="p-3">
                                    <span className={`px-2 py-1 text-[9px] font-mono font-bold tracking-wider ${territoryColor[dept.territory]}`}>
                                        {dept.territory === "ekb" ? "ЕКАТЕРИНБУРГ" : "КУРГАН"}
                                    </span>
                                </td>

                                <td className="text-center p-3">
                                    <input
                                        type="number"
                                        min={0}
                                        value={dept.staff}
                                        onChange={(e) =>
                                            changeStaff(
                                                dept.id,
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-20 text-center border border-indigo-200/50 bg-indigo-50/30 px-2 py-1.5 font-mono text-[12px] text-gray-900 focus:outline-none focus:border-indigo-400 transition-colors"
                                    />
                                </td>

                                <td className="text-right p-3">
                                    <span className="font-mono text-[12px] font-bold text-gray-900">
                                        {dept.totalLoad.toLocaleString()}
                                    </span>
                                </td>

                                <td className="text-right p-3">
                                    <span className="font-mono text-[12px] text-gray-600">
                                        {dept.avgLoad.toLocaleString()}
                                    </span>
                                </td>

                                <td className="p-3">
                                    <div className="w-24 bg-gray-200 h-1">
                                        <div
                                            className={`h-1 ${levelColor[dept.levelClass]}`}
                                            style={{
                                                width: `${dept.levelPercent}%`,
                                            }}
                                        />
                                    </div>
                                </td>

                                <td className="p-3">
                                    <button
                                        onClick={() => handleOpenModal(dept)}
                                        className="w-8 h-8 bg-white border border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedDept && (
                <ModalDetails
                    forms={selectedDept.forms}
                    loadPerStaff={selectedDept.avgLoad}
                    totalLoad={selectedDept.totalLoad}
                    staffCount={selectedDept.staff}
                    departmentName={selectedDept.name}
                    territory={selectedDept.territory}
                    setShowModal={setShowModal}
                    showModal={showModal}
                />
            )}
        </div>
    );
};

export { DeptTable };