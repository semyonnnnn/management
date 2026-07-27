import { Department } from "@/types";

interface DepSearchProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    placeholderText?: string;
    filteredDepartments: Department[];
    handleSelectDepartment: (id: string) => void;
}

export function DepSearch({
    searchTerm,
    setSearchTerm,
    placeholderText = '',
    filteredDepartments,
    handleSelectDepartment
}: DepSearchProps) {
    return (
        <div className="space-y-3 mb-5 min-w-[200px]">
            <div className="w-full">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholderText}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 hover:border-indigo-400 text-gray-800 text-sm font-bold shadow-sm transition-all duration-150 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-500 placeholder:font-normal"
                />
            </div>

            <div className="w-full overflow-y-auto bg-white border border-gray-200 shadow-sm custom-scrollbar" style={{ maxHeight: '35vh', minHeight: '150px' }}>
                {filteredDepartments.length === 0 ? (
                    <div className="px-3 py-3 text-sm text-gray-400 font-semibold italic bg-white/50">
                        Нет совпадений
                    </div>
                ) : (
                    filteredDepartments.map((dept: Department) => (
                        <div
                            key={dept.id}
                            onClick={() => handleSelectDepartment(String(dept.id))}
                            className="px-3 py-2 text-sm font-semibold text-gray-800 cursor-pointer transition-colors border-b border-gray-100 last:border-0 whitespace-normal break-words hover:bg-indigo-50/80 hover:text-indigo-900"
                        >
                            {dept.name}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}