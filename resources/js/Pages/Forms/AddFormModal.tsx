import React from 'react';
import Modal from "@/components/custom/Modal";
import { useForm } from '@inertiajs/react';
import { AddFormModalProps } from '@/types';

interface ExtendedAddProps extends AddFormModalProps {
    isConsolidated: boolean;
}

export const AddFormModal = ({ isOpen, onClose, isConsolidated }: ExtendedAddProps) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        indicators: 0,
        reports: 1,
        k1: '1.0',
        k2: '1.0',
        k3: '1.0',
        k4: '1.0',
        k5: '1.0',
        k6: '1.0',
        is_consolidated: isConsolidated
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/forms', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="md">
            <div className="p-6 bg-white font-mono text-gray-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <form onSubmit={handleSubmit} className="border border-gray-300 p-4 bg-gray-50 flex flex-col justify-between hidden-minimal-height">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900 border-b border-gray-200 pb-2">
                            [+] Создать форму
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

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Пок. (Indicators)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.indicators}
                                    onChange={e => setData('indicators', parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-1.5 bg-white border border-gray-300 text-xs font-bold focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Отч. (Reports)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.reports}
                                    onChange={e => setData('reports', parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-1.5 bg-white border border-gray-300 text-xs font-bold focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center p-2 bg-white border border-gray-300">
                            <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer select-none w-full">
                                <input
                                    type="checkbox"
                                    checked={data.is_consolidated}
                                    onChange={e => setData('is_consolidated', e.target.checked)}
                                    className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-0 focus:outline-none cursor-pointer"
                                />
                                <span className="text-gray-700 text-[10px] uppercase tracking-wider">Сводная</span>
                            </label>
                            {errors.is_consolidated && <div className="text-[10px] text-red-600 mt-1 font-bold">{errors.is_consolidated}</div>}
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                            {(['k1', 'k2', 'k3', 'k4', 'k5', 'k6'] as const).map((key) => (
                                <div key={key}>
                                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">{key.toUpperCase()}</label>
                                    <input
                                        type="text"
                                        value={data[key]}
                                        onChange={e => setData(key, e.target.value)}
                                        className="w-full px-2 py-1.5 bg-white border border-gray-300 text-xs font-bold focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

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
                </form>
            </div>
        </Modal>
    );
};