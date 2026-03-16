import React from "react";
import { useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";

interface Props {
    saveShrVersion: () => void;
}

const DataUploadCard: React.FC<Props> = ({ saveShrVersion }) => {
    const { data, setData, post, processing, errors, setError, reset } = useForm({
        forms: null as File | null,
        matrix: null as File | null,
        shr: null as File | null,
        version: "",
    });

    const tryUpload = () => {
        if (!data.forms) setError("forms", "Файл справочника обязателен");
        if (!data.matrix) setError("matrix", "Файл матрицы обязателен");
        if (!data.shr) setError("shr", "Файл штатного расписания обязателен");
        if (!data.version.trim()) setError("version", "Название версии обязательно");

        if (!data.forms || !data.matrix || !data.shr || !data.version.trim()) return;

        const formData = new FormData();
        formData.append("forms", data.forms);
        formData.append("matrix", data.matrix);
        formData.append("shr", data.shr);
        formData.append("version", data.version);

        router.post("/uploadFiles", formData, {
            onError: (errs) => console.log(errs),
            onSuccess: () => reset(),
        });
    };

    const pastelBorder = "#8aaedc";
    const pastelButton = "#a2bffe";

    return (
        <div className="bg-gray-900 shadow rounded-md h-full flex flex-col text-gray-100">
            {/* Header */}
            <div className="bg-gray-800 p-3 rounded-t-md flex items-center gap-2">
                <i className="bi bi-cloud-upload text-blue-300"></i>
                <h6 className="mb-0 text-white font-semibold">Управление данными</h6>
            </div>

            <div className="p-3 flex-1 space-y-4">
                {/* Forms */}
                <div>
                    <label className="block font-semibold mb-1">Справочник форм</label>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        className="w-full border rounded-md px-2 py-1 bg-gray-800 text-gray-100 border-[#8aaedc] focus:ring-[#a2bffe] focus:border-[#a2bffe]"
                        onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setData("forms", file);
                            setError("forms", file ? "" : "Файл обязателен");
                        }}
                    />
                    {errors.forms && <p className="text-red-400 text-sm mt-1">{errors.forms}</p>}
                </div>

                {/* Matrix */}
                <div>
                    <label className="block font-semibold mb-1">Матрица (СтатНагрузка)</label>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        className="w-full border rounded-md px-2 py-1 bg-gray-800 text-gray-100 border-[#9cd68a] focus:ring-[#9cd68a] focus:border-[#9cd68a]"
                        onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setData("matrix", file);
                            setError("matrix", file ? "" : "Файл обязателен");
                        }}
                    />
                    {errors.matrix && <p className="text-red-400 text-sm mt-1">{errors.matrix}</p>}
                </div>

                {/* Shr */}
                <div>
                    <label className="block font-semibold mb-1">Штатное расписание</label>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        className="w-full border rounded-md px-2 py-1 bg-gray-800 text-gray-100 border-[#e0a28a] focus:ring-[#e0a28a] focus:border-[#e0a28a]"
                        onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setData("shr", file);
                            setError("shr", file ? "" : "Файл обязателен");
                        }}
                    />
                    {errors.shr && <p className="text-red-400 text-sm mt-1">{errors.shr}</p>}

                    <div className="flex gap-2 mt-3 items-start">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="название версии"
                                value={data.version}
                                className="w-full border rounded-md px-2 py-1 bg-gray-800 text-gray-100 border-[#d6c58a] focus:ring-[#d6c58a] focus:border-[#d6c58a]"
                                onChange={e => {
                                    setData("version", e.target.value);
                                    setError("version", e.target.value ? "" : "Название версии обязательно");
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
        </div>
    );
};

export { DataUploadCard };