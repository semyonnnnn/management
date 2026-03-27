import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ApplicationLogo() {
    return (
        <div className="flex px-5 py-2 justify-center gap-2 items-center cursor-pointer select-none">
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-indigo-700"
            >
                {/* Abstract arrow / growth icon */}
                <path
                    d="M4 16L10 10L14 14L20 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="4" cy="16" r="1.5" fill="currentColor" />
                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                <circle cx="14" cy="14" r="1.5" fill="currentColor" />
                <circle cx="20" cy="8" r="1.5" fill="currentColor" />
            </svg>
            <span className="text-sm text-indigo-900 font-black">симулятор</span>
        </div>
    );
}
