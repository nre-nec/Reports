import React, { useState, useEffect, useMemo } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { AcademicYearData, ComputedYearStats } from './types';
import { INITIAL_DATA } from './constants';
import { StatCard } from './components/StatCard';
import { YearlyCard } from './components/YearlyCard';

const App: React.FC = () => {
    const [data, setData] = useState<AcademicYearData[]>(INITIAL_DATA);
    const [activeTab, setActiveTab] = useState<string>("overview");
    
    // File upload handler
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target?.result as string);
                    if (Array.isArray(json) && json.length > 0 && json[0].year) {
                        setData(json);
                        alert("تم استيراد البيانات بنجاح");
                    } else {
                        alert("تنسيق الملف غير صالح");
                    }
                } catch (error) {
                    alert("حدث خطأ أثناء قراءة الملف");
                }
            };
            reader.readAsText(file);
        }
    };

    // File download handler
    const handleDownload = () => {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ncn_stats_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Compute stats
    const computedData: ComputedYearStats[] = useMemo(() => {
        return data.map(year => ({
            ...year,
            phdPercentage: year.faculty.total > 0 ? (year.phdCount / year.faculty.total) * 100 : 0,
            studentToPhdRatio: year.phdCount > 0 ? year.students.total / year.phdCount : 0,
            studentToFacultyRatio: year.faculty.total > 0 ? year.students.total / year.faculty.total : 0,
        })).sort((a, b) => b.year.localeCompare(a.year)); // Sort descending by year
    }, [data]);

    const latestYear = computedData[0];
    const activeYearData = computedData.find(d => d.id === activeTab);

    return (
        <div className="min-h-screen pb-10 flex flex-col">
            {/* Header */}
            <header className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark sticky top-0 z-50 print:static print:border-none">
                <div className="container mx-auto max-w-7xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {/* Logo */}
                        <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-100 overflow-hidden p-1">
                             <img 
                                src="https://nre-nec.github.io/pictures/logo.png" 
                                alt="Northern College of Nursing Logo" 
                                className="w-full h-full object-contain"
                             />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg md:text-xl text-primary leading-tight">كلية الشمال للتمريض الأهلية</h1>
                            <p className="text-xs text-text-light-secondary">Northern College of Nursing</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 print:hidden">
                         <label className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="استيراد بيانات">
                            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                            <span className="material-icons text-text-light-secondary">upload_file</span>
                        </label>
                        <button onClick={handleDownload} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="تصدير بيانات">
                            <span className="material-icons text-text-light-secondary">download</span>
                        </button>
                        <button onClick={() => window.print()} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="طباعة">
                            <span className="material-icons text-text-light-secondary">print</span>
                        </button>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="container mx-auto max-w-7xl px-4 flex overflow-x-auto gap-2 no-scrollbar print:hidden">
                    <button 
                        onClick={() => setActiveTab("overview")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                            activeTab === "overview" 
                            ? "border-primary text-primary bg-primary/5" 
                            : "border-transparent text-text-light-secondary hover:text-text-light-primary hover:bg-gray-50"
                        }`}
                    >
                        نظرة عامة
                    </button>
                    {computedData.map(year => (
                        <button 
                            key={year.id}
                            onClick={() => setActiveTab(year.id)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                                activeTab === year.id
                                ? "border-primary text-primary bg-primary/5" 
                                : "border-transparent text-text-light-secondary hover:text-text-light-primary hover:bg-gray-50"
                            }`}
                        >
                            {year.year}
                        </button>
                    ))}
                </div>
            </header>

            <main className="flex-1 p-4 container mx-auto max-w-7xl">
                
                {/* OVERVIEW TAB */}
                <div className={activeTab === "overview" ? "block" : "hidden print:hidden"}>
                    <div className="text-center mb-8 mt-4">
                        <h2 className="text-2xl font-bold mb-1">لوحة المعلومات الرئيسية</h2>
                        <p className="text-text-light-secondary">ملخص الأداء لجميع الأعوام الدراسية</p>
                    </div>

                    {/* Summary Cards (Latest Year) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatCard 
                            title={`إجمالي الطلاب (${latestYear?.year})`} 
                            value={latestYear?.students.total.toLocaleString() || '0'} 
                            icon="groups" 
                            colorClass="text-light-blue bg-light-blue/10"
                        />
                        <StatCard 
                            title="هيئة التدريس" 
                            value={latestYear?.faculty.total.toLocaleString() || '0'} 
                            icon="school" 
                            colorClass="text-yellow bg-yellow/10"
                        />
                        <StatCard 
                            title="حملة الدكتوراه" 
                            value={latestYear?.phdCount.toLocaleString() || '0'} 
                            subValue={`نسبة: ${latestYear?.phdPercentage.toFixed(1)}%`}
                            icon="psychology" 
                            colorClass="text-primary bg-primary/10"
                        />
                        <StatCard 
                            title="معدل الطلاب للدكتور" 
                            value={latestYear?.studentToPhdRatio.toFixed(1) || '0'} 
                            icon="timeline" 
                            colorClass="text-green bg-green/10"
                        />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        {/* Growth Chart */}
                        <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg border border-border-light dark:border-border-dark h-[400px]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold">تطور أعداد الطلاب والأساتذة</h3>
                                <span className="material-icons text-text-light-secondary">trending_up</span>
                            </div>
                            <ResponsiveContainer width="100%" height="90%">
                                <LineChart data={[...computedData].reverse()}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="year" stroke="#94A3B8" fontSize={12} tick={{fontSize: 10}} />
                                    <YAxis yAxisId="left" stroke="#94A3B8" fontSize={12} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={12} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                        labelStyle={{ color: '#1E293B' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                    <Line yAxisId="left" type="monotone" dataKey="students.total" name="الطلاب" stroke="#147A94" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    <Line yAxisId="right" type="monotone" dataKey="faculty.total" name="الأساتذة" stroke="#FBBF24" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Gender Distribution Chart */}
                        <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg border border-border-light dark:border-border-dark h-[400px]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold">توزيع الطلاب حسب الجنس</h3>
                                <span className="material-icons text-text-light-secondary">wc</span>
                            </div>
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart data={[...computedData].reverse()}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="year" stroke="#94A3B8" fontSize={12} tick={{fontSize: 10}} />
                                    <YAxis stroke="#94A3B8" fontSize={12} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                        cursor={{fill: 'transparent'}}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                    <Bar dataKey="students.male" name="ذكور" fill="#66B2E4" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                    <Bar dataKey="students.female" name="إناث" fill="#F4007B" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* SINGLE YEAR TABS */}
                {activeYearData && (
                    <div className={activeTab === activeYearData.id ? "block animate-fade-in" : "hidden"}>
                        <div className="print:block">
                            <div className="mb-6 text-center print:mb-8">
                                <h2 className="text-2xl font-bold text-primary">تقرير العام الأكاديمي {activeYearData.year}</h2>
                                <p className="text-sm text-text-light-secondary mt-1">وحدة الشؤون التعليمية - كلية الشمال للتمريض الأهلية</p>
                            </div>
                            
                            <YearlyCard data={activeYearData} />

                            {/* Additional Print Footer */}
                            <div className="hidden print:flex justify-between mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
                                <div>تاريخ الطباعة: {new Date().toLocaleDateString('ar-SA')}</div>
                                <div>نظام الإحصائيات الأكاديمي - كلية الشمال للتمريض الأهلية</div>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default App;