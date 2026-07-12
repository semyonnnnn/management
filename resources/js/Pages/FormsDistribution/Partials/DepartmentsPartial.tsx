import React, { useState, useRef, useEffect } from 'react';

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
    onConfirmRemove: (index: number) => void;
    onSave: () => void;
    onReset: () => void;
    showActions: boolean;
}

const CustomSelect = ({
    value,
    onChange,
    options,
    defaultText
}: {
    value: string;
    onChange: (val: string) => void;
    options: { id: string; name: string }[];
    defaultText: string
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.id === value);

    return (
        <div className="relative w-full select-none" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-3 py-2 bg-white border text-sm font-bold transition-all duration-150 cursor-pointer flex justify-between items-center h-full relative z-20
                    ${isOpen ? 'border-indigo-500 shadow-lg ring-1 ring-indigo-500 text-gray-900' : 'border-gray-300 hover:border-indigo-400 text-gray-800 shadow-sm'}
                `}
            >
                <span className={!selectedOption ? "text-gray-500" : "truncate"}>
                    {selectedOption ? selectedOption.name : defaultText}
                </span>

                <svg
                    className={`w-4 h-4 ml-2 shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1">
                    {/* Fixed Fading Gradient Blur Underlay */}
                    {/* Removed top bleeding, anchors exactly at top-0 and radiates downwards */}
                    <div
                        className="absolute -left-8 -right-8 -bottom-12 top-0 z-0 pointer-events-none backdrop-blur-xl opacity-95 mask-[radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
                    />

                    {/* Actual Dropdown Container */}
                    <div className="relative z-10 w-full bg-white/85 backdrop-blur-md border border-gray-200 shadow-2xl shadow-black max-h-60 overflow-y-auto custom-scrollbar">
                        {options.length === 0 ? (
                            <div className="px-3 py-3 text-sm text-gray-400 font-semibold italic bg-white/50">
                                Нет доступных ведомств
                            </div>
                        ) : (
                            options.map((opt) => (
                                <div
                                    key={opt.id}
                                    onClick={() => {
                                        onChange(opt.id);
                                        setIsOpen(false);
                                    }}
                                    className={`px-3 py-2 text-base font-semibold cursor-pointer transition-colors border-b border-gray-100/50 last:border-0
                                        ${value === opt.id ? 'bg-indigo-100/80 text-indigo-800' : 'text-gray-800 hover:bg-indigo-50/80 hover:text-indigo-900'}
                                    `}
                                >
                                    {opt.name}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const DepartmentsPartial = ({
    departments,
    dataDepartments,
    selectedDeptId,
    activeDeptIndex,
    onSelectDept,
    onAddDepartment,
    onRemoveDepartment,
    onSelectActiveDept,
    isPanel3Open,
    onConfirmRemove,
    onSave,
    onReset,
    showActions
}: DepartmentsPartialProps) => {

    const availableDepartments = departments.filter(
        dept => !dataDepartments.some(d => d.department_id === dept.id)
    );

    const defaultSelectText = dataDepartments.length === 0
        ? "Без ведомства"
        : "Выбрать ведомство...";

    return (
        <div
            className={`w-95 border border-gray-300 p-5 bg-white flex flex-col shadow-sm shrink-0 transition-all duration-300 ease-in-out ${isPanel3Open ? 'mr-5' : 'mr-0'}`}
        >
            <h3 className="text-sm font-bold uppercase tracking-tight text-indigo-900 border-b border-indigo-200 pb-2 mb-4">
                Отделы
            </h3>

            <div className="grid grid-cols-[1fr_44px] gap-2 mb-5 w-full items-stretch relative z-20">
                <CustomSelect
                    value={selectedDeptId}
                    onChange={onSelectDept}
                    options={availableDepartments}
                    defaultText={defaultSelectText}
                />

                <button
                    type="button"
                    onClick={onAddDepartment}
                    className="w-11 h-full flex items-center text-3xl justify-center bg-indigo-600 hover:bg-indigo-700 text-white uppercase cursor-pointer shadow-sm transition-colors"
                >
                    +
                </button>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-87.5 custom-scrollbar w-full relative z-10">
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
                                    onConfirmRemove(index);
                                }}
                                className="absolute right-0 top-0 bottom-0 w-11 m-1 flex items-center justify-center text-4xl font-light leading-none border border-red-500 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all shrink-0 select-none"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
                {showActions && (
                    <div className="flex gap-2 mt-5 pt-5 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onReset}
                            className="flex-1 h-11 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold transition-colors cursor-pointer"
                        >
                            Отменить
                        </button>

                        <button
                            type="button"
                            onClick={onSave}
                            className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors cursor-pointer"
                        >
                            Сохранить
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};