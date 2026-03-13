import React from "react";
import { STVersionsCardProps } from "@/types";

const STVersionsCard: React.FC<STVersionsCardProps> = ({ applyShrVersion, printProtocol, versions }) => {
    return (
        <div className="bg-gray-900 dark:bg-gray-900 shadow rounded-md h-96 flex flex-col text-gray-900 dark:text-gray-100">

            {/* Header */}
            <div className="bg-gray-800 dark:bg-gray-800 p-3 flex justify-between items-center rounded-t-md">
                <h6 className="flex items-center gap-2 mb-0 text-white dark:text-white">
                    <i className="bi bi-clock-history"></i> Версии штатного расписания
                </h6>
                <span className="bg-gray-500 dark:bg-gray-700 text-white px-2 py-0.5 rounded" id="version-count">
                    {versions.length}
                </span>
            </div>

            {/* Versions list */}
            {/* Versions list with custom scrollbar */}
            <div
                className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md"
                id="version-selector"
                style={{
                    scrollbarColor: "#a2bffe", // Firefox: thumb color #7a3b1f, track color #1f1f1f
                }}
            >
                {versions.map((v, idx) => (
                    <div
                        key={idx}
                        className="version-item rounded-md p-2 flex justify-between items-center cursor-pointer transition border-1"
                        style={{
                            borderColor: ["#8aaedc", "#9cd68a", "#e0a28a", "#d6c58a"][idx % 4],
                        }}
                        data-version={idx + 1}
                    >
                        <div><strong>{v.name}</strong></div>
                        <div className="text-sm opacity-70">{v.date}</div>
                    </div>
                ))}
            </div>

            {/* Buttons */}
            <div className="p-3 flex flex-col gap-2">
                <button
                    className="border border-[#a2bffe] text-blue-500 py-1 rounded-md w-full flex items-center justify-center gap-1 cursor-pointer dark:bg-[#a2bffe] hover:bg-blue-100 dark:hover:bg-[#7da4f7] transition dark:text-white"
                    onClick={applyShrVersion}
                >
                    <i className="bi bi-check-circle"></i> Применить выбранную версию
                </button>
                <button
                    className="border border-gray-400 text-gray-700 dark:text-gray-200 py-1 rounded-md w-full flex items-center justify-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    onClick={printProtocol}
                >
                    <i className="bi bi-eye"></i> Показать изменения
                </button>
            </div>
        </div>
    );
};

export { STVersionsCard };