import React from "react";

interface Props {
    handleFormsUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleMatrixUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleShrUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    saveShrVersion: () => void;
}

const DataUploadCard: React.FC<Props> = ({
    handleFormsUpload,
    handleMatrixUpload,
    handleShrUpload,
    saveShrVersion,
}) => (
    <div className="bg-white shadow rounded-md h-full flex flex-col">
        <div className="bg-gray-100 p-3 rounded-t-md">
            <h6 className="flex items-center gap-2 mb-0">
                <i className="bi bi-cloud-upload"></i> Управление данными
            </h6>
        </div>
        <div className="p-3 flex-1 space-y-3">
            {/* Forms */}
            <div>
                <label className="block font-semibold mb-1">Справочник форм</label>
                <div className="flex gap-2">
                    <input
                        type="file"
                        id="sprav-upload"
                        accept=".xlsx,.xls"
                        className="flex-1 border rounded-md px-2 py-1"
                        onChange={handleFormsUpload}
                    />
                </div>
                <small className="text-gray-500">Файл: Справочник_2025.xlsx</small>
            </div>

            {/* Matrix */}
            <div>
                <label className="block font-semibold mb-1">Матрица (СтатНагрузка)</label>
                <div className="flex gap-2">
                    <input
                        type="file"
                        id="matrix-upload"
                        accept=".xlsx,.xls"
                        className="flex-1 border rounded-md px-2 py-1"
                        onChange={handleMatrixUpload}
                    />
                </div>
            </div>

            {/* Shr */}
            <div>
                <label className="block font-semibold mb-1">Штатное расписание</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="file"
                        id="sr-upload"
                        accept=".xlsx,.xls"
                        className="flex-1 border rounded-md px-2 py-1"
                        onChange={handleShrUpload}
                    />
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 border rounded-md px-2 py-1"
                        id="sr-comment"
                        placeholder="Комментарий к версии"
                    />
                    <button
                        className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                        onClick={saveShrVersion}
                    >
                        <i className="bi bi-save"></i> Сохранить
                    </button>
                </div>
            </div>

            <div id="fileStatus" className="text-sm text-gray-500"></div>
        </div>
    </div >
);

export { DataUploadCard };