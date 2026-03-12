import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useUrlParams } from 'dhis2-semis-functions'
import useGetPrograms from '../../program/useGetPrograms'
import { formStudentEnrollmentForm } from '../../../utils/form'
import { DataStoreConfigState } from '../../../atoms/DataStoreSchema'
import useProgramConfig from '../../../hooks/program/useGetProgram'
import { useBuildStudentEnrollmentForm, useBuildStudentGeneralForm, useBuildStudentProgramForm } from '../index'
import { useEffect, useState } from 'react'
import { getDataElements, getOptions } from '../../../utils/dataStore/common'
import { useBuildStudentSocioForm } from '../student/socio/useBuildStudentSocioForm'
import { useBuildStudentFinalResultForm } from '../student/final-result/useBuildStudentFinalResultForm'
import { formStudentFinalResultForm } from '../../../utils/form/student/final-result/useBuildStudentFinalResultForm'
import { useBuildStudentTransferForm } from '../student/transfer/useBuildStudentTransferForm'
import { formStudentTransferForm } from '../../../utils/form/student/transfer/useBuildStudentTransferForm'
import { getDataStoreConfigKeys } from '../../../utils/dataStore/dataStoreConfigKeys'
import { SectionType } from '../../../types/variables/Variables'
import { useBuildStudentAttendanceForm } from '../student/attendance/useBuildStudentAttendanceForm'
import { formStudentAttendance } from '../../../utils/form/student/attendance/useBuildStudentAttendanceForm'
import { useBuildStudentPerformanceForm } from '../student/performance/useBuildStudentPerformanceForm'
import { formmStudentPerformance } from '../../../utils/form/student/performance/useBuildStudentAttendanceForm'
import { useBuildStudentAdmissionForm } from '../student/admission/useBuildStudentAdmissionForm'
import { formatStudentAdmissionForm } from '../../../utils/form/student/admission/formatStudentAdmissionForm'
import { D2I18n } from 'dhis2-semis-types'
import { useBuildAttendanceClassConfigForm } from '../student/attendance/useBuildAttendanceClassConfigForm'
import { ProgramDataState } from '../../../atoms/ProgramDataSchema'

const useBuildForm = ({ trackeValues, i18n }: { trackeValues?: any, i18n: D2I18n }) => {
    const { useQuery } = useUrlParams()
    const [loading, setLoading] = useState<boolean>(trackeValues?.program)
    const [data, setData] = useState<any>(null)
    const [load, setLoad] = useState<boolean>(false)
    const [attendanceStatusProgram, setAttendanceStatusProgram] = useState<any>(null)
    const module = useQuery.get('module')
    const section = useQuery.get('section') as SectionType
    const dataStoreConfig = useRecoilValue(DataStoreConfigState)
    const { buildStudentProgramForm } = useBuildStudentProgramForm()
    const { buildStudentGeneralForm } = useBuildStudentGeneralForm()
    const { buildStudentEnrollmentForm } = useBuildStudentEnrollmentForm()
    const { buildStudentSocioForm } = useBuildStudentSocioForm()
    const { buildStudentFinalResultForm } = useBuildStudentFinalResultForm()
    const { buildStudentAttendanceForm } = useBuildStudentAttendanceForm()
    const { buildAttendanceClassConfigForm } = useBuildAttendanceClassConfigForm()
    const { getProgram } = useProgramConfig()
    const { buildStudentTransferForm } = useBuildStudentTransferForm()
    const { buildStudentPerformanceForm } = useBuildStudentPerformanceForm()
    const { buildStudentAdmissionForm } = useBuildStudentAdmissionForm()
    const setMainProgram = useSetRecoilState<any>(ProgramDataState)


    useEffect(() => {
        //FETCH PROGRAM (STUDENT/STAFF) DATA BASED ON SELECTED ONE ON THE FORM
        if (trackeValues?.program) {
            getProgram(trackeValues.program)
                .then((response: any) => {
                    setData(response)
                    setMainProgram(response)
                    setLoading(false)
                })
        }
    }, [trackeValues?.program])

    //LISTEN TO ATTENDANCE STATUS PROGRAM AND FETCH IT DETAILS TO FILL THE FORM
    useEffect(() => {
        if (trackeValues?.programAttendanceClassConfig) {
            getProgram(trackeValues?.programAttendanceClassConfig)
                .then((response: any) => {
                    setAttendanceStatusProgram(response)
                    setLoad(false)
                })
        }
    }, [trackeValues?.programAttendanceClassConfig])

    const { programs, loading: loadingPrograms } = useGetPrograms()

    const buildForm = () => {
        const programFields = buildStudentProgramForm({ dataStoreConfig: dataStoreConfig, programs, loading })
        switch (module) {
            case 'registration':
                const defaults: any = getDataStoreConfigKeys({
                    dataStoreConfig: dataStoreConfig,
                    sectionType: section,
                    element: 'defaults'
                })
                const fieldsEnrollment = data
                    ? buildStudentEnrollmentForm(
                        {
                            dataStoreConfig: dataStoreConfig,
                            programStages: data?.programStages ?? []
                        },
                        getDataElements(data?.programStages, trackeValues?.programStageRegistration)
                    )
                    : []

                const defaultFields = buildStudentGeneralForm(
                    getOptions(
                        getDataElements(data?.programStages, trackeValues?.programStageRegistration),
                        trackeValues?.academicYear
                    ),
                    data?.programTrackedEntityAttributes ?? [],
                    defaults
                )

                const socioFields = data
                    ? buildStudentSocioForm({
                        dataStoreConfig: dataStoreConfig,
                        programStages: data?.programStages ?? []
                    })
                    : []

                const sectionFormEnrollment = formStudentEnrollmentForm({
                    programFields,
                    socioFields,
                    registrationFields: fieldsEnrollment,
                    defaultFields,
                    requiredData: { ...trackeValues, data },
                    i18n
                })
                return sectionFormEnrollment

            case 'final-result':
                const frStageDataElements = getDataElements(data?.programStages, trackeValues?.programStageFinalResult)
                const fields = data
                    ? buildStudentFinalResultForm(
                        {
                            dataStoreConfig: dataStoreConfig,
                            programStages: data?.programStages ?? []
                        },
                        frStageDataElements
                    )
                    : []

                const { finalResultStatus }: any = getDataStoreConfigKeys({
                    dataStoreConfig: dataStoreConfig,
                    sectionType: section,
                    element: 'final-result'
                })

                const finalResultStatusDetails =
                    trackeValues?.status && data
                        ? buildStudentGeneralForm(
                            getOptions(frStageDataElements, trackeValues?.status),
                            frStageDataElements ?? [],
                            finalResultStatus
                        )
                        : []


                const sectionForm = formStudentFinalResultForm({
                    finalResultFields: fields,
                    programFields: programFields,
                    finalResultStatusDetails,
                    i18n
                })
                return sectionForm

            case 'attendance':
                const stageDataElements = getDataElements(data?.programStages, trackeValues?.programStageAttendance)
                const attendaceClassConfigStageDataElements = getDataElements(attendanceStatusProgram?.programStages, trackeValues?.programStageAttendanceClassConfig)

                const { attendanceStatus }: any = getDataStoreConfigKeys({
                    dataStoreConfig: dataStoreConfig,
                    sectionType: section,
                    element: 'attendance'
                })

                const attendace = data
                    ? buildStudentAttendanceForm(
                        {
                            dataStoreConfig: dataStoreConfig,
                            programStages: data?.programStages ?? []
                        },
                        stageDataElements
                    )
                    : []

                const attendanceStatusDetails =
                    trackeValues?.status && data
                        ? buildStudentGeneralForm(
                            getOptions(stageDataElements, trackeValues?.status),
                            stageDataElements ?? [],
                            attendanceStatus
                        )
                        : []

                const attendanceClassConfigDetails = data ?
                    buildAttendanceClassConfigForm(
                        {
                            dataStoreConfig: dataStoreConfig,
                            programStages: attendanceStatusProgram?.programStages ?? [],
                            programs
                        },
                        attendaceClassConfigStageDataElements
                    ) : []


                const theForm = formStudentAttendance({
                    attendanceDetails: attendace,
                    programFields: programFields,
                    attendanceStatusDetails,
                    attendanceClassConfig: attendanceClassConfigDetails,
                    i18n
                })
                return theForm

            case 'transfer':
                const transfer: any = getDataStoreConfigKeys({
                    dataStoreConfig,
                    sectionType: section,
                    element: 'transfer'
                })
                const { transferStatus: transferStatusFieldsConfig } = transfer

                const transferStatusFields =
                    trackeValues?.status && data
                        ? buildStudentGeneralForm(
                            getOptions(
                                getDataElements(data?.programStages, trackeValues?.programStageTransfer),
                                trackeValues?.status
                            ),
                            data?.programTrackedEntityAttributes ?? [],
                            transferStatusFieldsConfig
                        )
                        : []

                const transferFields = data
                    ? buildStudentTransferForm({
                        formValues: trackeValues,
                        dataStoreConfig: dataStoreConfig,
                        programStages: data?.programStages ?? []
                    })
                    : []
                const sectionFormTransfer = formStudentTransferForm({
                    transferFields,
                    programFields,
                    transferStatusFields,
                    i18n
                })
                return sectionFormTransfer

            case 'performance':
                const performanceFields = data
                    ? buildStudentPerformanceForm(
                        {
                            dataStoreConfig: dataStoreConfig,
                            programStages: data?.programStages ?? []
                        },
                        getDataElements(data?.programStages, trackeValues?.programStagePerformance)
                    )
                    : []

                const performanceForm = formmStudentPerformance({ performanceFields, programFields, i18n })
                return performanceForm

            case 'admission':
                const admissionFields = data
                    ? buildStudentAdmissionForm({
                        dataStoreConfig: dataStoreConfig,
                        programTrackedEntityAttributes: data?.programTrackedEntityAttributes ?? []
                    })
                    : []

                const admissionForm = formatStudentAdmissionForm({
                    admissionFields,
                    programFields,
                    i18n
                })
                return admissionForm

            default:
                break
        }
    }
    return { buildForm, loading: loadingPrograms }
}

export { useBuildForm }
