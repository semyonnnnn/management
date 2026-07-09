import React, { useState, useRef } from 'react';
import Modal from "@/components/custom/Modal";
import { useForm } from '@inertiajs/react';
import { AddFormModalProps } from '@/types';

interface ExtendedAddProps extends AddFormModalProps {
    isConsolidated: boolean;
}

export const AddFormModal = ({ isOpen, onClose, departments, versionId, isConsolidated }: ExtendedAddProps) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        indicators: 0,
        reports: 1,
        coeff: '1.0',
        departments: [] as Array<{ department_id: string; okveds: string[] }>,
        versions_id: versionId
    });

    const [selectedDeptId, setSelectedDeptId] = useState<string>('');
    const [activeDeptIndex, setActiveDeptIndex] = useState<number | null>(null);

    // Segmented OKVED inputs states matching the [ ]:[ ]:[ ] layout in the sketch
    const [ov1, setOv1] = useState('');
    const [ov2, setOv2] = useState('');
    const [ov3, setOv3] = useState('');

    const o2Ref = useRef<HTMLInputElement>(null);
    const o3Ref = useRef<HTMLInputElement>(null);

    const handleAddDepartment = () => {
        if (!selectedDeptId) return;
        if (data.departments.some(d => d.department_id === selectedDeptId)) {
            setSelectedDeptId('');
            return;
        }
        const updatedDepts = [...data.departments, { department_id: selectedDeptId, okveds: [] }];
        setData('departments', updatedDepts);
        setSelectedDeptId('');
        setActiveDeptIndex(updatedDepts.length - 1);
    };

    const handleRemoveDepartment = (indexToRemove: number) => {
        const updatedDepts = data.departments.filter((_, idx) => idx !== indexToRemove);
        setData('departments', updatedDepts);
        if (activeDeptIndex === indexToRemove) {
            setActiveDeptIndex(null);
        } else if (activeDeptIndex !== null && activeDeptIndex > indexToRemove) {
            setActiveDeptIndex(activeDeptIndex - 1);
        }
    };

    const handleAddOkved = (deptIndex: number) => {
        if (!ov1 || !ov2 || !ov3) return;
        const combined = `${ov1.trim()}:${ov2.trim()}:${ov3.trim()}`;

        const updatedDepts = [...data.departments];
        if (!updatedDepts[deptIndex].okveds.includes(combined)) {
            updatedDepts[deptIndex].okveds = [...updatedDepts[deptIndex].okveds, combined];
            setData('departments', updatedDepts);
        }
        // Reset segments
        setOv1('');
        setOv2('');
        setOv3('');
    };

    const handleSegmentChange = (val: string, setter: (v: string) => void, nextRef?: React.RefObject<HTMLInputElement | null>) => {
        const sanitized = val.replace(/[^0-9]/g, '').slice(0, 2);
        setter(sanitized);
        if (sanitized.length === 2 && nextRef?.current) {
            nextRef.current.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/forms', {
            onSuccess: () => {
                reset();
                setActiveDeptIndex(null);
                onClose();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="xl">
            <div className="p-6 bg-white font-mono text-gray-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                    {/* COLUMN 1: Core Form Parameters & Actions */}
                    <div className="md:col-span-4 border border-gray-300 p-4 bg-gray-50 flex flex-col justify-between min-h-100">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900 border-b border-gray-200 pb-2">
                                [+] Создать
                            </h3>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Название</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-2 py-1.5 bg-white border border-gray-300 text-xs font-bold focus:outline-none focus:border-indigo-600"
                                    required
                                />
                                {errors.name && <div className="text-[10px] text-red-600 mt-1 font-bold">{errors.name}</div>}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Пок.</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.indicators}
                                        onChange={e => setData('indicators', parseInt(e.target.value) || 0)}
                                        className="w-full px-2 py-1.5 bg-white border border-gray-300 text-xs font-bold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Отч.</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.reports}
                                        onChange={e => setData('reports', parseInt(e.target.value) || 0)}
                                        className="w-full px-2 py-1.5 bg-white border border-gray-300 text-xs font-bold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Коэф.</label>
                                    <input
                                        type="text"
                                        value={data.coeff}
                                        onChange={e => setData('coeff', e.target.value)}
                                        className="w-full px-2 py-1.5 bg-white border border-gray-300 text-xs font-bold focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions aligned at the bottom of Column 1 */}
                        <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-2 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-2 py-2 bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 text-center"
                            >
                                Добавить
                            </button>
                        </div>
                    </div>

                    {/* COLUMN 2: Departments ("отделы") list */}
                    <div className="md:col-span-4 border border-gray-300 p-4 bg-white min-h-100 flex flex-col">
                        <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900 border-b-2 border-gray-900 pb-1 mb-3">
                            Отделы
                        </h3>

                        <div className="flex gap-1 mb-4">
                            <select
                                value={selectedDeptId}
                                onChange={e => setSelectedDeptId(e.target.value)}
                                className="flex-1 px-2 py-1 bg-white border border-gray-300 text-xs font-bold focus:outline-none"
                            >
                                {data.departments.length === 0 && <option value="">Без ведомства</option>}
                                {data.departments.length > 0 && <option value="" disabled>Выбрать ведомство...</option>}
                                {departments
                                    .filter(dept => !data.departments.some(d => d.department_id === dept.id))
                                    .map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))
                                }
                            </select>
                            <button
                                type="button"
                                onClick={handleAddDepartment}
                                className="px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase cursor-pointer"
                            >
                                +
                            </button>
                        </div>

                        <div className="flex-1 space-y-1 overflow-y-auto max-h-70 pr-1">
                            {data.departments.map((d, index) => {
                                const match = departments.find(dept => dept.id === d.department_id);
                                const isSelected = activeDeptIndex === index;
                                return (
                                    <div
                                        key={d.department_id}
                                        onClick={() => setActiveDeptIndex(index)}
                                        className={`group flex justify-between items-center p-2 text-xs font-bold cursor-pointer border transition-all ${isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-900' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <span className="truncate">
                                            {index + 1}. {match ? `${match.name} [${match.territory.toUpperCase()}]` : `ID: ${d.department_id}`}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleRemoveDepartment(index); }}
                                            className="text-gray-400 hover:text-red-600 font-bold ml-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* COLUMN 3: Segmented OKVED Block */}
                    <div className="md:col-span-4 border border-gray-300 p-4 bg-gray-50 min-h-100 flex flex-col justify-between">
                        {activeDeptIndex !== null && data.departments[activeDeptIndex] ? (
                            <div className="space-y-4 flex flex-col justify-between h-full">
                                <div>
                                    <h4 className="text-[11px] font-bold uppercase text-gray-500 border-b border-gray-200 pb-1 mb-3 truncate">
                                        Коды: {departments.find(dept => dept.id === data.departments[activeDeptIndex!]?.department_id)?.name || 'Выбрано'}
                                    </h4>

                                    {/* Display area for added OKVED codes */}
                                    <div className="space-y-1 max-h-40 overflow-y-auto mb-4 bg-white p-2 border border-gray-200 min-h-20">
                                        {data.departments[activeDeptIndex].okveds.length === 0 ? (
                                            <div className="text-[11px] text-gray-400 italic">Нет кодов</div>
                                        ) : (
                                            data.departments[activeDeptIndex].okveds.map((okv, oIdx) => (
                                                <div key={oIdx} className="flex justify-between items-center text-xs font-bold bg-gray-100 px-2 py-1 border border-gray-200">
                                                    <span>{okv}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = [...data.departments];
                                                            updated[activeDeptIndex!].okveds = updated[activeDeptIndex!].okveds.filter((_, i) => i !== oIdx);
                                                            setData('departments', updated);
                                                        }}
                                                        className="text-red-500 hover:text-red-700 font-bold"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {isConsolidated ? (
                                        <div className="space-y-3">
                                            {/* Segmented Inputs Assembly [ ]:[ ]:[ ] */}
                                            <div className="flex items-center justify-center gap-1 bg-white p-3 border border-gray-300">
                                                <input
                                                    type="text"
                                                    value={ov1}
                                                    placeholder="00"
                                                    onChange={e => handleSegmentChange(e.target.value, setOv1, o2Ref)}
                                                    className="w-10 text-center border border-gray-300 py-1 text-xs font-bold focus:outline-none focus:border-indigo-600"
                                                />
                                                <span className="font-bold text-gray-400">:</span>
                                                <input
                                                    type="text"
                                                    ref={o2Ref}
                                                    value={ov2}
                                                    placeholder="00"
                                                    onChange={e => handleSegmentChange(e.target.value, setOv2, o3Ref)}
                                                    className="w-10 text-center border border-gray-300 py-1 text-xs font-bold focus:outline-none focus:border-indigo-600"
                                                />
                                                <span className="font-bold text-gray-400">:</span>
                                                <input
                                                    type="text"
                                                    ref={o3Ref}
                                                    value={ov3}
                                                    placeholder="00"
                                                    onChange={e => handleSegmentChange(e.target.value, setOv3)}
                                                    className="w-10 text-center border border-gray-300 py-1 text-xs font-bold focus:outline-none focus:border-indigo-600"
                                                />
                                            </div>

                                            {/* Lower Matrix Actions Panel */}
                                            <div className="grid grid-cols-2 gap-2 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => { setOv1(''); setOv2(''); setOv3(''); }}
                                                    className="px-2 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                                                >
                                                    Очист.
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddOkved(activeDeptIndex!)}
                                                    className="px-2 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                                                >
                                                    Добав.
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-[11px] text-gray-400 italic bg-white p-3 border border-gray-200 text-center">
                                            Консолидация отключена. Ввод заблокирован.
                                        </div>
                                    )}
                                </div>
                                <div className="text-[9px] text-gray-400 text-right uppercase font-bold tracking-tight">
                                    Панель сегментации ОКВЭД
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-center p-4">
                                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                                    Выберите отдел для настройки параметров ОКВЭД
                                </span>
                            </div>
                        )}
                    </div>

                </form>
            </div>
        </Modal>
    );
};