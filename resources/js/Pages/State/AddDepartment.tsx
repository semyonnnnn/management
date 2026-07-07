interface AddDepartmentProps {
    data: any;
    setData: any;
    processing: boolean;
    handleAdd: (e: React.FormEvent) => void;
    handleCancel: () => void;
}

const AddDepartment = ({ data, setData, processing, handleAdd, handleCancel }: AddDepartmentProps) => {

    const handleNumberChange = (field: string, value: string) => {
        if (/^\d*$/.test(value)) {
            setData(field, value);
        }
    };

    return (
        // The container wrapper with a subtle indigo stripe pattern
        <div className="mt-4 p-4 border border-indigo-300 shadow-xl bg-[repeating-linear-gradient(45deg,#f5f3ff,#f5f3ff_10px,#e0e7ff_10px,#e0e7ff_20px)]">

            {/* The table stays clean with a solid background */}
            <div className="bg-white p-2 border border-indigo-200 shadow-sm">
                <table className="min-w-full">
                    <thead className="bg-indigo-50/80 border-b border-indigo-200/80">
                        <tr className="align-bottom">
                            <th className="text-left px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 w-24">КОД</th>
                            <th className="text-left px-1.5 py-1 text-sm font-mono font-bold text-indigo-700">НАЗВАНИЕ</th>
                            <th className="text-left px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 w-32">ТЕРРИТОРИЯ</th>
                            <th className="text-right px-1.5 py-1 text-sm font-mono font-bold text-indigo-700 w-24">ШТАТНОЕ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white">
                            <td className="px-1 py-1">
                                <input
                                    placeholder="КОД"
                                    value={data.code}
                                    onChange={e => handleNumberChange('code', e.target.value)}
                                    className="w-24 bg-white border border-gray-300 p-1 text-sm font-mono focus:border-indigo-600 outline-none"
                                />
                            </td>
                            <td className="px-1 py-1">
                                <input
                                    placeholder="НАЗВАНИЕ"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full bg-white border border-gray-300 p-1 text-sm font-mono focus:border-indigo-600 outline-none"
                                />
                            </td>
                            <td className="px-1 py-1">
                                <select
                                    value={data.territory}
                                    onChange={e => setData('territory', e.target.value)}
                                    className="w-32 bg-white border border-gray-300 p-1 text-sm font-mono uppercase focus:border-indigo-600 outline-none"
                                >
                                    <option value="ekb">ЕКБ</option>
                                    <option value="krg">КРГ</option>
                                </select>
                            </td>
                            <td className="px-1 py-1 text-right">
                                <div className="flex justify-end">
                                    <input
                                        type="text"
                                        value={data.state}
                                        onChange={e => handleNumberChange('state', e.target.value)}
                                        className="w-20 bg-white border border-gray-300 p-1 text-sm font-mono text-right focus:border-indigo-600 outline-none"
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="mt-4 flex justify-end gap-2 border-t border-indigo-100 pt-2">
                    <button
                        onClick={handleCancel}
                        className="bg-white text-indigo-600 border border-indigo-600 px-3 py-1 text-xs font-bold whitespace-nowrap hover:bg-indigo-50 transition-colors lowercase cursor-pointer"
                    >
                        ОТМЕНИТЬ
                    </button>
                    <button
                        onClick={handleAdd}
                        disabled={processing}
                        className="bg-indigo-600 text-white px-3 py-1 text-xs font-bold whitespace-nowrap hover:bg-indigo-700 transition-colors disabled:opacity-50 lowercase cursor-pointer"
                    >
                        ДОБАВИТЬ
                    </button>
                </div>
            </div>
        </div>
    );
};

export { AddDepartment };