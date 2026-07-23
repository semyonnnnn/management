import Modal from "@/components/custom/Modal";

interface ConfirmationProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
    title?: string;
}

export const Confirmation = ({
    show,
    onClose,
    onConfirm,
    message,
    title = "Подтверждение"
}: ConfirmationProps) => {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="font-mono text-gray-900 bg-gray-50 border border-gray-300 p-6 shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-tight text-indigo-900 border-b border-indigo-200 pb-3 mb-4">
                    {title}
                </h3>

                <p className="text-sm text-gray-700 leading-relaxed">
                    {message}
                </p>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold uppercase cursor-pointer"
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase cursor-pointer shadow-sm"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </Modal>
    );
};