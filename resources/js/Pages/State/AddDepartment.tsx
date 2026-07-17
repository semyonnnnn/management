import React from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from "@/components/custom/Modal";

interface DepartmentForm {
    code: string;
    name: string;
    territory: string;
    state: string;
    version_id: string;
}

interface AddDepartmentProps {
    isOpen: boolean; // Controls whether the modal is visible
    handleCancel: () => void;
}

const AddDepartment = ({ isOpen, handleCancel }: AddDepartmentProps) => {
    const { data, errors, setData, post, processing, reset } = useForm<DepartmentForm>({
        code: '',
        name: '',
        territory: 'ekb',
        state: '',
        version_id: '',
    });

    // Helper to determine border/glow style for error fields
    const getBorderClass = (field: keyof DepartmentForm) => {
        return errors[field]
            ? "border-red-500 ring-1 ring-red-500 focus:border-red-600 focus:ring-red-600"
            : "border-gray-300 focus:border-indigo-600";
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('state.create'), {
            onSuccess: () => {
                reset();
                handleCancel();
                router.reload({ only: ['state'] });
            }
        });
    };

    const handleCodeChange = (value: string) => {
        if (value === '' || (/^(?!.*00)[0-9]{0,2}к?$/.test(value))) {
            setData('code', value);
        }
    };

    const handleNameChange = (value: string) => {
        if (/^(?!\s)(?!.*\s\s)[а-яА-ЯёЁ0-9,.\(\)\s)]*$/.test(value)) {
            setData('name', value);
        }
    };

    const handleStateChange = (value: string) => {
        if (/^(?!0)\d{0,3}$/.test(value) || value === '') {
            setData('state', value);
        }
    };

    const renderError = (field: keyof DepartmentForm) => {
        if (!errors[field]) return null;
        return <div className="text-red-600 text-xs font-bold mt-1">*{errors[field]}</div>;
    };

    return (
        <Modal show={isOpen} onClose={handleCancel} maxWidth="3xl">
            {/* Repeating background wrapper inside the modal panel */}
            <div className="p-4 border border-indigo-300 bg-[repeating-linear-gradient(45deg,#f5f3ff,#f5f3ff_10px,#e0e7ff_10px,#e0e7ff_20px)]">
                <div className="bg-white p-4 border border-indigo-200 shadow-sm">
                    {/* Header title for modal clarity */}
                    <div className="text-lg font-bold text-gray-900 uppercase tracking-tight mb-4 border-b border-indigo-100 pb-2">
                        новый отдел
                    </div>

                    <form onSubmit={handleAdd}>
                        <table className="min-w-full">
                            <thead className="bg-indigo-50/80 border-b border-indigo-200/80">
                                <tr className="align-bottom">
                                    <th className="text-left px-1.5 py-1.5 text-sm font-mono font-bold text-indigo-700 w-24">КОД</th>
                                    <th className="text-left px-1.5 py-1.5 text-sm font-mono font-bold text-indigo-700">НАЗВАНИЕ</th>
                                    <th className="text-left px-1.5 py-1.5 text-sm font-mono font-bold text-indigo-700 w-32">ТЕРРИТОРИЯ</th>
                                    <th className="text-right px-1.5 py-1.5 text-sm font-mono font-bold text-indigo-700 w-24">ШТАТНОЕ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white">
                                    <td className="px-1 py-2">
                                        <input
                                            placeholder="01/02к"
                                            value={data.code}
                                            onChange={e => handleCodeChange(e.target.value)}
                                            className={`w-full bg-white border p-1 text-sm font-mono outline-none ${getBorderClass('code')}`}
                                        />
                                    </td>
                                    <td className="px-1 py-2">
                                        <input
                                            placeholder="название.."
                                            value={data.name}
                                            onChange={e => handleNameChange(e.target.value)}
                                            className={`w-full bg-white border p-1 text-sm font-mono outline-none ${getBorderClass('name')}`}
                                        />
                                    </td>
                                    <td className="px-1 py-2">
                                        <select
                                            value={data.territory}
                                            onChange={e => setData('territory', e.target.value)}
                                            className={`w-full bg-white border p-1 text-sm font-mono uppercase outline-none ${getBorderClass('territory')}`}
                                        >
                                            <option value="ekb">ЕКБ</option>
                                            <option value="krg">КРГ</option>
                                        </select>
                                    </td>
                                    <td className="px-1 py-2 text-right">
                                        <div className="flex justify-end">
                                            <input
                                                placeholder="100"
                                                value={data.state}
                                                onChange={e => handleStateChange(e.target.value)}
                                                className={`w-full bg-white border p-1 text-sm font-mono text-right outline-none ${getBorderClass('state')}`}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Error Display Section */}
                        <div className="px-1 mt-2 space-y-1">
                            {renderError('code')}
                            {renderError('name')}
                            {renderError('state')}
                            {renderError('territory')}
                        </div>

                        {/* Actions Panel */}
                        <div className="mt-6 flex justify-end gap-2 border-t border-indigo-100 pt-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-white text-indigo-600 border border-indigo-600 px-4 py-1.5 text-xs font-bold whitespace-nowrap hover:bg-indigo-50 transition-colors lowercase cursor-pointer"
                            >
                                ОТМЕНИТЬ
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 text-white px-4 py-1.5 text-xs font-bold whitespace-nowrap hover:bg-indigo-700 transition-colors disabled:opacity-50 lowercase cursor-pointer"
                            >
                                ДОБАВИТЬ
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export { AddDepartment };