import React from 'react';
import { ComputedYearStats } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

interface YearlyCardProps {
    data: ComputedYearStats;
}

export const YearlyCard: React.FC<YearlyCardProps> = ({ data }) => {
    // Student Data for Pie Chart
    const studentPieData = [
        { name: 'ذكور', value: data.students.male, color: '#66B2E4' },
        { name: 'إناث', value: data.students.female, color: '#F4007B' },
    ];

    // Faculty Data for Bar Chart
    const facultyBarData = [
        { name: 'أعضاء هيئة التدريس', male: data.faculty.male, female: data.faculty.female }
    ];

    return (
        <div className="space-y-6">
            {/* Top Row: Big Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-border-light shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                        <span className="material-icons text-4xl">school</span>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">إجمالي الطلاب</p>
                        <p className="text-4xl font-bold text-gray-800 dark:text-white">{data.students.total}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-border-light shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-600 dark:text-yellow-400">
                        <span className="material-icons text-4xl">person_outline</span>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">أعضاء هيئة التدريس</p>
                        <p className="text-4xl font-bold text-gray-800 dark:text-white">{data.faculty.total}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-border-light shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                        <span className="material-icons text-4xl">psychology</span>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">حملة الدكتوراه</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-bold text-gray-800 dark:text-white">{data.phdCount}</p>
                            <span className="text-sm text-green-600 font-bold bg-green-100 px-2 py-1 rounded-md">
                                {data.phdPercentage.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Students Chart */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-border-light shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        توزيع الطلاب (ذكور / إناث)
                    </h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={studentPieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {studentPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-500">عدد الذكور</p>
                            <p className="text-2xl font-bold text-light-blue">{data.students.male}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-500">عدد الإناث</p>
                            <p className="text-2xl font-bold text-pink">{data.students.female}</p>
                        </div>
                    </div>
                </div>

                {/* Faculty Chart */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-border-light shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                        <span className="w-2 h-8 bg-yellow rounded-full"></span>
                        توزيع هيئة التدريس
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={facultyBarData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                <XAxis type="number" stroke="#94A3B8" />
                                <YAxis dataKey="name" type="category" width={100} hide />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Legend />
                                <Bar dataKey="male" name="ذكور" fill="#66B2E4" barSize={40} radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#66B2E4' }} />
                                <Bar dataKey="female" name="إناث" fill="#F4007B" barSize={40} radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#F4007B' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                     <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-500">ذكور (تدريس)</p>
                            <p className="text-2xl font-bold text-light-blue">{data.faculty.male}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-500">إناث (تدريس)</p>
                            <p className="text-2xl font-bold text-pink">{data.faculty.female}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Ratios */}
            <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-border-light shadow-sm">
                <h3 className="text-xl font-bold mb-4 border-b pb-2">مؤشرات الأداء (Ratios)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                            <p className="text-gray-500 text-base mb-1">المعدل الإجمالي للطلاب إلى أعضاء هيئة التدريس</p>
                            <p className="text-3xl font-bold text-primary">{data.studentToFacultyRatio.toFixed(1)} : 1</p>
                        </div>
                        <span className="material-icons text-4xl text-gray-300">groups</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                            <p className="text-gray-500 text-base mb-1">المعدل الإجمالي للطلاب إلى حملة الدكتوراه</p>
                            <p className="text-3xl font-bold text-green">{data.studentToPhdRatio.toFixed(1)} : 1</p>
                        </div>
                         <span className="material-icons text-4xl text-gray-300">school</span>
                     </div>
                </div>
            </div>
        </div>
    );
};