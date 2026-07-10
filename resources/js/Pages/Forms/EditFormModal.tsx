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
    versionId: number;
    form: any;
}

export const EditFormModal = ({ isOpen, onClose, departments, versionId, form }: EditFormModalProps) => {
    const { data, setData, put, processing, reset } = useForm({
        id: '',
        name: '',
        indicators: 0,
        reports: 1,
        coeff: '1.0',
        departments: [] as Array<{ department_id: string; okveds: string[] }>,
        version_id: versionId
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
                version_id: number;
            }
        >
    >({});

    const [isDeptConfirmOpen, setIsDeptConfirmOpen] = useState(false);
    const [deptToDelete, setDeptToDelete] = useState<number | null>(null);

    const [selectedDeptId, setSelectedDeptId] = useState<string>('');
    const [activeDeptIndex, setActiveDeptIndex] = useState<number | null>(null);

    const [ov1, setOv1] = useState('');
    const [ov2, setOv2] = useState('');
    const [ov3, setOv3] = useState('');

    const [editingOkvedIdx, setEditingOkvedIdx] = useState<number | null>(null);
    const [editOv1, setEditOv1] = useState('');
    const [editOv2, setEditOv2] = useState('');
    const [editOv3, setEditOv3] = useState('');

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
                okveds: Array.isArray(d.okveds) ? d.okveds : ['10:20:30', '45:11:12']
            }))
            : Array.isArray(form.department_ids) // <-- Added check for multiple IDs
                ? form.department_ids.map((id: any) => ({
                    department_id: String(id),
                    okveds: ['10:20:30']
                }))
                : (form.department_id
                    ? [{ department_id: String(form.department_id), okveds: ['10:20:30'] }]
                    : []);

        setData({
            id: form.id,
            name: form.name,
            indicators: form.indicators,
            reports: form.reports,
            coeff: form.coeff,
            departments: mappedDepartments,
            version_id: versionId
        });

        setActiveDeptIndex(null);
        setEditingOkvedIdx(null);
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
        if (data.departments.some(d => d.department_id === selectedDeptId)) {
            setSelectedDeptId('');
            return;
        }

        const updatedDepts = [...data.departments, { department_id: selectedDeptId, okveds: [] }];

        updateFormData('departments', updatedDepts);
        setAddedDepartmentIndex(updatedDepts.length - 1);
        setHasUnsavedDepartment(true);
        setSelectedDeptId('');
        setActiveDeptIndex(updatedDepts.length - 1);
    };

    const handleRemoveDepartment = (indexToRemove: number) => {
        const updatedDepts = data.departments.filter((_, idx) => idx !== indexToRemove);
        updateFormData('departments', updatedDepts);
        if (activeDeptIndex === indexToRemove) {
            setActiveDeptIndex(null);
            setEditingOkvedIdx(null);
        } else if (activeDeptIndex !== null && activeDeptIndex > indexToRemove) {
            setActiveDeptIndex(activeDeptIndex - 1);
        }
    };

    const handleAddOkved = () => {
        if (!ov1 || !ov2 || !ov3 || activeDeptIndex === null) return;
        const combined = `${ov1.trim()}:${ov2.trim()}:${ov3.trim()}`;

        const updatedDepts = [...data.departments];
        if (!updatedDepts[activeDeptIndex].okveds.includes(combined)) {
            updatedDepts[activeDeptIndex].okveds = [...updatedDepts[activeDeptIndex].okveds, combined];
            updateFormData('departments', updatedDepts);
        }
        setOv1('');
        setOv2('');
        setOv3('');
    };

    const startEditingOkved = (idx: number, currentVal: string) => {
        const segments = currentVal.split(':');
        setEditOv1(segments[0] || '');
        setEditOv2(segments[1] || '');
        setEditOv3(segments[2] || '');
        setEditingOkvedIdx(idx);
    };

    const handleSaveOkvedEdit = (okvedIdx: number) => {
        if (!editOv1 || !editOv2 || !editOv3 || activeDeptIndex === null) return;
        const combined = `${editOv1.trim()}:${editOv2.trim()}:${editOv3.trim()}`;

        const updatedDepts = [...data.departments];
        updatedDepts[activeDeptIndex].okveds[okvedIdx] = combined;
        updateFormData('departments', updatedDepts);
        setEditingOkvedIdx(null);
    };

    const handleRemoveOkvedRequest = (okvedIdx: number) => {
        setOkvedToDelete(okvedIdx);
        setIsOkvedConfirmOpen(true);
    };

    const handleConfirmRemoveOkved = () => {
        if (activeDeptIndex === null || okvedToDelete === null) return;
        const updated = [...data.departments];
        updated[activeDeptIndex].okveds = updated[activeDeptIndex].okveds.filter((_, i) => i !== okvedToDelete);
        updateFormData('departments', updated);
        if (editingOkvedIdx === okvedToDelete) setEditingOkvedIdx(null);
        setOkvedToDelete(null);
    };

    const handleCancel = () => {
        if (addedDepartmentIndex !== null) {
            setDeptToDelete(addedDepartmentIndex);
            setIsDeptConfirmOpen(true);
            return;
        }
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put('/forms', {
            onSuccess: () => {
                setAddedDepartmentIndex(null);
                setHasUnsavedDepartment(false);
                reset();
                setActiveDeptIndex(null);
                setEditingOkvedIdx(null);
                onClose();
            },
        });
    };

    const isPanel3Open = !!(activeDeptIndex !== null && data.departments[activeDeptIndex]);

    const handleOutsideClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            if (isOkvedConfirmOpen) return; // Ignore if confirmation is open
            if (isDeptConfirmOpen) return;
            onClose();
        }
    };

    const currentDepartmentName = activeDeptIndex !== null
        ? departments.find(dept => dept.id === data.departments[activeDeptIndex]?.department_id)?.name || 'Выбрано'
        : '';

    return (
        <>
            <Modal show={isOpen}
                onClose={() => {
                    if (isOkvedConfirmOpen) return;
                    if (isDeptConfirmOpen) return;
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
                                    Сохранить
                                </button>
                            </div>
                        </div>

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
                            onSave={() =>
                                handleSubmit({
                                    preventDefault: () => { }
                                } as React.FormEvent)
                            }
                            onReset={handleCancel}
                            showActions={hasUnsavedDepartment}
                        />

                        <OkvedPartial
                            isOpen={isPanel3Open}
                            departmentName={currentDepartmentName}
                            okveds={isPanel3Open ? data.departments[activeDeptIndex!].okveds : []}
                            activeDeptIndex={activeDeptIndex}
                            editingOkvedIdx={editingOkvedIdx}
                            ov1={ov1}
                            ov2={ov2}
                            ov3={ov3}
                            editOv1={editOv1}
                            editOv2={editOv2}
                            editOv3={editOv3}
                            onOv1Change={setOv1}
                            onOv2Change={setOv2}
                            onOv3Change={setOv3}
                            onEditOv1Change={setEditOv1}
                            onEditOv2Change={setEditOv2}
                            onEditOv3Change={setEditOv3}
                            onAddOkved={handleAddOkved}
                            onStartEditing={startEditingOkved}
                            onSaveEdit={handleSaveOkvedEdit}
                            onCancelEdit={() => setEditingOkvedIdx(null)}
                            onRemoveOkved={handleRemoveOkvedRequest}
                            onClearBuilder={() => { setOv1(''); setOv2(''); setOv3(''); }}
                        />
                    </form>
                </div>
            </Modal>

            <Confirmation
                show={isOkvedConfirmOpen}
                onClose={() => setIsOkvedConfirmOpen(false)}
                onConfirm={handleConfirmRemoveOkved}
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