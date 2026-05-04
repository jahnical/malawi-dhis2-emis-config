import ModalContent from "./ModalContent";
import { useBuildForm } from "../../hooks/form";
import React, { useState, useMemo } from "react";
import { DataStoreState, ModalComponent, } from "dhis2-semis-components";
import { ModalManagerInterface } from "../../types/modal/ModalProps";
import { useUrlParams, capitalizeString } from "dhis2-semis-functions";
import usePostDataStore from "../../hooks/dataStore/usePostDataStore";
import { useRecoilValue } from "recoil";
import { ProgramDataState } from "../../atoms/ProgramDataSchema";
import useGetDataStore from "../../hooks/dataStore/useGetDataStore";
import { modulePostBody } from "../../utils/form/formatters/formatDataStoreValues";
import { DataStoreConfigState } from "../../atoms/DataStoreSchema";
import { DataStoreConfigType, PerformanceSubjectMapping, GradeRange } from "../../types/dataStore/dataStoreConfigType";
import { SchoolCalendarState } from "../../atoms/schoolCalendar";
import useShowAlerts from "../../hooks/alert/useShowAlert";
import SubjectMappingTable, { DataElementOption } from "../performance/SubjectMappingTable";
import GradeRangeTable from "../performance/GradeRangeTable";

function ModalManager(props: ModalManagerInterface) {
    const { open, setOpen, initialValues, i18n } = props;
    const [trackeValues, setTrackedValues] = React.useState<any>({});
    const { useQuery, remove } = useUrlParams();
    const programData = useRecoilValue<any>(ProgramDataState)
    const name = useQuery.get("name");
    const section = useQuery.get("section");
    const module = useQuery.get("module");
    const [loadCreateConfig, setLoading] = useState<boolean>(false)
    const { refetch } = useGetDataStore(true)
    const { createDataStore } = usePostDataStore()
    const allInitialValues = { ...initialValues }
    const { buildForm, loading } = useBuildForm({ trackeValues, i18n })
    const formVariables = buildForm()
    const config = useRecoilValue(DataStoreConfigState)
    const prevDataStore = useRecoilValue(DataStoreState)
    const calendar = useRecoilValue(SchoolCalendarState)
    const { show } = useShowAlerts()

    const isPerformance = module === 'performance'
    const [subjects, setSubjects] = useState<PerformanceSubjectMapping[]>(initialValues?.subjects ?? [])
    const [gradeRanges, setGradeRanges] = useState<GradeRange[]>(initialValues?.gradeRanges ?? [])

    const allDataElements = useMemo(() => {
        if (!programData?.programStages || !trackeValues?.programStages) return []
        const selectedStageIds: string[] = Array.isArray(trackeValues.programStages)
            ? trackeValues.programStages
            : [trackeValues.programStages]

        const elements = programData.programStages
            .filter((s: any) => selectedStageIds.includes(s.id))
            .flatMap((s: any) => s.programStageDataElements?.map((p: any) => ({
                id: p.dataElement.id,
                displayName: p.dataElement.displayName,
                optionSetValue: p.dataElement.optionSetValue ?? false
            })) ?? [])

        return Array.from(
          new Map<string, DataElementOption>(elements.map((el: any) => [el.id, el])).values()
        )
    }, [programData, trackeValues?.programStages])

    const handleCloseModal = () => {
        remove("name")
        remove("module")
        remove("section")
        setOpen(false);
    }

    function onSubmit(e: Record<string, any>): void {
        if (!formVariables?.flatMap((x: any) => x.fields).flat()?.every((field: any) =>
            (!field?.required) || (field?.required && e[field.name])
        )) return

        try {
            setLoading(true)
            const enriched = isPerformance ? { ...e, subjects, gradeRanges } : e
            const configKey = config?.find(x => x.key == section)
            let postData = modulePostBody(enriched, programData, prevDataStore as unknown as DataStoreConfigType[], configKey)
            const keyIndex = postData?.findIndex((x: any) => x.key == section)
            const { academicYear, ...rest } = postData?.[keyIndex]?.[enriched?.module]

            if (keyIndex > -1) {
                postData[keyIndex] = { ...postData[keyIndex], [enriched?.module]: rest }
            }

            createDataStore({
                data: postData,
                key: 'dataStore/semis/values',
            }).then(async () => {
                if (academicYear) {
                    await createDataStore({
                        key: "dataStore/semis/schoolCalendar",
                        data: { ...calendar, academicYear: academicYear }
                    }).then(() => {
                        refetch().then(() => {
                            setLoading(false);
                            show({
                                message: i18n.t(`Configurations saved successfuly`),
                                type: { success: true }
                            })
                            handleCloseModal()
                        })
                    })
                } else {
                    refetch().then(() => {
                        setLoading(false);
                        show({
                            message: i18n.t(`Configurations saved successfuly`),
                            type: { success: true }
                        })
                        handleCloseModal()
                    })
                }
            })
        } catch (error: any) {
            show({
                message: `${i18n.t("Unable to save data")}: ${error.message}`,
                type: { critical: true }
            });
        }
    }

    const formatedName = capitalizeString(name!)
    const formatedSection = capitalizeString(section!)

    const extraContent = isPerformance ? (
        <>
            <SubjectMappingTable
                allDataElements={allDataElements}
                gradeOptionSetId={trackeValues?.gradeOptionSet ?? null}
                value={subjects}
                onChange={setSubjects}
            />
            <GradeRangeTable
                gradeOptionSetId={trackeValues?.gradeOptionSet ?? null}
                value={gradeRanges}
                onChange={setGradeRanges}
            />
        </>
    ) : undefined

    return (
        <ModalComponent
            open={open}
            loading={loading}
            handleClose={handleCloseModal}
            title={
                `${i18n.t('{{name}}', {
                    name: i18n.t(formatedName),
                })} - ${i18n.t('{{section}} Configuration', {
                    section: i18n.t(formatedSection),
                })}`
            }
        >
            <ModalContent
                setTrackedValues={setTrackedValues}
                loading={loading || loadCreateConfig}
                onSubmit={onSubmit}
                formFields={formVariables!}
                onCancel={handleCloseModal}
                initialValues={allInitialValues}
                extraContent={extraContent}
            />
        </ModalComponent>
    );
}

export default ModalManager;