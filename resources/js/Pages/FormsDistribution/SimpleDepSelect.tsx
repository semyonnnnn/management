import { useState, useRef, useEffect } from "react";
import { Department } from "@/types";

interface SimpleDepSelectProps {
    departments: Department[];
    selectedId: string;
    onSelect: (id: string) => void;
    placeholder?: string;
}

export const SimpleDepSelect = ({
    departments,
    selectedId,
    onSelect,
    placeholder = "Выберите ведомство...",
}: SimpleDepSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedDept = departments.find(d => String(d.id) === selectedId);

    const filteredDepts = departments.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative font-mono w-full" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 hover:border-indigo-400 text-gray-800 text-sm font-bold shadow-sm cursor-pointer flex justify-between items-center transition-all"
            >
                <span className="wrap-break-word pr-2">{selectedDept ? selectedDept.name : placeholder}</span>
                <span className="text-xs text-indigo-600 font-bold shrink-0">{isOpen ? "▲" : "▼"}</span>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-1 max-w-200 max-h-100 bg-white border border-indigo-300 shadow-xl z-50 flex flex-col">
                    <div className="p-2 border-b border-gray-200 bg-gray-50">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Поиск..."
                            className="w-full px-3 py-1.5 bg-white border border-gray-300 text-xs font-mono outline-none focus:border-indigo-500"
                            autoFocus
                        />
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar overflow-x-hidden">
                        {filteredDepts.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-gray-400 italic">Ничего не найдено</div>
                        ) : (
                            filteredDepts.map((dept) => (
                                <div
                                    key={dept.id}
                                    onClick={() => {
                                        onSelect(String(dept.id));
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                    className={`px-3.5 py-2.5 text-xs cursor-pointer hover:bg-indigo-50 transition-colors break-words whitespace-normal ${String(dept.id) === selectedId
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
            )}
        </div>
    );
};