import React from 'react';

interface Department {
    id: string;
    name: string;
    territory: string;
}

interface DepartmentData {
    department_id: string;
    okveds: string[];
}

interface DepartmentsPartialProps {
    departments: Department[];
    dataDepartments: DepartmentData[];
    selectedDeptId: string;
    activeDeptIndex: number | null;
    onSelectDept: (id: string) => void;
    onAddDepartment: () => void;
    onRemoveDepartment: (index: number) => void;
    onSelectActiveDept: (index: number | null) => void;
    isPanel3Open: boolean;
}

export const DepartmentsPartial = ({
    departments,
    dataDepartments,
    selectedDeptId,
    activeDeptIndex,
    onSelectDept,
    onAddDepartment,
    onRemoveDepartment,
    onSelectActiveDept,
    isPanel3Open
}: DepartmentsPartialProps) => {
    return (
        <div
            className={`w-95 border border-gray-300 p-5 bg-white flex flex-col shadow-sm shrink-0 transition-all duration-300 ease-in-out ${isPanel3Open ? 'mr-5' : 'mr-0'
                }`}
        >
            <h3 className="text-sm font-bold uppercase tracking-tight text-indigo-900 border-b border-indigo-200 pb-2 mb-4">
                Отделы
            </h3>

            <div className="grid grid-cols-[1fr_44px] gap-2 mb-5 w-full">
                <select
                    value={selectedDeptId}
                    onChange={e => onSelectDept(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-sm font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                    {dataDepartments.length === 0 && (
                        <option value="">Без ведомства</option>
                    )}
                    {dataDepartments.length > 0 && (
                        <option value="" disabled>
                            Выбрать ведомство...
                        </option>
                    )}

                    {departments
                        .filter(
                            dept =>
                                !dataDepartments.some(
                                    d => d.department_id === dept.id
                                )
                        )
                        .map(dept => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                </select>

                <button
                    type="button"
                    onClick={onAddDepartment}
                    className="w-11 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold uppercase cursor-pointer shadow-sm"
                >
                    +
                </button>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-87.5 custom-scrollbar w-full">
                {dataDepartments.map((d, index) => {
                    const match = departments.find(
                        dept => dept.id === d.department_id
                    );
                    const isSelected = activeDeptIndex === index;

                    return (
                        <div
                            key={d.department_id}
                            onClick={() => {
                                onSelectActiveDept(
                                    activeDeptIndex === index ? null : index
                                );
                            }}
                            className={`group relative flex justify-between items-center text-sm font-bold cursor-pointer transition-all h-13 w-full border
    ${index % 2 === 0
                                    ? 'bg-gray-50 hover:bg-gray-100'
                                    : 'bg-indigo-50/40 hover:bg-indigo-100/60'
                                }
    ${isSelected
                                    ? 'border-indigo-500 text-indigo-800'
                                    : 'border-transparent text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="truncate pl-3 pr-14 flex-1">
                                {index + 1}.{' '}
                                {match
                                    ? match.name
                                    : `ID: ${d.department_id}`}
                            </span>

                            <button
                                type="button"
                                onClick={e => {
                                    e.stopPropagation();
                                    onRemoveDepartment(index);
                                }}
                                className="absolute right-0 top-0 bottom-0 w-11 m-1 flex items-center justify-center text-3xl font-light leading-none border border-red-500 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-10 shrink-0 select-none"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};