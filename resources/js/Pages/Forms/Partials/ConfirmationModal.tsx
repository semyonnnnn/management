interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs font-mono px-4">
            <div className="bg-white border-2 border-indigo-600 p-4 max-w-md w-full shadow-lg">
                <h3 className="text-base font-bold uppercase text-gray-950 mb-2 border-b border-indigo-100 pb-1">
                    {title}
                </h3>
                <p className="text-xs font-bold text-gray-600 mb-4 leading-normal">
                    {message}
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 uppercase text-[11px] font-bold tracking-wider cursor-pointer"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 uppercase text-[11px] font-bold tracking-wider cursor-pointer"
                    >
                        Подтвердить
                    </button>
                </div>
            </div>
        </div>
    );
}