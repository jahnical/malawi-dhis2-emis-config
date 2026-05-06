import React from 'react'
import { D2I18n } from "dhis2-semis-types"

interface ModalContentInterface {
    formFields: any
    loading: boolean
    onCancel: () => void
    onSubmit: (arg: any) => void
    initialValues?: Record<string, any>
    setTrackedValues?: (value: any) => void
    extraContent?: React.ReactNode
    extraContentChanged?: boolean
}

interface ModalManagerInterface {
    open: boolean;
    formFields?: any;
    setOpen: (arg: boolean) => void;
    initialValues?: Record<string, any>
    i18n: D2I18n 
}

export type { ModalContentInterface, ModalManagerInterface }