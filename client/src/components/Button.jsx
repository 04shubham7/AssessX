import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, isLoading, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

    const variants = {
        primary: "border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
        secondary: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500",
        danger: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
        ghost: "border-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
            {children}
        </button>
    );
};

export default Button;
