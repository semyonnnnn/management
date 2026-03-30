import React, { useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from "@inertiajs/react";

interface Version {
    name: string;
    date: string;
    id: number;
    isCurrent: boolean; // indicates the current version
}

export default function Index({ versions }: { versions: Version[] }) {
    const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [versionToDelete, setVersionToDelete] = useState<Version | null>(null);

    const handleApplyVersion = (version: Version) => {
        setSelectedVersion(version);
        console.log("Apply version:", version);
        router.post(route('versions.apply', { id: version.id }));
    };

    const handleDeleteClick = (version: Version, e: React.MouseEvent) => {
        e.stopPropagation();
        setVersionToDelete(version);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (versionToDelete) {
            console.log("Delete version:", versionToDelete);
            setShowDeleteModal(false);
            router.delete(route('versions.delete', { id: versionToDelete.id }));
            setVersionToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setVersionToDelete(null);
    };

    // Sort so current version is always on top
    const sortedVersions = [
        ...versions.filter(v => v.isCurrent),
        ...versions.filter(v => !v.isCurrent)
    ];

    return (
        <>
            <Head title="Версии" />
            <AuthenticatedLayout>
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-indigo-200/50">
                        {/* Header */}
                        <div className="border-b border-indigo-200/50">
                            <div className="px-5 py-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h6 className="text-sm font-mono font-bold text-gray-900 tracking-tighter">
                                            ВЕРСИИ_ШТАТНОГО_РАСПИСАНИЯ
                                        </h6>
                                    </div>
                                    <div className="px-2 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-mono font-bold tracking-wider">
                                        {versions.length}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Versions List */}
                        <div className="" style={{ scrollbarWidth: "thin", scrollbarColor: "#818cf8 #e0e7ff" }}>
                            <div className="p-3 space-y-2">
                                {sortedVersions.map((v, idx) => (
                                    <div
                                        key={v.id}
                                        className={`group border transition-all duration-200
                                            ${v.isCurrent
                                                ? 'bg-indigo-100/50 border-indigo-600 mt-0 mb-4 rounded-lg shadow-md'
                                                : 'border-indigo-200/50 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
                                        style={{
                                            borderLeft: `3px solid ${idx % 4 === 0 ? '#818cf8' : idx % 4 === 1 ? '#10b981' : idx % 4 === 2 ? '#f59e0b' : '#ec489a'
                                                }`,
                                        }}
                                    >
                                        <div className="p-3 flex justify-between items-center">
                                            <div className="flex-1">
                                                <div className="font-mono text-[12px] font-bold text-gray-900 tracking-tighter">
                                                    {v.name}
                                                    {v.isCurrent && (
                                                        <span className="ml-2 text-[10px] font-mono font-bold text-white bg-indigo-600 px-1 rounded">
                                                            АКТУАЛЬНАЯ
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="font-mono text-[9px] text-indigo-500 tracking-wider mt-1">
                                                    {v.date}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApplyVersion(v)}
                                                    disabled={v.isCurrent}
                                                    className={`px-3 py-1.5 text-white border-0 cursor-pointer text-[10px] font-mono font-bold tracking-wider transition-all duration-200 flex items-center gap-1
                                                        ${v.isCurrent
                                                            ? 'bg-gray-300 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}`}
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    ПРИМЕНИТЬ
                                                </button>
                                                {!v.isCurrent && (
                                                    <button
                                                        onClick={(e) => handleDeleteClick(v, e)}
                                                        className="px-3 py-1.5 bg-white text-rose-600 border border-rose-200 cursor-pointer text-[10px] font-mono font-bold tracking-wider transition-all duration-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 flex items-center gap-1"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        УДАЛИТЬ
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && versionToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white border border-indigo-200/50 max-w-md w-full mx-4">
                            <div className="border-b border-indigo-200/50 px-5 py-4 flex items-center gap-2">
                                <div className="w-7 h-7 bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h6 className="text-sm font-mono font-bold text-gray-900 tracking-tighter">ПОДТВЕРЖДЕНИЕ_УДАЛЕНИЯ</h6>
                            </div>

                            <div className="p-5">
                                <p className="font-mono text-[12px] text-gray-700 tracking-wider mb-2">
                                    ВЫ УВЕРЕНЫ, ЧТО ХОТИТЕ УДАЛИТЬ ВЕРСИЮ:
                                </p>
                                <p className="font-mono text-[14px] font-bold text-gray-900 tracking-tighter bg-indigo-50/50 p-2 border border-indigo-200/50">
                                    {versionToDelete.name}
                                </p>
                                <p className="font-mono text-[10px] text-indigo-500 tracking-wider mt-2">
                                    {versionToDelete.date}
                                </p>
                            </div>

                            <div className="border-t border-indigo-200/50 p-4 flex gap-2 justify-end">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 cursor-pointer text-[10px] font-mono font-bold tracking-wider transition-all duration-200 hover:bg-gray-100"
                                >
                                    ОТМЕНА
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 text-white border-0 cursor-pointer text-[10px] font-mono font-bold tracking-wider transition-all duration-200 hover:from-rose-700 hover:to-red-700 flex items-center gap-2"
                                >
                                    УДАЛИТЬ
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
        </>
    );
}