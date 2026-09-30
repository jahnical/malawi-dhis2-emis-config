import resultImage from "../../../assets/images/home/result.png";
import transferImage from "../../../assets/images/home/transfer.png";
import admissionImage from "../../../assets/images/home/admission.png";
import enrollmentImage from "../../../assets/images/home/enrollment.png";
import attendanceImage from "../../../assets/images/home/attendance.png";
import performanceImage from "../../../assets/images/home/performance.png";
import { D2I18n } from 'dhis2-semis-types';


const studentCards = (i18n: D2I18n) => [
    { key: "admission", label: i18n.t("Admission"), icon: enrollmentImage, path: "admissions", configurable: true },
    { key: "registration", label: i18n.t("Enrollment"), icon: admissionImage, path: "enrollments", configurable: true },
    { key: "attendance", label: i18n.t("Attendance"), icon: attendanceImage, path: "attendance", configurable: true },
    { key: "performance", label: i18n.t("Performance"), icon: performanceImage, path: "performance", configurable: true },
    { key: "transfer", label: i18n.t("Transfer"), icon: transferImage, path: "transfer", configurable: true },
    { key: "final-result", label: i18n.t("Final Result"), icon: resultImage, path: "final-result", configurable: true },
];

const staffCards = (i18n: D2I18n) => [
    { key: "registration", label: i18n.t("Staff registry"), icon: enrollmentImage, path: "enrollments", configurable: true },
    { key: "attendance", label: i18n.t("Attendance"), icon: attendanceImage, path: "attendance", configurable: true },
    { key: "transfer", label: i18n.t("Transfer"), icon: transferImage, path: "transfer", configurable: true },
    { key: "final-result", label: i18n.t("Re-enroll"), icon: resultImage, path: "final-result", configurable: true },
];

const dashboardData = (i18n: D2I18n) => [
    { key: 0, title: "Student", cards: studentCards(i18n) },
    { key: 1, title: "Staff", cards: staffCards(i18n) }
]

export { staffCards, studentCards, dashboardData }