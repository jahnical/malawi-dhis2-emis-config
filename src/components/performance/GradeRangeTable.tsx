import React, { useEffect, useState } from 'react'
import {
    Box, Button, MenuItem, Select, Table, TableBody, TableCell,
    TableHead, TableRow, TextField, Typography, FormControl, Paper, CircularProgress
} from '@mui/material'
import { GradeRange } from '../../types/dataStore/dataStoreConfigType'
import { useGetOptionSetOptions } from '../../hooks/optionSets/useGetOptionSets'
import { ConfirmDialog } from '../../../../../components/alert/ConfirmDialog'

interface GradeRangeTableProps {
    gradeOptionSetId: string | null
    value: GradeRange[]
    onChange: (rows: GradeRange[]) => void
}

function GradeRangeTable({ gradeOptionSetId, value, onChange }: GradeRangeTableProps) {
    const { options, loading, fetchOptions } = useGetOptionSetOptions(gradeOptionSetId)
    const [pendingRemoveIndex, setPendingRemoveIndex] = useState<number | null>(null)

    useEffect(() => {
        if (gradeOptionSetId) {
            fetchOptions(gradeOptionSetId)
        }
    }, [gradeOptionSetId])

    const addRow = () => {
        onChange([...value, { optionCode: '', minScore: 0, maxScore: 100 }])
    }

    const removeRow = (index: number) => {
        onChange(value.filter((_, i) => i !== index))
    }

    const updateRow = (index: number, field: keyof GradeRange, newValue: string | number) => {
        const updated = value.map((row, i) =>
            i === index ? { ...row, [field]: newValue } : row
        )
        onChange(updated)
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Grade Score Ranges
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Define the score range (inclusive) that maps to each grade option.
                Select a Grade Option Set above first.
            </Typography>

            {!gradeOptionSetId && (
                <Typography variant="body2" color="warning.main" sx={{ mb: 1 }}>
                    Select a Grade Option Set above to populate the grade options list.
                </Typography>
            )}

            <Paper variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Grade Option</strong></TableCell>
                            <TableCell><strong>Min Score</strong></TableCell>
                            <TableCell><strong>Max Score</strong></TableCell>
                            <TableCell width={80} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {value.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 2 }}>
                                    No ranges configured. Click "Add Row" to begin.
                                </TableCell>
                            </TableRow>
                        )}
                        {value.map((row, index) => {
                            const usedCodes = value
                                .filter((_, i) => i !== index)
                                .map(r => r.optionCode)
                                .filter(Boolean)
                            const availableOptions = options.filter(opt => !usedCodes.includes(opt.code))

                            return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={row.optionCode}
                                                onChange={e => updateRow(index, 'optionCode', e.target.value)}
                                                displayEmpty
                                                disabled={loading}
                                            >
                                                <MenuItem value=""><em>— Select grade —</em></MenuItem>
                                                {availableOptions.map(opt => (
                                                    <MenuItem key={opt.id} value={opt.code}>
                                                        {opt.displayName} ({opt.code})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {loading && <CircularProgress size={14} sx={{ ml: 1 }} />}
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={row.minScore}
                                            onChange={e => updateRow(index, 'minScore', parseFloat(e.target.value) || 0)}
                                            inputProps={{ step: 0.5, min: 0 }}
                                            sx={{ width: 100 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={row.maxScore}
                                            onChange={e => updateRow(index, 'maxScore', parseFloat(e.target.value) || 0)}
                                            inputProps={{ step: 0.5, min: 0 }}
                                            sx={{ width: 100 }}
                                        />
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
                <Button variant="outlined" size="small" onClick={addRow} disabled={!gradeOptionSetId}>
                    + Add Row
                </Button>
            </Box>
            <ConfirmDialog
                open={pendingRemoveIndex !== null}
                message="Are you sure you want to remove this grade range?"
                onConfirm={() => {
                    if (pendingRemoveIndex !== null) removeRow(pendingRemoveIndex)
                    setPendingRemoveIndex(null)
                }}
                onCancel={() => setPendingRemoveIndex(null)}
            />
        </Box>
    )
}

export default GradeRangeTable
