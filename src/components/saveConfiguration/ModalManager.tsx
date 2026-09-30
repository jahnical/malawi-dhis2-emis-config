import ModalContent from "./ModalContent";
import { useBuildForm } from "../../hooks/form";
import React, { useState, useMemo, useEffect } from "react";
import { DataStoreState, ModalComponent, } from "dhis2-semis-components";
import { ModalManagerInterface } from "../../types/modal/ModalProps";
import { useUrlParams, capitalizeString } from "dhis2-semis-functions";
import usePostDataStore from "../../hooks/dataStore/usePostDataStore";
import { useRecoilValue } from "recoil";
import { ProgramDataState } from "../../atoms/ProgramDataSchema";
import useGetDataStore from "../../hooks/dataStore/useGetDataStore";
import { modulePostBody } from "../../utils/form/formatters/formatDataStoreValues";
import { DataStoreConfigState } from "../../atoms/DataStoreSchema";
import { DataStoreConfigType, PerformanceSubjectMapping, GradeRange, TermRemarkRange, StandardGroup } from "../../types/dataStore/dataStoreConfigType";
import { SchoolCalendarState } from "../../atoms/schoolCalendar";
import useShowAlerts from "../../hooks/alert/useShowAlert";
import SubjectMappingTable, { DataElementOption } from "../performance/SubjectMappingTable";
import GradeRangeTable from "../performance/GradeRangeTable";
import TermRemarksTable from "../performance/TermRemarksTable";
import StandardGroupsTable from "../performance/StandardGroupsTable";
import { useGetDataElementOptionSet } from "../../hooks/dataElements/useGetDataElementOptionSet";
import { Box, Divider, MenuItem, Select, TextField, Typography, FormControl, InputLabel } from "@mui/material";

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
    const [maxSubjectScore, setMaxSubjectScore] = useState<number>(initialValues?.maxSubjectScore ?? 100)
    const [termRemarksDataElement, setTermRemarksDataElement] = useState<string>(initialValues?.termRemarksDataElement ?? '')
    const [termRemarksRanges, setTermRemarksRanges] = useState<TermRemarkRange[]>(initialValues?.termRemarksRanges ?? [])
    const { optionSetId: termRemarksOptSetId, fetchOptionSetId } = useGetDataElementOptionSet()
    const [standardGroups, setStandardGroups] = useState<StandardGroup[]>(initialValues?.standardGroups ?? [])
    const { optionSetId: standardsOptionSetId, fetchOptionSetId: fetchStandardsOptionSetId } = useGetDataElementOptionSet()

    const initialSubjects = initialValues?.subjects ?? []
    const initialGradeRanges = initialValues?.gradeRanges ?? []
    const initialMaxSubjectScore = initialValues?.maxSubjectScore ?? 100
    const initialTermRemarksDE = initialValues?.termRemarksDataElement ?? ''
    const initialTermRemarksRanges = initialValues?.termRemarksRanges ?? []
    const initialStandardGroups = initialValues?.standardGroups ?? []
    const extraContentChanged = isPerformance && (
        JSON.stringify(subjects) !== JSON.stringify(initialSubjects) ||
        JSON.stringify(gradeRanges) !== JSON.stringify(initialGradeRanges) ||
        maxSubjectScore !== initialMaxSubjectScore ||
        termRemarksDataElement !== initialTermRemarksDE ||
        JSON.stringify(termRemarksRanges) !== JSON.stringify(initialTermRemarksRanges) ||
        JSON.stringify(standardGroups) !== JSON.stringify(initialStandardGroups)
    )

    useEffect(() => {
        if (termRemarksDataElement) fetchOptionSetId(termRemarksDataElement)
    }, [termRemarksDataElement])

    const registrationGradeDataElement = prevDataStore?.find((x: any) => x.program == programData?.id)?.registration?.grade
    useEffect(() => {
        if (registrationGradeDataElement) fetchStandardsOptionSetId(registrationGradeDataElement)
    }, [registrationGradeDataElement])

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
                optionSetValue: p.dataElement.optionSetValue ?? (p.dataElement.optionSet != null)
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
            const enriched = isPerformance
            ? { ...e, subjects, gradeRanges, maxSubjectScore, termRemarksDataElement, termRemarksRanges, termRemarksOptSetId, standardGroups }
            : e
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

    const optionSetDEs = allDataElements.filter(de => de.optionSetValue)

    const pickableSubjects = subjects
        .filter(s => !s.universal && s.scoreDataElement)
        .map(s => ({
            id: s.scoreDataElement,
            displayName: allDataElements.find(de => de.id === s.scoreDataElement)?.displayName ?? s.scoreDataElement
        }))

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
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Term Remarks Configuration
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start', mb: 2 }}>
                    <TextField
                        label="Max Subject Score"
                        type="number"
                        size="small"
                        value={maxSubjectScore}
                        onChange={e => setMaxSubjectScore(parseFloat(e.target.value) || 0)}
                        inputProps={{ min: 1, step: 1 }}
                        sx={{ width: 180 }}
                        helperText="Score ceiling applied to all subjects"
                    />
                    <FormControl size="small" sx={{ minWidth: 280 }}>
                        <InputLabel shrink>Term Remarks Data Element</InputLabel>
                        <Select
                            value={termRemarksDataElement}
                            label="Term Remarks Data Element"
                            onChange={e => setTermRemarksDataElement(e.target.value)}
                            displayEmpty
                            notched
                        >
                            <MenuItem value=""><em>— Select data element —</em></MenuItem>
                            {optionSetDEs.map(de => (
                                <MenuItem key={de.id} value={de.id}>{de.displayName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <TermRemarksTable
                    optionSetId={termRemarksOptSetId}
                    value={termRemarksRanges}
                    onChange={setTermRemarksRanges}
                />
            </Box>
            <Divider sx={{ my: 3 }} />
            <StandardGroupsTable
                standardGroupOptionSetId={trackeValues?.standardGroupOptionSet ?? null}
                standardsOptionSetId={standardsOptionSetId}
                pickableSubjects={pickableSubjects}
                value={standardGroups}
                onChange={setStandardGroups}
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
                extraContentChanged={extraContentChanged}
            />
        </ModalComponent>
    );
}

export default ModalManager;