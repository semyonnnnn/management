import React from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/components/custom/Modal';

interface DeleteConfirmationModalProps {
    show: boolean;
    onClose: () => void;
    item: { id: string | number; name: string } | null;
}

const DeleteConfirmationModal = ({ show, onClose, item }: DeleteConfirmationModalProps) => {
    const { delete: destroy, processing } = useForm();

    const handleConfirm = () => {
        if (item) {
            destroy(route('state.delete', { id: item.id }), {
                onSuccess: () => onClose()
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="bg-white border border-indigo-200/50 shadow-lg p-6 font-mono">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight mb-4 border-b border-indigo-100 pb-2">
                    Удаление
                </h2>

                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Вы уверены, что хотите удалить отдел <span className="font-bold text-red-600">{item?.name}</span>? Это действие нельзя отменить.
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 bg-gray-50 border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold uppercase tracking-wider transition-all cursor-pointer text-sm"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={processing}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider transition-all cursor-pointer text-sm disabled:opacity-50"
                    >
                        {processing ? 'Удаление...' : 'Подтвердить'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export { DeleteConfirmationModal };