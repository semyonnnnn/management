import React from 'react';

interface DepartmentRowProps {
    dept: any;
    index: number;
    versions: any[];
    territoryColor: Record<string, string>;
    showTerritory: boolean;
    form: any;
    handleUpdate: (e: React.FormEvent, id: string | number) => void;
    onDelete: (dept: any) => void;
}

export const DepartmentRow = ({
    dept, index, territoryColor, showTerritory, form, handleUpdate, onDelete
}: DepartmentRowProps) => {
    const { data, setData, processing } = form;

    return (
        <div className={`flex items-center border-b border-indigo-900/10 transition-colors hover:bg-indigo-50/50 ${index % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}`}>
            {/* CODE */}
            <div className="w-24 px-1.5 py-1 text-base font-bold text-indigo-700 leading-none border-r border-indigo-200 bg-indigo-50/30">
                {dept.code}
            </div>

            {/* NAME */}
            <div className="flex-1 px-1.5 py-1 text-base font-bold text-gray-900 leading-none">
                {dept.name}
            </div>

            {/* STATE INPUT */}
            <div className="w-44 px-1.5 py-1 text-right">
                <input
                    type="number"
                    value={data.state}
                    onChange={(e) => setData('state', parseInt(e.target.value) || 0)}
                    className="w-20 px-1 py-0.5 text-right font-mono text-sm font-bold border border-indigo-400 bg-white text-indigo-900 focus:outline-none"
                />
            </div>

            {/* TERRITORY */}
            {showTerritory && (
                <div className="w-40 px-1.5 py-1 flex justify-end">
                    <div className={`px-2 py-0.5 text-[11px] font-mono font-bold tracking-wider uppercase ${territoryColor[dept.territory] || "bg-gray-200"}`}>
                        {dept.territory === "ekb" ? "ЕКАТЕРИНБУРГ" : dept.territory === "krg" ? "КУРГАН" : dept.territory}
                    </div>
                </div>
            )}

            {/* DELETE BUTTON */}
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