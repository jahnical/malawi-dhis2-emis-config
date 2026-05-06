import { useShowAlerts } from "dhis2-semis-functions"
import { type FetchError, useDataQuery } from "@dhis2/app-runtime"

const listQuery: any = {
    optionSets: {
        resource: "optionSets",
        params: {
            fields: ['id', 'displayName'],
            paging: false
        }
    }
}

const optionsQuery: any = {
    optionSet: {
        resource: "optionSets",
        id: ({ id }: { id: string }) => id,
        params: {
            fields: ['id', 'displayName', 'options[id,displayName,code]']
        }
    }
}

export function useGetOptionSets() {
    const { show, hide } = useShowAlerts()
    const { data, loading, error } = useDataQuery<any>(listQuery, {
        onError: (error: FetchError) => {
            show({ message: `Can't load option sets: ${error.message}`, type: { critical: true } })
            setTimeout(hide, 5000)
        }
    })

    return {
        optionSets: (data?.optionSets?.optionSets ?? []) as { id: string; displayName: string }[],
        loading,
        error
    }
}

export function useGetOptionSetOptions(optionSetId: string | null) {
    const { show, hide } = useShowAlerts()
    const { data, refetch, loading, error } = useDataQuery<any>(optionsQuery, {
        lazy: !optionSetId,
        variables: optionSetId ? { id: optionSetId } : undefined,
        onError: (error: FetchError) => {
            show({ message: `Can't load option set options: ${error.message}`, type: { critical: true } })
            setTimeout(hide, 5000)
        }
    })

    const fetchOptions = async (id: string) => {
        try {
            await refetch({ id })
        } catch (err: any) {
            show({ message: `Can't load option set options: ${err.message}`, type: { critical: true } })
            setTimeout(hide, 5000)
        }
    }

    return {
        options: (data?.optionSet?.options ?? []) as { id: string; displayName: string; code: string }[],
        loading,
        error,
        fetchOptions
    }
}