import React, { useState, useRef, useEffect } from 'react';
import Modal from "@/components/custom/Modal";

interface OkvedModalProps {
    isOpen: boolean;
    activeFormIndex: number | null; // Index of the form currently being edited in the forms array
    activeDeptIndex: number | null; // Index of the department currently active
    form: any; // The Inertia useForm instance passed from the parent index view
    onClose: () => void;
}

export const OkvedModal = ({
    isOpen,
    activeFormIndex,
    activeDeptIndex,
    form,
    onClose
}: OkvedModalProps) => {
    // Refs for auto-focus moving on segment input
    const o2Ref = useRef<HTMLInputElement>(null);
    const o3Ref = useRef<HTMLInputElement>(null);

    // Builders for a brand new OKVED item [ov1, ov2, ov3]
    const [ov1, setOv1] = useState('');
    const [ov2, setOv2] = useState('');
    const [ov3, setOv3] = useState('');

    // Local tracking for editing an existing item within the array list
    const [editingOkvedIdx, setEditingOkvedIdx] = useState<number | null>(null);
    const [editOv1, setEditOv1] = useState('');
    const [editOv2, setEditOv2] = useState('');
    const [editOv3, setEditOv3] = useState('');

    // State for confirming deletion
    const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);

    // Extract current contextual targets safely
    const currentForm = activeFormIndex !== null ? form.data.forms[activeFormIndex] : null;
    const currentDept = (currentForm && activeDeptIndex !== null)
        ? currentForm.departments?.[activeDeptIndex]
        : null;

    const departmentName = currentDept?.name || '';
    // Make sure okveds array exists locally in data tracking
    const okveds: string[] = currentDept?.okveds || [];

    // Reset local builders if active targets shift
    useEffect(() => {
        clearBuilder();
        cancelEdit();
        setConfirmDeleteIdx(null);
    }, [activeFormIndex, activeDeptIndex, isOpen]);

    const handleSegmentChange = (
        val: string,
        setter: (v: string) => void,
        nextRef?: React.RefObject<HTMLInputElement | null>
    ) => {
        const sanitized = val.replace(/[^0-9]/g, '').slice(0, 2);
        setter(sanitized);
        if (sanitized.length === 2 && nextRef?.current) {
            nextRef.current.focus();
        }
    };

    const clearBuilder = () => {
        setOv1('');
        setOv2('');
        setOv3('');
    };

    const cancelEdit = () => {
        setEditingOkvedIdx(null);
        setEditOv1('');
        setEditOv2('');
        setEditOv3('');
    };

    // Helper to commit updates back up into Inertia form state
    const updateFormStateOkveds = (updatedOkvedsList: string[]) => {
        if (activeFormIndex === null || activeDeptIndex === null) return;

        form.setData((prev: any) => {
            const nextForms = [...prev.forms];
            const nextDepartments = [...(nextForms[activeFormIndex].departments || [])];

            nextDepartments[activeDeptIndex] = {
                ...nextDepartments[activeDeptIndex],
                okveds: updatedOkvedsList
            };

            nextForms[activeFormIndex] = {
                ...nextForms[activeFormIndex],
                departments: nextDepartments
            };

            return { ...prev, forms: nextForms };
        });
    };

    const handleAddOkved = () => {
        if (!ov1 || !ov2 || !ov3) return;
        const newCode = `${ov1}:${ov2}:${ov3}`;

        if (!okveds.includes(newCode)) {
            updateFormStateOkveds([...okveds, newCode]);
        }
        clearBuilder();
    };

    const handleStartEditing = (idx: number, fullValue: string) => {
        setConfirmDeleteIdx(null); // Close any open delete prompts
        setEditingOkvedIdx(idx);
        const parts = fullValue.split(':');
        setEditOv1(parts[0] || '');
        setEditOv2(parts[1] || '');
        setEditOv3(parts[2] || '');
    };

    const handleSaveEdit = (idx: number) => {
        if (!editOv1 || !editOv2 || !editOv3) return;
        const updatedCode = `${editOv1}:${editOv2}:${editOv3}`;

        const nextList = [...okveds];
        nextList[idx] = updatedCode;

        updateFormStateOkveds(nextList);
        cancelEdit();
    };

    const handleRemoveOkved = (idx: number) => {
        const nextList = okveds.filter((_, i) => i !== idx);
        updateFormStateOkveds(nextList);
        if (editingOkvedIdx === idx) cancelEdit();
        setConfirmDeleteIdx(null);
    };

    const triggerPutFormRequest = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(route('forms.update'), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="md">
            <div className="p-6 space-y-5 bg-white">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-indigo-200 pb-3">
                    <h3 className="text-sm font-bold uppercase text-indigo-900 tracking-wide truncate max-w-[85%]">
                        Коды: {departmentName}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-semibold line-height-none"
                    >
                        &times;
                    </button>
                </div>

                {/* List of existing codes */}
                {okveds.length > 0 && (
                    <div className="space-y-0 max-h-60 overflow-y-auto bg-white border border-indigo-200 custom-scrollbar rounded-sm shadow-inner">
                        {okveds.map((okv, oIdx) => {
                            const isEditing = editingOkvedIdx === oIdx;
                            const isConfirmingDelete = confirmDeleteIdx === oIdx;
                            const parts = okv.split(':');

                            return (
                                <div key={oIdx} className="border-b border-indigo-100 bg-white p-3 transition-colors hover:bg-indigo-50/30">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <React.Fragment key={i}>
                                                    <input
                                                        type="text"
                                                        maxLength={2}
                                                        onFocus={() => handleStartEditing(oIdx, okv)}
                                                        value={isEditing ? (i === 0 ? editOv1 : i === 1 ? editOv2 : editOv3) : parts[i]}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                                            if (i === 0) setEditOv1(val);
                                                            if (i === 1) setEditOv2(val);
                                                            if (i === 2) setEditOv3(val);
                                                        }}
                                                        className="w-10 text-center border border-indigo-200 py-1 text-sm font-bold bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-sm"
                                                    />
                                                    {i < 2 && <span className="text-indigo-300 font-bold">:</span>}
                                                </React.Fragment>
                                            ))}
                                        </div>

                                        {!isConfirmingDelete ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    cancelEdit();
                                                    setConfirmDeleteIdx(oIdx);
                                                }}
                                                className="w-7 h-7 flex items-center justify-center rounded border border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-lg"
                                                title="Удалить код"
                                            >
                                                &times;
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-1.5 animate-fadeIn">
                                                <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider mr-1">Удалить?</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmDeleteIdx(null)}
                                                    className="px-2 py-0.5 border border-gray-300 bg-gray-50 text-gray-700 text-[10px] font-bold uppercase rounded hover:bg-gray-200"
                                                >
                                                    нет
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOkved(oIdx)}
                                                    className="px-2 py-0.5 border border-red-600 bg-red-600 text-white text-[10px] font-bold uppercase rounded hover:bg-red-700"
                                                >
                                                    да
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {isEditing && !isConfirmingDelete && (
                                        <div className="flex gap-2 pt-2.5 max-w-[146px]">
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); cancelEdit(); }}
                                                className="flex-1 px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[10px] font-bold uppercase border border-gray-300 rounded-sm"
                                            >
                                                сброс
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); handleSaveEdit(oIdx); }}
                                                className="flex-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase border border-indigo-600 rounded-sm shadow-sm"
                                            >
                                                ок
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Code builder module */}
                <div className="space-y-4 bg-gray-50 p-4 border border-indigo-100 rounded-sm shadow-sm">
                    <span className="text-[11px] font-bold uppercase text-indigo-900 tracking-wider block">Новый код</span>
                    <div className="flex items-center justify-center gap-1.5 bg-white p-3 border border-indigo-200 shadow-inner rounded-sm">
                        <input
                            type="text"
                            maxLength={2}
                            value={ov1}
                            placeholder="00"
                            onChange={e => handleSegmentChange(e.target.value, setOv1, o2Ref)}
                            className="w-12 text-center border border-indigo-300 py-1.5 text-sm font-bold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-sm"
                        />
                        <span className="font-bold text-indigo-300 text-lg">:</span>
                        <input
                            type="text"
                            maxLength={2}
                            ref={o2Ref}
                            value={ov2}
                            placeholder="00"
                            onChange={e => handleSegmentChange(e.target.value, setOv2, o3Ref)}
                            className="w-12 text-center border border-indigo-300 py-1.5 text-sm font-bold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-sm"
                        />
                        <span className="font-bold text-indigo-300 text-lg">:</span>
                        <input
                            type="text"
                            maxLength={2}
                            ref={o3Ref}
                            value={ov3}
                            placeholder="00"
                            onChange={e => handleSegmentChange(e.target.value, setOv3)}
                            className="w-12 text-center border border-indigo-300 py-1.5 text-sm font-bold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); clearBuilder(); }}
                            className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold uppercase border border-gray-300 rounded-sm shadow-sm"
                        >
                            сбросить
                        </button>
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); handleAddOkved(); }}
                            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase border border-indigo-600 rounded-sm shadow-sm"
                        >
                            Добавить
                        </button>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-sm"
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        disabled={form.processing}
                        onClick={triggerPutFormRequest}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors rounded-sm"
                    >
                        {form.processing ? 'Сохранение...' : 'Сохранить форму'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};