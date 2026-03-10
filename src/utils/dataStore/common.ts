const isModuleConfigured = (section: string, dataStore: any[], key: string): boolean => {
  // Check if the section exists in the dataStore and if the module is configured
  if (!dataStore || !Array.isArray(dataStore)) return false;
  // Admission shares registration's configuration
  if (key === "admission") return isModuleConfigured(section, dataStore, "registration");
  const sectionData = dataStore?.find((item: any) => item?.key === section?.toLowerCase());
  return sectionData?.[key]?.programStage || sectionData?.[key]?.programStages?.some((x: any) => x.programStage);
}

const isModuleEnabled = (section: string, key: string, dataStore: any[]): boolean => {
  if (isModuleConfigured(section, dataStore, key)) {
    return dataStore?.find(item => item.key === section?.toLowerCase())?.[key]?.enabled
  }
  return false;
}

const getDataStoreSection = (section: string, dataStore: any[]) => {
  if (!dataStore || !Array.isArray(dataStore)) return null;
  return dataStore.find((item: any) => item?.key === section?.toLowerCase());
}

const getDataElements = (programStages: any[], programStage: string) => {
  const dataElements = programStages?.find((programStag) => {
    return programStag.id === programStage
  })?.programStageDataElements

  return dataElements
}

const getOptions = (dataElemnts: any[], dataElement: string) => {
  const found = dataElemnts?.find((item: any) => item?.dataElement?.id === dataElement);
  return found?.dataElement?.optionSet?.options || [];
}

export { isModuleConfigured, isModuleEnabled, getDataStoreSection, getDataElements, getOptions };