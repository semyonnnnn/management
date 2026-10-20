import Modal from '@/components/custom/Modal';
import type { LocalFormItem } from './Index';

// Same badge colors as the territory badge in DeptTable, so a department
// looks identical on both pages
const territoryColor = {
    ekb: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    krg: 'bg-purple-100 text-purple-700 border border-purple-200',
};

const territoryLabel = {
    ekb: 'ЕКАТЕРИНБУРГ',
    krg: 'КУРГАН',
};

interface Props {
    form: LocalFormItem | null; // null = closed
    onClose: () => void;
}

export function DepartmentsModal({ form, onClose }: Props) {
    // Nothing to render without a form. The parent derives `form` from an id,
    // so deleting the selected form closes the modal automatically.
    if (!form) return null;

    return (
        <Modal show={true} onClose={onClose} maxWidth="lg">
            <div className="bg-white border border-indigo-200/50 h-fit flex flex-col p-6">
                <h3 className="text-2xl font-mono font-bold text-gray-900 mb-1">отделы_формы</h3>

                {/* which form we are looking at */}
                <div className="mb-6 flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 bg-sky-100 border border-sky-200 text-sky-900 font-mono font-bold text-xs">
                        {form.okud || '—'}
                    </span>
                    <span className="font-semibold text-gray-700">{form.name || 'без названия'}</span>
                </div>

                {form.departments.length === 0 ? (
                    <div className="py-8 text-center font-mono text-sm text-red-600 bg-red-50 border border-red-200">
                        к форме не привязано ни одного отдела
                    </div>
                ) : (
                    // max-h + overflow: a form can have 10+ departments with long names
                    <div className="max-h-[60vh] overflow-y-auto space-y-2">
                        {form.departments.map((dept) => (
                            <div
                                // no id in the payload yet; codes are unique in the table
                                key={dept.code}
                                className="flex items-center gap-3 border border-gray-300 bg-gray-50 px-3 py-2"
                            >
                                <div className="min-w-10 px-2 py-1 bg-indigo-900 text-white text-center font-mono font-bold text-xs">
                                    {dept.code}
                                </div>
                                <div className="flex-1 text-sm font-semibold text-gray-800">{dept.name}</div>
                                <div className={`px-2 py-1 text-[9px] font-mono font-bold tracking-wider w-fit ${territoryColor[dept.territory]}`}>
                                    {territoryLabel[dept.territory]}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 border border-indigo-200 font-mono font-bold text-indigo-600 uppercase hover:bg-indigo-50"
                    >
                        ЗАКРЫТЬ
                    </button>
                </div>
            </div>
        </Modal>
    );
}