import { D2I18n } from "dhis2-semis-types";

export const config = (i18n: D2I18n) => [
    {
        admission: {
            admissionDate: {
                filter: 'valueType:eq:DATE',
                hint: i18n.t('Attribute of type date'),
                resource: 'attributes',
                inputType: 'LIST',
                label: i18n.t('Admission date'),
                order: 1,
                required: true,
                valueType: 'DATE'
            },
            studentIdentifier: {
                filter: '',
                hint: i18n.t('Attribute used as student identifier. If left empty by the user during admission, the system will auto-generate a value using the attribute pattern.'),
                resource: 'attributes',
                inputType: 'LIST',
                label: i18n.t('Student Identifier'),
                order: 2,
                required: false
            },
            academicYearAttribute: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('Attribute used to store the academic year a student is admitted into. Auto-filled from the selected academic year on admission.'),
                resource: 'attributes',
                inputType: 'LIST',
                label: i18n.t('Academic Year'),
                order: 3,
                required: false,
                valueType: 'TEXT'
            },
            replaceIdentifierYearPrefix: {
                inputType: 'BOOLEAN',
                label: i18n.t('Replace first 4 digits with the academic year'),
                hint: i18n.t('When enabled, the first 4 digits of a generated student identifier are replaced with the upper (later) year of the selected academic year.'),
                order: 4,
                required: false
            }
        },
        attendance: {
            absenceReason: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('Data Element with option sets'),
                inputType: 'LIST',
                label: i18n.t('Reason of absence'),
                optionSetValue: true,
                order: 3,
                required: false,
                resource: 'dataElements',
                valueType: 'TEXT'
            },
            attendanceStatus: {
                absentCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Absent Code'),
                    optionSetValue: true,
                    order: 2,
                    required: true,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                },
                lateCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Late Code'),
                    optionSetValue: true,
                    order: 3,
                    required: false,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                },
                leaveCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Leave Code'),
                    optionSetValue: true,
                    order: 4,
                    required: false,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                },
                presentCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Present Code'),
                    optionSetValue: true,
                    order: 1,
                    required: false,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                }
            },
            attendanceClassConfig: {
                allowClassAttendanceConfig: {
                    filter: 'valueType:eq:TEXT',
                    inputType: 'BOOLEAN',
                    label: i18n.t('Allow Attendance Status'),
                    optionSetValue: true,
                    order: 0,
                    resource: 'optionSets',
                    valueType: 'BOOLEAN'
                },
                programAttendanceClassConfig: {
                    hint: i18n.t('Event Program'),
                    inputType: 'LIST',
                    label: i18n.t('Attendance Class Config Program'),
                    order: 1,
                    required: false,
                    resource: 'programs'
                },
                programStageAttendanceClassConfig: {
                    hint: i18n.t('Non Repeatable Program Stage'),
                    inputType: 'LIST',
                    label: i18n.t('Attendance Class Config Program Stage'),
                    order: 2,
                    required: false,
                    resource: 'programStages'
                },
                attendaceClassConfigStatus: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('Data Element with option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Attendance Status'),
                    optionSetValue: true,
                    order: 3,
                    required: false,
                    resource: 'dataElements',
                    valueType: 'TEXT'
                }
            },
            programStageAttendance: {
                filter: 'repeatable:eq:true',
                hint: i18n.t('Repeatable Program Stage'),
                inputType: 'LIST',
                label: i18n.t('Attendance Program Stage'),
                order: 1,
                required: true,
                resource: 'programStages'
            },
            status: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('Data Element with option sets'),
                inputType: 'LIST',
                label: i18n.t('Attendance Status'),
                optionSetValue: true,
                order: 2,
                required: true,
                resource: 'dataElements',
                valueType: 'TEXT'
            }
        },
        defaults: {
            allowSearching: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('option sets'),
                inputType: 'BOOLEAN',
                label: i18n.t('Allow Searching'),
                optionSetValue: true,
                order: 3,
                resource: 'optionSets',
                valueType: 'BOOLEAN'
            },
            defaultOrder: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('option sets'),
                inputType: 'LIST',
                label: i18n.t('Default order by'),
                optionSetValue: true,
                order: 0,
                resource: 'attributes',
                valueType: 'BOOLEAN'
            },
            orderType: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('option sets'),
                inputType: 'LIST',
                label: i18n.t('Order as'),
                optionSetValue: true,
                options: [
                    {
                        label: i18n.t('asc'),
                        value: 'asc'
                    },
                    {
                        label: i18n.t('desc'),
                        value: 'desc'
                    }
                ],
                order: 1,
                resource: 'custom',
                valueType: 'BOOLEAN'
            }
        },
        'final-result': {
            programStageFinalResult: {
                filter: 'repeatable:eq:false',
                hint: i18n.t('Non-Repeatable Program Stage'),
                inputType: 'LIST',
                label: i18n.t('Final Result Program Stage'),
                order: 0,
                resource: 'programStages'
            },
            status: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('Data Element'),
                inputType: 'LIST',
                label: i18n.t('Final result status'),
                optionSetValue: false,
                order: 1,
                resource: 'dataElements',
                valueType: 'TEXT'
            },
            finalResultStatus: {
                programStages: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('List of final result status that allows student promotion'),
                    inputType: 'MULTI_SELECT',
                    label: i18n.t('Promotable Status'),
                    order: 0,
                    resource: 'optionSets'
                },
                dropout: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('List of final result status that allows student dropout'),
                    inputType: 'MULTI_SELECT',
                    label: i18n.t('Dropout Status'),
                    order: 1,
                    resource: 'optionSets'
                },
            }
        },
        key: 'student',
        lastUpdate: '2022-01-01',
        performance: {
            programStages: {
                filter: 'repeatable:eq:false',
                hint: i18n.t('Allow multi selection of program stage'),
                inputType: 'MULTI_SELECT',
                label: i18n.t('Performance/marks Program Stages'),
                resource: 'programStages',
                order: 0
            },
            gradeOptionSet: {
                hint: i18n.t('The shared option set used for grading across all subjects'),
                inputType: 'LIST',
                label: i18n.t('Grade Option Set'),
                order: 1,
                required: true,
                resource: 'optionSets'
            }
        },
        program: {
            program: {
                filter: '',
                hint: i18n.t('Tracker Program'),
                inputType: 'LIST',
                label: i18n.t('Student Program'),
                resource: 'programs'
            }
        },
        registration: {
            academicYear: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('Data Element with Option Sets'),
                inputType: 'LIST',
                label: i18n.t('Academic Year'),
                optionSetValue: true,
                order: 1,
                resource: 'dataElements',
                valueType: 'TEXT'
            },
            grade: {
                dataFilter: true,
                filter: 'valueType:eq:TEXT',
                filterCode: 'grade',
                hint: i18n.t('Data Element with Option Sets'),
                inputType: 'LIST',
                label: i18n.t('Grade'),
                optionSetValue: true,
                order: 2,
                resource: 'dataElements',
                valueType: 'TEXT'
            },
            gradeName: {
                required: false,
                hint: i18n.t('The name that should appear in the global filters'),
                inputType: 'TEXT',
                label: i18n.t('Grade filter name'),
                optionSetValue: true,
                order: 2,
                valueType: 'TEXT'
            },
            programStageRegistration: {
                filter: 'repeatable:eq:false',
                hint: i18n.t('Non-repeatable ProgramStage'),
                inputType: 'LIST',
                label: i18n.t('Registration Program Stage'),
                order: 0,
                resource: 'programStages'
            },
            section: {
                dataFilter: true,
                filter: 'valueType:eq:TEXT',
                filterCode: 'class',
                hint: i18n.t('Data optionally with Option Sets'),
                inputType: 'LIST',
                label: i18n.t('Class/Section'),
                optionSetValue: true,
                order: 3,
                resource: 'dataElements',
                valueType: 'TEXT'
            },
            sectionName: {
                required: false,
                hint: i18n.t('The name that should appear in the global filters'),
                inputType: 'TEXT',
                label: i18n.t('Section filter name'),
                optionSetValue: true,
                order: 4,
                valueType: 'TEXT'
            }
        },
        'socio-economics': {
            programStageSocioEconomic: {
                filter: 'repeatable:eq:false',
                hint: i18n.t('Non-repeateable ProgramStage'),
                inputType: 'LIST',
                label: i18n.t('Socio-economics Program Stage'),
                order: 2,
                resource: 'programStages'
            }
        },
        transfer: {
            destinySchool: {
                filter: 'valueType:eq:ORGANISATION_UNIT',
                hint: i18n.t('Organisation Unit  Data Element'),
                inputType: 'LIST',
                label: i18n.t('Destiny School'),
                order: 2,
                resource: 'dataElements'
            },
            originSchool: {
                filter: 'valueType:eq:ORGANISATION_UNIT',
                hint: i18n.t('Organisation Unit  Data Element'),
                inputType: 'LIST',
                label: i18n.t('Origin School'),
                order: 1,
                resource: 'dataElements'
            },
            programStageTransfer: {
                filter: 'repeatable:eq:true',
                hint: i18n.t('Repeatable Program Stage'),
                inputType: 'LIST',
                label: i18n.t('Program Stage'),
                order: 0,
                resource: 'programStages'
            },
            status: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('Data Element'),
                inputType: 'LIST',
                label: i18n.t('Transfer Status'),
                optionSetValue: true,
                order: 3,
                resource: 'dataElements',
                valueType: 'TEXT'
            },
            transferStatus: {
                approvedCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Approved Code'),
                    optionSetValue: true,
                    order: 5,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                },
                penddingCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Pedding Code'),
                    optionSetValue: true,
                    order: 4,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                },
                reprovedCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Reproved Code'),
                    optionSetValue: true,
                    order: 6,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                }
            }
        }
    },
    {
        attendance: {
            absenceReason: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('Data Element with option sets'),
                inputType: 'LIST',
                label: i18n.t('Reason of absence'),
                optionSetValue: true,
                order: 3,
                required: false,
                resource: 'dataElements',
                valueType: 'TEXT'
            },
            attendanceStatus: {
                absentCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Absent Code'),
                    optionSetValue: true,
                    order: 2,
                    required: true,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                },
                lateCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Late Code'),
                    optionSetValue: true,
                    order: 3,
                    required: false,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                },
                leaveCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Leave Code'),
                    optionSetValue: true,
                    order: 4,
                    required: false,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                },
                presentCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Present Code'),
                    optionSetValue: true,
                    order: 1,
                    required: true,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                }
            },
            attendanceClassConfig: {
                allowClassAttendanceConfig: {
                    filter: 'valueType:eq:TEXT',
                    inputType: 'BOOLEAN',
                    label: i18n.t('Allow Attendance Status'),
                    optionSetValue: true,
                    order: 0,
                    resource: 'optionSets',
                    valueType: 'BOOLEAN'
                },
                programAttendanceClassConfig: {
                    hint: i18n.t('Event Program'),
                    inputType: 'LIST',
                    label: i18n.t('Attendance Class Config Program'),
                    order: 1,
                    required: true,
                    resource: 'programs'
                },
                programStageAttendanceClassConfig: {
                    hint: i18n.t('Non Repeatable Program Stage'),
                    inputType: 'LIST',
                    label: i18n.t('Attendance Class Config Program Stage'),
                    order: 1,
                    required: true,
                    resource: 'programStages'
                },
                attendaceClassConfigStatus: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('Data Element with option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Attendance Status'),
                    optionSetValue: true,
                    order: 2,
                    required: true,
                    resource: 'dataElements',
                    valueType: 'TEXT'
                }
            },
            programStageAttendance: {
                filter: 'repeatable:eq:true',
                hint: i18n.t('Repeatable Program Stage'),
                inputType: 'LIST',
                label: i18n.t('Attendance Program Stage'),
                order: 1,
                required: true,
                resource: 'programStages'
            },
            status: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('Data Element with option sets'),
                inputType: 'LIST',
                label: i18n.t('Attendance Status'),
                optionSetValue: true,
                order: 2,
                required: true,
                resource: 'dataElements',
                valueType: 'TEXT'
            }
        },
        defaults: {
            allowSearching: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('option sets'),
                inputType: 'BOOLEAN',
                label: i18n.t('Allow Searching'),
                optionSetValue: true,
                order: 3,
                resource: 'optionSets',
                valueType: 'BOOLEAN'
            },
            defaultOrder: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('option sets'),
                inputType: 'LIST',
                label: i18n.t('Default order by'),
                optionSetValue: true,
                order: 0,
                resource: 'attributes',
                valueType: 'BOOLEAN'
            },
            orderType: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('option sets'),
                inputType: 'LIST',
                label: i18n.t('Order as'),
                optionSetValue: true,
                options: [
                    {
                        label: i18n.t('asc'),
                        value: 'asc'
                    },
                    {
                        label: i18n.t('desc'),
                        value: 'desc'
                    }
                ],
                order: 1,
                resource: 'custom',
                valueType: 'BOOLEAN'
            }
        },
        'final-result': {
            programStageFinalResult: {
                filter: 'repeatable:eq:false',
                hint: i18n.t('Non-Repeatable Program Stage'),
                inputType: 'LIST',
                label: i18n.t('Final Result Program Stage'),
                order: 0,
                resource: 'programStages'
            },
            finalResultStatus: {
                programStages: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('List of final result status that allows staff promotion'),
                    inputType: 'MULTI_SELECT',
                    label: i18n.t('Promotable Status'),
                    resource: 'optionSets'
                }
            },
            status: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('Data Element'),
                inputType: 'LIST',
                label: i18n.t('Final result status'),
                optionSetValue: false,
                order: 1,
                resource: 'dataElements',
                valueType: 'TEXT'
            }
        },
        key: 'staff',
        lastUpdate: '2022-01-01',
        program: {
            program: {
                filter: '',
                hint: i18n.t('Tracker Program'),
                inputType: 'LIST',
                label: i18n.t('Staff Program'),
                resource: 'programs'
            }
        },
        registration: {
            academicYear: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('Data Element with Option Sets'),
                inputType: 'LIST',
                label: i18n.t('Academic Year'),
                optionSetValue: true,
                order: 1,
                resource: 'dataElements',
                valueType: 'TEXT'
            },
            employmentType: {
                dataFilter: true,
                filter: 'valueType:eq:TEXT',
                filterCode: 'grade',
                hint: i18n.t('Data optionally with Option Sets'),
                inputType: 'LIST',
                label: i18n.t('Employment type'),
                optionSetValue: true,
                order: 4,
                resource: 'dataElements',
                valueType: 'TEXT'
            },
            employmentTypeName: {
                required: false,
                hint: i18n.t('The name that should appear in the global filters'),
                inputType: 'TEXT',
                label: i18n.t('Employment type filter name'),
                optionSetValue: true,
                order: 5,
                valueType: 'TEXT'
            },
            programStageRegistration: {
                filter: 'repeatable:eq:true',
                hint: i18n.t('Repeatable ProgramStage'),
                inputType: 'LIST',
                label: i18n.t('Registration Program Stage'),
                order: 0,
                resource: 'programStages'
            },
            typeOfStaff: {
                dataFilter: true,
                filter: 'valueType:eq:TEXT',
                filterCode: 'class',
                hint: i18n.t('Data Element with Option Sets'),
                inputType: 'LIST',
                label: i18n.t('Type of staff'),
                optionSetValue: true,
                order: 2,
                resource: 'dataElements',
                valueType: 'TEXT'
            },
            typeOfStaffName: {
                required: false,
                hint: i18n.t('The name that should appear in the global filters'),
                inputType: 'TEXT',
                label: i18n.t('Type of staff filter name'),
                optionSetValue: true,
                order: 3,
                valueType: 'TEXT'
            }
        },
        'socio-economics': {
            programStageSocioEconomic: {
                filter: 'repeatable:eq:false',
                hint: i18n.t('Non-repeateable ProgramStage'),
                inputType: 'LIST',
                label: i18n.t('Socio-economics Program Stage'),
                order: 2,
                resource: 'programStages'
            }
        },
        transfer: {
            destinySchool: {
                filter: 'valueType:eq:ORGANISATION_UNIT',
                hint: i18n.t('Organisation Unit  Data Element'),
                inputType: 'LIST',
                label: i18n.t('Destiny School'),
                order: 1,
                resource: 'dataElements'
            },
            originSchool: {
                filter: 'valueType:eq:ORGANISATION_UNIT',
                hint: i18n.t('Organisation Unit  Data Element'),
                inputType: 'LIST',
                label: i18n.t('Origin School'),
                order: 1,
                resource: 'dataElements'
            },
            programStageTransfer: {
                filter: 'repeatable:eq:true',
                hint: i18n.t('Repeatable Program Stage'),
                inputType: 'LIST',
                label: i18n.t('Program Stage'),
                order: 0,
                resource: 'programStages'
            },
            status: {
                filter: 'valueType:eq:TEXT',
                hint: i18n.t('Data Element'),
                inputType: 'LIST',
                label: i18n.t('Transfer Status'),
                optionSetValue: true,
                order: 2,
                resource: 'dataElements',
                valueType: 'TEXT'
            },
            transferStatus: {
                approvedCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Approved Code'),
                    optionSetValue: true,
                    order: 1,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                },
                penddingCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Pedding Code'),
                    optionSetValue: true,
                    order: 1,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                },
                reprovedCode: {
                    filter: 'valueType:eq:TEXT',
                    hint: i18n.t('option sets'),
                    inputType: 'LIST',
                    label: i18n.t('Reproved Code'),
                    optionSetValue: true,
                    order: 1,
                    resource: 'optionSets',
                    valueType: 'TEXT'
                }
            }
        }
    }
];