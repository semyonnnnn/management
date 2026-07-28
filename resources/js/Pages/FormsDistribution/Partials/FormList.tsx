import React, { useState, useEffect } from 'react';
import { MinDep } from '@/types';
import { boolean } from 'zod';
import { CustomSelect } from '@/components/custom/CustomSelect';
import { SimpleDepSelect } from '../SimpleDepSelect';

interface FormListProps {
    form: {
        departments?: Array<MinDep>;
        [key: string]: any;
    };
    onOpenEditModal: (e: React.MouseEvent, form: any) => void;
    onSaveBackend: (formId: any, departmentsPayload: Array<{ id: any; value: string }>) => void;
    processing: boolean;
    isExpanded: boolean;
    toggleFormExpand: (formId: number) => void;
}

export const FormList: React.FC<FormListProps> = ({
    form,
    onOpenEditModal,
    onSaveBackend,
    processing,
    isExpanded,
    toggleFormExpand
}) => {
    const hasDepartments = Array.isArray(form?.departments) && form.departments.length > 0;

    // 1. LOCAL STATE TRACKING (purely for instant UI typing inputs per department)
    const [localInputs, setLocalInputs] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        form.departments?.forEach((dept: MinDep) => {
            initial[dept.id] = dept.okveds;
        });
        return initial;
    });


    const handleLocalInputChange = (deptId: any, val: string) => {
        setLocalInputs(prev => ({
            ...prev,
            [deptId]: val
        }));
    };

    const handleTriggerSave = () => {
        // Map local state values into a clean payload structure for backend sync
        const payload = Object.entries(localInputs).map(([id, value]) => ({
            id,
            value
        }));
        onSaveBackend(form.id, payload);
    };

    if (form.id == 1) {
        console.log(JSON.stringify(form))
        console.log(JSON.stringify(localInputs));
    }

    const rand: boolean = Math.random() < 0.3;

    const [hasChanges, setHasChanges] = useState<boolean>(rand);

    return (
        <div
            key={form.id}
            className="border border-gray-300 bg-white shadow-sm overflow-hidden transition-all duration-150"
        >
            <div
                onClick={() => toggleFormExpand(form.id)}
                className="flex items-stretch justify-between  bg-white hover:bg-indigo-50/40 transition-colors group select-none min-h-12"
            >
                <div className="flex items-center flex-1 min-w-0">
                    <div className="px-4 py-3 bg-gray-100 border-r border-gray-300 text-xs font-mono font-bold text-gray-700 shrink-0 uppercase tracking-tight min-w-25 text-center flex items-center justify-center">
                        {form.okud || form.code || `ОКУД: ${form.id}`}
                    </div>
                    <div className="px-4 py-3 w-full text-sm font-mono font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                        {form.name}
                    </div>
                    <button className='w-10 h-10 bg-indigo-600 text-white text-3xl cursor-pointer'>+</button>
                    <SimpleDepSelect>
                </div>

                <div className="flex items-center gap-2 pr-3 shrink-0">
                    <div className="w-8 h-8 flex items-center justify-center text-gray-600 group-hover:text-indigo-600 font-mono text-xs">
                        {isExpanded ? '▲' : '▼'}
                    </div>
                </div>
            </div>

            {isExpanded && <div className="p-4 bg-gray-50/80 border-t border-gray-300 space-y-4 font-mono text-sm">
                {hasDepartments ? (
                    form.departments!.map((dept, idx: number) => {
                        const deptName = dept.name || `Отдел - ${idx + 1}`;
                        const inputValue = localInputs[dept.id] ?? '';

                        return (
                            <div
                                key={dept.id || idx}
                                className="border border-gray-400 bg-white shadow-sm overflow-hidden"
                            >
                                {/* Department Header Bar */}
                                <div className="flex items-stretch bg-gray-100 border-b border-gray-300">
                                    <div className="px-4 py-2 bg-indigo-900 text-white text-xs font-mono font-bold border-r border-gray-300 min-w-12.5 flex items-center justify-center">
                                        {dept.code}
                                    </div>
                                    <div className="px-4 py-3 break-all text-sm font-mono font-bold text-gray-800 uppercase tracking-tight flex items-center flex-1 min-w-0">
                                        {deptName}
                                    </div>

                                </div>

                                {/* Department Input Control */}
                                <div className="p-4 text-sm font-mono text-gray-800 w-full bg-white flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => handleLocalInputChange(dept.id, e.target.value)}
                                        className="focus:ring-indigo-400 w-full rounded-none border-0 border-b focus:border-b-indigo-400 outline-none"
                                    />
                                </div>
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
            </div>}
        </div>
    );
};