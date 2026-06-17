import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index() {
    const { data, setData, post, processing, errors, setError, clearErrors, reset } = useForm({
        matrix: null as File | null,
        version: "",
    });

    const tryUpload = () => {
        clearErrors();

        // 1. Local Validation
        let hasErrors = false;

        if (!data.matrix) {
            setError("matrix", "ФАЙЛ МАТРИЦЫ ОБЯЗАТЕЛЕН");
            hasErrors = true;
        }

        if (!data.version.trim()) {
            setError("version", "НАЗВАНИЕ ВЕРСИИ ОБЯЗАТЕЛЬНО");
            hasErrors = true;
        }

        // 2. STOP if local validation failed
        if (hasErrors) return;

        // 3. Send to server (Backend errors will automatically fill the 'errors' object)
        post("/uploadFiles", {
            onSuccess: () => reset(),
            // Inertia handles onError automatically, 
            // but you can add custom logic here if needed:
            onError: (backendErrors) => {
                console.log("Server validation failed:", backendErrors);
            }
        });
    };
    function validateExcelFile(file: File | null): string | null {
        if (!file) return null;

        const extension = file.name.split(".").pop()?.toLowerCase();

        if (extension !== "xlsx") {
            return "ФАЙЛ ДОЛЖЕН БЫТЬ ФОРМАТА .XLSX";
        }

        return null;
    }

    return (
        <>
            <Head title="Загрузить" />
            <AuthenticatedLayout>
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-indigo-200/50">
                        {/* Header */}
                        <div className="border-b border-indigo-200/50">
                            <div className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                    <h6 className="text-sm font-mono font-bold text-gray-900 tracking-tighter">
                                        УПРАВЛЕНИЕ_ДАННЫМИ
                                    </h6>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 space-y-5">
                            {/* Matrix File Upload - Single field */}
                            <div>
                                <label className="block font-mono text-[11px] font-bold text-indigo-600 tracking-wider mb-2 uppercase">
                                    МАТРИЦА (СТАТНАГРУЗКА)
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={e => {
                                            const file = e.target.files?.[0] || null;
                                            setData("matrix", file);

                                            const err = validateExcelFile(file);
                                            if (err) setError("matrix", err);
                                            else clearErrors("matrix");
                                        }}
                                    />
                                    <div className="w-full border border-indigo-200/50 bg-indigo-50/30 px-3 py-2.5 font-mono text-[12px] text-gray-600">
                                        {data.matrix ? data.matrix.name : "ВЫБЕРИТЕ ФАЙЛ..."}
                                    </div>
                                </div>
                                {errors.matrix && (
                                    <p className="text-[10px] font-mono font-bold text-rose-600 mt-2 tracking-wider">
                                        {errors.matrix}
                                    </p>
                                )}
                            </div>

                            {/* Version Input */}
                            <div>
                                <label className="block font-mono text-[11px] font-bold text-indigo-600 tracking-wider mb-2 uppercase">
                                    НАЗВАНИЕ ВЕРСИИ
                                </label>
                                <input
                                    type="text"
                                    placeholder="ВВЕДИТЕ НАЗВАНИЕ..."
                                    value={data.version}
                                    className="w-full border border-indigo-200/50 bg-indigo-50/30 px-3 py-2.5 font-mono text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 transition-colors"
                                    onChange={e => {
                                        const value = e.target.value;
                                        setData("version", value);

                                        if (!value.trim()) {
                                            setError("version", "НАЗВАНИЕ ВЕРСИИ ОБЯЗАТЕЛЬНО");
                                        } else {
                                            clearErrors("version");
                                        }
                                    }}
                                />
                                {errors.version && (
                                    <p className="text-[10px] font-mono font-bold text-rose-600 mt-2 tracking-wider">
                                        {errors.version}
                                    </p>
                                )}
                            </div>

                            {/* Upload Button */}
                            <div className="pt-2">
                                <button
                                    className="w-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 cursor-pointer text-[11px] font-mono font-bold tracking-wider transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    onClick={tryUpload}
                                    disabled={processing}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    {processing ? "ЗАГРУЗКА..." : "ЗАГРУЗИТЬ"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}