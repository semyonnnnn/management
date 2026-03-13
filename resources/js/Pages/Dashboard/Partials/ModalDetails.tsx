import Modal from "@/components/custom/Modal";
import { ModalDetailsProps } from "@/types";


const ModalDetails = ({
    showModal,
    setShowModal,
    departmentName,
    territory,
    staffCount,
    totalLoad,
    loadPerStaff,
    forms,
}: ModalDetailsProps) => {
    const totalCalc = forms.reduce((sum, f) => sum + f.calc, 0);

    return (
        <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="2xl">
            <div className="flex flex-col rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-lg">

                {/* Header */}
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Детализация нагрузки</h5>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                    >
                        <i className="bi bi-x-lg text-xl"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 overflow-y-auto max-h-[60vh] space-y-4">

                    {/* Department Info */}
                    <div className="bg-blue-50 dark:bg-[#a2bffe] rounded-lg p-4 inline-block">
                        <div className="flex justify-between text-sm">
                            <div className="space-y-2 flex flex-wrap gap-2">
                                <div className="bg-[#c2a2ff] text-[#3b1f7a] rounded-md px-3 py-2 shadow-sm inline-block">
                                    <strong>Отдел:</strong> {departmentName}
                                </div>
                                <div className="bg-[#ffbfa2] text-[#7a3b1f] rounded-md px-3 py-2 shadow-sm inline-block">
                                    <strong>Территория:</strong> {territory}
                                </div>
                                <div className="bg-[#ffd86a] text-[#7a5a1f] rounded-md px-3 py-2 shadow-sm inline-block">
                                    <strong>Сотрудников:</strong> {staffCount}
                                </div>
                                <div className="bg-[#a2ffc8] text-[#1f7a5a] rounded-md px-3 py-2 shadow-sm inline-block">
                                    <strong>Суммарная нагрузка:</strong> {totalLoad}
                                </div>
                                <div className="bg-[#ffa2e1] h-fit text-[#7a1f6b] rounded-md px-3 py-2 shadow-sm inline-block">
                                    <strong>Нагрузка на 1 сотрудника:</strong> {loadPerStaff}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Forms Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-gray-200 dark:border-gray-600 table-auto">
                            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                <tr>
                                    <th className="px-3 py-2 text-left">Форма</th>
                                    <th className="px-3 py-2 text-left">Показателей</th>
                                    <th className="px-3 py-2 text-left">Кол-во отчётов</th>
                                    <th className="px-3 py-2 text-left">Коэф. (K1..K6)</th>
                                    <th className="px-3 py-2 text-left">Расчёт</th>
                                    <th className="px-3 py-2 text-left">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {forms.map(f => (
                                    <tr key={f.id} className="hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700">
                                        <td className="px-3 py-1">{f.form}</td>
                                        <td className="px-3 py-1">{f.indicators}</td>
                                        <td className="px-3 py-1">{f.reports}</td>
                                        <td className="px-3 py-1">{f.coeff}</td>
                                        <td className="px-3 py-1">{f.calc}</td>
                                        <td className="px-3 py-1">
                                            <button className="px-2 cursor-pointer py-1 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                                вырезать
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="font-semibold dark:text-white border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <td colSpan={4} className="px-3 py-2">ИТОГО</td>
                                    <td className="px-3 py-2">{totalCalc}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center border-t border-gray-200 dark:border-gray-600 px-6 py-3 space-x-2 bg-gray-50 dark:bg-gray-700">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                    >
                        Закрыть
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1">
                        <i className="bi bi-clipboard-plus"></i> Вклеить форму из буфера
                    </button>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                        в буфере: f_0601009_1000
                    </span>
                </div>
            </div>
        </Modal>
    );
};

export { ModalDetails };