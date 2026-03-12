import React from "react";

interface Props {
    toggleEditMode: () => void;
    printProtocol: () => void;
}

export const DeptTable: React.FC<Props> = ({
    toggleEditMode,
    printProtocol,
}) => {
    return (
        <div className="bg-white shadow rounded-md">
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-md">
                <h5 className="font-semibold mb-0">
                    Нагрузка по структурным подразделениям
                </h5>

                <div className="flex gap-2">
                    <button
                        className="text-sm border border-gray-400 rounded px-2 py-1 flex items-center gap-1"
                        id="edit-mode-btn"
                        onClick={toggleEditMode}
                    >
                        <i className="bi bi-pencil"></i>
                        Режим редактирования
                    </button>

                    <button
                        className="text-sm bg-blue-600 text-white rounded px-2 py-1 flex items-center gap-1"
                        id="show-summary-btn"
                        onClick={printProtocol}
                    >
                        <i className="bi bi-table"></i>
                        Сводная таблица
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table
                    className="table-auto w-full text-sm divide-y divide-gray-200"
                    id="dept-table"
                >
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 text-left">Отдел</th>
                            <th className="px-3 py-2 text-left">Территория</th>
                            <th className="px-3 py-2 text-center">
                                Сотрудников
                            </th>
                            <th className="px-3 py-2 text-right">
                                Суммарная нагрузка
                            </th>
                            <th className="px-3 py-2 text-right">
                                Нагрузка на 1 сотрудника
                            </th>
                            <th className="px-3 py-2">
                                Уровень нагрузки
                            </th>
                            <th className="px-3 py-2">
                                Действия
                            </th>
                        </tr>
                    </thead>

                    {/* JS will populate rows here */}
                    <tbody id="dept-tbody"></tbody>
                </table>
            </div>
        </div>
    );
};