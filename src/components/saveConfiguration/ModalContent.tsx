import React from 'react'
import { Form } from 'react-final-form';
import { ModalContentInterface } from '../../types/modal/ModalProps';
import { CustomForm, WithBorder, WithPadding } from 'dhis2-semis-components';
import { LinearProgress } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { ProgramLoaderState } from '../../atoms/getProgramLoaderSchema';

function ModalContent(props: ModalContentInterface) {
    const { formFields, onSubmit, onCancel, initialValues, loading, setTrackedValues, extraContent } = props;
    const loadingProgram = useRecoilValue<boolean>(ProgramLoaderState)

    return (
        <WithPadding>
            <WithBorder type='all'>
                <WithPadding>
                    {loadingProgram && <LinearProgress />}
                    <CustomForm
                        Form={Form}
                        loading={loading}
                        withButtons={true}
                        formFields={formFields}
                        setTrackedValues={setTrackedValues}
                        initialValues={initialValues}
                        onCancel={() => { onCancel() }}
                        trackedEntity={initialValues?.trackedEntity}
                        onFormSubtmit={(e: Record<string, any>) => { onSubmit(e) }}
                    />
                    {extraContent}
                </WithPadding>
            </WithBorder>
        </WithPadding>
    )
}
export default ModalContent