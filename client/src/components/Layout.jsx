import React from 'react';

export const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 shadow rounded-lg px-4 py-5 sm:p-6 border border-gray-100 dark:border-gray-700 ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ title, description }) => {
    return (
        <div className="mb-5 border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {title}
            </h3>
            {description && (
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    {description}
                </p>
            )}
        </div>
    );
};
