import React, { useState } from "react";
import { DeptTableProps } from "@/types";
import { ModalDetails } from "./ModalDetails";

const DeptTable: React.FC<DeptTableProps> = ({
    departments,
    toggleEditMode,
    printProtocol,
    changeStaff,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedDept, setSelectedDept] = useState<any>(null);
    const [selectedTerritory, setSelectedTerritory] = useState<string>("all");

    const territoryColor = {
        ekb: "bg-indigo-100 text-indigo-700 border border-indigo-200",
        krg: "bg-purple-100 text-purple-700 border border-purple-200",
    };

    const handleOpenModal = (dept: any) => {
        setSelectedDept(dept);
        setShowModal(true);
    };

    const filteredDepartments =
        selectedTerritory === "all"
            ? departments
            : departments.filter(
                (dept) => dept.territory === selectedTerritory
            );

    const territoryFilters = [
        { value: "all", label: "ВСЕ" },
        { value: "ekb", label: "ЕКАТЕРИНБУРГ" },
        { value: "krg", label: "КУРГАН" },
    ];

    // Total load is constant for the organization, staff is the variable
    const total_org_load = departments.reduce((sum, dep) => sum + dep.totalLoad, 0);
    const total_org_staff = departments.reduce((sum, dep) => sum + dep.staff, 0);

    // The "optimal" or "average" load per person across the whole organization
    const org_average_load_per_person = total_org_staff > 0 ? total_org_load / total_org_staff : 0;

    const calcLevelPercent = (dep: any) => {
        if (dep.staff <= 0) return 0;
        const depLoadPerPerson = dep.totalLoad / dep.staff;
        if (org_average_load_per_person === 0) return 0;
        return Math.floor((depLoadPerPerson / org_average_load_per_person) * 100);
    };

    const getLevelClass = (percent: number) => {
        if (percent < 25) return "bg-orange-400 shadow-[0_0_8px_rgba(255,165,0,0.7)]";
        if (percent >= 25 && percent < 50) return "bg-yellow-400";
        if (percent >= 50 && percent <= 100) return "bg-green-200";
        if (percent > 100 && percent <= 150) return "bg-green-500";
        if (percent > 150 && percent <= 175) return "bg-rose-500";
        return "bg-red-700";
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm border border-indigo-200/50">
            <div className="border-b border-indigo-200/50 px-5 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                    </div>
                    <h5 className="text-sm font-mono font-bold text-gray-900 tracking-tighter">
                        НАГРУЗКА_ПО_ПОДРАЗДЕЛЕНИЯМ
                    </h5>
                </div>

                <div className="flex gap-2">
                    {territoryFilters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setSelectedTerritory(f.value)}
                            className={`px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider transition-all duration-200 ${selectedTerritory === f.value
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400/30"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-indigo-50/50 border-b border-indigo-200/50">
                        <tr>
                            <th className="text-left p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">
                                ОТДЕЛ
                            </th>
                            <th className="text-left p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">
                                ТЕРРИТОРИЯ
                            </th>
                            <th className="text-center p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">
                                СОТРУДНИКОВ
                            </th>
                            <th className="text-right p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">
                                СУММАРНАЯ_НАГРУЗКА
                            </th>
                            <th className="text-right p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">
                                НАГРУЗКА/СОТРУДНИКА
                            </th>
                            <th className="p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">
                                УРОВЕНЬ
                            </th>
                            <th className="p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">
                                ДЕЙСТВИЯ
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="bg-indigo-50/50 border-b border-indigo-200/50">
                            <td></td>
                            <td></td>
                            <td className="text-center align-middle border-r">
                                <div className="my-2 inline-block p-2 w-fit text-xs text-white py-1 bg-indigo-600/50 border-indigo-700/70 border">
                                    {total_org_staff.toLocaleString()}
                                </div>
                            </td>
                            <td className="text-center align-middle border-r">
                                <div className="my-2 inline-block p-2 w-fit text-xs text-white py-1 bg-indigo-600/50 border-indigo-700/70 border">
                                    {total_org_load.toLocaleString()}
                                </div>
                            </td>
                            <td className="text-center align-middle">
                                <div className="my-2 inline-block p-2 w-fit text-xs text-white py-1 bg-indigo-600/50 border-indigo-700/70 border">
                                    {Math.floor(org_average_load_per_person).toLocaleString()}
                                </div>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>

                        {filteredDepartments.map((dept) => {
                            const levelPercent = calcLevelPercent(dept);
                            const levelClass = getLevelClass(levelPercent);
                            const loadPerStaff = dept.staff > 0 ? Math.floor(dept.totalLoad / dept.staff) : 0;

                            return (
                                <tr
                                    key={dept.id}
                                    className={`border-b border-indigo-100/50 transition-all`}
                                >
                                    <td className="p-3 flex items-center gap-2">
                                        {dept.name}
                                    </td>
                                    <td className="p-3 px-2 py-1 text-[9px] font-mono font-bold tracking-wider">
                                        <div
                                            className={`px-2 py-1 ${territoryColor[dept.territory]}`}
                                        >
                                            {dept.territory === "ekb"
                                                ? "ЕКАТЕРИНБУРГ"
                                                : "КУРГАН"}
                                        </div>
                                    </td>
                                    <td className="text-center p-3">
                                        <input
                                            type="number"
                                            min={0}
                                            // Use a string check or short-circuit to handle the visual empty state if desired
                                            value={dept.staff === 0 ? "" : dept.staff}
                                            placeholder="0"
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                // If the input is cleared, we treat it as 0 for the state
                                                changeStaff(dept.id, val === "" ? 0 : Number(val));
                                            }}
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
                                            {loadPerStaff.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-3 flex flex-col">
                                        <div className="w-24 bg-gray-200 h-1 relative ">
                                            <div className="absolute left-1/4 top-0 h-1 w-[1px] bg-gray-400 opacity-40" />
                                            <div className="absolute left-1/2 top-0 h-1 w-[1px] bg-gray-500 opacity-60" />
                                            <div className="absolute left-3/4 top-0 h-1 w-[1px] bg-gray-400 opacity-40" />
                                            <div
                                                className={`h-1 transition-all duration-500 ${levelClass}`}
                                                style={{ width: `${Math.min(levelPercent, 200) / 2}%` }}
                                            />
                                        </div>
                                        <div className="text-[9px] font-mono text-gray-600 mt-1 text-right">
                                            {levelPercent}%
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleOpenModal(dept)}
                                            className="w-8 h-8 bg-white border border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 flex items-center justify-center"
                                        >
                                            <svg
                                                className="w-4 h-4 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 6h16M4 12h16M4 18h16"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {selectedDept && (
                <ModalDetails
                    forms={selectedDept.forms || []}
                    loadPerStaff={selectedDept.staff > 0 ? Math.floor(selectedDept.totalLoad / selectedDept.staff) : 0}
                    totalLoad={selectedDept.totalLoad}
                    staffCount={selectedDept.staff}
                    departmentName={selectedDept.name}
                    territory={selectedDept.territory}
                    levelPercent={calcLevelPercent(selectedDept)}
                    levelClass={getLevelClass(calcLevelPercent(selectedDept))}
                    setShowModal={setShowModal}
                    showModal={showModal}
                />
            )}
        </div>
    );
};

export { DeptTable };