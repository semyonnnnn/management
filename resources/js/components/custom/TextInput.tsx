import { cva } from 'class-variance-authority';
import { forwardRef, InputHTMLAttributes, useEffect, useImperativeHandle, useRef } from 'react';

const inputVariants = cva(
    'px-2 py-1 shadow-sm border focus:ring-1 focus:outline-none', // base
    {
        variants: {
            variant: {
                default: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:focus:border-indigo-600 dark:focus:ring-indigo-600',
                error: 'border-red-500 focus:border-red-600 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-700',
                subtle: 'border-gray-200 focus:border-gray-300 focus:ring-gray-200 dark:border-gray-800 dark:focus:border-gray-600',
            },
            size: {
                sm: 'text-sm py-1 px-2',
                md: 'text-base py-2 px-3',
                lg: 'text-lg py-3 px-4',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
    isFocused?: boolean;
    variant?: 'default' | 'error' | 'subtle';
    size?: 'sm' | 'md' | 'lg';
};

export default forwardRef(function TextInput(
    { type = 'text', isFocused = false, variant, size, className = '', ...props }: TextInputProps,
    ref
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) localRef.current?.focus();
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={inputVariants({ variant, size }) + ' ' + className}
            ref={localRef}
        />
    );
});
