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
    const levelColor = {
        low: "bg-green-400",
        medium: "bg-yellow-400",
        high: "bg-red-500",
    };

    const territoryColor = {
        ekb: "bg-yellow-100 text-yellow-800",
        kg: "bg-blue-100 text-blue-800",
    };


    return (
        <div className="bg-white shadow rounded-md mb-3">
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-md">
                <h5 className="font-semibold">
                    Нагрузка по структурным подразделениям
                </h5>

                <div className="flex gap-2">
                    <button
                        onClick={toggleEditMode}
                        className="text-sm border px-3 py-1 rounded flex items-center gap-1"
                    >
                        <i className="bi bi-pencil"></i>
                        Режим редактирования
                    </button>

                    <button
                        onClick={printProtocol}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                        <i className="bi bi-table"></i>
                        Сводная таблица
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-2">Отдел</th>
                            <th className="text-left p-2">Территория</th>
                            <th className="text-center p-2">Сотрудников</th>
                            <th className="text-right p-2">Суммарная нагрузка</th>
                            <th className="text-right p-2">Нагрузка на 1 сотрудника</th>
                            <th className="p-2">Уровень нагрузки</th>
                            <th className="p-2">Действия</th>
                        </tr>
                    </thead>

                    <tbody>
                        {departments.map((dept) => (
                            <tr
                                key={dept.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="p-2 flex items-center gap-1">
                                    <i className="bi bi-building"></i>
                                    {dept.name}
                                </td>

                                <td className="p-2">
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${territoryColor[dept.territory]}`}
                                    >
                                        {dept.territoryLabel}
                                    </span>
                                </td>

                                <td className="text-center p-2">
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
                                        className="border rounded w-16 text-center"
                                    />
                                </td>

                                <td className="text-right p-2">
                                    {dept.totalLoad.toLocaleString()}
                                </td>

                                <td className="text-right p-2">
                                    {dept.avgLoad.toLocaleString()}
                                </td>

                                <td className="p-2">
                                    <div className="w-full bg-gray-200 rounded h-3">
                                        <div
                                            className={`h-3 rounded ${levelColor[dept.levelClass]}`}
                                            style={{
                                                width: `${dept.levelPercent}%`,
                                            }}
                                        />
                                    </div>
                                </td>

                                <td className="p-2">
                                    <button
                                        onClick={() => {
                                            console.log('hello');
                                            setShowModal(true)
                                        }
                                        }
                                        className="border rounded px-2 py-1"
                                    >
                                        <i className="bi bi-list">open</i>
                                    </button>
                                    <ModalDetails forms={dept.forms} loadPerStaff={dept.avgLoad} totalLoad={dept.totalLoad} staffCount={dept.staff} departmentName={dept.name} territory={dept.territory} setShowModal={setShowModal} showModal={showModal} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export { DeptTable };