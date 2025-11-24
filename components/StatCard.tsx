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
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg flex items-center justify-between shadow-sm border border-border-light dark:border-border-dark">
            <div>
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-1">{title}</p>
                <p className="text-xl font-bold">{value}</p>
                {subValue && <p className="text-xs text-text-light-secondary mt-1">{subValue}</p>}
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                <span className="material-icons">{icon}</span>
            </div>
        </div>
    );
};
