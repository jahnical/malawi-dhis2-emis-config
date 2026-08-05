import { DataStoreConfigType } from '../../../types/dataStore/dataStoreConfigType'

const registrationPostBody = (formValues: any, program: any, config: any) => {
    const keys = Object.keys(config?.registration ?? {})
    let filters = []
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]

        if (config?.registration?.[key]?.dataFilter) {
            filters.push({
                code: config.registration[key].filterCode,
                dataElement: formValues?.[key],
                label: formValues[`${key}Name`] ?? key,
                order: i,
                ulrParam: config.registration[key].filterCode
            })
        }
    }

    return {
        [formValues?.module]: {
            enabled: formValues?.enabled ?? true,
            academicYear: formValues.academicYear,
            grade: formValues?.grade ? formValues?.grade : formValues.typeOfStaff ?? null,
            section: formValues?.section ? formValues?.section : formValues.employmentType ?? null,
            lastUpdate: new Date().toISOString(),
            programStage: formValues.programStageRegistration
        },
        currentAcademicYear: formValues?.currentAcademicYear,
        ...(formValues.programStageSocioEconomic
            ? {
                'socio-economics': {
                    programStage: formValues.programStageSocioEconomic
                }
            }
            : {}),
        program: formValues.program,
        key: formValues.key,
        trackedEntityType: program?.trackedEntityType?.id,
        defaults: {
            allowSearching: formValues.allowSearching === 'true',
            defaultOrder: `${formValues.defaultOrder}:${formValues.orderType}`
        },
        filters: {
            dataElements: filters
        }
    }
}

const registrationBodyToForm = (dataStoreValues: any, module: string) => {
    return {
        module: module,
        program: dataStoreValues?.program,
        programStageRegistration: dataStoreValues?.[module]?.programStage,
        ...dataStoreValues?.[module],
        ...(dataStoreValues?.key == 'staff'
            ? {
                typeOfStaff: dataStoreValues?.[module]?.grade,
                employmentType: dataStoreValues?.[module]?.section
            }
            : {}),
        [dataStoreValues?.key == 'student' ? 'gradeName' : 'typeOfStaffName']:
            dataStoreValues?.filters?.dataElements?.find((x: any) => x.dataElement == dataStoreValues?.[module]?.grade)
                ?.label,

        [dataStoreValues?.key == 'student' ? 'sectionName' : 'employmentTypeName']:
            dataStoreValues?.filters?.dataElements?.find(
                (x: any) => x.dataElement == dataStoreValues?.[module]?.section
            )?.label,

        orderType: dataStoreValues?.defaults?.defaultOrder?.split(':')?.[1],
        programStageSocioEconomic: dataStoreValues?.['socio-economics']?.programStage,
        defaultOrder: dataStoreValues?.defaults?.defaultOrder?.split(':')?.[0],
        allowSearching: JSON?.stringify(dataStoreValues?.defaults?.allowSearching),
        currentAcademicYear: dataStoreValues?.defaults?.currentAcademicYear
    }
}

const finalResultBodyToForm = (dataStoreValues: any, module: string) => {
    return {
        module: module,
        program: dataStoreValues?.program,
        programStageFinalResult: dataStoreValues?.[module]?.programStage,
        ...dataStoreValues?.[module],
        programStages: dataStoreValues?.[module]?.validStatusValue?.map((x: any) => x) ?? [],
        dropout: dataStoreValues?.[module]?.dropoutStatusValues?.map((x: any) => x) ?? []
    }
}

const attendance = (dataStoreValues: any, module: string) => {
    const { attendanceStatus, ...rest } = dataStoreValues
    return {
        module: module,
        program: dataStoreValues?.program,
        programStageAttendance: dataStoreValues?.[module]?.programStage,
        allowClassAttendanceConfig: JSON?.stringify(dataStoreValues?.[module]?.attendanceStatus?.allowAttendanceStatus),
        programAttendanceClassConfig: dataStoreValues?.[module]?.attendanceStatus?.program,
        attendaceClassConfigStatus: dataStoreValues?.[module]?.attendanceStatus?.status,
        programStageAttendanceClassConfig: dataStoreValues?.[module]?.attendanceStatus?.programStage,
        ...rest?.[module],
        ...rest?.[module]?.statusOptions?.reduce(
            (acc: any, x: any) => ({ ...acc, [x?.configKey]: x?.code }),
            {}
        )
    }
}

const attendancePostBody = (formValues: any) => {
    const { absentCode, lateCode, leaveCode, presentCode, allowClassAttendanceConfig,
        programAttendanceClassConfig, attendaceClassConfigStatus, programStageAttendanceClassConfig
    } = formValues

    return {
        absenteeism: {
            enabled: true
        },
        [formValues?.module]: {
            enabled: true,
            absenceReason: formValues?.absenceReason,
            lastUpdate: new Date().toISOString(),
            programStage: formValues?.programStageAttendance,
            status: formValues?.status,
            ...((allowClassAttendanceConfig != undefined && programAttendanceClassConfig
                && attendaceClassConfigStatus && programStageAttendanceClassConfig
            ) ? {
                attendanceStatus: {
                    allowAttendanceStatus: allowClassAttendanceConfig === 'true',
                    program: programAttendanceClassConfig,
                    status: attendaceClassConfigStatus,
                    programStage: programStageAttendanceClassConfig
                }
            } : {}
            ),
            statusOptions: [
                ...(presentCode
                    ? [
                        {
                            code: presentCode,
                            color: '#81C784',
                            icon: 'correct_blue_fill',
                            key: presentCode,
                            configKey: `presentCode`
                        }
                    ]
                    : []),
                ...(absentCode
                    ? [
                        {
                            code: absentCode,
                            color: '#E57373',
                            icon: 'wrong_red_fill',
                            key: absentCode,
                            configKey: `absentCode`
                        }
                    ]
                    : []),
                ...(lateCode
                    ? [
                        {
                            code: lateCode,
                            color: '#f4fb71ff',
                            icon: 'correct_blue_fill',
                            key: lateCode,
                            configKey: `lateCode`
                        }
                    ]
                    : []),
                ...(leaveCode
                    ? [
                        {
                            code: leaveCode,
                            color: '#a6d652ff',
                            icon: 'wrong_red_fill',
                            key: leaveCode,
                            configKey: `leaveCode`
                        }
                    ]
                    : [])
            ]
        }
    }
}

const finalResultPostBody = (formValues: any) => {

    return {
        [formValues?.module]: {
            enabled: true,
            programStage: formValues.programStageFinalResult,
            validStatusValue: formValues?.programStages,
            dropoutStatusValues: formValues?.dropout,
            status: formValues.status,
            lastUpdate: new Date().toISOString()
        }
    }
}


const transferBodyToForm = (dataStoreValues: any, module: string) => {
    return {
        module: module,
        program: dataStoreValues?.program,
        programStageTransfer: dataStoreValues?.[module]?.programStage,
        ...dataStoreValues?.[module],
        ...dataStoreValues?.[module]?.statusOptions?.reduce(
            (acc: any, x: any) => ({ ...acc, [x?.configKey]: x?.code }),
            {}
        )
    }
}

const transferPostBody = (formValues: any, prevDataStore: any) => {
    const { approvedCode, penddingCode, reprovedCode } = formValues

    return {
        ...prevDataStore,
        [formValues?.module]: {
            enabled: true,
            status: formValues.status,
            originSchool: formValues.originSchool,
            destinySchool: formValues.destinySchool,
            programStage: formValues.programStageTransfer,
            lastUpdate: new Date().toISOString(),
            statusOptions: [
                ...(approvedCode
                    ? [
                        {
                            code: approvedCode,
                            configKey: 'approvedCode',
                            key: approvedCode?.toLowerCase()
                        }
                    ]
                    : []),
                ...(penddingCode
                    ? [
                        {
                            code: penddingCode,
                            configKey: 'penddingCode',
                            key: penddingCode?.toLowerCase()
                        }
                    ]
                    : []),
                ...(reprovedCode
                    ? [
                        {
                            code: reprovedCode,
                            configKey: 'reprovedCode',
                            key: reprovedCode?.toLowerCase()
                        }
                    ]
                    : [])
            ]
        }
    }
}

const performanceBodyToForm = (dataStoreValues: any, module: string) => {
    return {
        module: module,
        program: dataStoreValues?.program,
        programStages: dataStoreValues?.[module]?.programStages?.map((x: any) => x.programStage),
        gradeOptionSet: dataStoreValues?.[module]?.gradeMapping?.gradeOptionSet ?? null,
        subjects: dataStoreValues?.[module]?.subjects ?? [],
        gradeRanges: dataStoreValues?.[module]?.gradeMapping?.ranges ?? [],
        maxSubjectScore: dataStoreValues?.[module]?.maxSubjectScore ?? 100,
        termRemarksDataElement: dataStoreValues?.[module]?.termRemarksMapping?.dataElement ?? '',
        termRemarksRanges: dataStoreValues?.[module]?.termRemarksMapping?.ranges ?? [],
        standardGroupOptionSet: dataStoreValues?.[module]?.standardGroupMapping?.standardGroupOptionSet ?? null,
        standardGroups: dataStoreValues?.[module]?.standardGroupMapping?.groups ?? []
    }
}

const performancePostBody = (formValues: any) => {
    return {
        [formValues?.module]: {
            enabled: true,
            lastUpdate: new Date().toISOString(),
            programStages: formValues?.programStages?.map((e: string) => ({ programStage: e })),
            subjects: formValues?.subjects ?? [],
            gradeMapping: {
                gradeOptionSet: formValues?.gradeOptionSet ?? null,
                ranges: formValues?.gradeRanges ?? []
            },
            maxSubjectScore: formValues?.maxSubjectScore ?? 100,
            ...(formValues?.termRemarksDataElement ? {
                termRemarksMapping: {
                    dataElement: formValues.termRemarksDataElement,
                    optionSet: formValues.termRemarksOptSetId ?? '',
                    ranges: formValues?.termRemarksRanges ?? []
                }
            } : {}),
            ...(formValues?.standardGroupOptionSet ? {
                standardGroupMapping: {
                    standardGroupOptionSet: formValues.standardGroupOptionSet,
                    groups: formValues?.standardGroups ?? []
                }
            } : {})
        }
    }
}

const admissionBodyToForm = (dataStoreValues: any, module: string) => {
    return {
        module: module,
        program: dataStoreValues?.program,
        ...dataStoreValues?.[module]
    }
}

const admissionPostBody = (formValues: any) => {
    return {
        [formValues?.module]: {
            enabled: formValues?.enabled ?? true,
            admissionDate: formValues?.admissionDate,
            studentIdentifier: formValues?.studentIdentifier,
            replaceIdentifierYearPrefix: formValues?.replaceIdentifierYearPrefix === 'true' || formValues?.replaceIdentifierYearPrefix === true,
            lastUpdate: new Date().toISOString()
        }
    }
}

const modulePostBody = (formValues: any, program: any, prevData: DataStoreConfigType[], config: any): any => {
    const prevDataStore = prevData
    const selectedDataStoreKey = prevData?.find((x: any) => x.program == program.id)
    const selectedDataStoreKeyIndex = prevData?.findIndex((x: any) => x.program == program.id)

    const returnBody = (data: any) => {
        if (selectedDataStoreKeyIndex >= 0) {
            const updated = [...prevDataStore]
            updated[selectedDataStoreKeyIndex] = { ...selectedDataStoreKey, ...data }
            return updated
        } else {
            return prevDataStore?.concat(data)
        }
    }

    switch (formValues?.module) {
        case 'registration':
            return returnBody(registrationPostBody(formValues, program, config))

        case 'final-result':
            return returnBody(finalResultPostBody(formValues))

        case 'attendance':
            return returnBody(attendancePostBody(formValues))

        case 'transfer':
            return returnBody(transferPostBody(formValues, selectedDataStoreKey))

        case 'performance':
            return returnBody(performancePostBody(formValues))

        case 'admission':
            return returnBody(admissionPostBody(formValues))

        default:
            return {}
    }
}

const moduleBodyToForm = (dataStoreValues: any, module: string) => {
    switch (module) {
        case 'registration':
            return registrationBodyToForm(dataStoreValues, module)

        case 'final-result':
            return finalResultBodyToForm(dataStoreValues, module)

        case 'attendance':
            return attendance(dataStoreValues, module)

        case 'transfer':
            return transferBodyToForm(dataStoreValues, module)

        case 'performance':
            return performanceBodyToForm(dataStoreValues, module)

        case 'admission':
            return admissionBodyToForm(dataStoreValues, module)

        default:
            return {}
    }
}

export { modulePostBody, moduleBodyToForm }
