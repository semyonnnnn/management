import React, { useState, useEffect, useMemo, useRef } from 'react';
import { router } from '@inertiajs/react';
import { MinDep, Department } from '@/types';
import { SimpleDepSelect } from '../SimpleDepSelect';
import { Confirmation } from './Confirmation'; // Adjust path if needed (e.g., '@/Pages/Forms/Partials/Confirmation')

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
    isExpanded: boolean;
    toggleFormExpand: (formId: number) => void;
    index: number;
}

export const FormList: React.FC<FormListProps> = ({
    form,
    allDepartments,
    isExpanded,
    toggleFormExpand,
    index
}) => {
    const [localInputs, setLocalInputs] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        form.departments?.forEach((dept: MinDep) => {
            initial[dept.id] = dept.okveds || '';
        });
        return initial;
    });

    const [attachedDeps, setAttachedDeps] = useState<MinDep[]>(form.departments || []);
    const [isAddingDep, setIsAddingDep] = useState<boolean>(false);
    const [departmentOkvedInputOpen, setDepartmentOkvedInputOpen] = useState<Record<string, boolean>>({});
    const [processing, setProcessing] = useState<boolean>(false);

    // State for tracking target deletion
    const [deptToDelete, setDeptToDelete] = useState<number | string | null>(null);

    // Spatial refs and states for dynamic flip positioning
    const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
    const [openUpwards, setOpenUpwards] = useState<boolean>(false);

    // Prevent body scrolling while modal overlay is active
    useEffect(() => {
        if (isAddingDep || deptToDelete !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isAddingDep, deptToDelete]);

    // Calculate clearance beneath the button to obviate UI clipping
    useEffect(() => {
        if (isAddingDep && triggerButtonRef.current) {
            const rect = triggerButtonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const ESTIMATED_DROPDOWN_HEIGHT = 380;

            setOpenUpwards(spaceBelow < ESTIMATED_DROPDOWN_HEIGHT);
        }
    }, [isAddingDep]);

    // Re-sync local state when fresh server props arrive
    useEffect(() => {
        const initialDeps = form.departments || [];
        setAttachedDeps(initialDeps);
        const resetInputs: Record<string, string> = {};
        initialDeps.forEach((dept: MinDep) => {
            resetInputs[dept.id] = dept.okveds || '';
        });
        setLocalInputs(resetInputs);
    }, [form.departments]);

    // Automatically dismiss dropdown when parent accordion closes
    useEffect(() => {
        if (!isExpanded) {
            setIsAddingDep(false);
        }
    }, [isExpanded]);

    // Calculate dirty state for reactive UI updates
    const hasChanges = useMemo(() => {
        const initialDeps = form.departments || [];

        if (attachedDeps.length !== initialDeps.length) return true;

        const depsOrderOrIdChanged = attachedDeps.some(
            (dept, idx) => dept.id !== initialDeps[idx]?.id
        );
        if (depsOrderOrIdChanged) return true;

        const inputsChanged = attachedDeps.some((dept) => {
            const initialDept = initialDeps.find((d) => d.id === dept.id);
            const initialVal = initialDept?.okveds || '';
            const currentVal = localInputs[dept.id] ?? '';
            return currentVal !== initialVal;
        });

        return inputsChanged;
    }, [attachedDeps, localInputs, form.departments]);

    const handleLocalInputChange = (deptId: any, val: string) => {
        setLocalInputs(prev => ({
            ...prev,
            [deptId]: val
        }));
    };

    const handleTriggerSave = (updatedDeps: MinDep[]) => {
        const payloadDepartments = updatedDeps.map(d => ({
            id: d.id,
            value: localInputs[d.id] ?? d.okveds ?? ''
        }));

        setProcessing(true);

        router.put(
            route('forms_distribution.update', { id: form.id }),
            {
                id: form.id,
                departments: payloadDepartments,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            }
        );
    };

    // Open custom deletion modal or purge transient local entry expeditiously
    const promptDeleteDepartment = (deptId: number | string) => {
        const isPersisted = form.departments?.some(d => d.id === deptId);

        if (isPersisted) {
            setDeptToDelete(deptId);
        } else {
            setAttachedDeps(prev => prev.filter(d => d.id !== deptId));
            setLocalInputs(prev => {
                const copy = { ...prev };
                delete copy[deptId];
                return copy;
            });
        }
    };

    const confirmDeleteDepartment = () => {
        if (deptToDelete === null) return;

        setProcessing(true);
        router.delete(
            route('forms_distribution.delete', { id: form.id }),
            {
                data: { department_id: deptToDelete },
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    setDeptToDelete(null);
                },
            }
        );
    };

    const handleReset = () => {
        const initialDeps = form.departments || [];
        setAttachedDeps(initialDeps);

        const resetInputs: Record<string, string> = {};
        initialDeps.forEach((dept: MinDep) => {
            resetInputs[dept.id] = dept.okveds || '';
        });
        setLocalInputs(resetInputs);
    };

    const handleAddDepartment = (deptIdString: string) => {
        const deptToAdd = allDepartments.find(d => String(d.id) === deptIdString);
        if (!deptToAdd) return;

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
    };

    const toggleDeptOkvedInput = (deptId: any) => {
        setDepartmentOkvedInputOpen(prev => ({
            ...prev,
            [deptId]: !prev[deptId]
        }));
    };

    const hasDepartments = attachedDeps.length > 0;
    const alternatingBg = index % 2 === 0 ? 'bg-white' : 'bg-indigo-100';

    return (
        <>
            <div className={`relative border border-gray-300 shadow-sm transition-all duration-150 ${isExpanded ? 'ring-2 ring-indigo-800 bg-white' : alternatingBg}`}>
                {/* Form Header Bar */}
                <div
                    onClick={() => toggleFormExpand(form.id)}
                    className={`flex items-stretch justify-between transition-colors group select-none min-h-12 cursor-pointer ${isExpanded ? 'bg-indigo-600 text-white' : `hover:bg-indigo-100/50 ${alternatingBg}`}`}
                >
                    <div className="flex items-center flex-1 min-w-0">
                        <div className={`px-4 py-3 border-r border-gray-300 text-xs font-mono font-bold shrink-0 uppercase tracking-tight min-w-25 text-center flex items-center justify-center ${isExpanded ? 'bg-indigo-800 text-white border-indigo-500' : 'bg-gray-100/80 text-gray-700'}`}>
                            {form.okud || form.code || `ОКУД: ${form.id}`}
                        </div>
                        <div className={`px-4 py-3 w-full text-sm font-mono font-bold truncate transition-colors ${isExpanded ? 'text-white' : 'text-gray-900 group-hover:text-indigo-600'}`}>
                            {form.name}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pr-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                            <button
                                ref={triggerButtonRef}
                                type="button"
                                onClick={() => {
                                    if (!isAddingDep && !isExpanded) {
                                        toggleFormExpand(form.id);
                                    }
                                    setIsAddingDep(prev => !prev);
                                }}
                                className={`w-8 h-8 font-mono text-base font-bold flex items-center justify-center cursor-pointer shadow-sm transition-colors ${isExpanded ? 'bg-indigo-800 hover:bg-indigo-900 text-white border border-indigo-400' : 'bg-indigo-700 hover:bg-indigo-800 text-white'}`}
                                title="Прикрепить ведомство"
                            >
                                +
                            </button>

                            {isAddingDep && (
                                <>
                                    <div
                                        className="fixed inset-0 bg-black/10 z-40 cursor-default"
                                        onClick={() => setIsAddingDep(false)}
                                    />
                                    <div className={`absolute right-0 w-100 z-50 bg-white shadow-xl border border-indigo-200 p-2 ${openUpwards ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
                                        <SimpleDepSelect
                                            departments={allDepartments}
                                            attachedDepartments={attachedDeps}
                                            selectedId=""
                                            onSelect={(id) => handleAddDepartment(id)}
                                            onOpenForm={() => { if (!isExpanded) toggleFormExpand(form.id); }}
                                            placeholder="Выберите ведомство..."
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div
                            className={`w-8 h-8 flex items-center justify-center font-mono text-xs cursor-pointer ${isExpanded ? 'text-white' : 'text-gray-600 group-hover:text-indigo-600'}`}
                            onClick={() => toggleFormExpand(form.id)}
                        >
                            <div className={`w-0 h-0 border-x-[6px] border-x-transparent transition-all duration-200 border-t-12 ${isExpanded ? 'border-t-white rotate-180' : 'border-t-indigo-800'}`}></div>
                        </div>
                    </div>
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                    <div className="p-4 bg-gray-50/90 border-t border-gray-300 space-y-4 font-mono text-sm">
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
                                        <div className="flex items-stretch bg-gray-100 border-b border-gray-300 justify-between">
                                            <div className="flex items-center min-w-0 flex-1">
                                                <div className="px-4 py-2 bg-indigo-900 text-white text-xs font-mono font-bold border-r border-gray-300 min-w-12.5 flex items-center justify-center">
                                                    {dept.code || `#${idx + 1}`}
                                                </div>
                                                <div className="px-4 py-3 break-all text-sm font-mono font-bold text-gray-800 uppercase tracking-tight flex items-center flex-1 min-w-0">
                                                    {deptName}
                                                </div>
                                            </div>

                                            {/* Header Right Action Block */}
                                            <div className="flex items-center px-3 gap-3">
                                                {/* Square ✕ Delete Button (Left of border line) */}
                                                <button
                                                    type="button"
                                                    onClick={() => promptDeleteDepartment(dept.id)}
                                                    disabled={processing}
                                                    className="w-7 h-7 flex items-center justify-center bg-white hover:bg-red-50 border border-red-300 hover:border-red-400 text-red-500 hover:text-red-600 font-mono font-bold text-xs rounded-none transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                                                    title="Удалить ведомство"
                                                >
                                                    ✕
                                                </button>

                                                {/* OKVED Section with Left Accent Line */}
                                                <div className="flex items-center gap-3 border-l-2 border-l-indigo-600 pl-3">
                                                    <span className="text-sm font-mono text-gray-800">оквед-2</span>
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
                                        </div>

                                        {isOkvedInputOpen && (
                                            <div className="p-4 text-sm font-mono text-gray-800 w-full bg-white flex gap-2 items-center border-t border-gray-200">
                                                <input
                                                    type="text"
                                                    value={inputValue}
                                                    placeholder="Введите ОКВЭДы..."
                                                    onChange={(e) => handleLocalInputChange(dept.id, e.target.value)}
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
                            </div>
                        )}

                        {/* Action controls block */}
                        {hasChanges && (
                            <div>
                                <div className="border-b-2 border-b-indigo-600"></div>
                                <div className="relative w-full flex justify-end mt-4">
                                    <div className="bg-white w-full border border-gray-400 p-1.5 shadow-md flex items-center gap-2 min-w-70">
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            disabled={processing}
                                            className="flex-1 px-4 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-800 font-mono text-md font-bold uppercase transition-colors cursor-pointer border border-gray-300 text-center"
                                        >
                                            отменить
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleTriggerSave(attachedDeps)}
                                            disabled={processing}
                                            className="flex-1 px-4 py-1 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white font-mono text-md font-bold uppercase transition-colors shadow-sm cursor-pointer text-center"
                                        >
                                            {processing ? 'сохранение...' : 'сохранить'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Shared Confirmation Modal Paradigm */}
            <Confirmation
                show={deptToDelete !== null}
                title="Подтверждение удаления"
                message="Вы уверены, что хотите удалить ведомство?"
                onConfirm={confirmDeleteDepartment}
                onClose={() => setDeptToDelete(null)}
            />
        </>
    );
};