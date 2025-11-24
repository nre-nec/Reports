import React from 'react';
import { ComputedYearStats } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface YearlyCardProps {
    data: ComputedYearStats;
}

export const YearlyCard: React.FC<YearlyCardProps> = ({ data }) => {
    const pieData = [
        { name: 'ذكور', value: data.students.male, color: '#66B2E4' },
        { name: 'إناث', value: data.students.female, color: '#F4007B' },
    ];

    return (
        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md border border-border-light dark:border-border-dark overflow-hidden break-inside-avoid mb-6">
            <div className="bg-primary/5 p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                <h3 className="font-bold text-lg text-primary">تقرير العام الدراسي {data.year}</h3>
                <span className="material-icons text-primary opacity-50">calendar_today</span>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Students Column */}
                <div className="space-y-3">
                    <h4 className="font-bold text-sm text-text-light-secondary flex items-center gap-2">
                        <span className="material-icons text-sm">school</span>
                        الطلاب
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-background-light dark:bg-background-dark p-2 rounded">
                            <span className="block text-xs text-text-light-secondary">الإجمالي</span>
                            <span className="font-bold">{data.students.total}</span>
                        </div>
                        <div className="bg-background-light dark:bg-background-dark p-2 rounded">
                            <span className="block text-xs text-text-light-secondary">ذكور</span>
                            <span className="font-bold text-light-blue">{data.students.male}</span>
                        </div>
                        <div className="bg-background-light dark:bg-background-dark p-2 rounded">
                            <span className="block text-xs text-text-light-secondary">إناث</span>
                            <span className="font-bold text-pink">{data.students.female}</span>
                        </div>
                    </div>
                </div>

                {/* Faculty Column */}
                <div className="space-y-3">
                    <h4 className="font-bold text-sm text-text-light-secondary flex items-center gap-2">
                        <span className="material-icons text-sm">person_outline</span>
                        أعضاء هيئة التدريس
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-background-light dark:bg-background-dark p-2 rounded">
                            <span className="block text-xs text-text-light-secondary">الإجمالي</span>
                            <span className="font-bold">{data.faculty.total}</span>
                        </div>
                        <div className="bg-background-light dark:bg-background-dark p-2 rounded">
                            <span className="block text-xs text-text-light-secondary">دكتوراه</span>
                            <span className="font-bold text-green">{data.phdCount}</span>
                        </div>
                         <div className="bg-background-light dark:bg-background-dark p-2 rounded col-span-2">
                            <span className="block text-xs text-text-light-secondary">نسبة حملة الدكتوراه</span>
                            <span className="font-bold text-primary">{data.phdPercentage.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                {/* Ratios & Chart */}
                <div className="flex flex-col justify-between">
                     <div className="flex gap-2 mb-2">
                         <div className="flex-1 bg-background-light dark:bg-background-dark p-2 rounded text-center">
                            <span className="block text-[10px] text-text-light-secondary">طالب لكل أستاذ</span>
                            <span className="font-bold text-sm">{data.studentToFacultyRatio.toFixed(1)}</span>
                         </div>
                         <div className="flex-1 bg-background-light dark:bg-background-dark p-2 rounded text-center">
                            <span className="block text-[10px] text-text-light-secondary">طالب لكل دكتور</span>
                            <span className="font-bold text-sm">{data.studentToPhdRatio.toFixed(1)}</span>
                         </div>
                     </div>
                     <div className="h-24 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={25}
                                    outerRadius={40}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-0 right-0 text-[10px] text-text-light-secondary">توزيع الطلاب</div>
                     </div>
                </div>
            </div>
        </div>
    );
};
