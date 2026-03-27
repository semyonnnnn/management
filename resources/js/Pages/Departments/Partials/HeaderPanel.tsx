import React from "react";

const HeaderPanel: React.FC = () => (
    <div className="bg-white shadow rounded-md">
        <div className="p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h5 className="text-lg font-semibold mb-2">
                        Модуль "Расчет, визуализация и модификация нагрузки"
                    </h5>
                    <div className="flex flex-wrap gap-3">
                        <div>
                            <strong>Дата/версия справочника форм:</strong>{" "}
                            <span id="header-sprav-version">—</span>
                        </div>
                        <div>
                            <strong>Дата/версия матрицы форм:</strong>{" "}
                            <span id="header-matrix-version">—</span>
                        </div>
                        <div>
                            <strong>Дата/версия штатного расписания:</strong>{" "}
                            <span id="header-sr-version">—</span>
                        </div>
                    </div>
                </div>
                <div
                    id="status-indicator"
                    className="text-green-600 flex items-center gap-1"
                >
                    <i className="bi bi-check-circle"></i> Данные актуальны
                </div>
            </div>
        </div>
    </div>
);

export { HeaderPanel };