import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { TotalLoadCardProps } from "@/types";

// Smooth color from blue -> yellow -> red
function getLoadColor(percent: number) {
    let r: number, g: number, b: number;

    if (percent < 50) {
        // Blue (0%) -> Yellow (50%)
        const ratio = percent / 50;
        r = Math.round(255 * ratio);           // 0 -> 255
        g = Math.round(255 * ratio);           // 0 -> 255
        b = Math.round(255 - 255 * ratio);     // 255 -> 0
    } else {
        // Yellow (50%) -> Red (100%)
        const ratio = (percent - 50) / 50;
        r = 255;                               // stays 255
        g = Math.round(255 - 255 * ratio);     // 255 -> 0
        b = 0;                                 // stays 0
    }

    return `rgb(${r},${g},${b})`;
}

export const TotalLoadCard: React.FC<TotalLoadCardProps> = ({ loads, printProtocol }) => {
    return (
        <div className="bg-gray-900 h-96 shadow-lg rounded-md text-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gray-800 rounded-t-md">
                <h6 className="font-semibold mb-0 flex items-center gap-2">
                    <i className="bi bi-bar-chart"></i> Общая нагрузка
                </h6>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col h-full space-y-4">
                {/* Load bars */}
                <div className="space-y-4">
                    {loads.map((load) => (
                        <div key={load.id}>
                            <div className="flex justify-between mb-1">
                                <span>{load.label}</span>
                                <span className="font-bold">{load.value.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded h-5 overflow-hidden">
                                <div
                                    className="h-5 rounded flex justify-start items-center"
                                    style={{
                                        width: `${load.percent}%`,
                                        backgroundColor: getLoadColor(load.percent),
                                        transition: "width 0.5s ease, background-color 0.5s ease",
                                    }}
                                >
                                    <span
                                        className={`text-xs pl-1 font-bold ${load.percent < 26 ? "text-white" : "text-black"
                                            }`}
                                    >
                                        {load.percent}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Button pushed to the bottom */}
                <button
                    onClick={printProtocol}
                    className="mt-auto text-md bg-indigo-700 hover:bg-indigo-600 w-full font-bold text-white rounded py-2 flex items-center justify-center gap-2 transition-colors"
                >
                    Экспорт отчета
                    <FontAwesomeIcon className="text-xl" icon={faDownload} />
                </button>
            </div>
        </div>
    );
};