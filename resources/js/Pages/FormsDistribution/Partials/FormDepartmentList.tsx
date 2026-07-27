import React from 'react';
import { Department } from '@/types';

interface FormDepartmentsListProps {
    form: {
        departments?: Array<Department & { okveds?: string | string[]; okved?: string; okved_code?: string; territory?: string; short_code?: string; code?: string }>;
        [key: string]: any;
    };
    onOpenEditModal: (e: React.MouseEvent, form: any) => void;
}

export const FormDepartmentsList: React.FC<FormDepartmentsListProps> = ({
    form,
    onOpenEditModal,
}) => {
    const hasDepartments = Array.isArray(form?.departments) && form.departments.length > 0;

    return (
        <div className="p-4 bg-gray-50/80 border-t border-gray-300 space-y-4 font-mono text-sm">
            {hasDepartments ? (
                form.departments!.map((dept, idx: number) => {
                    const codesList = Array.isArray(dept.okveds) && dept.okveds.length > 0
                        ? dept.okveds.join(', ')
                        : dept.okveds || dept.okved || dept.okved_code || '12, 13, 14, 15, 16, 17, 21, 20';

                    const territoryBadge = dept.territory || dept.code || dept.short_code || `${idx + 1}k`;
                    const deptName = dept.name || `Отдел - ${idx + 1}`;

                    return (
                        <div
                            key={dept.id || idx}
                            className="border border-gray-400 bg-white shadow-sm overflow-hidden"
                        >
                            {/* Department Header Bar */}
                            <div className="flex items-stretch bg-gray-100 border-b border-gray-300">
                                <div className="px-4 py-2 bg-indigo-900 text-white text-xs font-mono font-bold border-r border-gray-300 min-w-12.5 flex items-center justify-center">
                                    {territoryBadge}
                                </div>
                                <div className="px-4 py-2 text-sm font-mono font-bold text-gray-800 uppercase tracking-tight flex items-center">
                                    {deptName}
                                </div>
                            </div>

                            {/* Department Codes / Content Box */}
                            <div className="p-4 text-sm font-mono text-gray-800 bg-white leading-relaxed">
                                {codesList}
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
        </div>
    );
};