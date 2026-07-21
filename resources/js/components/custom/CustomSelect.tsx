import React from "react";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: { id: string; name: string }[];
    defaultText: string;
}

export const CustomSelect = ({
    value,
    onChange,
    options,
    defaultText,
}: CustomSelectProps) => {
    const selectedOption = options.find((opt) => opt.id === value);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="w-full min-w-96 px-3 py-2 bg-white border border-gray-300 hover:border-indigo-400 text-gray-800 text-sm font-bold shadow-sm transition-all duration-150 cursor-pointer flex justify-between items-center min-h-10 relative z-20 rounded-none outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 data-[state=open]:border-indigo-500 data-[state=open]:ring-1 data-[state=open]:ring-indigo-500 data-[state=open]:shadow-lg data-[state=open]:text-gray-900"
                >
                    <span
                        className={`block whitespace-normal wrap-break-word min-w-0 flex-1 text-left ${!selectedOption ? "text-gray-500" : ""
                            }`}
                    >
                        {selectedOption ? selectedOption.name : defaultText}
                    </span>

                    <ChevronDown className="w-4 h-4 ml-2 shrink-0 text-gray-500 transition-transform duration-200 data-[state=open]:rotate-180 self-center" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={4}
                className="w-(--radix-dropdown-menu-trigger-width) min-w-(--radix-dropdown-menu-trigger-width) max-h-60 overflow-y-auto rounded-none border border-gray-200 bg-white/85 backdrop-blur-md p-0 shadow-2xl shadow-black z-50 custom-scrollbar"
            >
                {options.length === 0 ? (
                    <div className="px-3 py-3 text-sm text-gray-400 font-semibold italic bg-white/50">
                        Нет доступных ведомств
                    </div>
                ) : (
                    options.map((opt) => (
                        <DropdownMenuItem
                            key={opt.id}
                            onClick={() => onChange(opt.id)}
                            title={opt.name}
                            className={`px-3 py-2 text-sm font-semibold cursor-pointer transition-colors border-b border-gray-100/50 last:border-0 rounded-none whitespace-normal wrap-break-word outline-none ${value === opt.id
                                ? "bg-indigo-100/80 text-indigo-800 focus:bg-indigo-100/80 focus:text-indigo-800"
                                : "text-gray-800 focus:bg-indigo-50/80 focus:text-indigo-900 hover:bg-indigo-50/80 hover:text-indigo-900"
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