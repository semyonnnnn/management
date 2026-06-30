import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { PropsWithChildren } from 'react';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => { },
}: PropsWithChildren<{
    show: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'fit' | '';
    closeable?: boolean;
    onClose: CallableFunction;
}>) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm w-full',
        md: 'sm:max-w-md w-full',
        lg: 'sm:max-w-lg w-full',
        xl: 'sm:max-w-xl w-full',
        '2xl': 'sm:max-w-2xl w-full',
        '3xl': 'sm:max-w-3xl w-full',
        '4xl': 'sm:max-w-4xl w-full',
        '5xl': 'sm:max-w-5xl w-full',
        '6xl': 'sm:max-w-6xl w-full',
        '7xl': 'sm:max-w-7xl w-full',
        'fit': 'sm:w-fit w-full mx-auto',
        '': ''
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed backdrop-blur-sm inset-0 z-50 flex justify-center items-center overflow-y-auto p-4 transition-all sm:p-6"
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/75 dark:bg-gray-900/75 z-0" onClick={close} />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={`my-8 z-50 transform overflow-hidden bg-white shadow-xl transition-all dark:bg-gray-800 ${maxWidthClass} !h-fit`}
                    >
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}