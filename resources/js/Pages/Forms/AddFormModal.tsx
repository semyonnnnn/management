import React from 'react';
import Modal from "@/components/custom/Modal";
import { useForm } from '@inertiajs/react';
//////////////////////////////////////////////
import { AddFormModalProps } from '@/types';

export const AddFormModal = ({ isOpen, onClose, departments, versionId }: AddFormModalProps) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        indicators: 0,
        reports: 1,
        coeff: '1.0',
        department_id: '',
        versions_id: versionId
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
            <form onSubmit={handleSubmit} className="p-6 bg-white font-mono text-gray-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>

                {/* Header */}
                <div className="border-b border-gray-200 pb-4 mb-5 flex justify-between items-center">
                    <h3 className="text-lg font-bold uppercase tracking-tight text-gray-900 flex items-center gap-2">
                        <span className="text-indigo-600">[+]</span> Создать Новую Форму
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer focus:outline-none"
                    >
                        ×
                    </button>
                </div>

                {/* Body Form Controls */}
                <div className="space-y-4">

                    {/* Form Title */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                            Наименование Формы *
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm font-bold focus:outline-none focus:border-indigo-600 focus:ring-0"
                            placeholder="Введите название формы..."
                            required
                        />
                        {errors.name && <div className="text-xs text-red-600 mt-1 font-bold">{errors.name}</div>}
                    </div>

                    {/* Department Select Matrix */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                            Привязка к Ведомству
                        </label>
                        <select
                            value={data.department_id}
                            onChange={e => setData('department_id', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 text-sm font-bold focus:outline-none focus:border-indigo-600 focus:ring-0"
                        >
                            <option value="">Без ведомства (Null)</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name} [{dept.territory.toUpperCase()}]
                                </option>
                            ))}
                        </select>
                        {errors.department_id && (
                            <div className="text-xs text-red-600 mt-1 font-bold">{errors.department_id}</div>
                        )}
                    </div>

                    {/* Metrics Numerical Row Elements */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                                Показатели
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.indicators}
                                onChange={e => setData('indicators', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 text-sm font-bold focus:outline-none focus:border-indigo-600 focus:ring-0"
                            />
                            {errors.indicators && <div className="text-xs text-red-600 mt-1 font-bold">{errors.indicators}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                                Отчеты
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.reports}
                                onChange={e => setData('reports', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 text-sm font-bold focus:outline-none focus:border-indigo-600 focus:ring-0"
                            />
                            {errors.reports && <div className="text-xs text-red-600 mt-1 font-bold">{errors.reports}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                                Коэф. (Coeff)
                            </label>
                            <input
                                type="text"
                                value={data.coeff}
                                onChange={e => setData('coeff', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 text-sm font-bold focus:outline-none focus:border-indigo-600 focus:ring-0"
                                placeholder="1.0"
                            />
                            {errors.coeff && <div className="text-xs text-red-600 mt-1 font-bold">{errors.coeff}</div>}
                        </div>
                    </div>
                </div>

                {/* Footer Control Actions */}
                <div className="mt-6 border-t border-gray-100 pt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {processing ? 'Сохранение...' : 'Сохранить запись'}
                    </button>
                </div>

            </form>
        </Modal>
    );
}