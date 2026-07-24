import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SelectVariant = "green" | "indigo";

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: { name: string }[];
    defaultText: string;
    className?: string;
    variant?: SelectVariant;
}

const variantStyles: Record<
    SelectVariant,
    {
        trigger: string;
        span: string;
        placeholder: string;
        chevron: string;
        content: string;
        item: string;
        selectedItem: string;
        unselectedItem: string;
        empty: string;
    }
> = {
    green: {
        trigger: "w-full px-2.5 py-1.5 bg-transparent hover:bg-emerald-200/40 text-emerald-950 text-sm font-medium transition-all duration-150 cursor-pointer flex justify-between items-center outline-none",
        span: "block truncate text-left",
        placeholder: "text-emerald-800/60",
        chevron: "w-4 h-4 ml-1.5 shrink-0 text-emerald-800 transition-transform duration-200 data-[state=open]:rotate-180 self-center",
        content: "w-(--radix-dropdown-menu-trigger-width) min-w-(--radix-dropdown-menu-trigger-width) max-h-60 overflow-y-auto rounded-none border border-gray-200 bg-white/95 backdrop-blur-md p-0 shadow-xl z-50 custom-scrollbar",
        item: "px-3 py-2 text-sm font-semibold cursor-pointer transition-colors border-b border-gray-100 last:border-0 rounded-none outline-none",
        selectedItem: "bg-emerald-100 text-emerald-900 focus:bg-emerald-100 focus:text-emerald-900",
        unselectedItem: "text-gray-800 focus:bg-emerald-50 focus:text-emerald-900 hover:bg-emerald-50 hover:text-emerald-900",
        empty: "px-3 py-2 text-sm text-gray-400 font-semibold italic",
    },
    indigo: {
        trigger: "w-full min-w-96 px-3 py-2 bg-white border border-gray-300 hover:border-indigo-400 text-gray-800 text-sm font-bold shadow-sm transition-all duration-150 cursor-pointer flex justify-between items-center min-h-10 relative z-20 rounded-none outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 data-[state=open]:border-indigo-500 data-[state=open]:ring-1 data-[state=open]:ring-indigo-500 data-[state=open]:shadow-lg data-[state=open]:text-gray-900",
        span: "block whitespace-normal wrap-break-word min-w-0 flex-1 text-left",
        placeholder: "text-gray-500",
        chevron: "w-4 h-4 ml-2 shrink-0 text-gray-500 transition-transform duration-200 data-[state=open]:rotate-180 self-center",
        content: "w-(--radix-dropdown-menu-trigger-width) min-w-(--radix-dropdown-menu-trigger-width) max-h-60 overflow-y-auto rounded-none border border-gray-200 bg-white/85 backdrop-blur-md p-0 shadow-2xl shadow-black z-50 custom-scrollbar",
        item: "px-3 py-2 text-sm font-semibold cursor-pointer transition-colors border-b border-gray-100/50 last:border-0 rounded-none whitespace-normal wrap-break-word outline-none",
        selectedItem: "bg-indigo-100/80 text-indigo-800 focus:bg-indigo-100/80 focus:text-indigo-800",
        unselectedItem: "text-gray-800 focus:bg-indigo-50/80 focus:text-indigo-900 hover:bg-indigo-50/80 hover:text-indigo-900",
        empty: "px-3 py-3 text-sm text-gray-400 font-semibold italic bg-white/50",
    },
};

export const CustomSelect = ({
    value,
    onChange,
    options,
    defaultText,
    className = "",
    variant = "indigo",
}: CustomSelectProps) => {
    // Match directly against the name property
    const selectedOption = options.find((opt) => opt.name === value);
    const styles = variantStyles[variant];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={`${styles.trigger} ${className} select-none`}
                >
                    <span
                        className={`${styles.span} ${!selectedOption ? styles.placeholder : ""
                            }`}
                    >
                        {selectedOption ? selectedOption.name : defaultText}
                    </span>

                    <ChevronDown className={styles.chevron} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={4}
                className={styles.content}
            >
                {options.length === 0 ? (
                    <div className={styles.empty}>
                        Нет данных
                    </div>
                ) : (
                    options.map((opt) => (
                        <DropdownMenuItem
                            key={opt.name}
                            onClick={() => onChange(opt.name)}
                            title={opt.name}
                            className={`${styles.item} ${value === opt.name
                                ? styles.selectedItem
                                : styles.unselectedItem
                                }`}
                        >
                            {opt.name}
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};