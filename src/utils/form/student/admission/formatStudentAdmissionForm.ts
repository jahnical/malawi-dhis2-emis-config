import { D2I18n, GroupFormProps } from "dhis2-semis-types";

type formStudentAdmissionFormType = {
    programFields: GroupFormProps["fields"],
    admissionFields: GroupFormProps["fields"],
    i18n: D2I18n
}

function formatStudentAdmissionForm({ programFields, admissionFields, i18n }: formStudentAdmissionFormType) {
    return [
        {
            visible: true,
            description: "",
            name: i18n.t("Program Details"),
            fields: [...programFields]
        },
        ...(admissionFields.length > 0 ? [{
            visible: true,
            description: "",
            name: i18n.t("Admission Details"),
            fields: [...admissionFields]
        }] : [])
    ];
}

export { formatStudentAdmissionForm };
