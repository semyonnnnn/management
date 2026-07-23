import React, { memo } from 'react';
import { Department } from '@/types';

interface DepartmentRowProps {
    dept: Department;
    index: number;
    onDeptChange: (updatedDept: Department) => void;
    onDelete: (dept: Department) => void;
    rowErrors?: Record<string, string>;
}

export const DepartmentRow = memo(({
    dept,
    index,
    onDeptChange,
    onDelete,
    rowErrors = {} // Fallback applied here to preserve reference equality
}: DepartmentRowProps) => {

    const updateField = (field: keyof Department, value: any) => {
        onDeptChange({
            ...dept,
            [field]: value
        });
    };

    const handleCodeChange = (value: string) => {
        if (value === '' || (/^(?!.*00)[0-9]{0,2}к?$/.test(value))) {
            updateField('code', value);
        }
    };

    const handleNameChange = (value: string) => {
        if (/^(?!\s)(?!.*\s\s)[а-яА-ЯёЁ0-9,.\(\)\s)]*$/.test(value)) {
            updateField('name', value);
        }
    };

    const handleStateChange = (value: string) => {
        if (/^(?!0)\d{0,3}$/.test(value) || value === '') {
            updateField('state', value);
        }
    };

    const getBorderClass = (field: keyof Department) => {
        const hasError = !!rowErrors[field];
        return hasError
            ? "border-red-500 ring-1 ring-red-500 focus:border-red-600 focus:ring-red-600 bg-red-50/20"
            : "border-black/20 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-400";
    };

    const renderError = (field: keyof Department) => {
        const errorMsg = rowErrors[field];
        if (!errorMsg) return null;
        return (
            <div className="text-red-600 text-[10px] font-bold leading-none mt-1 select-none">
                *{errorMsg}
            </div>
        );
    };

    const territoryColor: Record<string, string> = {
        ekb: "bg-indigo-100 text-indigo-700 border border-indigo-200",
        krg: "bg-purple-100 text-purple-700 border border-purple-200",
    };

    return (
        <div className={`flex flex-col border-b border-indigo-900/10 ${index % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}`}>
            <div className="flex items-start h-fit py-2">

                {/* CODE CELL */}
                <div className="w-24 px-2 flex flex-col justify-start relative">
                    <input
                        type="text"
                        value={dept.code}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        className={`w-full border-b h-7 px-1.5 text-base font-bold text-indigo-700 bg-transparent outline-none transition-colors ${getBorderClass('code')}`}
                    />
                    {renderError('code')}
                    <div className="absolute right-0 top-0 w-px h-7 bg-indigo-200" />
                </div>

                {/* NAME CELL */}
                <div className="flex-1 px-2 flex flex-col justify-start relative">
                    <input
                        type="text"
                        value={dept.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className={`w-full h-7 border-b px-2 text-base font-bold text-gray-900 bg-transparent outline-none transition-colors ${getBorderClass('name')}`}
                    />
                    {renderError('name')}
                    <div className="absolute right-0 top-0 w-px h-7 bg-indigo-200" />
                </div>

                {/* STATE CELL */}
                <div className="w-24 px-2 flex flex-col relative justify-start">
                    <input
                        type="text"
                        value={dept.state}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className={`w-full h-7 border-b px-1.5 text-right font-mono text-sm font-bold bg-transparent text-indigo-900 outline-none transition-colors ${getBorderClass('state')}`}
                    />
                    {renderError('state')}
                    <div className="absolute right-0 top-0 w-px h-7 bg-indigo-200" />
                </div>

                {/* TERRITORY CELL */}
                <div className="w-40 px-1.5 flex flex-col justify-start items-end">
                    <select
                        value={dept.territory}
                        onChange={(e) => updateField('territory', e.target.value)}
                        className={`h-7 px-1 text-[11px] font-mono font-bold tracking-wider uppercase border border-indigo-400 bg-white text-gray-900 w-full leading-tight transition-all cursor-pointer
                        focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 focus:border-indigo-600
                        ${territoryColor[dept.territory] || "bg-gray-200"}`}
                    >
                        <option value="ekb" className="bg-white text-gray-900">ЕКАТЕРИНБУРГ</option>
                        <option value="krg" className="bg-white text-gray-900">КУРГАН</option>
                    </select>
                </div>

                {/* ACTION/DELETE CELL */}
                <div className="w-24 px-1.5 flex justify-end items-start">
                    <button
                        type="button"
                        onClick={() => onDelete(dept)}
                        className="w-7 h-7 flex items-center justify-center bg-pink-100 border cursor-pointer border-red-300 text-3xl text-center text-red-600 transition-all hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                        ×
                    </button>
                </div>

            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Exact equality check to ensure row isolates from parent modal states
    return (
        prevProps.dept === nextProps.dept &&
        prevProps.index === nextProps.index &&
        prevProps.rowErrors === nextProps.rowErrors
    );
});

DepartmentRow.displayName = 'DepartmentRow';