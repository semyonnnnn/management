import React from 'react';

interface DepartmentRowProps {
    dept: any;
    index: number;
    setBuffer: React.Dispatch<React.SetStateAction<any[]>>;
    onDelete: (dept: any) => void;
}

export const DepartmentRow = ({ dept, index, setBuffer, onDelete }: DepartmentRowProps) => {

    const updateField = (field: string, value: any) => {
        setBuffer(prev => prev.map(item =>
            item.id === dept.id ? { ...item, [field]: value } : item
        ));
    };

    const territoryColor: Record<string, string> = {
        ekb: "bg-indigo-100 text-indigo-700 border border-indigo-200",
        krg: "bg-purple-100 text-purple-700 border border-purple-200",
    };

    return (
        <div className={`flex items-center border-b border-indigo-900/10 ${index % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}`}>
            <div className="w-24 border-r border-indigo-200 px-2">
                <input
                    type="text"
                    value={dept.code}
                    onChange={(e) => updateField('code', e.target.value)}
                    className="w-full border-b border-black/20 h-7 px-1.5 text-base font-bold text-indigo-700 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
            </div>

            <div className="flex-1 px-2 border-r">
                <input
                    type="text"
                    value={dept.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full h-7 border-b border-black/20 px-2 text-base font-bold text-gray-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
            </div>

            <div className="w-24 px-1.5 py-1">
                <input
                    type="text"
                    value={dept.state}
                    onChange={(e) => updateField('state', parseInt(e.target.value) || 0)}
                    className="w-full h-7 border-b px-1.5 border-black/20 text-right font-mono text-sm font-bold bg-transparent text-indigo-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
            </div>

            <div className="w-40 px-1.5 py-1 flex justify-end">
                <select
                    value={dept.territory}
                    onChange={(e) => updateField('territory', e.target.value)}
                    className={`h-7 px-1 text-[11px] font-mono font-bold tracking-wider uppercase border border-indigo-400 bg-white text-gray-900 focus:outline-none w-full leading-tight ${territoryColor[dept.territory] || "bg-gray-200"}`}
                >
                    <option value="ekb">ЕКАТЕРИНБУРГ</option>
                    <option value="krg">КУРГАН</option>
                </select>
            </div>

            <div className="w-24 px-1.5 py-1 flex justify-end">
                <button
                    onClick={() => onDelete(dept)}
                    className="w-7 h-7 flex items-center justify-center bg-pink-100 border cursor-pointer border-red-300 text-3xl text-center text-red-600 hover:bg-pink-200"
                >
                    ×
                </button>
            </div>
        </div>
    );
};
