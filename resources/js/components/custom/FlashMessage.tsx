import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

///////////////////////////////////////////////////////////////////////////////
// APP IMPORTS
///////////////////////////////////////////////////////////////////////////////
import { PageProps } from '@/types';

interface SharedProps extends PageProps {
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    // Grab the validation errors from the shared page props
    errors: Record<string, string>;
}

export function FlashMessage() {
    // 1. Properly pull props from usePage
    const { props } = usePage<SharedProps>();
    const { flash, errors } = props;

    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [isError, setIsError] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // 2. If we have active validation errors, smoothly slide out and close
        if (errors && Object.keys(errors).length > 0) {
            setIsMounted(false);
            const dismissTimeout = setTimeout(() => {
                setVisible(false);
                setMessage('');
            }, 300); // Wait for slide-out animation

            return () => clearTimeout(dismissTimeout);
        }

        const flashSuccess = flash?.success;
        const flashError = flash?.error;

        if (flashSuccess || flashError) {
            // Force the slide-out state immediately to reset the animation
            setIsMounted(false);

            // Update the messaging and make sure the container is visible
            setMessage((flashSuccess || flashError) as string);
            setIsError(!!flashError);
            setVisible(true);

            // Queue the slide-in "jump" to run right after the DOM updates
            const entryTimeout = setTimeout(() => {
                setIsMounted(true);
            }, 50);

            // Auto-close timers
            const exitTimeout = setTimeout(() => {
                setIsMounted(false);
                setTimeout(() => setVisible(false), 300);
            }, 5000);

            return () => {
                clearTimeout(entryTimeout);
                clearTimeout(exitTimeout);
            };
        }
    }, [flash, errors]); // Keep watching flash and validation errors

    if (!visible || !message) return null;

    return (
        <>
            {/* Custom Keyframe Animations for the Glowing Shadow */}
            <style>{`
                @keyframes successGlow {
                    0%, 100% {
                        box-shadow: 4px 4px 10px 2px #4f46e5; /* Indigo */
                    }
                    50% {
                        box-shadow: 4px 4px 10px 2px #10b981; /* Emerald */
                    }
                }
                @keyframes errorGlow {
                    0%, 100% {
                        box-shadow: 4px 4px 10px 2px #4f46e5; /* Indigo */
                    }
                    50% {
                        box-shadow: 4px 4px 10px 2px #f43f5e; /* Rose */
                    }
                }
                .animate-success-glow {
                    animation: successGlow 2s infinite ease-in-out;
                }
                .animate-error-glow {
                    animation: errorGlow 2s infinite ease-in-out;
                }
            `}</style>

            <div
                className={`fixed bottom-8 z-100 max-w-md transition-all duration-300 ease-out ${isMounted
                    ? 'left-8 opacity-100'
                    : '-left-96 opacity-0' // Back off-screen on reset
                    } ${isError
                        ? 'animate-error-glow'
                        : 'animate-success-glow'
                    }`}
                style={{
                    fontFamily: "'JetBrains Mono', monospace",
                }}
            >
                {/* Main Outer Container */}
                <div className={`bg-white border-2 flex flex-col ${isError ? 'border-rose-600' : 'border-indigo-600'
                    }`}>

                    {/* Technical Header Strip */}
                    <div className={`flex justify-between items-center px-3 py-1.5 border-b text-xs font-black tracking-widest uppercase ${isError
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : 'bg-indigo-50/50 border-indigo-100 text-emerald-700'
                        }`}>
                        <span>СИСТЕМНОЕ УВЕДОМЛЕНИЕ</span>
                        <span className="font-extrabold">
                            [{isError ? 'увы' : 'успех'}]
                        </span>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 flex items-center justify-between gap-8 bg-white">
                        <span className="text-base font-black tracking-wide text-gray-950 uppercase leading-normal">
                            {message}
                        </span>

                        <button
                            type="button"
                            onClick={() => {
                                setIsMounted(false);
                                setTimeout(() => setVisible(false), 300);
                            }}
                            className={`px-3 py-1 border-2 font-black text-xs uppercase tracking-wider transition-all active:translate-y-0.5 active:shadow-none cursor-pointer ${isError
                                ? 'border-rose-600 text-rose-600 hover:bg-rose-50'
                                : 'border-indigo-600 text-indigo-600 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700'
                                }`}
                            aria-label="Close notification"
                        >
                            ок
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}