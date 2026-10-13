import { useRef } from "react";
import { router } from "@inertiajs/react";
import { SyncIcon } from "@/components/custom/SyncIcon";

interface StateUploadButtonProps {
    isPlaceholder?: boolean;
}

export function SyncButton({
    isPlaceholder = false,
}: StateUploadButtonProps) {

    const handleClick = () => {
        router.post(route('sync.index'));
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
                            hover:scale-105"
                    >
                        <SyncIcon color="#3949AB" />

                        <span className="text-lg font-semibold">
                            Загрузить файл
                        </span>

                        <span className="text-sm opacity-60">
                            XLSX, XLS или CSV
                        </span>
                    </button>
                </div>
            ) : (
                <SyncIcon
                    color="#3949AB"
                    onClick={handleClick}
                />
            )}
        </>
    );
}