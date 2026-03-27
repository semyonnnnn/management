import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useState, useEffect, useMemo } from "react";

import { LoadItem, DeptData, PageProps } from "@/types";
import { TotalLoadCard } from "./Partials/TotalLoadCard";
import { DeptTable } from "./Partials/DeptTable";

interface Props extends PageProps {
    departments: any[];
}

export default function Index({ auth, departments }: Props) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Управление нагрузкой</h2>}
        >
            <Head title="Отделы" />
            <LoadAndModifyModule backendDepartments={departments} />
        </AuthenticatedLayout>
    );
}

const LoadAndModifyModule: React.FC<{ backendDepartments: any[] }> = ({ backendDepartments }) => {
    // We use a single source of truth for staff values to avoid sync issues
    const [localStaff, setLocalStaff] = useState<Record<string, number>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        staff_map: {} as Record<string, number>,
        version: "",
    });

    // 1. Initialize data once
    useEffect(() => {
        const initial = backendDepartments.reduce((acc, d) => {
            acc[String(d.id)] = Number(d.staff);
            return acc;
        }, {} as Record<string, number>);

        setLocalStaff(initial);
        setData('staff_map', initial);
    }, [backendDepartments]);

    // 2. FIXED BASELINE
    const fixedOptimalLoad = useMemo(() => {
        const totalWorkload = backendDepartments.reduce((acc, d) => acc + Number(d.workload), 0);
        const totalStaff = backendDepartments.reduce((acc, d) => acc + Number(d.staff), 0);
        return totalStaff > 0 ? totalWorkload / totalStaff : 0;
    }, [backendDepartments]);

    // 3. PROCESS DEPARTMENTS 
    // We filter for uniqueness by ID here just in case the backend or a re-render doubles the array
    const processedDepartments: DeptData[] = useMemo(() => {
        const uniqueDepts = Array.from(new Map(backendDepartments.map(item => [item.id, item])).values());

        return uniqueDepts.map((dept) => {
            const id = String(dept.id);
            const totalLoad = Number(dept.workload) || 0;
            const staff = localStaff[id] ?? Number(dept.staff) ?? 1;
            const avgLoad = staff > 0 ? totalLoad / staff : totalLoad;

            // 50% fill = 100% load
            const barFillPercent = fixedOptimalLoad > 0
                ? (avgLoad / fixedOptimalLoad) * 50
                : 0;

            const levelPercent = Math.min(Math.round(barFillPercent), 100);

            let levelClass: 'low' | 'medium' | 'high' = 'medium';
            if (levelPercent < 40) levelClass = 'low';
            if (levelPercent > 60) levelClass = 'high';

            return {
                id,
                name: dept.name,
                territory: dept.territory,
                territoryLabel: dept.territory === 'ekb' ? 'Екатеринбург' : 'Курган',
                staff,
                totalLoad,
                avgLoad: Math.round(avgLoad),
                levelPercent,
                levelClass,
                forms: dept.forms || [],
            };
        });
    }, [backendDepartments, localStaff, fixedOptimalLoad]);

    // 4. SUMMARY LOADS
    const loads: LoadItem[] = useMemo(() => {
        const totalWorkload = backendDepartments.reduce((acc, d) => acc + Number(d.workload), 0);
        const currentTotalStaff = Object.values(localStaff).reduce((a, b) => a + b, 0);

        const getTerritoryStats = (territoryKey: string) => {
            const depts = backendDepartments.filter(d => d.territory === territoryKey);
            const workload = depts.reduce((acc, d) => acc + Number(d.workload), 0);
            const staff = depts.reduce((acc, d) => acc + (localStaff[String(d.id)] ?? Number(d.staff)), 0);

            const avg = staff > 0 ? workload / staff : 0;
            const percent = fixedOptimalLoad > 0
                ? Math.min(Math.round((avg / fixedOptimalLoad) * 50), 100)
                : 0;

            return { workload, percent };
        };

        const ekb = getTerritoryStats('ekb');
        const krg = getTerritoryStats('krg');

        const globalAvg = currentTotalStaff > 0 ? totalWorkload / currentTotalStaff : 0;
        const globalPercent = fixedOptimalLoad > 0
            ? Math.min(Math.round((globalAvg / fixedOptimalLoad) * 50), 100)
            : 0;

        return [
            { id: "all", label: "По Управлению", value: Math.round(totalWorkload), percent: globalPercent },
            { id: "ekb", label: "Екатеринбург", value: Math.round(ekb.workload), percent: ekb.percent },
            { id: "krg", label: "Курган", value: Math.round(krg.workload), percent: krg.percent },
        ];
    }, [backendDepartments, localStaff, fixedOptimalLoad]);

    const changeStaff = (id: string, value: number) => {
        const newStaff = Math.max(0, value);
        const updated = { ...localStaff, [id]: newStaff };
        setLocalStaff(updated);
        setData('staff_map', updated);
    };

    const hasChanges = backendDepartments.some(d => localStaff[String(d.id)] !== Number(d.staff));

    const handleConfirmSave = () => {
        post(route('departments.update-staff'), {
            preserveScroll: true,
            onSuccess: () => setIsModalOpen(false),
        });
    };

    return (
        <div className="container mx-auto p-3 space-y-6 pb-32">
            <TotalLoadCard loads={loads} printProtocol={() => window.print()} />

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-blue-700 text-sm font-bold uppercase tracking-wider">
                    Целевой показатель: {Math.round(fixedOptimalLoad)} ед./чел.
                    <span className="ml-2 font-normal lowercase">(шкала индикатора: центр = 100%)</span>
                </p>
            </div>

            <DeptTable
                departments={processedDepartments}
                changeStaff={changeStaff}
                toggleEditMode={() => { }}
                printProtocol={() => { }}
                openDeptDetail={(id) => { }}
            />

            {/* Floating Action Bar */}
            {hasChanges && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                            className="px-8 py-4 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-600 font-mono font-bold text-xl transition-all"
                        >
                            СБРОСИТЬ
                        </button>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-10 py-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-mono font-bold text-xl uppercase hover:opacity-90 transition-all"
                        >
                            ПРИМЕНИТЬ
                        </button>
                    </div>
                </div>
            )}

            {/* Save Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-900/40 backdrop-blur-sm">
                    <div className="bg-white border border-white shadow-2xl w-full max-w-md p-8 relative">
                        <h3 className="text-2xl font-mono font-bold text-gray-900 mb-6 uppercase">
                            СОХРАНЕНИЕ_ВЕРСИИ
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-mono text-indigo-500 font-bold mb-2 uppercase">
                                    НАЗВАНИЕ_ВЕРСИИ
                                </label>
                                <input
                                    type="text"
                                    value={data.version}
                                    onChange={(e) => setData('version', e.target.value)}
                                    placeholder="Напр. v1.0.4"
                                    className="w-full bg-indigo-50 border border-indigo-100 p-4 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    autoFocus
                                />
                            </div>

                            {Object.keys(errors).length > 0 && (
                                <div className="bg-rose-50 border border-rose-100 p-4 font-mono text-xs text-rose-600">
                                    {Object.values(errors).map((err, i) => <div key={i}>{">"} {err}</div>)}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 border border-indigo-200 font-mono font-bold text-indigo-600 uppercase"
                                >
                                    ОТМЕНА
                                </button>
                                <button
                                    onClick={handleConfirmSave}
                                    disabled={processing}
                                    className="flex-1 py-4 bg-indigo-600 text-white font-mono font-bold uppercase disabled:opacity-50"
                                >
                                    {processing ? "ЗАГРУЗКА" : "ОК"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};