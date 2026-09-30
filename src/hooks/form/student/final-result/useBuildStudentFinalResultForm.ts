import { useUrlParams } from "dhis2-semis-functions"
import { ConfigCustomAttributeProps, SectionType } from "../../../../types/variables/Variables"
import { getDataStoreConfigKeys } from "../../../../utils/dataStore/dataStoreConfigKeys"
import { DataStoreConfigType } from "../../../../types/dataStore/dataStoreConfigType"

function useBuildStudentFinalResultForm() {
    const { useQuery } = useUrlParams()
    const section = useQuery.get("section") as SectionType

    // registrationDataElements: options for fields that pick from the registration stage
    const buildStudentFinalResultForm = ({ dataStoreConfig, programStages }: any, dataElements: any, registrationDataElements: any[] = []) => {
        const formFieldsList: ConfigCustomAttributeProps[] = []
        const finalResult: any = getDataStoreConfigKeys({ dataStoreConfig, sectionType: section, element: "final-result" })
        const { finalResultStatus, ...rest } = finalResult

        for (const element in rest) {
            const configuratioKey: any = finalResult?.[element as keyof DataStoreConfigType["final-result"]]
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
                                options: configuratioKey?.resource == "programStages" ?
                                    programStages?.map((prog: any) =>
                                        ({ value: prog.id, label: prog.displayName }))
                                    : (configuratioKey?.resource == "registrationDataElements" ? registrationDataElements : dataElements)
                                        ?.map((dx: any) => ({ value: dx?.dataElement?.id, label: dx?.dataElement?.displayName }))
                            }
                        }
                    }
                )
            }
        }

        const sortedFields = formFieldsList?.sort((a, b) => a.order - b.order)
        return sortedFields
    }

    return { buildStudentFinalResultForm }
}

export { useBuildStudentFinalResultForm }