import { D2I18n, GroupFormProps } from "dhis2-semis-types";

type formStudentFinalResultFormType = {
    programFields: GroupFormProps["fields"],
    attendanceDetails: GroupFormProps["fields"],
    attendanceStatusDetails: GroupFormProps["fields"]
    attendanceClassConfig: GroupFormProps["fields"]
    i18n: D2I18n
}

function formStudentAttendance({ attendanceDetails, programFields, attendanceStatusDetails, attendanceClassConfig, i18n }: formStudentFinalResultFormType) {
    return [
        {
            visible: true,
            description: "",
            name: i18n.t("Program Details"),
            fields: [...programFields]
        },
        ...(attendanceDetails?.length > 0 ? [{
            visible: true,
            name: i18n.t('Attendance General Details'),
            fields: [...attendanceDetails]
        }] : []),
        ...(attendanceStatusDetails?.length > 0 ? [{
            visible: true,
            name: i18n.t('Attendance Statuses Details'),
            fields: [...attendanceStatusDetails]
        }] : []),
        ...(attendanceClassConfig?.length > 0 ? [{
            visible: true,
            description: "The Class Attendance Configuration section allows administrators to define how the system interprets and records learner attendance status.",
            name: i18n.t('Class Attendance Configuration'),
            fields: [...attendanceClassConfig]
        }] : [])
    ];
}

export { formStudentAttendance };