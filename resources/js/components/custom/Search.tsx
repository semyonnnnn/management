import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface SearchProps {
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    placeholder: string;
}

const Search = ({ searchQuery, setSearchQuery, placeholder }: SearchProps) => {
    return (
        <div className="relative w-full flex items-center">
            <svg
                className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
            <div className="relative w-full">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={placeholder + "..."}
                    className="w-full pl-8 pr-8 py-2 border border-slate-300 text-lg focus:outline-none focus:border-indigo-600 transition-colors"
                />

                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="Очистить поиск"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

export { Search };