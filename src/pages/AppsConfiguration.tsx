import { Switch } from '@dhis2/ui';
import { Box, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Settings from '@mui/icons-material/Settings';
import { useUrlParams } from 'dhis2-semis-functions';
import { DashboardCard, DataStoreState, WithPadding, useGetDataStore as useDataStore, useSchoolCalendarKey } from 'dhis2-semis-components';
import DashboardLayout from '../components/dashboard/dashboardLayout';
import ModalManager from '../components/saveConfiguration/ModalManager';
import { dashboardData } from '../utils/constants/dashboard/dashboardData';
import InfoIcon from '@mui/icons-material/Info';
import { useRecoilValue } from 'recoil';
import usePostDataStore from '../hooks/dataStore/usePostDataStore';
import useGetDataStore from '../hooks/dataStore/useGetDataStore';
import { moduleBodyToForm } from '../utils/form/formatters/formatDataStoreValues';
import { getDataStoreSection, isModuleConfigured, isModuleEnabled } from '../utils/dataStore/common';
import { hasNullOrUndefined } from '../utils/valuesFormatter/valuesFormatter';
import { D2I18n } from 'dhis2-semis-types';
import useShowAlerts from '../hooks/alert/useShowAlert';

const AppsConfiguration = ({ i18n }: { i18n: D2I18n }) => {
  const { add, useQuery } = useUrlParams();
  const name = useQuery.get("name")
  const module = useQuery.get("module")
  const section = useQuery.get("section")
  const schoolCalendarKeys = useSchoolCalendarKey()
  const [initialValues, setInitialValues] = useState({});
  const { createDataStore } = usePostDataStore()
  const dataStore: any = useRecoilValue(DataStoreState)
  const { refetch } = useGetDataStore(true)
  const [loading, setLoading] = useState<any>({})
  const { getDataStore } = useDataStore()
  const [open, setOpen] = useState(Boolean(name && module && section));
  const { show } = useShowAlerts()

  useEffect(() => {
    if (open) {
      const moduleInitialValues = moduleBodyToForm(getDataStoreSection(section!, dataStore), module ?? "")
      const initialValues = {
        module: module, key: section!.toLocaleLowerCase(),
        ...moduleInitialValues
      }
      setInitialValues(() => initialValues)
      handleConfiguration({ module: module!, section: section!, label: name! })
    }
  }, [open])

  const handleConfiguration = ({ module, section, label }: { module: string, section: string, label: string }) => {
    add("name", label)
    add("module", module)
    add("section", section.toLocaleLowerCase())
    setOpen(true)
  }

  const onModuleEnable = (e: any, section: string, label: string, key: string) => {
    const updated = dataStore.map((itemSection: any) =>
      itemSection.key === section?.toLowerCase()
        ? {
          ...itemSection,
          [key]: {
            ...itemSection[key],
            enabled: e?.checked,
          }
        }
        : itemSection
    )

    setLoading({ [key + section]: true })
    createDataStore({
      data: updated,
      key: 'dataStore/semis/values',
    }).then(() => {
      refetch().then(async () => {
        await getDataStore('dataStore/semis/values').then(() => {
          setLoading({ [key + section]: false })
          if (e?.checked) {
            show({
              message: i18n.t('{{section}} {{key}} enabled successfully', {
                section: i18n.t(section),
                key: i18n.t(key)
              }), type: { success: true }
            })
          } else {
            show({
              message: i18n.t('{{section}} {{key}} disabled successfully', {
                section: i18n.t(section),
                key: i18n.t(key)
              }), type: { success: true }
            })
          }
        })
      })
    })
  }


  const makeAction = ({ module, section, label, registrationLabel, configurable }: { configurable: boolean, module: string, section: string, label: string, registrationLabel: string }) => {
    const formatedLabel = label.replace("-", " ")

    return ([
      ...(module == "registration" ? [{
        label: i18n.t("This module contain general configuration and it's required for semis to work properly"),
        icon: <InfoIcon style={{ color: "orange" }} />,
      }] : [{}]),
      ...(configurable ? [{
        label: (module == "registration" || isModuleConfigured(section, dataStore, "registration"))
          ? i18n.t('Configure {{label}}', {
            label: i18n.t(formatedLabel),
          })
          : i18n.t('Cannot configure {{label}} before configuring {{registrationLabel}}', {
            label: i18n.t(formatedLabel),
            registrationLabel: i18n.t(registrationLabel)
          }),
        icon: <Settings />,
        disabled: module == "registration" ? false : !isModuleConfigured(section, dataStore, "registration"),
        onAction: () => {
          const initialValues = {
            module: module, key: section.toLocaleLowerCase(),
            ...moduleBodyToForm(getDataStoreSection(section, dataStore), module ?? "")
          }
          setInitialValues(() => initialValues)
          handleConfiguration({ module, section, label })
        },
      }] : []),
      {
        label: !hasNullOrUndefined(isModuleConfigured(section, dataStore, module)) ? `${isModuleEnabled(section, module, dataStore) ? i18n.t('Disable') : i18n.t('Enable')} ${label.replace("-", " ")}` : i18n.t(`You must configure this module first to enable it`),
        icon: (loading?.[module + section]) ? <CircularProgress size={20} /> :
          <Switch
            disabled={hasNullOrUndefined(isModuleConfigured(section, dataStore, module)) || !isModuleConfigured(section, dataStore, module)}
            className="custom-switch-config"
            name={`${section}-${label}`}
            checked={isModuleEnabled(section, module, dataStore)}
            onChange={(e: any) => onModuleEnable(e, section, label, module)}
          />
      }
    ])
  };

  return (
    <Box>
      <WithPadding p="1rem">
        {
          dashboardData(i18n)?.map(({ title, section, cards }) => {
            return (
              <DashboardLayout title={i18n.t('{{section}}', { section: i18n.t(title) })} >
                {
                  cards.map(({ key: module, label, icon, configurable }) => (
                    <DashboardCard
                      key={label}
                      icon={icon}
                      contents={[{ label }]}
                      actions={[...makeAction({ module, section, label, registrationLabel: cards[0]?.label, configurable })]}
                    />
                  ))
                }
              </DashboardLayout>
            )
          })
        }
        {open && <ModalManager i18n={i18n} open={open} setOpen={setOpen} initialValues={{ ...initialValues, academicYear: schoolCalendarKeys?.academicYear }} />}
      </WithPadding >
    </Box>
  )
}

export default AppsConfiguration