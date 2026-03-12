import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ApplicationLogo() {
    return (
        <div className="flex justify-center gap-2 items-center">
            <FontAwesomeIcon icon={faFolder} className="text-4xl dark:text-white select-none cursor-pointer" />
            <span className="text-sm text-nowrap dark:text-white">Крутое название</span>
        </div>
    );
}
