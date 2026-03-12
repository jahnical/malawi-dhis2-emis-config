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

type DataStoreConfigType = {
    key: string;
    lastUpdate: string;
    admission?: FieldGroup;
    attendance?: attendance;
    "final-result"?: FieldGroup;
    performance?: FieldGroup;
    program?: FieldGroup;
    registration?: FieldGroup;
    "socio-economics"?: FieldGroup;
    transfer?: FieldGroup;
    defaults?: FieldGroup;
};


export type { DataStoreConfigType }