import React from "react";
import { useForm } from "@inertiajs/react";

const DataUploadCard: React.FC = () => {
    const { data, setData, post, processing, errors, setError, clearErrors, reset } = useForm({
        matrix: null as File | null,
        forms: null as File | null,
        shr: null as File | null,
        version: "",
    });

    const tryUpload = () => {
        clearErrors();

        if (!data.matrix) {
            setError("matrix", "Файл матрицы обязателен");
        }

        if (!data.forms) {
            setError("forms", "Файл справочника обязателен");
        }

        if (!data.shr) {
            setError("shr", "Файл штатного расписания обязателен");
        }

        if (!data.version.trim()) {
            setError("version", "Название версии обязательно");
        }

        post("/uploadFiles", {
            onSuccess: () => reset(),
        });
    };

    function validateExcelFile(file: File | null): string | null {
        if (!file) return null;

        const extension = file.name.split(".").pop()?.toLowerCase();

        if (extension !== "xlsx") {
            return "Файл должен быть формата .xlsx";
        }

        return null;
    }

    return (
        <div className="bg-gray-900 shadow rounded-md h-full flex flex-col text-gray-100">
            <div className="bg-gray-800 p-3 rounded-t-md flex items-center gap-2">
                <i className="bi bi-cloud-upload text-blue-300"></i>
                <h6 className="mb-0 text-white font-semibold">Управление данными</h6>
            </div>

            <div className="p-3 flex-1 space-y-4">

                {/* Matrix */}
                <div>
                    <label className="block font-semibold mb-1">Матрица (СтатНагрузка)</label>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        className="w-full border rounded-md px-2 py-1 bg-gray-800 text-gray-100 border-[#9cd68a]"
                        onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setData("matrix", file);

                            const err = validateExcelFile(file);
                            if (err) setError("matrix", err);
                            else clearErrors("matrix");
                        }}
                    />
                    {errors.matrix && <p className="text-red-400 text-sm mt-1">{errors.matrix}</p>}
                </div>

                {/* Forms */}
                <div>
                    <label className="block font-semibold mb-1">Справочник форм</label>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        className="w-full border rounded-md px-2 py-1 bg-gray-800 text-gray-100 border-[#8aaedc]"
                        onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setData("forms", file);

                            const err = validateExcelFile(file);
                            if (err) setError("forms", err);
                            else clearErrors("forms");
                        }}
                    />
                    {errors.forms && <p className="text-red-400 text-sm mt-1">{errors.forms}</p>}
                </div>

                {/* SHR */}
                <div>
                    <label className="block font-semibold mb-1">Штатное расписание</label>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        className="w-full border rounded-md px-2 py-1 bg-gray-800 text-gray-100 border-[#e0a28a]"
                        onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setData("shr", file);

                            const err = validateExcelFile(file);
                            if (err) setError("shr", err);
                            else clearErrors("shr");
                        }}
                    />
                    {errors.shr && <p className="text-red-400 text-sm mt-1">{errors.shr}</p>}
                </div>

                <div className="flex gap-2 mt-3 items-start">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="название версии"
                            value={data.version}
                            className="w-full border rounded-md px-2 py-1 bg-gray-800 text-gray-100 border-[#d6c58a]"
                            onChange={e => {
                                const value = e.target.value;
                                setData("version", value);

                                if (!value.trim()) {
                                    setError("version", "Название версии обязательно");
                                } else {
                                    clearErrors("version");
                                }
                            }}
                        />
                        {errors.version && <p className="text-red-400 text-sm mt-1">{errors.version}</p>}
                    </div>

                    <button
                        className="bg-[#a2bffe] text-gray-900 px-3 py-1 rounded-md flex items-center gap-1 hover:bg-[#7da4f7] transition h-fit"
                        onClick={tryUpload}
                        disabled={processing}
                    >
                        <i className="bi bi-cloud-upload"></i> Загрузить
                    </button>
                </div>

            </div>
        </div>
    );
};

export { DataUploadCard };