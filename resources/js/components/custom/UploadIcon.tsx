import { MouseEventHandler } from "react";

export interface UploadIconProps {
    color?: string;
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const UploadIcon = ({ color = "#000", className = "w-8 h-8.5 cursor-pointer", onClick }: UploadIconProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="bg-transparent border-none p-0 focus:outline-none focus:ring-0"
        >
            <svg
                width="140"
                height="150"
                viewBox="0 0 140 150"
                fill="none"
                className={className}
            >
                {/* Arrow head centered precisely over the stem */}
                <path
                    d="M47 47 L70 24 L93 47"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />

                {/* Vertical stem of the arrow */}
                <rect x="68" y="25" width="4" height="90" fill={color} />

                {/* Left vertical wall of the container tray */}
                <rect x="12" y="92" width="4" height="44" fill={color} />

                {/* Right vertical wall of the container tray */}
                <rect x="124" y="92" width="4" height="44" fill={color} />

                {/* Bottom horizontal base of the container tray */}
                <rect x="12" y="132" width="116" height="4" fill={color} />

                {/* Left segment of the top rim edge */}
                <rect x="12" y="92" width="40" height="4" fill={color} />

                {/* Right segment of the top rim edge */}
                <rect x="88" y="92" width="40" height="4" fill={color} />

                {/* Circular dot/indicator near the right side of the tray */}
                <circle cx="102" cy="112" r="6" stroke={color} strokeWidth="4" fill="none" />
            </svg>
        </button>
    );
};

export { UploadIcon };