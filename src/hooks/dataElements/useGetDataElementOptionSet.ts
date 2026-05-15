import { useDataQuery } from "@dhis2/app-runtime"

const deQuery: any = {
    de: {
        resource: 'dataElements',
        id: ({ id }: { id: string }) => id,
        params: { fields: ['optionSet[id]'] }
    }
}

export function useGetDataElementOptionSet() {
    const { data, refetch, loading } = useDataQuery<any>(deQuery, { lazy: true })

    const fetchOptionSetId = async (deId: string) => {
        await refetch({ id: deId })
    }

    return {
        optionSetId: (data?.de?.optionSet?.id ?? null) as string | null,
        loading,
        fetchOptionSetId
    }
}