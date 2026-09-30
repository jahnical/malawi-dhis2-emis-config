import React, { useEffect, useState } from 'react'
import {
    Box, Button, MenuItem, Select, Table, TableBody, TableCell,
    TableHead, TableRow, Typography, FormControl, Paper, CircularProgress, Checkbox, ListItemText
} from '@mui/material'
import { StandardGroup } from '../../types/dataStore/dataStoreConfigType'
import { useGetOptionSetOptions } from '../../hooks/optionSets/useGetOptionSets'
import { ConfirmDialog } from '../../../../../components/alert/ConfirmDialog'

interface PickableSubject {
    id: string
    displayName: string
}

interface StandardGroupsTableProps {
    standardGroupOptionSetId: string | null
    standardsOptionSetId: string | null
    pickableSubjects: PickableSubject[]
    value: StandardGroup[]
    onChange: (rows: StandardGroup[]) => void
}

function StandardGroupsTable({ standardGroupOptionSetId, standardsOptionSetId, pickableSubjects, value, onChange }: StandardGroupsTableProps) {
    const { options: groupOptions, loading: loadingGroups, fetchOptions: fetchGroupOptions } = useGetOptionSetOptions(standardGroupOptionSetId)
    const { options: standardOptions, loading: loadingStandards, fetchOptions: fetchStandardOptions } = useGetOptionSetOptions(standardsOptionSetId)
    const [pendingRemoveIndex, setPendingRemoveIndex] = useState<number | null>(null)

    useEffect(() => {
        if (standardGroupOptionSetId) fetchGroupOptions(standardGroupOptionSetId)
    }, [standardGroupOptionSetId])

    useEffect(() => {
        if (standardsOptionSetId) fetchStandardOptions(standardsOptionSetId)
    }, [standardsOptionSetId])

    const addRow = () => {
        onChange([...value, { optionCode: '', standards: [], subjects: [] }])
    }

    const removeRow = (index: number) => {
        onChange(value.filter((_, i) => i !== index))
    }

    const updateRow = (index: number, field: keyof StandardGroup, newValue: string | string[]) => {
        const updated = value.map((row, i) =>
            i === index ? { ...row, [field]: newValue } : row
        )
        onChange(updated)
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Standard Groups
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Group Standards (e.g. Junior/Middle/Senior) and pick which subjects apply to each
                group. Subjects marked "Universal" above always apply to every group and don't
                need to be picked here. Select a Standard Group Option Set above first.
            </Typography>

            {!standardGroupOptionSetId && (
                <Typography variant="body2" color="warning.main" sx={{ mb: 1 }}>
                    Select a Standard Group Option Set above to populate this table.
                </Typography>
            )}

            <Paper variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Group</strong></TableCell>
                            <TableCell><strong>Standards</strong></TableCell>
                            <TableCell><strong>Subjects</strong></TableCell>
                            <TableCell width={80} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {value.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 2 }}>
                                    No groups configured. Click "Add Row" to begin.
                                </TableCell>
                            </TableRow>
                        )}
                        {value.map((row, index) => {
                            const usedCodes = value
                                .filter((_, i) => i !== index)
                                .map(r => r.optionCode)
                                .filter(Boolean)
                            const availableGroupOptions = groupOptions.filter(opt => !usedCodes.includes(opt.code))

                            return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={row.optionCode}
                                                onChange={e => updateRow(index, 'optionCode', e.target.value)}
                                                displayEmpty
                                                disabled={loadingGroups}
                                            >
                                                <MenuItem value=""><em>— Select group —</em></MenuItem>
                                                {availableGroupOptions.map(opt => (
                                                    <MenuItem key={opt.id} value={opt.code}>
                                                        {opt.displayName} ({opt.code})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {loadingGroups && <CircularProgress size={14} sx={{ ml: 1 }} />}
                                    </TableCell>
                                    <TableCell>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                multiple
                                                value={row.standards ?? []}
                                                onChange={e => updateRow(index, 'standards', e.target.value as string[])}
                                                renderValue={(selected) => (selected as string[]).join(', ')}
                                                displayEmpty
                                                disabled={loadingStandards}
                                            >
                                                {standardOptions.map(opt => (
                                                    <MenuItem key={opt.id} value={opt.code}>
                                                        <Checkbox checked={(row.standards ?? []).includes(opt.code)} />
                                                        <ListItemText primary={opt.displayName} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {loadingStandards && <CircularProgress size={14} sx={{ ml: 1 }} />}
                                    </TableCell>
                                    <TableCell>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                multiple
                                                value={row.subjects ?? []}
                                                onChange={e => updateRow(index, 'subjects', e.target.value as string[])}
                                                renderValue={(selected) => (selected as string[])
                                                    .map(id => pickableSubjects.find(s => s.id === id)?.displayName ?? id)
                                                    .join(', ')}
                                                displayEmpty
                                            >
                                                {pickableSubjects.map(subject => (
                                                    <MenuItem key={subject.id} value={subject.id}>
                                                        <Checkbox checked={(row.subjects ?? []).includes(subject.id)} />
                                                        <ListItemText primary={subject.displayName} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => setPendingRemoveIndex(index)}
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Paper>
            <Box sx={{ mt: 1 }}>
                <Button variant="outlined" size="small" onClick={addRow} disabled={!standardGroupOptionSetId}>
                    + Add Row
                </Button>
            </Box>
            <ConfirmDialog
                open={pendingRemoveIndex !== null}
                message="Are you sure you want to remove this standard group?"
                onConfirm={() => {
                    if (pendingRemoveIndex !== null) removeRow(pendingRemoveIndex)
                    setPendingRemoveIndex(null)
                }}
                onCancel={() => setPendingRemoveIndex(null)}
            />
        </Box>
    )
}

export default StandardGroupsTable
