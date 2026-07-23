import { useState, useRef, useEffect } from "react";
import { Department } from "@/types";

interface DepartmentData {
    department_id: string;
    okveds?: string[];
}

interface DepartmentsPartialProps {
    departments: Department[];
    dataDepartments: DepartmentData[];
    selectedDeptId: string;
    onSelectDept: (id: string) => void;
    onAddDepartment: () => void;
    onConfirmRemove: (index: number) => void;
    onSave: () => void;
    onReset: () => void;
    showActions: boolean;
    formName: string;
    activeDeptIndex: number | null;
    onRemoveDepartment: (index: number) => void;
    onSelectActiveDept: (index: number | null) => void;
    isPanel3Open: boolean;
}

export const DepartmentsPartial = ({
    departments,
    dataDepartments,
    selectedDeptId,
    onSelectDept,
    onAddDepartment,
    onConfirmRemove,
    onSave,
    onReset,
    showActions,
    formName,
    activeDeptIndex,
    onRemoveDepartment,
    onSelectActiveDept,
    isPanel3Open,
}: DepartmentsPartialProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Ameliorate lingering dropdowns by closing them when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const availableDepartments = (departments ?? []).filter(
        dept => !(dataDepartments ?? []).some(d => d?.department_id === String(dept.id))
    );

    const filteredDepartments = availableDepartments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectDepartment = (id: string) => {
        onSelectDept(id);

        // A nominal delay ensures React batches the state update 
        // in the parent before executing the add operation.
        setTimeout(() => {
            onAddDepartment();
        }, 0);

        setSearchTerm("");
        setIsDropdownOpen(false);
    };

    const placeholderText = dataDepartments.length === 0
        ? "Поиск (Без ведомства)..."
        : "Поиск ведомства...";

    return (
        <div className="w-fit max-w-200 border border-gray-300 p-5 bg-white flex flex-col shadow-sm shrink-0">
            <h3 className="text-sm font-bold uppercase tracking-tight text-indigo-900 border-b border-indigo-200 pb-2 mb-4">
                {formName}
            </h3>

            {/* Search Input & Dropdown Container */}
            <div className="relative mb-5 w-full z-20" ref={dropdownRef}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder={placeholderText}
                    className="w-full px-3 py-2 bg-white border border-gray-300 hover:border-indigo-400 text-gray-800 text-sm font-bold shadow-sm transition-all duration-150 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-500 placeholder:font-normal"
                />

                {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl shadow-black/10 z-50 custom-scrollbar">
                        {filteredDepartments.length === 0 ? (
                            <div className="px-3 py-3 text-sm text-gray-400 font-semibold italic bg-white/50">
                                Нет совпадений
                            </div>
                        ) : (
                            filteredDepartments.map((dept) => (
                                <div
                                    key={dept.id}
                                    onClick={() => handleSelectDepartment(String(dept.id))}
                                    className="px-3 py-2 text-sm font-semibold text-gray-800 cursor-pointer transition-colors border-b border-gray-100/50 last:border-0 whitespace-normal break-words hover:bg-indigo-50/80 hover:text-indigo-900"
                                >
                                    {dept.name}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Selected Departments List */}
            <div className="space-y-1.5 overflow-y-auto max-h-87.5 custom-scrollbar w-full relative z-10">
                {dataDepartments.map((d, index) => {
                    const match = departments.find(
                        dept => String(dept.id) === d.department_id
                    );

                    return (
                        <div
                            key={d.department_id}
                            className={`group relative flex justify-between items-center text-sm font-bold h-13 w-full border border-transparent hover:border-gray-300 transition-all ${index % 2 === 0
                                ? 'bg-gray-50'
                                : 'bg-indigo-50/40'
                                }`}
                        >
                            <span className="truncate pl-3 pr-14 flex-1 text-gray-700">
                                {index + 1}. {match ? match.name : `ID: ${d.department_id}`}
                            </span>

                            <button
                                type="button"
                                onClick={e => {
                                    e.stopPropagation();
                                    onConfirmRemove(index);
                                }}
                                className="absolute right-0 top-0 bottom-0 w-11 m-1 flex items-center justify-center text-4xl font-light leading-none border border-red-500 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all shrink-0 select-none cursor-pointer"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Action Buttons */}
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
    );
};