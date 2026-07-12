import React, { useState, useRef, useEffect } from 'react';

interface OkvedPartialProps {
    isOpen: boolean;
    activeDeptIndex: number | null;
    form: any;
    onClose?: () => void;
    okveds: string[];
}

export const OkvedPartial = ({
    isOpen,
    activeDeptIndex,
    form,
    onClose,
    okveds = []
}: OkvedPartialProps) => {
    const o2Ref = useRef<HTMLInputElement>(null);
    const o3Ref = useRef<HTMLInputElement>(null);

    const [ov1, setOv1] = useState('');
    const [ov2, setOv2] = useState('');
    const [ov3, setOv3] = useState('');

    const [editingOkvedIdx, setEditingOkvedIdx] = useState<number | null>(null);
    const [editOv1, setEditOv1] = useState('');
    const [editOv2, setEditOv2] = useState('');
    const [editOv3, setEditOv3] = useState('');

    useEffect(() => {
        clearBuilder();
        cancelEdit();
    }, [activeDeptIndex]);

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

    const updateFormStateOkveds = (updatedOkvedsList: string[]) => {
        if (activeDeptIndex === null) return;

        form.setData((prev: any) => {
            const nextDepartments = [...prev.departments];

            nextDepartments[activeDeptIndex] = {
                ...nextDepartments[activeDeptIndex],
                okveds: updatedOkvedsList
            };

            return { ...prev, departments: nextDepartments };
        });
    };

    const handleAddOkved = () => {
        if (!ov1 || !ov2 || !ov3) return;
        const newCode = `${ov1.trim()}:${ov2.trim()}:${ov3.trim()}`;

        if (!okveds.includes(newCode)) {
            updateFormStateOkveds([...okveds, newCode]);
        }
        clearBuilder();
    };

    const handleStartEditing = (idx: number, fullValue: string) => {
        setEditingOkvedIdx(idx);
        const parts = fullValue.split(':');
        setEditOv1(parts[0] || '');
        setEditOv2(parts[1] || '');
        setEditOv3(parts[2] || '');
    };

    const handleSaveEdit = (idx: number) => {
        if (!editOv1 || !editOv2 || !editOv3) return;
        const updatedCode = `${editOv1.trim()}:${editOv2.trim()}:${editOv3.trim()}`;

        const nextList = [...okveds];
        nextList[idx] = updatedCode;

        updateFormStateOkveds(nextList);
        cancelEdit();
    };

    const handleRemoveOkved = (idx: number) => {
        const nextList = okveds.filter((_, i) => i !== idx);
        updateFormStateOkveds(nextList);
        if (editingOkvedIdx === idx) cancelEdit();
    };

    const triggerPutFormRequest = (e: React.FormEvent) => {
        e.preventDefault();
        // Updated to use the correct /forms_distribution endpoint mapping
        form.put('/forms_distribution', {
            preserveScroll: true,
            onSuccess: () => {
                if (onClose) onClose();
            }
        });
    };

    return (
        <div className={`bg-white flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden border-indigo-200
            ${isOpen ? 'w-fit border-l opacity-100' : 'w-0 border-l-0 opacity-0 pointer-events-none'}`}
        >
            <div className="w-fit p-5 space-y-5">
                <h4 className="text-xs font-bold uppercase text-indigo-900 border-b border-indigo-200 pb-2 truncate tracking-wide">
                    Коды OKBЕД
                </h4>

                {okveds.length > 0 && (
                    <div className="space-y-0 max-h-55 overflow-y-auto mb-5 bg-white border border-indigo-200 custom-scrollbar">
                        {okveds.map((okv, oIdx) => {
                            const isEditing = editingOkvedIdx === oIdx;
                            const parts = okv.split(':');

                            return (
                                <div key={oIdx} className="border-b border-indigo-100 bg-white p-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <React.Fragment key={i}>
                                                    <input
                                                        type="text"
                                                        maxLength={2}
                                                        onFocus={() => handleStartEditing(oIdx, okv)}
                                                        value={isEditing ? (i === 0 ? editOv1 : i === 1 ? editOv2 : editOv3) : parts[i] || ''}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                                            if (i === 0) setEditOv1(val);
                                                            if (i === 1) setEditOv2(val);
                                                            if (i === 2) setEditOv3(val);
                                                        }}
                                                        className="w-10 text-center border border-indigo-200 py-1 text-sm font-bold bg-transparent focus:border-indigo-600 focus:outline-none"
                                                    />
                                                    {i < 2 && ":"}
                                                </React.Fragment>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveOkved(oIdx); }}
                                            className="w-7.5 h-7.5 flex items-center justify-center border border-red-500 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {isEditing && (
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); cancelEdit(); }}
                                                className="flex-1 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase border border-indigo-300"
                                            >
                                                сброс
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSaveEdit(oIdx); }}
                                                className="flex-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase border border-indigo-600"
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

                <div className="space-y-4 bg-white p-4 border border-indigo-200 shadow-sm">
                    <div className="flex items-center justify-center gap-1.5 bg-white p-3 border border-indigo-200 shadow-inner">
                        <input
                            type="text"
                            maxLength={2}
                            value={ov1}
                            placeholder="00"
                            onChange={e => handleSegmentChange(e.target.value, setOv1, o2Ref)}
                            className="w-12 text-center border border-indigo-300 py-1.5 text-sm font-bold focus:outline-none focus:border-indigo-600"
                        />
                        <span className="font-bold text-indigo-300 text-lg">:</span>
                        <input
                            type="text"
                            maxLength={2}
                            ref={o2Ref}
                            value={ov2}
                            placeholder="00"
                            onChange={e => handleSegmentChange(e.target.value, setOv2, o3Ref)}
                            className="w-12 text-center border border-indigo-300 py-1.5 text-sm font-bold focus:outline-none focus:border-indigo-600"
                        />
                        <span className="font-bold text-indigo-300 text-lg">:</span>
                        <input
                            type="text"
                            maxLength={2}
                            ref={o3Ref}
                            value={ov3}
                            placeholder="00"
                            onChange={e => handleSegmentChange(e.target.value, setOv3)}
                            className="w-12 text-center border border-indigo-300 py-1.5 text-sm font-bold focus:outline-none focus:border-indigo-600"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearBuilder(); }} className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold uppercase border border-indigo-300">
                            сбросить
                        </button>
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddOkved(); }} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase border border-indigo-600">
                            Добавить
                        </button>
                    </div>
                </div>

                <div className="pt-2 border-t border-indigo-100">
                    <button
                        type="button"
                        disabled={form.processing}
                        onClick={triggerPutFormRequest}
                        className="w-full text-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
                    >
                        {form.processing ? 'Сохранение...' : 'Сохранить форму'}
                    </button>
                </div>
            </div>
        </div>
    );
};