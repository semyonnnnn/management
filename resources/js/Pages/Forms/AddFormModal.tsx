import React, { useEffect } from 'react';
import Modal from "@/components/custom/Modal";
import { useForm } from '@inertiajs/react';
import { AddFormModalProps } from '@/types';

interface ExtendedAddProps extends AddFormModalProps {
    isConsolidated: boolean;
}

export const AddFormModal = ({ isOpen, onClose, isConsolidated }: ExtendedAddProps) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        okud: '',
        indicators: '1',
        reports: '1',
        total: '1',
        k1: '1.0',
        k2: '1.0',
        k3: '1.0',
        k4: '1.0',
        k5: '1.0',
        k6: '1.0',
        is_consolidated: isConsolidated
    });

    useEffect(() => {
        setData('is_consolidated', isConsolidated);
    }, [isConsolidated]);

    const handleTextChange = (field: keyof typeof data, value: string) => {
        const sanitizeText = value.replace(/[^\p{L}\p{N}\s\-_.,()'"«»]/gu, '');
        setData(field, sanitizeText as any);
    };

    const handleIntegerChange = (field: keyof typeof data, value: string) => {
        let sanitizeInt = value.replace(/\D/g, '');
        if (sanitizeInt.length > 1 && sanitizeInt.startsWith('0')) {
            sanitizeInt = sanitizeInt.replace(/^0+/, '');
            if (sanitizeInt === '') sanitizeInt = '0';
        }
        setData(field, sanitizeInt as any);
    };

    const handleFloatChange = (field: keyof typeof data, value: string) => {
        let normalized = value.replace(',', '.');
        normalized = normalized.replace(/[^0-9.]/g, '');

        const parts = normalized.split('.');
        if (parts.length > 2) {
            normalized = parts[0] + '.' + parts.slice(1).join('');
        }

        if (normalized.length > 1 && normalized.startsWith('0') && !normalized.startsWith('0.')) {
            normalized = normalized.replace(/^0+/, '');
            if (normalized === '' || normalized.startsWith('.')) {
                normalized = '0' + normalized;
            }
        }

        setData(field, normalized as any);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Transform numeric fields before dispatching via Inertia form helper
        setData(prev => ({
            ...prev,
            indicators: (parseInt(prev.indicators, 10) || 0) as any,
            reports: (parseInt(prev.reports, 10) || 0) as any,
            total: (parseInt(prev.total, 10) || 0) as any,
            k1: (parseFloat(prev.k1) || 0) as any,
            k2: (parseFloat(prev.k2) || 0) as any,
            k3: (parseFloat(prev.k3) || 0) as any,
            k4: (parseFloat(prev.k4) || 0) as any,
            k5: (parseFloat(prev.k5) || 0) as any,
            k6: (parseFloat(prev.k6) || 0) as any,
        }));

        post('/forms', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-8 bg-white font-mono text-gray-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <form onSubmit={handleSubmit} className="border border-gray-300 p-6 bg-gray-50 flex flex-col justify-between hidden-minimal-height">
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold uppercase tracking-tight text-gray-900 border-b border-gray-200 pb-3">
                            [+] Создать форму
                        </h3>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold uppercase text-gray-500 mb-2">Название</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => handleTextChange('name', e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-300 text-base font-bold focus:outline-none focus:border-indigo-600"
                                    required
                                />
                                {errors.name && <div className="text-sm text-red-600 mt-1 font-bold">{errors.name}</div>}
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold uppercase text-gray-500 mb-2">ОКУД</label>
                                <input
                                    maxLength={8}
                                    type="text"
                                    value={data.okud}
                                    onChange={e => handleTextChange('okud', e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-300 text-base font-bold focus:outline-none focus:border-indigo-600"
                                />
                                {errors.okud && <div className="text-sm text-red-600 mt-1 font-bold">{errors.okud}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold uppercase text-gray-500 mb-2">Показатели</label>
                                <input
                                    type="text"
                                    value={data.indicators}
                                    onChange={e => handleIntegerChange('indicators', e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-300 text-base font-bold focus:outline-none focus:border-indigo-600"
                                />
                                {errors.indicators && <div className="text-sm text-red-600 mt-1 font-bold">{errors.indicators}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold uppercase text-gray-500 mb-2">Отчёты</label>
                                <input
                                    type="text"
                                    value={data.reports}
                                    onChange={e => handleIntegerChange('reports', e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-300 text-base font-bold focus:outline-none focus:border-indigo-600"
                                    required
                                />
                                {errors.reports && <div className="text-sm text-red-600 mt-1 font-bold">{errors.reports}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold uppercase text-gray-500 mb-2">Всего</label>
                                <input
                                    type="text"
                                    value={data.total}
                                    onChange={e => handleIntegerChange('total', e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-300 text-base font-bold focus:outline-none focus:border-indigo-600"
                                    required
                                />
                                {errors.total && <div className="text-sm text-red-600 mt-1 font-bold">{errors.total}</div>}
                            </div>
                        </div>

                        <div className='border-t pt-4 mt-4'>
                            <h3 className="text-base font-bold uppercase text-gray-700 mb-3">коэффициенты</h3>
                            <div className="grid grid-cols-3 gap-4 pt-2 border-gray-200">
                                {(['k1', 'k2', 'k3', 'k4', 'k5', 'k6'] as const).map((key) => (
                                    <div key={key}>
                                        <label className="block text-sm font-bold uppercase text-gray-500 mb-2">{key.toUpperCase()}</label>
                                        <input
                                            type="text"
                                            value={data[key]}
                                            onChange={e => handleFloatChange(key, e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-300 text-base font-bold focus:outline-none focus:border-indigo-600"
                                        />
                                        {errors[key] && <div className="text-sm text-red-600 mt-1 font-bold">{errors[key]}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 grid grid-cols-2 gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-3 bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 text-center"
                        >
                            Добавить
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};