type ConfigField = {
    filter: string;
    hint: string;
    inputType: string;
    label: string;
    resource: string;
    order?: number;
    valueType?: string;
    optionSetValue?: boolean;
};

type ProgramStageField = Omit<ConfigField, 'valueType' | 'optionSetValue'>;

type FieldGroup = Record<string, ConfigField | ProgramStageField>;

type attendance = FieldGroup & { attendanceStatus: FieldGroup };

type PerformanceSubjectMapping = {
    scoreDataElement: string;
    gradeDataElement: string;
};

type GradeRange = {
    optionCode: string;
    minScore: number;
    maxScore: number;
};

type PerformanceGradeMapping = {
    gradeOptionSet: string;
    ranges: GradeRange[];
};

type PerformanceConfig = FieldGroup & {
    subjects?: PerformanceSubjectMapping[];
    gradeMapping?: PerformanceGradeMapping;
};

type DataStoreConfigType = {
    key: string;
    lastUpdate: string;
    admission?: FieldGroup;
    attendance?: attendance;
    "final-result"?: FieldGroup;
    performance?: PerformanceConfig;
    program?: FieldGroup;
    registration?: FieldGroup;
    "socio-economics"?: FieldGroup;
    transfer?: FieldGroup;
    defaults?: FieldGroup;
};


export type { DataStoreConfigType, PerformanceSubjectMapping, GradeRange, PerformanceGradeMapping, PerformanceConfig }