import React, { useState } from "react";
import { DeptTableProps } from "@/types";
import { ModalDetails } from "./ModalDetails";

interface ExtendedProps extends DeptTableProps {
    fixedOptimalLoad: number;
}

const DeptTable: React.FC<ExtendedProps> = ({
    departments,
    changeStaff,
    fixedOptimalLoad,
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

    const filteredDepartments = selectedTerritory === "all"
        ? departments
        : departments.filter((dept) => dept.territory === selectedTerritory);

    // This calculates the actual workload percentage (e.g., 150 means 150% load)
    const calcWorkloadRawPercent = (dep: any) => {
        if (dep.staff <= 0 || fixedOptimalLoad === 0) return 0;
        const depLoadPerPerson = dep.totalLoad / dep.staff;
        return Math.floor((depLoadPerPerson / fixedOptimalLoad) * 100);
    };

    const getLevelClass = (percent: any) => {
        if (percent < 50) return "bg-orange-400 shadow-[0_0_8px_rgba(255,165,0,0.7)]"; // < 50% load
        if (percent >= 50 && percent < 90) return "bg-yellow-400"; // 50-90% load
        if (percent >= 90 && percent <= 110) return "bg-green-200"; // 90-110% load (Optimal)
        if (percent > 110 && percent <= 150) return "bg-green-500"; // 110-150% load
        if (percent > 150 && percent <= 180) return "bg-rose-500"; // 150-180% load
        return "bg-red-700"; // > 180% load
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm border border-indigo-200/50">
            <div className="border-b border-indigo-200/50 px-5 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h5 className="text-sm font-mono font-bold text-gray-900 tracking-tighter uppercase">НАГРУЗКА_ПО_ПОДРАЗДЕЛЕНИЯМ</h5>
                </div>
                <div className="flex gap-2">
                    {["all", "ekb", "krg"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setSelectedTerritory(t)}
                            className={`px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider transition-all duration-200 ${selectedTerritory === t ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400/30" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"}`}
                        >
                            {t === 'all' ? 'ВСЕ' : t.toUpperCase() === 'EKB' ? 'ЕКАТЕРИНБУРГ' : 'КУРГАН'}
                        </button>
                    ))}
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
                            <th className="p-3 text-[10px] font-mono font-bold text-indigo-600 tracking-wider uppercase">ДЕТАЛИ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDepartments.map((dept) => {
                            const workloadPercent = calcWorkloadRawPercent(dept);
                            const levelClass = getLevelClass(workloadPercent);
                            const loadPerStaff = dept.staff > 0 ? Math.floor(dept.totalLoad / dept.staff) : 0;

                            // Visual logic: 200% load = 100% width. So we divide by 2.
                            const barWidth = Math.min(workloadPercent / 2, 100);

                            return (
                                <tr key={dept.id} className="border-b border-indigo-100/50 transition-all">
                                    <td className="p-3 text-sm">{dept.name}</td>
                                    <td className="p-3">
                                        <div className={`px-2 py-1 text-[9px] font-mono font-bold tracking-wider w-fit ${territoryColor[dept.territory as keyof typeof territoryColor]}`}>
                                            {dept.territory === "ekb" ? "ЕКАТЕРИНБУРГ" : "КУРГАН"}
                                        </div>
                                    </td>
                                    <td className="text-center p-3">
                                        <input
                                            type="number"
                                            value={dept.staff || ""}
                                            onChange={(e) => changeStaff(dept.id, Number(e.target.value))}
                                            className="w-20 text-center border border-indigo-200/50 bg-indigo-50/30 px-2 py-1.5 font-mono text-[12px] outline-none"
                                        />
                                    </td>
                                    <td className="text-right p-3 font-mono text-[12px] font-bold">{dept.totalLoad.toLocaleString()}</td>
                                    <td className="text-right p-3 font-mono text-[12px] text-gray-600">{loadPerStaff.toLocaleString()}</td>
                                    <td className="p-3 flex flex-col items-end">
                                        <div className="w-24 bg-gray-200 h-1 relative">
                                            {/* Visual center marker for 100% workload (50% width) */}
                                            <div className="absolute left-1/4 top-0 w-px h-full bg-gray-400/50 z-10" />
                                            <div className="absolute left-1/2 top-0 w-px h-full bg-gray-400/50 z-10" />
                                            <div className="absolute left-3/4 top-0 w-px h-full bg-gray-400/50 z-10" />
                                            <div
                                                className={`h-1 transition-all duration-500 ${levelClass}`}
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        </div>
                                        <div className="text-[9px] font-mono text-gray-600 mt-1">{workloadPercent}%</div>
                                    </td>
                                    <td className="p-3">
                                        <button onClick={() => handleOpenModal(dept)} className="w-8 h-8 bg-white border border-gray-300 hover:border-indigo-400 flex items-center justify-center mx-auto">
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
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
                    showModal={showModal}
                    setShowModal={setShowModal}
                    departmentName={selectedDept.name}
                    staffCount={selectedDept.staff}
                    totalLoad={selectedDept.totalLoad}
                    loadPerStaff={selectedDept.staff > 0 ? Math.floor(selectedDept.totalLoad / selectedDept.staff) : 0}
                    levelPercent={calcWorkloadRawPercent(selectedDept)}
                    levelClass={getLevelClass(calcWorkloadRawPercent(selectedDept)) as any}
                    territory={selectedDept.territory}
                    forms={selectedDept.forms || []}
                />
            )}
        </div>
    );
};

export { DeptTable };