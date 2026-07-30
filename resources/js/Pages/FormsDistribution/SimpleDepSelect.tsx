import React, { useState, useRef, useEffect } from "react";
import { MinDep } from "@/types";

interface SimpleDepSelectProps {
    departments: MinDep[];
    attachedDepartments?: Array<{ id: any;[key: string]: any }>;
    selectedId: string;
    onSelect: (id: string) => void;
    placeholder?: string;
    onOpenForm?: () => void;
}

export const SimpleDepSelect = ({
    departments,
    attachedDepartments = [],
    selectedId,
    onSelect,
    placeholder = "Поиск ведомства...",
    onOpenForm,
}: SimpleDepSelectProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Create a set of attached department IDs for fast lookup
    const attachedIds = new Set(attachedDepartments.map(d => String(d.id)));

    // Filter out departments already attached, then apply search query
    const filteredDepts = departments
        .filter(d => !attachedIds.has(String(d.id)))
        .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="relative font-mono w-full bg-white border border-indigo-300 shadow-xl flex flex-col z-50" ref={containerRef}>
            {/* <div className="text-black">добавить</div> */}
            <div className="p-2 border-b border-gray-200 bg-gray-50">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 text-xs font-mono outline-none focus:border-indigo-500"
                    autoFocus
                />
            </div>

            <div className="overflow-y-auto max-h-100 flex-1 custom-scrollbar overflow-x-hidden">
                {filteredDepts.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-gray-400 italic">Ничего не найдено</div>
                ) : (
                    filteredDepts.map((dept) => (
                        <div
                            key={dept.id}
                            onClick={() => {
                                onSelect(String(dept.id));
                                if (onOpenForm) onOpenForm();
                                setSearchTerm("");
                            }}
                            className={`px-3.5 py-2.5 text-xs cursor-pointer hover:bg-indigo-50 transition-colors wrap-break-word whitespace-normal ${String(dept.id) === selectedId
                                ? "bg-indigo-100 font-bold text-indigo-900"
                                : "text-gray-700"
                                }`}
                        >
                            {dept.name}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};