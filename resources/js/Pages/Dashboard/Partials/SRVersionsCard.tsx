import React from "react";

interface Props {
    applyShrVersion: () => void;
    printProtocol: () => void;
}

const SRVersionsCard: React.FC<Props> = ({ applyShrVersion, printProtocol }) => (
    <div className="bg-white shadow rounded-md h-full flex flex-col">
        <div className="bg-gray-100 p-3 flex justify-between items-center rounded-t-md">
            <h6 className="flex items-center gap-2 mb-0">
                <i className="bi bi-clock-history"></i> Версии штатного расписания
            </h6>
            <span className="bg-gray-400 text-white px-2 py-0.5 rounded" id="version-count">
                0
            </span>
        </div>
        <div className="p-3 flex-1 flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto mb-3" id="version-selector"></div>
            <div className="flex flex-col gap-2">
                <button
                    className="border border-blue-500 text-blue-500 py-1 rounded-md w-full flex items-center justify-center gap-1"
                    onClick={applyShrVersion}
                >
                    <i className="bi bi-check-circle"></i> Применить выбранную версию
                </button>
                <button
                    className="border border-gray-400 text-gray-700 py-1 rounded-md w-full flex items-center justify-center gap-1"
                    onClick={printProtocol}
                >
                    <i className="bi bi-eye"></i> Показать изменения
                </button>
            </div>
        </div>
    </div>
);

export { SRVersionsCard };