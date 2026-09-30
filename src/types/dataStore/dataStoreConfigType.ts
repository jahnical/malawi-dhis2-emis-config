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
    universal?: boolean;
};

type StandardGroup = {
    optionCode: string;
    standards: string[];
    subjects: string[];
};

type StandardGroupMapping = {
    standardGroupOptionSet: string;
    groups: StandardGroup[];
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

type TermRemarkRange = {
    optionCode: string;
    minPercentage: number;
    maxPercentage: number;
};

type TermRemarksMapping = {
    dataElement: string;
    optionSet: string;
    ranges: TermRemarkRange[];
};

type PerformanceConfig = FieldGroup & {
    subjects?: PerformanceSubjectMapping[];
    gradeMapping?: PerformanceGradeMapping;
    maxSubjectScore?: number;
    termRemarksMapping?: TermRemarksMapping;
    standardGroupMapping?: StandardGroupMapping;
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


export type { DataStoreConfigType, PerformanceSubjectMapping, GradeRange, PerformanceGradeMapping, PerformanceConfig, TermRemarkRange, TermRemarksMapping, StandardGroup, StandardGroupMapping }