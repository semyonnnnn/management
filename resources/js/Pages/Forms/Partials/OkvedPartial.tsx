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
            ${isOpen ? 'w-85 border-l opacity-100' : 'w-0 border-l-0 opacity-0 pointer-events-none'}`}
        >
            <div className="w-85 p-5 space-y-5">
                <h4 className="text-xs font-bold uppercase text-indigo-900 border-b border-indigo-200 pb-2 truncate tracking-wide">
                    Коды: {isOpen && departmentName}
                </h4>

                {okveds.length > 0 &&
                    <div className="space-y-0 max-h-55 overflow-y-auto mb-5 bg-white border border-indigo-200 min-h-20 custom-scrollbar shadow-none">
                        {isOpen && okveds.map((okv, oIdx) => {
                            const isEditing = editingOkvedIdx === oIdx;
                            const parts = okv.split(':');
                            return (
                                <div key={oIdx} className={`flex items-center justify-between border-b border-indigo-100 ${oIdx % 2 === 0 ? 'bg-white' : 'bg-indigo-50/30'}`}>
                                    <div className="flex items-center gap-1 p-2">
                                        <input
                                            type="text"
                                            maxLength={2}
                                            value={isEditing ? editOv1 : parts[0] || ''}
                                            onFocus={() => onStartEditing(oIdx, okv)}
                                            onChange={e => handleSegmentChange(e.target.value, onEditOv1Change, eo2Ref)}
                                            className="w-10 text-center border border-indigo-200 py-1 text-sm font-bold focus:outline-none focus:border-indigo-600 bg-transparent text-indigo-900"
                                        />
                                        <span className="font-bold text-indigo-300 text-lg">:</span>
                                        <input
                                            type="text"
                                            maxLength={2}
                                            ref={isEditing ? eo2Ref : null}
                                            value={isEditing ? editOv2 : parts[1] || ''}
                                            onFocus={() => onStartEditing(oIdx, okv)}
                                            onChange={e => handleSegmentChange(e.target.value, onEditOv2Change, eo3Ref)}
                                            className="w-10 text-center border border-indigo-200 py-1 text-sm font-bold focus:outline-none focus:border-indigo-600 bg-transparent text-indigo-900"
                                        />
                                        <span className="font-bold text-indigo-300 text-lg">:</span>
                                        <input
                                            type="text"
                                            maxLength={2}
                                            ref={isEditing ? eo3Ref : null}
                                            value={isEditing ? editOv3 : parts[2] || ''}
                                            onFocus={() => onStartEditing(oIdx, okv)}
                                            onChange={e => handleSegmentChange(e.target.value, onEditOv3Change)}
                                            className="w-10 text-center border border-indigo-200 py-1 text-sm font-bold focus:outline-none focus:border-indigo-600 bg-transparent text-indigo-900"
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-1 px-2 w-27.5">
                                        {isEditing ? (
                                            <>
                                                <button type="button" onClick={() => onStartEditing(oIdx, okveds[oIdx])} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-1 font-bold border border-indigo-200 uppercase hover:bg-indigo-100">сброс</button>
                                                <button type="button" onClick={() => onSaveEdit(oIdx)} className="text-[10px] bg-indigo-600 text-white px-1.5 py-1 font-bold hover:bg-indigo-700 uppercase">ок</button>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); onRemoveOkved(oIdx); }} className="w-7.5 h-7.5 flex items-center justify-center font-light border border-red-500 bg-red-500/20 text-red-500 hover:bg-red-500 text-2xl hover:text-white transition-all shrink-0 select-none">×</button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-7.5" />
                                                <div className="w-7.5" />
                                                <button type="button" onClick={(e) => { e.stopPropagation(); onRemoveOkved(oIdx); }} className="w-7.5 h-7.5 text-2xl flex items-center justify-center font-light border border-red-500 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shrink-0 select-none">×</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                }

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
                        <button type="button" onClick={onClearBuilder} className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold uppercase border border-indigo-300">
                            сбросить
                        </button>
                        <button type="button" onClick={onAddOkved} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase border border-indigo-600">
                            сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};