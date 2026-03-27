import React from "react";

interface ResultFixationCardProps {
    saveShrVersion: () => void;
    printProtocol: () => void;
}

export const ResultFixationCard: React.FC<ResultFixationCardProps> = ({
    saveShrVersion,
    printProtocol,
}) => {
    return (
        <div className="bg-white shadow rounded-md mb-3">
            <div className="bg-gray-100 p-3 flex justify-between items-center rounded-t-md">
                <h5 className="flex items-center gap-2 mb-0">
                    <i className="bi bi-save"></i>Фиксация результатов
                </h5>
            </div>

            <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white border rounded-md h-full">
                        <div className="bg-gray-100 p-2 rounded-t-md">
                            <h6 className="mb-0">Сохранение новой версии</h6>
                        </div>

                        <div className="p-3 space-y-3">
                            <p className="text-gray-500">
                                Сохраните текущие изменения как новую версию штатного расписания:
                            </p>

                            <div>
                                <label className="block mb-1">
                                    Комментарий к версии
                                    <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    className="w-full border rounded px-2 py-1"
                                    id="new-version-comment"
                                    placeholder="Например: Оптимизация после перевода двух сотрудников в Курган"
                                />
                            </div>

                            <button
                                className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-1"
                                id="save-new-version-btn"
                                onClick={saveShrVersion}
                            >
                                <i className="bi bi-save"></i>
                                Зафиксировать новую версию штатного расписания
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border rounded-md h-full">
                        <div className="bg-gray-100 p-2 rounded-t-md">
                            <h6 className="mb-0">Протокол изменений</h6>
                        </div>

                        <div className="p-3 space-y-3">
                            <p className="text-gray-500">
                                Сгенерируйте протокол изменений для печати или экспорта:
                            </p>

                            <div className="flex flex-col gap-2">
                                <button
                                    className="border border-blue-500 text-blue-600 py-2 rounded flex items-center justify-center gap-1"
                                    id="generate-protocol-btn"
                                    onClick={printProtocol}
                                >
                                    <i className="bi bi-file-earmark-text"></i>
                                    Сгенерировать протокол изменений
                                </button>

                                <button
                                    className="bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-1"
                                    id="print-protocol-btn"
                                    onClick={printProtocol}
                                >
                                    <i className="bi bi-printer"></i>
                                    Распечатать протокол
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};