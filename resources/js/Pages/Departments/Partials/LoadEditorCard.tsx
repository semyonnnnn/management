import React from "react";

interface EditorCardProps {
    resetPendingChanges: () => void;
    applyPendingChanges: () => void;
    moveStaff: () => void;
}

export const LoadEditorCard: React.FC<EditorCardProps> = ({
    resetPendingChanges,
    applyPendingChanges,
    moveStaff,
}) => {
    return (
        <div className="bg-white shadow rounded-md mb-3">
            <div className="bg-gray-100 p-3 flex justify-between items-center rounded-t-md">
                <h5 className="flex items-center gap-2 mb-0">
                    <i className="bi bi-pencil-square"></i>Редактор нагрузки
                </h5>
                <div className="flex gap-2">
                    <button
                        className="text-sm border border-gray-400 px-3 py-1 rounded flex items-center gap-1"
                        id="reset-editing-btn"
                        onClick={resetPendingChanges}
                    >
                        <i className="bi bi-x-circle"></i> Сбросить изменения
                    </button>
                    <button
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                        id="apply-changes-btn"
                        onClick={applyPendingChanges}
                    >
                        <i className="bi bi-check-circle"></i> Применить изменения
                    </button>
                </div>
            </div>

            <div className="p-3">
                <div
                    className="bg-yellow-100 text-yellow-800 p-3 rounded mb-3 hidden"
                    id="editing-mode-alert"
                >
                    <i className="bi bi-exclamation-triangle mr-1"></i>
                    Вы находитесь в режиме редактирования. Внесенные изменения не сохранены.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white border rounded-md h-full">
                        <div className="bg-gray-100 p-2 rounded-t-md">
                            <h6 className="mb-0">
                                Перемещение сотрудников между отделами
                            </h6>
                        </div>

                        <div className="p-3 space-y-3">
                            <p className="text-gray-500">
                                Переместите сотрудников из одного отдела в другой:
                            </p>

                            <div>
                                <label className="block mb-1">Отдел-источник</label>
                                <select
                                    className="w-full border rounded px-2 py-1"
                                    id="source-department-select"
                                />
                            </div>

                            <div>
                                <label className="block mb-1">
                                    Количество сотрудников
                                </label>
                                <input
                                    type="number"
                                    className="w-full border rounded px-2 py-1"
                                    id="staff-to-move"
                                    min={1}
                                    defaultValue={1}
                                />
                            </div>

                            <div>
                                <label className="block mb-1">
                                    Отдел-получатель
                                </label>
                                <select
                                    className="w-full border rounded px-2 py-1"
                                    id="target-department-select"
                                />
                            </div>

                            <button
                                className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-1"
                                id="move-staff-btn"
                                onClick={moveStaff}
                            >
                                <i className="bi bi-arrow-right-circle"></i>
                                Переместить сотрудников
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border rounded-md h-full">
                        <div className="bg-gray-100 p-2 rounded-t-md">
                            <h6 className="mb-0">
                                Перемещение форм между отделами
                            </h6>
                        </div>

                        <div className="p-3 space-y-3">
                            <p className="text-gray-500">
                                Переместите форму из одного отдела в другой (используйте буфер обмена в детализации).
                            </p>

                            <div className="bg-blue-100 text-blue-800 p-2 rounded flex items-start gap-1">
                                <i className="bi bi-info-circle"></i>
                                Откройте детализацию отдела, нажмите ✂️ у формы,
                                затем откройте другой отдел и нажмите
                                "Вклеить форму из буфера".
                            </div>

                            <div>
                                <label className="block mb-1">
                                    Текущий буфер:
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-2 py-1"
                                    id="clipboard-display"
                                    readOnly
                                    placeholder="пусто"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};