import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
    colorClass: string; // e.g., "text-red bg-red/10"
    subValue?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, subValue }) => {
    return (
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl flex items-center justify-between shadow-sm border border-border-light dark:border-border-dark hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2">
                <p className="text-lg font-medium text-text-light-secondary dark:text-text-dark-secondary">{title}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-text-light-primary dark:text-text-dark-primary">{value}</p>
                </div>
                {subValue && <p className="text-sm font-medium text-text-light-secondary">{subValue}</p>}
            </div>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${colorClass}`}>
                <span className="material-icons text-3xl">{icon}</span>
            </div>
        </div>
    );
};