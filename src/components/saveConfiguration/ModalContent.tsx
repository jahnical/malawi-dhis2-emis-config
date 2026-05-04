import React, { useState } from 'react'
import { Form } from 'react-final-form';
import { ModalContentInterface } from '../../types/modal/ModalProps';
import { CustomForm, WithBorder, WithPadding } from 'dhis2-semis-components';
import { Button, LinearProgress } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { ProgramLoaderState } from '../../atoms/getProgramLoaderSchema';
import { ButtonStrip } from "@dhis2/ui";

function ModalContent(props: ModalContentInterface) {
    const { formFields, onSubmit, onCancel, initialValues, loading, setTrackedValues, extraContent } = props;
    const loadingProgram = useRecoilValue<boolean>(ProgramLoaderState)
    const [currentValues, setCurrentValues] = useState<Record<string, any>>(initialValues ?? {})

    const handleSetTrackedValues = (values: any)    => {
        setCurrentValues(values)
        setTrackedValues?.(values)
    }

    return (
        <WithPadding>
            <WithBorder type='all'>
                <WithPadding>
                    {loadingProgram && <LinearProgress />}
                    <CustomForm
                        Form={Form}
                        loading={loading}
                        withButtons={false}
                        formFields={formFields}
                        setTrackedValues={handleSetTrackedValues}
                        initialValues={initialValues}
                        onCancel={() => { onCancel() }}
                        trackedEntity={initialValues?.trackedEntity}
                        onFormSubtmit={(e: Record<string, any>) => { onSubmit(e) }}
                    />
                    {extraContent}
                    <ButtonStrip end>
                        <Button
                          onClick={() => { onCancel() }}
                          color="secondary"
                          disabled={!!loading}
                          variant={"outlined"}
                        >
                            Cancel
                        </Button>
                        <Button
                          onClick={() => { onSubmit(currentValues) }}
                          disabled={!!loading}
                          color="primary"
                          variant={"contained"}
                        >
                            Save
                        </Button>
                    </ButtonStrip>
                </WithPadding>
            </WithBorder>
        </WithPadding>
    )
}
export default ModalContent