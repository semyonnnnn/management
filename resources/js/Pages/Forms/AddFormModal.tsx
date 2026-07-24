import React, { useEffect } from 'react';
import Modal from "@/components/custom/Modal";
import { useForm } from '@inertiajs/react';
import { AddFormModalProps } from '@/types';
import { CustomSelect } from '@/components/custom/CustomSelect';

interface ExtendedAddProps extends AddFormModalProps {
    isConsolidated: boolean;
    periods: string[];
}

// Translation mapping for field names
const FIELD_TRANSLATIONS: Record<string, string> = {
    'name': 'Название',
    'okud': 'ОКУД',
    'period': 'Период',
    'indicators': 'Показатели',
    'k1': 'Коэффициент K1',
    'k2': 'Коэффициент K2',
    'k3': 'Коэффициент K3',
    'k4': 'Коэффициент K4',
    'k5': 'Коэффициент K5',
    'k6': 'Коэффициент K6',
    'is_consolidated': 'Консолидированный'
};

export const AddFormModal = ({ isOpen, onClose, isConsolidated, periods }: ExtendedAddProps) => {
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm({
        name: '',
        okud: '',
        period: '',
        indicators: '',
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

    const handleCancel = () => {
        clearErrors();
        onClose();
    };

    const handleTextChange = (field: keyof typeof data, value: string) => {
        const sanitizeText = value.replace(/[^\p{L}\p{N}\s\-_.,()'"«»]/gu, '');
        setData(field, sanitizeText as any);
    };

    const handleOkudChange = (value: string) => {
        if (value !== '' && (!/^\d*$/.test(value) || value.length > 8)) return;
        setData('okud', value);
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

        transform((currentData) => ({
            ...currentData,
            indicators: parseInt(currentData.indicators, 10) || 0,
            k1: parseFloat(currentData.k1) || 0,
            k2: parseFloat(currentData.k2) || 0,
            k3: parseFloat(currentData.k3) || 0,
            k4: parseFloat(currentData.k4) || 0,
            k5: parseFloat(currentData.k5) || 0,
            k6: parseFloat(currentData.k6) || 0,
        }));

        post('/forms', {
            onSuccess: () => {
                reset();
                clearErrors();
                onClose();
            },
        });
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth={hasErrors ? "5xl" : "2xl"}>
            {/* Repeating background wrapper inside the modal panel - using items-stretch */}
            <div className="p-4 border border-indigo-300 bg-[repeating-linear-gradient(45deg,#f5f3ff,#f5f3ff_10px,#e0e7ff_10px,#e0e7ff_20px)] flex flex-row items-stretch gap-4 transition-all duration-300">

                {/* MAIN FORM PANEL */}
                <div className="flex-1 min-w-0 p-8 bg-white font-mono text-gray-900 border border-indigo-200 shadow-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    <form onSubmit={handleSubmit} className="border border-gray-300 p-6 bg-gray-50 flex flex-col justify-between max-h-[85vh] min-h-0 h-full">

                        <h3 className="text-lg font-bold uppercase tracking-tight text-gray-900 border-b border-gray-200 pb-3 mb-6 shrink-0">
                            [+] Создать форму
                        </h3>

                        {/* Scrollable fields container */}
                        <div className="space-y-4 flex-1 min-h-0 overflow-y-auto pr-2 my-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">

                            {/* Primary Identifiers */}
                            <div className="grid grid-cols-3 gap-4">
                                {/* BLOCK 1: Name */}
                                <div className={`col-span-2 p-4 border transition-colors bg-sky-50/80 ${errors.name ? 'border-red-300' : 'border-sky-200'}`}>
                                    <label className={`block text-sm font-bold uppercase mb-2 ${errors.name ? 'text-red-700' : 'text-sky-900/80'}`}>Название</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => handleTextChange('name', e.target.value)}
                                        className={`w-full px-3 py-2.5 bg-white border text-base font-bold focus:outline-none transition-colors ${errors.name
                                            ? 'border-red-500 text-red-950 focus:border-red-600'
                                            : 'border-sky-300 text-sky-950 focus:border-sky-400 focus:ring focus:ring-sky-400 focus:bg-sky-100'
                                            }`}
                                    />
                                </div>

                                {/* BLOCK 2: OKUD */}
                                <div className={`col-span-1 p-4 border transition-colors bg-rose-50/80 ${errors.okud ? 'border-red-300' : 'border-rose-200'}`}>
                                    <label className={`block text-sm font-bold uppercase mb-2 ${errors.okud ? 'text-red-700' : 'text-rose-900/80'}`}>ОКУД</label>
                                    <input
                                        type="text"
                                        value={data.okud}
                                        onChange={e => handleOkudChange(e.target.value)}
                                        placeholder="00000000"
                                        className={`w-full px-3 py-2.5 bg-white border text-base font-bold focus:outline-none transition-colors text-center ${errors.okud
                                            ? 'border-red-500 text-red-950 focus:border-red-600'
                                            : 'border-rose-300 text-rose-950 focus:border-rose-400 focus:ring focus:ring-rose-400 focus:bg-rose-100'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* BLOCK 3: Core Metrics */}
                            <div className="bg-emerald-50/80 border border-emerald-200 p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-bold uppercase mb-2 ${errors.period ? 'text-red-700' : 'text-emerald-900/80'}`}>Период</label>
                                        <CustomSelect
                                            variant='green'
                                            value={data.period}
                                            onChange={(val) => setData('period', val)}
                                            options={periods.map((p) => ({ name: p }))}
                                            defaultText="— Выберите период —"
                                            className={`w-full px-3.5 py-2.5 bg-white border text-base font-bold focus:outline-none transition-colors ${errors.period
                                                ? 'border-red-500 text-red-950 focus:border-red-600 bg-red-50/30'
                                                : 'border-emerald-300 text-emerald-950 focus:border-emerald-400 focus:ring focus:ring-emerald-400 focus:bg-emerald-100'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-bold uppercase mb-2 ${errors.indicators ? 'text-red-700' : 'text-emerald-900/80'}`}>Показатели</label>
                                        <input
                                            type="text"
                                            value={data.indicators}
                                            onChange={e => handleIntegerChange('indicators', e.target.value)}
                                            placeholder="0"
                                            className={`w-full px-3 py-2.5 bg-white border text-base font-bold focus:outline-none transition-colors text-center ${errors.indicators
                                                ? 'border-red-500 text-red-950 focus:border-red-600 bg-red-50/30'
                                                : 'border-emerald-300 text-emerald-950 focus:border-emerald-400 focus:ring focus:ring-emerald-400 focus:bg-emerald-100'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* BLOCK 4: Coefficients */}
                            <div className="bg-violet-50/80 border border-violet-200 p-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-violet-900/80 border-b border-violet-200 pb-2 mb-4">коэффициенты</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {(['k1', 'k2', 'k3', 'k4', 'k5', 'k6'] as const).map((key) => {
                                        const hasError = !!errors[key];
                                        return (
                                            <div key={key}>
                                                <label className={`block text-sm font-bold uppercase mb-2 ${hasError ? 'text-red-700' : 'text-violet-900/80'}`}>{key.toUpperCase()}</label>
                                                <input
                                                    type="text"
                                                    value={data[key]}
                                                    onChange={e => handleFloatChange(key, e.target.value)}
                                                    placeholder="0.00"
                                                    className={`w-full px-3 py-2.5 bg-white border text-base font-bold focus:outline-none transition-colors text-center ${hasError
                                                        ? 'border-red-500 text-red-950 focus:border-red-600 bg-red-50/30'
                                                        : 'border-violet-300 text-violet-950 focus:border-violet-400 focus:ring focus:ring-violet-400 focus:bg-violet-100'
                                                        }`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 border-t border-gray-200 grid grid-cols-2 gap-4 mt-4 shrink-0">
                            <button
                                type="button"
                                onClick={handleCancel}
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

                {/* DYNAMIC ERRORS PANEL */}
                {hasErrors && (
                    <div className="w-80 h-full max-h-[90vh] bg-white border border-red-400 shadow-sm relative overflow-hidden flex flex-col font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {/* Hardware-styled warning header */}
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
        </Modal>
    );
};