import { useRef } from "react";
import { router } from "@inertiajs/react";
import { UploadIcon } from "@/components/custom/UploadIcon";

interface StateUploadButtonProps {
    isPlaceholder?: boolean;
    route_path: string;
}

export function StateUploadButton({
    isPlaceholder = false,
    route_path,
}: StateUploadButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        router.post(route(route_path), formData, {
            forceFormData: true,

            onSuccess: () => {
                // refresh / toast
            },

            onError: (errors) => {
                console.error(errors);
            },
        });

        // Allow selecting the same file again
        e.target.value = "";
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            {isPlaceholder ? (
                <div className="flex min-h-125 flex-col items-center justify-center">

                    <button
                        type="button"
                        onClick={handleClick}
                        className="
                            cursor-pointer
                            flex h-52 w-96 flex-col
                            items-center justify-center
                            gap-4
                            rounded-none
                            border-2 border-dashed
                            border-[#3949AB]
                            text-[#3949AB]
                            transition
                            hover:bg-[#3949AB]/5
                            hover:scale-105
                        "
                    >
                        <UploadIcon color="#3949AB" />

                        <span className="text-lg font-semibold">
                            Загрузить файл
                        </span>

                        <span className="text-sm opacity-60">
                            XLSX, XLS или CSV
                        </span>
                    </button>
                </div>
            ) : (
                <UploadIcon
                    color="#3949AB"
                    onClick={handleClick}
                />
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
            />
        </>
    );
}