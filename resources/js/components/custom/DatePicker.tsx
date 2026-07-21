"use client"

import * as React from "react"
import {
    format,
    parse,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths
} from "date-fns"
import { ru } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface DatePickerProps {
    date: string | null // Now explicitly expects 'YYYY-MM-DD'
    setDate?: (date: string | undefined) => void // Now emits 'YYYY-MM-DD'
    className?: string
}

export function DatePicker({ date: externalDate, setDate: externalSetDate, className }: DatePickerProps) {
    const [internalDate, setInternalDate] = React.useState<string | undefined>(externalDate || undefined)

    // Helper to safely parse the SQL date string back into a JS Date object for rendering
    const parseSqlDate = (dateStr?: string | null) => {
        if (!dateStr) return null
        return parse(dateStr, 'yyyy-MM-dd', new Date())
    }

    const activeDateString = externalDate !== undefined ? externalDate : internalDate
    const activeDateObj = parseSqlDate(activeDateString)

    const [currentMonth, setCurrentMonth] = React.useState<Date>(activeDateObj || new Date())
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        if (externalDate !== undefined) {
            setInternalDate(externalDate === null ? undefined : externalDate)
            if (externalDate) {
                setCurrentMonth(parseSqlDate(externalDate) as Date)
            }
        }
    }, [externalDate])

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

    const formatCleanRussianDate = (date: Date): string => {
        if (isNaN(date.getTime())) return ''

        const formatted = new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(date)

        return formatted.replace(/\s?г\.$/, '')
    }

    const formatMonthHeader = (dateInstance: Date) => {
        const rawLabel = format(dateInstance, "LLLL yyyy", { locale: ru })
        return rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-70 justify-start text-left font-mono rounded-none border-zinc-300 bg-white text-zinc-950 hover:bg-zinc-50",
                        !activeDateObj && "text-zinc-400",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
                    {activeDateObj ? formatCleanRussianDate(activeDateObj) : <span>ВЫБОР_ДАТЫ</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 rounded-none border border-zinc-300 bg-white text-zinc-950 font-mono shadow-none">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-wider text-zinc-900">
                        {formatMonthHeader(currentMonth)}
                    </span>
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            className="h-7 w-7 p-0 rounded-none border-zinc-200 bg-transparent text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600"
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-7 w-7 p-0 rounded-none border-zinc-200 bg-transparent text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600"
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-indigo-600/70 mb-2">
                    {["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"].map((d) => (
                        <div key={d}>{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, idx) => {
                        const isSelected = activeDateObj && isSameDay(day, activeDateObj)
                        const isCurrentMonth = isSameMonth(day, currentMonth)

                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                    if (isCurrentMonth) {
                                        // Formats the clicked date into SQL standard string
                                        const sqlDateString = format(day, "yyyy-MM-dd")
                                        setInternalDate(sqlDateString)
                                        if (externalSetDate) {
                                            externalSetDate(sqlDateString)
                                        }
                                        setOpen(false)
                                    }
                                }}
                                className={cn(
                                    "h-8 text-xs font-mono transition-colors rounded-none border border-transparent",
                                    !isCurrentMonth && "text-zinc-300 cursor-not-allowed pointer-events-none",
                                    isCurrentMonth && "text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600",
                                    isSameDay(day, new Date()) && isCurrentMonth && "border-indigo-600 text-indigo-600 font-bold",
                                    isSelected && "bg-indigo-600! text-white! font-bold"
                                )}
                            >
                                {format(day, "d")}
                            </button>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}