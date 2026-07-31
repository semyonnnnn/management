import axios from "axios";
import { Head, useForm, router } from "@inertiajs/react";
import React, { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { DeptData, PageProps, LoadItem } from "@/types";
import { TotalLoadCard } from "./Partials/TotalLoadCard";
import { DeptTable } from "./Partials/DeptTable";
import { FlashMessage } from "@/components/custom/FlashMessage";

export default function Index({ auth, departments, forms }: PageProps & { departments: any[], forms: any[] }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Управление нагрузкой</h2>}
        >
            <Head title="Отделы" />
            <LoadAndModifyModule backendDepartments={departments} forms={forms} />
        </AuthenticatedLayout>
    );
}

const LoadAndModifyModule: React.FC<{ backendDepartments: any[], forms: any[] }> = ({
    backendDepartments,
    forms
}) => {
    const [localStaff, setLocalStaff] = useState<Record<string, number>>({});
    const [saving, setSaving] = useState(false);

    const safeNum = (val: any): number => {
        const num = Number(val);
        return Number.isNaN(num) ? 0 : num;
    };

    useEffect(() => {
        const initial = backendDepartments.reduce((acc, d) => {
            acc[String(d.id)] = Number(d.staff);
            return acc;
        }, {} as Record<string, number>);
        setLocalStaff(initial);
    }, [backendDepartments]);

    // Derived from initial DB state to keep the 100% mark static
    const fixedOptimalLoad = useMemo(() => {
        const totalWorkload = backendDepartments.reduce((acc, d) => acc + Number(d.workload || 0), 0);
        const totalStaff = backendDepartments.reduce((acc, d) => acc + Number(d.staff || 0), 0);
        return totalStaff > 0 ? totalWorkload / totalStaff : 0;
    }, [backendDepartments]);

    const loads: LoadItem[] = useMemo(() => {
        const getStats = (territoryKey?: string) => {
            const depts = territoryKey
                ? backendDepartments.filter(d => d.territory === territoryKey)
                : backendDepartments;

            const workload = depts.reduce((acc, d) => acc + safeNum(d.workload), 0);
            const staff = depts.reduce((acc, d) => acc + safeNum(localStaff[String(d.id)] ?? d.staff), 0);
            const avg = staff > 0 ? workload / staff : 0;

            let percent = 0;
            if (fixedOptimalLoad > 0 && avg > 0) {
                percent = Math.round((avg / fixedOptimalLoad) * 50);
            }

            return {
                workload: safeNum(workload),
                percent: safeNum(percent),
                avg: safeNum(avg)
            };
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
            const staff = localStaff[String(dept.id)] ?? Number(dept.staff || 0);
            const workload = Number(dept.workload || 0);
            const avgLoad = staff > 0 ? workload / staff : 0;

            const levelPercent = (fixedOptimalLoad > 0 && avgLoad > 0)
                ? Math.round((avgLoad / fixedOptimalLoad) * 50)
                : 0;

            return {
                ...dept,
                id: String(dept.id),
                staff,
                totalLoad: workload,
                avgLoad: Math.round(avgLoad),
                levelPercent,
            };
        });
    }, [backendDepartments, localStaff, fixedOptimalLoad]);

    const changeStaff = (id: string, value: number) => {
        const updated = { ...localStaff, [id]: Math.max(0, value) };
        setLocalStaff(updated);
    };

    // Directly saves updates to current state/backend
    const handleSaveStaffChanges = async () => {
        setSaving(true);
        try {
            const updates = Object.entries(localStaff).map(([id, staff]) => ({
                id: parseInt(id),
                staff: staff
            }));

            await axios.put('/uploadFiles', {
                departments: updates,
            });

            console.log('Changes saved successfully');
            router.reload();
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
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

            {/* Floating control bar (saves directly without modal popup) */}
            {hasChanges && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
                    <div className="bg-white/90 backdrop-blur-md border border-indigo-200 p-2 shadow-2xl flex gap-2 items-center">
                        <button
                            onClick={() => {
                                const initial = backendDepartments.reduce((acc, d) => {
                                    acc[String(d.id)] = Number(d.staff);
                                    return acc;
                                }, {} as Record<string, number>);
                                setLocalStaff(initial);
                            }}
                            className="px-8 py-4 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-600 font-mono font-bold text-xl cursor-pointer"
                        >
                            СБРОСИТЬ
                        </button>
                        <button
                            onClick={handleSaveStaffChanges}
                            className="px-10 py-4 bg-linear-to-br from-indigo-600 to-purple-600 text-white font-mono font-bold text-xl uppercase hover:opacity-90 cursor-pointer disabled:opacity-50"
                            disabled={saving}
                        >
                            {saving ? 'СОХРАНЕНИЕ...' : 'ПРИМЕНИТЬ'}
                        </button>
                    </div>
                </div>
            )}

            <FlashMessage />
        </div>
    );
};