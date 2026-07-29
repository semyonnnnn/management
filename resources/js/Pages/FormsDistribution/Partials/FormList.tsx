import React, { useState } from 'react';
import { MinDep, Department } from '@/types';
import { SimpleDepSelect } from '../SimpleDepSelect';

interface FormListProps {
    form: {
        id: number;
        okud?: string;
        code?: string;
        name: string;
        departments?: Array<MinDep>;
        [key: string]: any;
    };
    allDepartments: Department[];
    onOpenEditModal: (e: React.MouseEvent, form: any) => void;
    onSaveBackend: (formId: any, departmentsPayload: Array<{ id: any; value: string }>) => void;
    processing: boolean;
    isExpanded: boolean;
    toggleFormExpand: (formId: number) => void;
}

export const FormList: React.FC<FormListProps> = ({
    form,
    allDepartments,
    onOpenEditModal,
    onSaveBackend,
    processing,
    isExpanded,
    toggleFormExpand
}) => {
    // Local state tracking inputs per department id
    const [localInputs, setLocalInputs] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        form.departments?.forEach((dept: MinDep) => {
            initial[dept.id] = dept.okveds || '';
        });
        return initial;
    });

    // Local tracking for departments currently attached to this form instance
    const [attachedDeps, setAttachedDeps] = useState<MinDep[]>(form.departments || []);

    // Toggle state for showing/hiding the SimpleDepSelect dropdown on the form header
    const [isAddingDep, setIsAddingDep] = useState<boolean>(false);

    // Track which individual departments have their own open input field for adding okveds
    const [departmentOkvedInputOpen, setDepartmentOkvedInputOpen] = useState<Record<string, boolean>>({});

    const handleLocalInputChange = (deptId: any, val: string) => {
        setLocalInputs(prev => ({
            ...prev,
            [deptId]: val
        }));
    };

    const handleTriggerSave = (updatedDeps: MinDep[]) => {
        const payload = updatedDeps.map(d => ({
            id: d.id,
            value: localInputs[d.id] || d.okveds || ''
        }));
        onSaveBackend(form.id, payload);
    };

    const handleAddDepartment = (deptIdString: string) => {
        const deptToAdd = allDepartments.find(d => String(d.id) === deptIdString);
        if (!deptToAdd) return;

        // Check if already attached
        if (attachedDeps.some(d => String(d.id) === deptIdString)) {
            setIsAddingDep(false);
            return;
        }

        const newMinDep: MinDep = {
            id: deptToAdd.id,
            name: deptToAdd.name,
            territory: deptToAdd.territory,
            okveds: ''
        };

        const updated = [...attachedDeps, newMinDep];
        setAttachedDeps(updated);
        setLocalInputs(prev => ({ ...prev, [deptToAdd.id]: '' }));
        setIsAddingDep(false);
        handleTriggerSave(updated);
    };

    const toggleDeptOkvedInput = (deptId: any) => {
        setDepartmentOkvedInputOpen(prev => ({
            ...prev,
            [deptId]: !prev[deptId]
        }));
    };

    const hasDepartments = attachedDeps.length > 0;

    return (
        <div className={`border border-gray-300 bg-white shadow-sm transition-all duration-150  ${isExpanded && 'border-indigo-800 border-2'}`}>
            {/* Form Header Bar */}
            <div
                onClick={() => toggleFormExpand(form.id)}
                className={`flex items-stretch justify-between bg-white hover:bg-indigo-50/40 transition-colors group select-none min-h-12 cursor-pointer ${isExpanded && 'bg-indigo-500! text-white!'}`}
            >
                <div className={`flex items-center flex-1 min-w-0`}>
                    <div className="px-4 py-3 bg-gray-100 border-r border-gray-300 text-xs font-mono font-bold text-gray-700 shrink-0 uppercase tracking-tight min-w-25 text-center flex items-center justify-center">
                        {form.okud || form.code || `ОКУД: ${form.id}`}
                    </div>
                    <div className={`px-4 py-3 w-full text-sm font-mono font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors ${isExpanded && 'text-white!'}`}>
                        {form.name}
                    </div>
                </div>

                <div className="flex items-center gap-2 pr-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Add department dropdown trigger */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsAddingDep(!isAddingDep)}
                            className={`w-8 h-8 bg-indigo-700 hover:bg-indigo-800  text-white font-mono text-base font-bold flex items-center justify-center cursor-pointer shadow-sm transition-colors ${isExpanded && 'border-white border'}`}
                            title="Прикрепить ведомство"
                        >
                            +
                        </button>
                        {isAddingDep && (
                            <div className="absolute right-0 mt-2 w-72 z-50 bg-white shadow-xl border border-indigo-200 p-2">
                                <SimpleDepSelect
                                    departments={allDepartments}
                                    selectedId=""
                                    onSelect={(id) => handleAddDepartment(id)}
                                    placeholder="Выберите ведомство..."
                                />
                            </div>
                        )}
                    </div>

                    <div
                        className="w-8 h-8 flex items-center justify-center text-gray-600 group-hover:text-indigo-600 font-mono text-xs cursor-pointer"
                        onClick={() => toggleFormExpand(form.id)}
                    >
                        {isExpanded ? '▲' : '▼'}
                    </div>
                </div>
            </div>

            {/* Accordion Body */}
            {isExpanded && (
                <div className={`p-4 bg-gray-50/80 border-t border-gray-300 space-y-4 font-mono text-sm`}>
                    {hasDepartments ? (
                        attachedDeps.map((dept, idx: number) => {
                            const deptName = dept.name || `Отдел - ${idx + 1}`;
                            const inputValue = localInputs[dept.id] ?? '';
                            const isOkvedInputOpen = !!departmentOkvedInputOpen[dept.id] || Boolean(inputValue);

                            return (
                                <div
                                    key={dept.id || idx}
                                    className="border border-gray-400 bg-white shadow-sm overflow-hidden"
                                >
                                    {/* Department Header Bar */}
                                    <div className="flex items-stretch bg-gray-100 border-b border-gray-300 justify-between">
                                        <div className="flex items-center min-w-0 flex-1">
                                            <div className="px-4 py-2 bg-indigo-900 text-white text-xs font-mono font-bold border-r border-gray-300 min-w-12.5 flex items-center justify-center">
                                                {dept.code || `#${idx + 1}`}
                                            </div>
                                            <div className="px-4 py-3 break-all text-sm font-mono font-bold text-gray-800 uppercase tracking-tight flex items-center flex-1 min-w-0">
                                                {deptName}
                                            </div>
                                        </div>

                                        <div className="flex items-center px-3 gap-2">
                                            {/* Action to toggle Okved input field if lacking or hidden */}
                                            <button
                                                type="button"
                                                onClick={() => toggleDeptOkvedInput(dept.id)}
                                                className="w-7 h-7 bg-gray-200 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 font-mono text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                                                title="Добавить/изменить ОКВЭДы"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Department Input Control */}
                                    {isOkvedInputOpen && (
                                        <div className="p-4 text-sm font-mono text-gray-800 w-full bg-white flex gap-2 items-center border-t border-gray-200">
                                            <input
                                                type="text"
                                                value={inputValue}
                                                placeholder="Введите ОКВЭДы..."
                                                onChange={(e) => handleLocalInputChange(dept.id, e.target.value)}
                                                onBlur={() => handleTriggerSave(attachedDeps)}
                                                className="focus:ring-indigo-400 w-full rounded-none border-0 border-b border-gray-300 focus:border-b-indigo-600 outline-none py-1 text-xs"
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-6 text-center border border-dashed border-gray-300 bg-white">
                            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">
                                К этой форме не прикреплено ни одного отдела
                            </p>
                            <button
                                type="button"
                                onClick={(e) => onOpenEditModal(e, form)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                                <span>+</span> Прикрепить отдел
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};