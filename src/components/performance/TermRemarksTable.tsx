import React, { useEffect, useState } from 'react'
import {
    Box, Button, MenuItem, Select, Table, TableBody, TableCell,
    TableHead, TableRow, TextField, Typography, FormControl, Paper, CircularProgress
} from '@mui/material'
import { TermRemarkRange } from '../../types/dataStore/dataStoreConfigType'
import { useGetOptionSetOptions } from '../../hooks/optionSets/useGetOptionSets'
import { ConfirmDialog } from '../../../../../components/alert/ConfirmDialog'

interface TermRemarksTableProps {
    optionSetId: string | null
    value: TermRemarkRange[]
    onChange: (rows: TermRemarkRange[]) => void
}

function TermRemarksTable({ optionSetId, value, onChange }: TermRemarksTableProps) {
    const { options, loading, fetchOptions } = useGetOptionSetOptions(optionSetId)
    const [pendingRemoveIndex, setPendingRemoveIndex] = useState<number | null>(null)

    useEffect(() => {
        if (optionSetId) fetchOptions(optionSetId)
    }, [optionSetId])

    const addRow = () => {
        onChange([...value, { optionCode: '', minPercentage: 0, maxPercentage: 100 }])
    }

    const removeRow = (index: number) => {
        onChange(value.filter((_, i) => i !== index))
    }

    const updateRow = (index: number, field: keyof TermRemarkRange, newValue: string | number) => {
        onChange(value.map((row, i) => i === index ? { ...row, [field]: newValue } : row))
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Term Remarks Percentage Ranges
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Map each term remark option to a percentage range (0–100). The percentage is
                calculated as: (total score ÷ (subjects × max subject score)) × 100.
            </Typography>

            {!optionSetId && (
                <Typography variant="body2" color="warning.main" sx={{ mb: 1 }}>
                    Select a Term Remarks Data Element above to populate the options list.
                </Typography>
            )}

            <Paper variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Term Remark Option</strong></TableCell>
                            <TableCell><strong>Min %</strong></TableCell>
                            <TableCell><strong>Max %</strong></TableCell>
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
                                                <MenuItem value=""><em>— Select remark —</em></MenuItem>
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
                                            value={row.minPercentage}
                                            onChange={e => updateRow(index, 'minPercentage', parseFloat(e.target.value) || 0)}
                                            inputProps={{ step: 1, min: 0, max: 100 }}
                                            sx={{ width: 90 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={row.maxPercentage}
                                            onChange={e => updateRow(index, 'maxPercentage', parseFloat(e.target.value) || 0)}
                                            inputProps={{ step: 1, min: 0, max: 100 }}
                                            sx={{ width: 90 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button size="small" color="error" onClick={() => setPendingRemoveIndex(index)}>
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
                <Button variant="outlined" size="small" onClick={addRow} disabled={!optionSetId}>
                    + Add Row
                </Button>
            </Box>
            <ConfirmDialog
                open={pendingRemoveIndex !== null}
                message="Are you sure you want to remove this term remark range?"
                onConfirm={() => {
                    if (pendingRemoveIndex !== null) removeRow(pendingRemoveIndex)
                    setPendingRemoveIndex(null)
                }}
                onCancel={() => setPendingRemoveIndex(null)}
            />
        </Box>
    )
}

export default TermRemarksTable