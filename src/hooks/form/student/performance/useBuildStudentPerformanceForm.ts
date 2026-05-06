import { useUrlParams } from "dhis2-semis-functions"
import { ConfigCustomAttributeProps, SectionType } from "../../../../types/variables/Variables"
import { getDataStoreConfigKeys } from "../../../../utils/dataStore/dataStoreConfigKeys"
import { DataStoreConfigType } from "../../../../types/dataStore/dataStoreConfigType"

function useBuildStudentPerformanceForm() {
    const { useQuery } = useUrlParams()
    const section = useQuery.get("section") as SectionType

    const buildStudentPerformanceForm = ({ dataStoreConfig, programStages, optionSets }: any, dataElements: any) => {
        const formFieldsList: ConfigCustomAttributeProps[] = []
        const performanceConfig: any = getDataStoreConfigKeys({ dataStoreConfig, sectionType: section, element: "performance" })

        for (const element in performanceConfig) {
            const configuratioKey: any = performanceConfig?.[element as keyof DataStoreConfigType["performance"]]
            if (configuratioKey && typeof configuratioKey === 'object' && 'inputType' in configuratioKey) {

                let options: any[]
                if (configuratioKey?.resource === "programStages") {
                    options = programStages?.map((prog: any) => ({ value: prog.id, label: prog.displayName })) ?? []
                } else if (configuratioKey?.resource === "optionSets") {
                    options = optionSets?.map((os: any) => ({ value: os.id, label: os.displayName })) ?? []
                } else {
                    options = dataElements?.map((dx: any) => ({ value: dx?.dataElement?.id, label: dx?.dataElement?.displayName })) ?? []
                }

                formFieldsList.push(
                    {
                        id: element,
                        name: element,
                        visible: true,
                        required: configuratioKey.required,
                        disabled: false,
                        order: configuratioKey?.order ?? 99,
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
                                options
                            }
                        }
                    }
                )
            }
        }

        const sortedFields = formFieldsList?.sort((a, b) => a.order - b.order)
        return sortedFields
    }

    return { buildStudentPerformanceForm }
}

export { useBuildStudentPerformanceForm }