import { AcademicYearData } from "./types";

export const INITIAL_DATA: AcademicYearData[] = [
    {
        id: "2024-2025",
        year: "2024-2025",
        students: { male: 577, female: 1346, total: 1923 }, // Estimated gender split ~30/70 based on total
        faculty: { male: 34, female: 53, total: 87 },
        phdCount: 54
    },
    {
        id: "2023-2024",
        year: "2023-2024",
        students: { male: 459, female: 1070, total: 1529 }, // Estimated gender split ~30/70 based on total
        faculty: { male: 29, female: 47, total: 76 },
        phdCount: 35
    },
    {
        id: "2022-2023",
        year: "2022-2023",
        students: { male: 286, female: 621, total: 907 }, // Exact data: Male 286, Female 621, Total 907
        faculty: { male: 23, female: 42, total: 65 },
        phdCount: 33
    },
    {
        id: "2021-2022",
        year: "2021-2022",
        students: { male: 288, female: 581, total: 869 }, // Exact data: Male 288, Female 581. Total calculated as 869 (288+581)
        faculty: { male: 23, female: 42, total: 65 },
        phdCount: 33
    }
];