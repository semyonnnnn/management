import React from "react";

interface Props {
    recalcAndRender: () => void;
    loadDemoData: () => void;
}

export const CalculationCard: React.FC<Props> = ({
    recalcAndRender,
    loadDemoData,
}) => {
    return (
        <div className="bg-white shadow rounded-md h-full flex flex-col">
            <div className="bg-gray-100 p-3 rounded-t-md">
                <h6 className="flex items-center gap-2 mb-0">
                    <i className="bi bi-calculator"></i> Расчет и фильтрация
                </h6>
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between space-y-3">
                <div>
                    <label className="block font-semibold mb-1">
                        Фильтр по территории
                    </label>

                    <div className="flex gap-2 flex-wrap">
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="radio"
                                name="territory-filter"
                                id="all-territory"
                                defaultChecked
                            />
                            Оба региона
                        </label>

                        <label className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="radio"
                                name="territory-filter"
                                id="ekb-territory"
                            />
                            Екатеринбург
                        </label>

                        <label className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="radio"
                                name="territory-filter"
                                id="kg-territory"
                            />
                            Курган
                        </label>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        className="bg-green-600 text-white py-2 rounded-md flex items-center justify-center gap-1"
                        id="calculate-btn"
                        onClick={recalcAndRender}
                    >
                        <i className="bi bi-play-circle"></i>
                        Рассчитать нагрузку
                    </button>

                    <button
                        className="border border-gray-400 text-gray-700 py-2 rounded-md flex items-center justify-center gap-1"
                        id="reset-btn"
                        onClick={loadDemoData}
                    >
                        <i className="bi bi-arrow-counterclockwise"></i>
                        Сбросить изменения
                    </button>
                </div>

                <div className="bg-blue-100 text-blue-800 p-2 rounded-md flex items-center gap-1 text-sm">
                    <i className="bi bi-info-circle"></i>
                    После загрузки всех файлов таблица строится автоматически.
                </div>
            </div>
        </div>
    );
};