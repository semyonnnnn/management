import { Plus } from "lucide-react";

interface AddButtonPlaceholderProps {
    onClick: () => void;
}

export function AddButtonPlaceholder({
    onClick,
}: AddButtonPlaceholderProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                flex
                h-52
                w-96
                flex-col
                items-center
                justify-center
                gap-4
                border-2
                border-dashed
                border-[#3949AB]
                text-[#3949AB]
                transition
                hover:bg-[#3949AB]/5
                hover:scale-[1.02]
                cursor-pointer
            "
        >
            <Plus
                size={48}
                strokeWidth={1.5}
            />

            <span className="text-lg font-semibold">
                Добавить
            </span>

            <span className="text-sm opacity-60">
                Создать вручную
            </span>
        </button>
    );
}