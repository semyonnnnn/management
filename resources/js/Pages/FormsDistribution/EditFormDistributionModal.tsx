import { useState, useRef, useEffect } from "react";
import { useForm } from '@inertiajs/react';
import Modal from "@/components/custom/Modal";
import { Confirmation } from './Partials/Confirmation';
import { Department } from "@/types";

interface DepartmentData {
    department_id: string;
    okveds: string;
}

interface EditFormDistributionModalProps {
    isOpen: boolean;
    onClose: () => void;
    departments: Department[];
    form: any;
}

// Translation mapping for field names
const FIELD_TRANSLATIONS: Record<string, string> = {
    'name': 'Название',
    'departments': 'Отделы',
    'departments.general': 'Ошибка в структуре отделов'
};

export const EditFormDistributionModal = ({
    isOpen,
    onClose,
    departments,
    form,
}: EditFormDistributionModalProps) => {
    const { data, setData, put, reset, errors, clearErrors } = useForm({
        id: '',
        name: '',
        departments: [] as DepartmentData[],
    });

    const [drafts, setDrafts] = useState<
        Record<
            string,
            {
                id: string;
                name: string;
                departments: DepartmentData[];
            }
        >
    >({});

    const [isDeptConfirmOpen, setIsDeptConfirmOpen] = useState(false);
    const [deptToDelete, setDeptToDelete] = useState<number | null>(null);

    const [selectedDeptId, setSelectedDeptId] = useState<string>('');
    const [activeDeptIndex, setActiveDeptIndex] = useState<number | null>(null);
    const [addedDepartmentIndex, setAddedDepartmentIndex] = useState<number | null>(null);
    const [isOkvedConfirmOpen, setIsOkvedConfirmOpen] = useState(false);

    // Search and dropdown state
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const handleRequestDelete = (index: number) => {
        setDeptToDelete(index);
        setIsDeptConfirmOpen(true);
    };

    const executeDelete = () => {
        if (deptToDelete !== null) {
            handleRemoveDepartment(deptToDelete);

            if (deptToDelete === addedDepartmentIndex) {
                setAddedDepartmentIndex(null);
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
                okveds: typeof d.okveds === 'string' ? d.okveds : (Array.isArray(d.okveds) ? d.okveds.join(', ') : '')
            }))
            : Array.isArray(form.department_ids)
                ? form.department_ids.map((id: any) => ({
                    department_id: String(id),
                    okveds: ''
                }))
                : (form.department_id
                    ? [{ department_id: String(form.department_id), okveds: '' }]
                    : []);

        setData({
            id: form.id,
            name: form.name,
            departments: mappedDepartments,
        });

        setActiveDeptIndex(null);
        setAddedDepartmentIndex(null);
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

    const handleAddDepartment = (deptIdToAdd?: string) => {
        const targetId = deptIdToAdd || selectedDeptId;
        if (!targetId) return;

        if (data.departments.some(d => d.department_id === targetId)) {
            setSelectedDeptId('');
            return;
        }

        const updatedDepts = [...data.departments, { department_id: targetId, okveds: '' }];

        updateFormData('departments', updatedDepts);
        setAddedDepartmentIndex(updatedDepts.length - 1);
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

    const handleOkvedChange = (index: number, value: string) => {
        const sanitizedValue = value.replace(/[^0-9:,;\s]/g, '');
        const updatedDepts = [...data.departments];
        updatedDepts[index] = {
            ...updatedDepts[index],
            okveds: sanitizedValue
        };
        updateFormData('departments', updatedDepts);
    };

    const handleCancel = () => {
        clearErrors();
        if (addedDepartmentIndex !== null) {
            setDeptToDelete(addedDepartmentIndex);
            setIsDeptConfirmOpen(true);
            return;
        }
        onClose();
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (data.departments.length === 0) return;

        put('/forms_distribution', {
            preserveScroll: true,
            onSuccess: () => {
                setAddedDepartmentIndex(null);
                reset();
                clearErrors();
                setActiveDeptIndex(null);
                onClose();
            },
        });
    };

    const handleOutsideClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            if (isOkvedConfirmOpen || isDeptConfirmOpen) return;
            onClose();
        }
    };

    const availableDepartments = (departments ?? []).filter(
        dept => !(data.departments ?? []).some(d => d?.department_id === String(dept.id))
    );

    const filteredDepartments = availableDepartments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectDepartment = (id: string) => {
        setSelectedDeptId(id);
        handleAddDepartment(id);
        setSearchTerm("");
        setIsDropdownOpen(false);
    };

    const placeholderText = data.departments.length === 0
        ? "Поиск (Без ведомства)..."
        : "Поиск ведомства...";

    const hasErrors = Object.keys(errors).length > 0;
    const isSaveDisabled = data.departments.length === 0;

    return (
        <>
            <Modal
                show={isOpen}
                onClose={() => {
                    if (isOkvedConfirmOpen || isDeptConfirmOpen) return;
                    clearErrors();
                    onClose();
                }}
                maxWidth={hasErrors ? "5xl" : "fit"}
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                    #modal div[class*="bg-white"][class*="shadow-xl"] {
                        background-color: transparent !important;
                        box-shadow: none !important;
                        width: fit-content !important;
                        max-width: none !important;
                        height: fit-content !important;
                        max-height: none !important;
                        padding: 0 !important;
                    }
                    #modal div[class*="dark:bg-gray-800"] {
                        background-color: transparent !important;
                    }
                `}} />

                <div
                    onClick={handleOutsideClick}
                    className="font-mono text-gray-900 select-none p-6 relative pt-7 text-base inline-block box-border"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                    <div className="p-5 border border-indigo-300 bg-[repeating-linear-gradient(45deg,#f5f3ff,#f5f3ff_10px,#e0e7ff_10px,#e0e7ff_20px)] flex flex-row items-stretch gap-4 transition-all duration-300">
                        <form
                            onSubmit={handleSubmit}
                            onClick={handleOutsideClick}
                            className="flex flex-row items-stretch cursor-default w-full"
                        >
                            <div className="w-full border border-gray-300 p-6 bg-white flex flex-col shadow-sm shrink-0" style={{ minWidth: '640px' }}>
                                <h3 className="text-sm font-bold uppercase tracking-tight text-indigo-900 border-b border-indigo-200 pb-3 mb-5">
                                    {data.name}
                                </h3>

                                {/* Search Input & Dropdown Container */}
                                <div className="relative mb-5 w-full z-20" ref={dropdownRef}>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        placeholder={placeholderText}
                                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 hover:border-indigo-400 text-gray-800 text-sm font-bold shadow-sm transition-all duration-150 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-500 placeholder:font-normal"
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
                                <div className="space-y-3 overflow-y-auto max-h-[500px] custom-scrollbar w-full relative z-10 pr-1">
                                    {data.departments.map((d, index) => {
                                        const match = departments.find(
                                            dept => String(dept.id) === d.department_id
                                        );

                                        return (
                                            <div
                                                key={d.department_id}
                                                className={`group relative flex flex-col gap-2.5 p-3.5 border border-transparent hover:border-gray-300 transition-all ${index % 2 === 0 ? 'bg-gray-50' : 'bg-indigo-50/40'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center text-sm font-bold pr-10">
                                                    <span className="truncate text-gray-700">
                                                        {index + 1}. {match ? match.name : `ID: ${d.department_id}`}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            handleRequestDelete(index);
                                                        }}
                                                        className="absolute right-3.5 top-3.5 w-7 h-7 flex items-center justify-center text-base font-bold border border-red-500 bg-red-500/20 text-red-600 hover:bg-red-500 hover:text-white transition-all shrink-0 select-none cursor-pointer"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>

                                                {/* OKVEDs textarea: vertical resize only, larger text */}
                                                <div>
                                                    <textarea
                                                        value={d.okveds}
                                                        onChange={(e) => handleOkvedChange(index, e.target.value)}
                                                        placeholder="ОКВЭДы (например: 01.11, 02.20)"
                                                        rows={3}
                                                        className="w-full px-3 py-2.5 bg-white border border-gray-300 text-sm font-mono text-gray-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6 pt-5 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 h-12 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold transition-colors cursor-pointer"
                                    >
                                        Отменить
                                    </button>

                                    <button
                                        type="button"
                                        disabled={isSaveDisabled}
                                        onClick={() => handleSubmit()}
                                        className={`flex-1 h-12 font-bold transition-colors ${isSaveDisabled
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                                            }`}
                                    >
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* DYNAMIC ERRORS PANEL */}
                        {hasErrors && (
                            <div className="w-80 h-full max-h-[90vh] bg-white border border-red-400 shadow-sm relative overflow-hidden flex flex-col font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                <div className="h-1.5 w-full bg-[repeating-linear-gradient(45deg,#f87171,#f87171_10px,#ef4444_10px,#ef4444_20px)] absolute top-0 left-0" />

                                <div className="p-6 flex flex-col h-full min-h-0 bg-red-50/30">
                                    <h3 className="text-sm font-bold uppercase tracking-tight text-red-700 border-b border-red-200 pb-3 mb-4 mt-2 shrink-0">
                                        [!] ошибка валидации
                                    </h3>

                                    <div
                                        className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-red-50/50 [&::-webkit-scrollbar-thumb]:bg-red-300"
                                    >
                                        {Object.entries(errors).map(([field, message]) => {
                                            const russianFieldName = FIELD_TRANSLATIONS[field] || field;

                                            return (
                                                <div key={field} className="bg-white border border-red-300 p-3 shadow-sm relative">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                                                    <div className="pl-2">
                                                        <div className="text-[10px] uppercase font-bold text-red-400 mb-1 tracking-widest">{russianFieldName}</div>
                                                        <div className="text-xs font-bold text-red-950 leading-tight">{message}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
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