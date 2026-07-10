import React, { useRef } from 'react';

interface OkvedPartialProps {
    isOpen: boolean;
    departmentName: string;
    okveds: string[];
    activeDeptIndex: number | null;
    editingOkvedIdx: number | null;
    ov1: string;
    ov2: string;
    ov3: string;
    editOv1: string;
    editOv2: string;
    editOv3: string;
    onOv1Change: (val: string) => void;
    onOv2Change: (val: string) => void;
    onOv3Change: (val: string) => void;
    onEditOv1Change: (val: string) => void;
    onEditOv2Change: (val: string) => void;
    onEditOv3Change: (val: string) => void;
    onAddOkved: () => void;
    onStartEditing: (okvedIdx: number, okvedValue: string) => void;
    onSaveEdit: (okvedIdx: number) => void;
    onCancelEdit: () => void;
    onRemoveOkved: (okvedIdx: number) => void;
    onClearBuilder: () => void;
}

export const OkvedPartial = ({
    isOpen,
    departmentName,
    okveds,
    activeDeptIndex,
    editingOkvedIdx,
    ov1,
    ov2,
    ov3,
    editOv1,
    editOv2,
    editOv3,
    onOv1Change,
    onOv2Change,
    onOv3Change,
    onEditOv1Change,
    onEditOv2Change,
    onEditOv3Change,
    onAddOkved,
    onStartEditing,
    onSaveEdit,
    onCancelEdit,
    onRemoveOkved,
    onClearBuilder
}: OkvedPartialProps) => {
    const o2Ref = useRef<HTMLInputElement>(null);
    const o3Ref = useRef<HTMLInputElement>(null);
    const eo2Ref = useRef<HTMLInputElement>(null);
    const eo3Ref = useRef<HTMLInputElement>(null);

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

    return (
        <div className={`bg-white flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden border-indigo-200
            ${isOpen ? 'w-fit border-l opacity-100' : 'w-0 border-l-0 opacity-0 pointer-events-none'}`}
        >
            <div className="w-fit p-5 space-y-5">
                <h4 className="text-xs font-bold uppercase text-indigo-900 border-b border-indigo-200 pb-2 truncate tracking-wide">
                    Коды: {isOpen && departmentName}
                </h4>

                {/* List of existing codes */}
                {okveds.length > 0 && (
                    <div className="space-y-0 max-h-55 overflow-y-auto mb-5 bg-white border border-indigo-200 custom-scrollbar">
                        {/* List of existing codes */}
                        {okveds.map((okv, oIdx) => {
                            const isEditing = editingOkvedIdx === oIdx;
                            const parts = okv.split(':');

                            return (
                                <div key={oIdx} className="border-b border-indigo-100 bg-white p-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <>
                                                    <input
                                                        key={i}
                                                        type="text"
                                                        maxLength={2}
                                                        // Trigger edit mode when user clicks/focuses any segment
                                                        onFocus={() => onStartEditing(oIdx, okv)}
                                                        value={isEditing ? (i === 0 ? editOv1 : i === 1 ? editOv2 : editOv3) : parts[i]}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (i === 0) onEditOv1Change(val);
                                                            if (i === 1) onEditOv2Change(val);
                                                            if (i === 2) onEditOv3Change(val);
                                                        }}
                                                        className="w-10 text-center border border-indigo-200 py-1 text-sm font-bold bg-transparent focus:border-indigo-600 focus:outline-none"
                                                    />
                                                    {i < 2 && ":"}
                                                </>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemoveOkved(oIdx); }}
                                            className="w-7.5 h-7.5 flex items-center justify-center border border-red-500 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {/* Buttons appear only when isEditing is true */}
                                    {isEditing && (
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onCancelEdit(); // Assuming you have this to reset editingOkvedIdx to null
                                                }}
                                                className="flex-1 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase border border-indigo-300"
                                            >
                                                сброс
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onSaveEdit(oIdx);
                                                }}
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
                            onChange={e => handleSegmentChange(e.target.value, onOv1Change, o2Ref)}
                            className="w-12 text-center border border-indigo-300 py-1.5 text-sm font-bold focus:outline-none focus:border-indigo-600"
                        />
                        <span className="font-bold text-indigo-300 text-lg">:</span>
                        <input
                            type="text"
                            maxLength={2}
                            ref={o2Ref}
                            value={ov2}
                            placeholder="00"
                            onChange={e => handleSegmentChange(e.target.value, onOv2Change, o3Ref)}
                            className="w-12 text-center border border-indigo-300 py-1.5 text-sm font-bold focus:outline-none focus:border-indigo-600"
                        />
                        <span className="font-bold text-indigo-300 text-lg">:</span>
                        <input
                            type="text"
                            maxLength={2}
                            ref={o3Ref}
                            value={ov3}
                            placeholder="00"
                            onChange={e => handleSegmentChange(e.target.value, onOv3Change)}
                            className="w-12 text-center border border-indigo-300 py-1.5 text-sm font-bold focus:outline-none focus:border-indigo-600"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClearBuilder(); }} className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold uppercase border border-indigo-300">
                            сбросить
                        </button>
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddOkved(); }} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase border border-indigo-600">
                            сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};