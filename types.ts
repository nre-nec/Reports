export interface GenderStats {
    male: number;
    female: number;
    total: number;
}

export interface AcademicYearData {
    id: string;
    year: string;
    students: GenderStats;
    faculty: GenderStats;
    phdCount: number; // Number of faculty with PhD
}

// Derived stats for display
export interface ComputedYearStats extends AcademicYearData {
    phdPercentage: number;
    studentToPhdRatio: number;
    studentToFacultyRatio: number;
}
