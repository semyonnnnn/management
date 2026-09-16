// components/custom/PaginationControls.tsx
import { router } from '@inertiajs/react';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationControlsProps {
    links: PaginationLink[];
    isVisible: boolean;
}

// Regex-based (not exact-string) label translation — matches doc 17's version,
// not doc 16's, since regex survives label format drift (e.g. Laravel changing
// "&laquo; Previous" wording) while doc 16's exact-match version would silently
// stop translating if that string ever changes upstream.
const translatePaginationLabel = (label: string): string => {
    if (label.includes('Previous') || label.includes('&laquo;')) {
        return label.replace(/Previous/gi, 'Назад');
    }
    if (label.includes('Next') || label.includes('&raquo;')) {
        return label.replace(/Next/gi, 'Вперед');
    }
    return label;
};

const Pagination = ({ links, isVisible }: PaginationControlsProps) => {
    // links.length > 3 check stays here, not in the caller — it's inherent to
    // "is there anything to paginate," unlike isVisible which is page-specific
    // (filtered-empty state, isEmpty prop) and can't be inferred from links alone.
    if (!isVisible || !links || links.length <= 3) return null;

    return (
        <div className="bg-white border border-slate-300 p-2 flex justify-center items-center shadow-sm">
            <div className="flex gap-1">
                {links.map((link, k) => {
                    const translatedLabel = translatePaginationLabel(link.label);

                    if (link.url === null) {
                        return (
                            <div
                                key={k}
                                className="px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-50 border border-slate-200 select-none flex items-center"
                                dangerouslySetInnerHTML={{ __html: translatedLabel }}
                            />
                        );
                    }

                    return (
                        <button
                            key={k}
                            onClick={() => router.get(link.url!, {}, { preserveState: true, preserveScroll: true })}
                            className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer border ${link.active
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                                }`}
                            dangerouslySetInnerHTML={{ __html: translatedLabel }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export { Pagination };