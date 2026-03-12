import React from "react";
import { TotalLoadCardProps } from "@/types";


export const TotalLoadCard: React.FC<TotalLoadCardProps> = ({ loads, printProtocol }) => {

    return (
        <div className="bg-white shadow rounded-md h-full">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-md">
                <h6 className="font-semibold mb-0 flex items-center gap-2">
                    <i className="bi bi-bar-chart"></i> Общая нагрузка
                </h6>
                <button
                    onClick={printProtocol}
                    className="text-sm bg-blue-600 text-white rounded px-3 py-1 flex items-center gap-1"
                >
                    <i className="bi bi-download"></i> Экспорт отчета
                </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
                {loads.map((load) => (
                    <div key={load.id}>
                        <div className="flex justify-between mb-1">
                            <span>{load.label}</span>
                            <span className="font-bold">{load.value.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded h-5">
                            <div
                                className={`h-5 rounded ${load.color}`}
                                style={{ width: `${load.percent}%` }}
                            >
                                <span className="text-white text-xs pl-1">{load.percent}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};