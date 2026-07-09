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
        <div className={`bg-gray-50 flex flex-col shadow-sm shrink-0 transition-all duration-300 ease-in-out overflow-hidden border-gray-300
            ${isOpen
                ? 'w-[340px] p-5 border opacity-100'
                : 'w-0 p-0 border-0 opacity-0 pointer-events-none'
            }`}
        >
            <div className="w-74.5 space-y-5">
                <h4 className="text-xs font-bold uppercase text-gray-500 border-b border-gray-200 pb-2 mb-4 truncate">
                    Коды: {isOpen && departmentName}
                </h4>

                {/* View, Modify & Drop Registry Items */}
                <div className="space-y-1.5 max-h-55 overflow-y-auto mb-5 bg-white p-2.5 border border-gray-200 min-h-20">
                    {isOpen && okveds.length === 0 ? (
                        <div className="text-xs text-gray-400 italic font-bold p-2 text-center">Нет кодов</div>
                    ) : (
                        isOpen && okveds.map((okv, oIdx) => {
                            const isEditing = editingOkvedIdx === oIdx;
                            return (
                                <div key={oIdx} className="flex flex-col border border-gray-200 bg-gray-50 p-1.5">
                                    {isEditing ? (
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-center gap-1 bg-white border p-1">
                                                <input
                                                    type="text"
                                                    maxLength={2}
                                                    value={editOv1}
                                                    onChange={e => handleSegmentChange(e.target.value, onEditOv1Change, eo2Ref)}
                                                    className="w-10 text-center border text-xs font-bold py-1 focus:outline-none focus:border-indigo-500"
                                                />
                                                <span className="text-gray-400 font-bold">:</span>
                                                <input
                                                    type="text"
                                                    maxLength={2}
                                                    ref={eo2Ref}
                                                    value={editOv2}
                                                    onChange={e => handleSegmentChange(e.target.value, onEditOv2Change, eo3Ref)}
                                                    className="w-10 text-center border text-xs font-bold py-1 focus:outline-none focus:border-indigo-500"
                                                />
                                                <span className="text-gray-400 font-bold">:</span>
                                                <input
                                                    type="text"
                                                    maxLength={2}
                                                    ref={eo3Ref}
                                                    value={editOv3}
                                                    onChange={e => handleSegmentChange(e.target.value, onEditOv3Change)}
                                                    className="w-10 text-center border text-xs font-bold py-1 focus:outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                            <div className="flex justify-end gap-1.5 text-[10px]">
                                                <button
                                                    type="button"
                                                    onClick={onCancelEdit}
                                                    className="px-2 py-0.5 bg-gray-300 uppercase font-bold cursor-pointer"
                                                >
                                                    Esc
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onSaveEdit(oIdx)}
                                                    className="px-2 py-0.5 bg-emerald-600 text-white uppercase font-bold cursor-pointer"
                                                >
                                                    ОК
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center text-sm font-bold pl-1.5">
                                            <span
                                                onClick={() => onStartEditing(oIdx, okv)}
                                                className="hover:text-indigo-600 cursor-pointer decoration-dotted underline underline-offset-2"
                                                title="Редактировать"
                                            >
                                                {okv}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => onStartEditing(oIdx, okv)}
                                                    className="text-gray-400 hover:text-indigo-600 font-bold text-xs px-1 cursor-pointer"
                                                >
                                                    изм.
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveOkved(oIdx)}
                                                    className="text-red-400 hover:text-red-600 font-bold text-lg px-1.5 cursor-pointer"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Core Builder Input Segments */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-1.5 bg-white p-3 border border-gray-300 shadow-inner">
                        <input
                            type="text"
                            maxLength={2}
                            value={ov1}
                            placeholder="00"
                            onChange={e => handleSegmentChange(e.target.value, onOv1Change, o2Ref)}
                            className="w-12 text-center border border-gray-300 py-1.5 text-sm font-bold focus:outline-none focus:border-indigo-500"
                        />
                        <span className="font-bold text-gray-400 text-lg">:</span>
                        <input
                            type="text"
                            maxLength={2}
                            ref={o2Ref}
                            value={ov2}
                            placeholder="00"
                            onChange={e => handleSegmentChange(e.target.value, onOv2Change, o3Ref)}
                            className="w-12 text-center border border-gray-300 py-1.5 text-sm font-bold focus:outline-none focus:border-indigo-500"
                        />
                        <span className="font-bold text-gray-400 text-lg">:</span>
                        <input
                            type="text"
                            maxLength={2}
                            ref={o3Ref}
                            value={ov3}
                            placeholder="00"
                            onChange={e => handleSegmentChange(e.target.value, onOv3Change)}
                            className="w-12 text-center border border-gray-300 py-1.5 text-sm font-bold focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                            type="button"
                            onClick={onClearBuilder}
                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold uppercase transition-colors cursor-pointer"
                        >
                            очист.
                        </button>
                        <button
                            type="button"
                            onClick={onAddOkved}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase transition-colors shadow-sm cursor-pointer"
                        >
                            добав.
                        </button>
                    </div>
                </div>

                <div className="text-[10px] text-gray-400 text-right uppercase font-bold tracking-tight pt-1">
                    ОКВЭД МАТРИЦА
                </div>
            </div>
        </div>
    );
};