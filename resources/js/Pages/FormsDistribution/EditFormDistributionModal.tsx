import React, { useEffect, useState } from 'react';
import Modal from "@/components/custom/Modal";
import { useForm } from '@inertiajs/react';
import { DepartmentsPartial } from './Partials/DepartmentsPartial';
import { OkvedPartial } from './Partials/OkvedPartial';
import { Confirmation } from './Partials/Confirmation';

interface EditFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    departments: Array<{ id: string; name: string; territory: string }>;
    form: any;
}

export const EditFormModal = ({ isOpen, onClose, departments, form }: EditFormModalProps) => {
    const { data, setData, put, processing, reset } = useForm({
        id: '',
        name: '',
        indicators: 0,
        reports: 1,
        coeff: '1.0',
        departments: [] as Array<{ department_id: string; okveds: string[] }>,
    });

    const [drafts, setDrafts] = useState<
        Record<
            string,
            {
                id: string;
                name: string;
                indicators: number;
                reports: number;
                coeff: string;
                departments: Array<{ department_id: string; okveds: string[] }>;
            }
        >
    >({});

    const [isDeptConfirmOpen, setIsDeptConfirmOpen] = useState(false);
    const [deptToDelete, setDeptToDelete] = useState<number | null>(null);

    const [selectedDeptId, setSelectedDeptId] = useState<string>('');
    const [activeDeptIndex, setActiveDeptIndex] = useState<number | null>(null);

    const [hasUnsavedDepartment, setHasUnsavedDepartment] = useState(false);
    const [addedDepartmentIndex, setAddedDepartmentIndex] = useState<number | null>(null);

    const [isOkvedConfirmOpen, setIsOkvedConfirmOpen] = useState(false);
    const [okvedToDelete, setOkvedToDelete] = useState<number | null>(null);

    const handleRequestDelete = (index: number) => {
        setDeptToDelete(index);
        setIsDeptConfirmOpen(true);
    };

    const executeDelete = () => {
        if (deptToDelete !== null) {
            handleRemoveDepartment(deptToDelete);

            if (deptToDelete === addedDepartmentIndex) {
                setAddedDepartmentIndex(null);
                setHasUnsavedDepartment(false);
            }

            setIsDeptConfirmOpen(false);
            setDeptToDelete(null);
        }
    };

    useEffect(() => {
        if (!form) return;

        if (drafts[form.id]) {
            setData(drafts[form.id]);
            return;
        }

        const mappedDepartments = Array.isArray(form.departments)
            ? form.departments.map((d: any) => ({
                department_id: String(d.department_id || d.id),
                okveds: Array.isArray(d.okveds) ? d.okveds : []
            }))
            : Array.isArray(form.department_ids)
                ? form.department_ids.map((id: any) => ({
                    department_id: String(id),
                    okveds: []
                }))
                : (form.department_id
                    ? [{ department_id: String(form.department_id), okveds: [] }]
                    : []);

        setData({
            id: form.id,
            name: form.name,
            indicators: form.indicators,
            reports: form.reports,
            coeff: form.coeff,
            departments: mappedDepartments,
        });

        setActiveDeptIndex(null);
        setAddedDepartmentIndex(null);
        setHasUnsavedDepartment(false);
    }, [form?.id]);

    const updateFormData = <K extends keyof typeof data>(
        key: K,
        value: (typeof data)[K]
    ) => {
        (setData as any)(key, value);

        if (!form) return;

        setDrafts(prev => ({
            ...prev,
            [form.id]: {
                ...data,
                [key]: value
            }
        }));
    };

    const handleAddDepartment = () => {
        if (!selectedDeptId) return;

        // Prevent adding duplicates
        if (data.departments.some(d => d.department_id === selectedDeptId)) {
            setSelectedDeptId('');
            return;
        }

        const updatedDepts = [...data.departments, { department_id: selectedDeptId, okveds: [] }];

        // Update local state ONLY (no onSave call here)
        updateFormData('departments', updatedDepts);
        setAddedDepartmentIndex(updatedDepts.length - 1);
        setHasUnsavedDepartment(true);
        setSelectedDeptId('');

        // Immediately highlight the new department so the OKVED panel opens
        setActiveDeptIndex(updatedDepts.length - 1);
    };

    const handleRemoveDepartment = (indexToRemove: number) => {
        const updatedDepts = data.departments.filter((_, idx) => idx !== indexToRemove);
        updateFormData('departments', updatedDepts);

        if (activeDeptIndex === indexToRemove) {
            setActiveDeptIndex(null);
        } else if (activeDeptIndex !== null && activeDeptIndex > indexToRemove) {
            setActiveDeptIndex(activeDeptIndex - 1);
        }
    };

    const handleCancel = () => {
        if (addedDepartmentIndex !== null) {
            setDeptToDelete(addedDepartmentIndex);
            setIsDeptConfirmOpen(true);
            return;
        }
        onClose();
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // This is the ONLY place that actually sends the request to Laravel
        put('/forms_distribution', {
            preserveScroll: true,
            onSuccess: () => {
                setAddedDepartmentIndex(null);
                setHasUnsavedDepartment(false);
                reset();
                setActiveDeptIndex(null);
                onClose(); // Close modal only upon successful save
            },
        });
    };

    const isPanel3Open = !!(activeDeptIndex !== null && data.departments[activeDeptIndex]);

    const handleOutsideClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            if (isOkvedConfirmOpen || isDeptConfirmOpen) return;
            onClose();
        }
    };

    return (
        <>
            <Modal show={isOpen}
                onClose={() => {
                    if (isOkvedConfirmOpen || isDeptConfirmOpen) return;
                    onClose();
                }}
                maxWidth="fit">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    #modal div[class*="bg-white"][class*="shadow-xl"] {
                        background-color: transparent !important;
                        box-shadow: none !important;
                        width: fit-content !important;
                        max-width: fit-content !important;
                    }
                    #modal div[class*="dark:bg-gray-800"] {
                        background-color: transparent !important;
                    }
                `}} />

                <div
                    onClick={handleOutsideClick}
                    className="font-mono text-gray-900 select-none p-1 w-fit h-fit"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                    <form
                        onSubmit={handleSubmit}
                        onClick={handleOutsideClick}
                        className="flex flex-row items-start w-fit cursor-default"
                    >
                        {/* Main Settings Panel */}
                        <div className="w-95 border border-gray-300 p-5 bg-gray-50 flex flex-col shadow-sm shrink-0 mr-5">
                            <div className="space-y-5">
                                <h3 className="text-sm font-bold uppercase tracking-tight text-indigo-900 border-b border-indigo-200 pb-3">
                                    [*] Редактировать #{data.id}
                                </h3>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Название</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => updateFormData('name', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 text-sm font-bold focus:outline-none focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Пок.</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.indicators}
                                            onChange={e => setData('indicators', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm font-bold focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Отч.</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.reports}
                                            onChange={e => setData('reports', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm font-bold focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Коэф.</label>
                                        <input
                                            type="text"
                                            value={data.coeff}
                                            onChange={e => updateFormData('coeff', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm font-bold focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-5 border-t border-gray-200 grid grid-cols-2 gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
                                    className="px-3 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-bold uppercase cursor-pointer"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold uppercase cursor-pointer disabled:opacity-50 shadow-sm"
                                >
                                    {processing ? '...' : 'Сохранить'}
                                </button>
                            </div>
                        </div>

                        {/* Departments Panel */}
                        <DepartmentsPartial
                            onConfirmRemove={handleRequestDelete}
                            departments={departments}
                            dataDepartments={data.departments}
                            selectedDeptId={selectedDeptId}
                            activeDeptIndex={activeDeptIndex}
                            onSelectDept={setSelectedDeptId}
                            onAddDepartment={handleAddDepartment}
                            onRemoveDepartment={handleRemoveDepartment}
                            onSelectActiveDept={setActiveDeptIndex}
                            isPanel3Open={isPanel3Open}
                            onReset={handleCancel}
                            showActions={hasUnsavedDepartment}
                            onSave={() => handleSubmit()} // <-- Add this back right here
                        />

                        {/* OKVEDs Panel */}
                        {/* <OkvedPartial
                            isOpen={isPanel3Open}
                            activeDeptIndex={activeDeptIndex}
                            form={{ data, setData, processing, put }}
                            okveds={isPanel3Open && activeDeptIndex !== null ? data.departments[activeDeptIndex].okveds : []}
                            onClose={onClose}
                        /> */}
                    </form>
                </div>
            </Modal>

            {/* Confirmations */}
            <Confirmation
                show={isOkvedConfirmOpen}
                onClose={() => setIsOkvedConfirmOpen(false)}
                onConfirm={() => { }}
                message="Вы уверены, что хотите удалить этот код ОКВЭД?"
            />

            <Confirmation
                show={isDeptConfirmOpen}
                onClose={() => setIsDeptConfirmOpen(false)}
                onConfirm={executeDelete}
                title="Удаление отдела"
                message="Вы уверены, что хотите удалить этот отдел? Все связанные с ним коды также будут удалены."
            />
        </>
    );
};