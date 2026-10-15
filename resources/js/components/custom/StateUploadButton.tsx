import { useRef } from 'react';
import { useForm } from '@inertiajs/react';

export interface StateUploadButtonProps {
    route_path: string;
    className?: string;
    label?: string;
}

const StateUploadButton = ({
    route_path,
    className = "px-3 py-2 text-nowrap bg-emerald-600 text-white text-md font-bold uppercase hover:bg-emerald-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    label = "Импорт из файла",
}: StateUploadButtonProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setData, post, processing } = useForm<{ file: File | null }>({ file: null });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;

        setData('file', file);
        post(route(route_path), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
                disabled={processing}
            />
            <button
                type="button"
                disabled={processing}
                onClick={() => fileInputRef.current?.click()}
                className={className}
            >
                {processing ? 'Загрузка...' : label}
            </button>
        </>
    );
};

export { StateUploadButton };