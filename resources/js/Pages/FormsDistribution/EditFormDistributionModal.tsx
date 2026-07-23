import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from "@/components/custom/Modal";
import { DepartmentsPartial } from './Partials/DepartmentsPartial';
// import { OkvedPartial } from './Partials/OkvedPartial';
import { Confirmation } from './Partials/Confirmation';
import { Department } from '@/types';

interface EditFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    departments: Department[],
    form: any;
}

export const EditFormModal = ({ isOpen, onClose, departments, form }: EditFormModalProps) => {
    const { data, setData, put, processing, reset } = useForm({
        id: '',
        name: '',
        departments: [] as Array<{ department_id: string; okveds: string[] }>,
    });

    const [drafts, setDrafts] = useState<
        Record<
            string,
            {
                id: string;
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

        put('/forms_distribution', {
            preserveScroll: true,
            onSuccess: () => {
                setAddedDepartmentIndex(null);
                setHasUnsavedDepartment(false);
                reset();
                setActiveDeptIndex(null);
                onClose();
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
                    className="font-mono text-gray-900 select-none p-1 w-fit h-fit relative pt-7"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                    <form
                        onSubmit={handleSubmit}
                        onClick={handleOutsideClick}
                        className="flex flex-row items-start mt-2 w-fit cursor-default"
                    >
                        <DepartmentsPartial
                            formName={data.name}
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
                            onSave={() => handleSubmit()}
                        />

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