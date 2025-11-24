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
        <div className="min-h-screen pb-10 flex flex-col bg-background-light/50">
            {/* Header */}
            <header className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark sticky top-0 z-50 print:static print:border-none shadow-sm">
                <div className="container mx-auto max-w-7xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <div className="w-20 h-20 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100 overflow-hidden p-1">
                             <img 
                                src="https://nre-nec.github.io/pictures/logo.png" 
                                alt="Northern College of Nursing Logo" 
                                className="w-full h-full object-contain"
                             />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl md:text-2xl text-primary leading-tight">كلية الشمال للتمريض الأهلية</h1>
                            <p className="text-sm text-text-light-secondary font-medium">Northern College of Nursing</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 print:hidden">
                         <label className="cursor-pointer p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-white shadow-sm border border-gray-100" title="استيراد بيانات">
                            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                            <span className="material-icons text-text-light-secondary">upload_file</span>
                        </label>
                        <button onClick={handleDownload} className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-white shadow-sm border border-gray-100" title="تصدير بيانات">
                            <span className="material-icons text-text-light-secondary">download</span>
                        </button>
                        <button onClick={() => window.print()} className="p-3 rounded-full hover:bg-primary hover:text-white dark:hover:bg-gray-700 transition-colors bg-white shadow-sm border border-gray-100 text-primary" title="طباعة">
                            <span className="material-icons">print</span>
                        </button>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="container mx-auto max-w-7xl px-4 flex overflow-x-auto gap-2 no-scrollbar print:hidden mt-2">
                    <button 
                        onClick={() => setActiveTab("overview")}
                        className={`px-6 py-3 text-base font-bold border-b-4 whitespace-nowrap transition-colors rounded-t-lg ${
                            activeTab === "overview" 
                            ? "border-primary text-primary bg-white" 
                            : "border-transparent text-text-light-secondary hover:text-text-light-primary hover:bg-gray-50"
                        }`}
                    >
                        نظرة عامة
                    </button>
                    {computedData.map(year => (
                        <button 
                            key={year.id}
                            onClick={() => setActiveTab(year.id)}
                            className={`px-6 py-3 text-base font-bold border-b-4 whitespace-nowrap transition-colors rounded-t-lg ${
                                activeTab === year.id
                                ? "border-primary text-primary bg-white" 
                                : "border-transparent text-text-light-secondary hover:text-text-light-primary hover:bg-gray-50"
                            }`}
                        >
                            {year.year}
                        </button>
                    ))}
                </div>
            </header>

            <main className="flex-1 p-6 container mx-auto max-w-7xl">
                
                {/* OVERVIEW TAB */}
                <div className={activeTab === "overview" ? "block" : "hidden print:hidden"}>
                    <div className="text-center mb-10 mt-6">
                        <h2 className="text-3xl font-bold mb-2 text-text-light-primary">لوحة المعلومات الرئيسية</h2>
                        <p className="text-lg text-text-light-secondary">ملخص الأداء والمؤشرات لجميع الأعوام الدراسية</p>
                    </div>

                    {/* Summary Cards (Latest Year) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Growth Chart */}
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark h-[500px] shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl text-text-light-primary">تطور أعداد الطلاب والأساتذة</h3>
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <span className="material-icons text-text-light-secondary">trending_up</span>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="90%">
                                <LineChart data={[...computedData].reverse()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="year" stroke="#64748B" fontSize={14} tickMargin={10} />
                                    <YAxis yAxisId="left" stroke="#64748B" fontSize={14} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#64748B" fontSize={14} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        labelStyle={{ color: '#1E293B', fontWeight: 'bold', marginBottom: '8px' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Line yAxisId="left" type="monotone" dataKey="students.total" name="الطلاب" stroke="#147A94" strokeWidth={4} dot={{ r: 6, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                                    <Line yAxisId="right" type="monotone" dataKey="faculty.total" name="الأساتذة" stroke="#FBBF24" strokeWidth={4} dot={{ r: 6, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Gender Distribution Chart */}
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark h-[500px] shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl text-text-light-primary">توزيع الطلاب حسب الجنس</h3>
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <span className="material-icons text-text-light-secondary">wc</span>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart data={[...computedData].reverse()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="year" stroke="#64748B" fontSize={14} tickMargin={10} />
                                    <YAxis stroke="#64748B" fontSize={14} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        cursor={{fill: '#F1F5F9'}}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="students.male" name="ذكور" fill="#66B2E4" radius={[6, 6, 0, 0]} maxBarSize={60} />
                                    <Bar dataKey="students.female" name="إناث" fill="#F4007B" radius={[6, 6, 0, 0]} maxBarSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* SINGLE YEAR TABS */}
                {activeYearData && (
                    <div className={activeTab === activeYearData.id ? "block animate-fade-in" : "hidden"}>
                        <div className="print:block">
                            <div className="mb-10 text-center print:mb-8 border-b pb-6 border-gray-200">
                                <h2 className="text-3xl font-bold text-primary mb-2">تقرير العام الأكاديمي {activeYearData.year}</h2>
                                <p className="text-lg text-text-light-secondary font-medium">وحدة الشؤون التعليمية - كلية الشمال للتمريض الأهلية</p>
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