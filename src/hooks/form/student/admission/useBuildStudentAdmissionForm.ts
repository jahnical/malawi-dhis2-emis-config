import { useUrlParams } from "dhis2-semis-functions"
import { DataStoreConfigType } from "../../../../types/dataStore/dataStoreConfigType"
import { getDataStoreConfigKeys } from "../../../../utils/dataStore/dataStoreConfigKeys"
import { ConfigCustomAttributeProps, SectionType } from "../../../../types/variables/Variables"

function useBuildStudentAdmissionForm() {
    const { useQuery } = useUrlParams()
    const section = useQuery.get("section") as SectionType

    const buildStudentAdmissionForm = ({ dataStoreConfig, programTrackedEntityAttributes }: any) => {
        const formFieldsList: ConfigCustomAttributeProps[] = []
        const admission: any = getDataStoreConfigKeys({ dataStoreConfig, sectionType: section, element: "admission" })

        for (const element in admission) {
            const configuratioKey: any = admission?.[element as keyof DataStoreConfigType["admission"]]
            if (configuratioKey) {
                formFieldsList.push(
                    {
                        id: element,
                        name: element,
                        visible: true,
                        required: configuratioKey?.required ?? true,
                        disabled: false,
                        order: configuratioKey?.order,
                        type: configuratioKey?.inputType,
                        labelName: configuratioKey?.label,
                        description: configuratioKey?.hint,
                        content: configuratioKey?.hint,
                        valueType: configuratioKey?.inputType,
                        displayName: configuratioKey?.label,
                        header: configuratioKey?.label,
                        options: {
                            optionSet: {
                                id: element,
                                options: configuratioKey?.resource === "attributes"
                                    ? (programTrackedEntityAttributes?.map((attr: any) => ({
                                        value: attr?.trackedEntityAttribute?.id,
                                        label: attr?.trackedEntityAttribute?.displayName
                                    })) || [])
                                    : []
                            }
                        }
                    }
                )
            }
        }

        const sortedFields = formFieldsList?.sort((a, b) => a.order - b.order)
        return sortedFields
    }

    return { buildStudentAdmissionForm }
}

export { useBuildStudentAdmissionForm }
