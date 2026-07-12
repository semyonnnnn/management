import axios from "axios";
import { Head, useForm, router } from "@inertiajs/react";
import React, { useState, useEffect, useMemo } from "react";
///////////////////////////////////////////////////////
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { DeptData, PageProps, LoadItem } from "@/types";
import { TotalLoadCard } from "./Partials/TotalLoadCard";
import { DeptTable } from "./Partials/DeptTable";
import Modal from "@/components/custom/Modal";

export default function Index({ auth, departments, forms, versionId }: PageProps & { departments: any[], forms: any[], versionId: number }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Управление нагрузкой</h2>}
        >
            <Head title="Отделы" />
            <LoadAndModifyModule backendDepartments={departments} forms={forms} currentVersionId={versionId} />
        </AuthenticatedLayout>
    );
}

const LoadAndModifyModule: React.FC<{ backendDepartments: any[], forms: any[], currentVersionId: number }> = ({
    backendDepartments,
    forms,
    currentVersionId
}) => {
    const [localStaff, setLocalStaff] = useState<Record<string, number>>({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const { data, setData } = useForm({
        staff_map: {} as Record<string, number>,
        version: "",
    });

    useEffect(() => {
        const initial = backendDepartments.reduce((acc, d) => {
            acc[String(d.id)] = Number(d.staff);
            return acc;
        }, {} as Record<string, number>);
        setLocalStaff(initial);
        setData('staff_map', initial);
    }, [backendDepartments]);

    // THE FIXED ANCHOR: Derived from initial DB state to keep the 100% mark static
    const fixedOptimalLoad = useMemo(() => {
        const totalWorkload = backendDepartments.reduce((acc, d) => acc + Number(d.workload), 0);
        const totalStaff = backendDepartments.reduce((acc, d) => acc + Number(d.staff), 0);
        return totalStaff > 0 ? totalWorkload / totalStaff : 0;
    }, [backendDepartments]);

    // Calculate Card Data: Mapping "Optimal" to 50% visual width
    const loads: LoadItem[] = useMemo(() => {
        const getStats = (territoryKey?: string) => {
            const depts = territoryKey
                ? backendDepartments.filter(d => d.territory === territoryKey)
                : backendDepartments;

            const workload = depts.reduce((acc, d) => acc + Number(d.workload), 0);
            const staff = depts.reduce((acc, d) => acc + (localStaff[String(d.id)] ?? Number(d.staff)), 0);
            const avg = staff > 0 ? workload / staff : 0;

            // Map: (avg / benchmark) * 50. If avg == benchmark, percent is 50 (The Center).
            const percent = fixedOptimalLoad > 0 ? Math.round((avg / fixedOptimalLoad) * 50) : 0;
            return { workload, percent, avg };
        };

        const global = getStats();
        const ekb = getStats('ekb');
        const krg = getStats('krg');

        return [
            { id: "all", label: "По Управлению", value: Math.round(global.workload), percent: global.percent, load_per_person: global.avg },
            { id: "ekb", label: "Екатеринбург", value: Math.round(ekb.workload), percent: ekb.percent, load_per_person: ekb.avg },
            { id: "krg", label: "Курган", value: Math.round(krg.workload), percent: krg.percent, load_per_person: krg.avg },
        ];
    }, [backendDepartments, localStaff, fixedOptimalLoad]);

    const processedDepartments: DeptData[] = useMemo(() => {
        return backendDepartments.map((dept) => {
            const staff = localStaff[String(dept.id)] ?? Number(dept.staff);
            const avgLoad = staff > 0 ? Number(dept.workload) / staff : 0;
            const levelPercent = fixedOptimalLoad > 0 ? Math.round((avgLoad / fixedOptimalLoad) * 50) : 0;

            return {
                ...dept,
                id: String(dept.id),
                staff,
                totalLoad: Number(dept.workload),
                avgLoad: Math.round(avgLoad),
                levelPercent,
            };
        });
    }, [backendDepartments, localStaff, fixedOptimalLoad]);

    const changeStaff = (id: string, value: number) => {
        const updated = { ...localStaff, [id]: Math.max(0, value) };
        setLocalStaff(updated);
        setData('staff_map', updated);
    };

    // console.log("localStaff", localStaff);
    const handleSaveStaffChanges = async () => {
        setSaving(true);
        try {
            // Prepare updates for ALL departments (or only changed ones)
            const updates = Object.entries(localStaff).map(([id, staff]) => ({
                id: parseInt(id),
                staff: staff
            }));

            await axios.put('/uploadFiles', {
                departments: updates,
                version_id: currentVersionId
            });

            // Show success message (you can add a toast notification here)
            console.log('Changes saved successfully');

            // Refresh the page or update backendDepartments
            router.reload();
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
            setIsModalOpen(false);
        }
    };

    const handleCreateVersion = () => {
        // This is for creating a NEW version from current edits
        router.post(route('versions.create'), {
            name: data.version,
            staff_map: data.staff_map,
        });
        setIsModalOpen(false);
    };

    const hasChanges = backendDepartments.some(d => localStaff[String(d.id)] !== Number(d.staff));

    return (
        <div className="container mx-auto p-3 space-y-6 pb-32">
            <TotalLoadCard loads={loads} />
            <DeptTable
                departments={processedDepartments}
                changeStaff={changeStaff}
                fixedOptimalLoad={fixedOptimalLoad}
                toggleEditMode={() => { }}
            />

            {hasChanges && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
                    <div className="bg-white/90 backdrop-blur-md border border-indigo-200 p-2 shadow-2xl flex gap-2">
                        <button
                            onClick={() => {
                                const initial = backendDepartments.reduce((acc, d) => {
                                    acc[String(d.id)] = Number(d.staff);
                                    return acc;
                                }, {} as Record<string, number>);
                                setLocalStaff(initial);
                                setData('staff_map', initial);
                            }}
                            className="px-8 py-4 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-600 font-mono font-bold text-xl"
                        >
                            СБРОСИТЬ
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-10 py-4 bg-linear-to-br from-indigo-600 to-purple-600 text-white font-mono font-bold text-xl uppercase hover:opacity-90"
                            disabled={saving}
                        >
                            {saving ? 'СОХРАНЕНИЕ...' : 'ПРИМЕНИТЬ'}
                        </button>
                    </div>
                </div>
            )}

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm">
                <div className="bg-white border border-indigo-200/50 h-fit flex flex-col p-6">
                    <h3 className="text-2xl font-mono font-bold text-gray-900 mb-6">сохранение_версии</h3>

                    {/* Two save options */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSaveStaffChanges}
                            className="w-full py-4 bg-indigo-600 text-white font-mono font-bold uppercase"
                        >
                            СОХРАНИТЬ ИЗМЕНЕНИЯ (ТЕКУЩАЯ ВЕРСИЯ)
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">или</span>
                            </div>
                        </div>

                        <input
                            type="text"
                            value={data.version}
                            onChange={(e) => setData('version', e.target.value)}
                            placeholder="Название новой версии (напр. v1.0.4)"
                            className="w-full bg-indigo-50 border border-indigo-100 p-4 font-mono text-lg mb-2 outline-none"
                        />
                        <button
                            onClick={handleCreateVersion}
                            className="w-full py-4 border-2 border-indigo-600 text-indigo-600 font-mono font-bold uppercase hover:bg-indigo-50"
                        >
                            СОЗДАТЬ НОВУЮ ВЕРСИЮ
                        </button>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-4 border border-indigo-200 font-mono font-bold text-indigo-600 uppercase"
                        >
                            ОТМЕНА
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};