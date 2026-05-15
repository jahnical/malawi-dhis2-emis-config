import React, { useState } from 'react'
import {
    Box, Button, MenuItem, Select, Table, TableBody, TableCell,
    TableHead, TableRow, Typography, FormControl, Paper
} from '@mui/material'
import { PerformanceSubjectMapping } from '../../types/dataStore/dataStoreConfigType'
import { ConfirmDialog } from '../../../../../components/alert/ConfirmDialog'

export interface DataElementOption {
    id: string
    displayName: string
    optionSetValue?: boolean
}

interface SubjectMappingTableProps {
    allDataElements: DataElementOption[]
    gradeOptionSetId: string | null
    value: PerformanceSubjectMapping[]
    onChange: (rows: PerformanceSubjectMapping[]) => void
}

function SubjectMappingTable({ allDataElements, gradeOptionSetId, value, onChange }: SubjectMappingTableProps) {
    const scoreDEs = allDataElements.filter(de => !de.optionSetValue)
    const gradeDEs = allDataElements.filter(de => de.optionSetValue)
    const [pendingRemoveIndex, setPendingRemoveIndex] = useState<number | null>(null)

    const addRow = () => {
        onChange([...value, { scoreDataElement: '', gradeDataElement: '' }])
    }

    const removeRow = (index: number) => {
        const updated = value.filter((_, i) => i !== index)
        onChange(updated)
    }

    const updateRow = (index: number, field: keyof PerformanceSubjectMapping, newValue: string) => {
        const updated = value.map((row, i) =>
            i === index ? { ...row, [field]: newValue } : row
        )
        onChange(updated)
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Subject → Grade Data Element Mapping
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Map each score data element to its corresponding grade data element.
                Select program stages above first to populate the lists.
            </Typography>
            <Paper variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Score Data Element</strong></TableCell>
                            <TableCell><strong>Grade Data Element</strong></TableCell>
                            <TableCell width={80} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {value.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ color: 'text.secondary', py: 2 }}>
                                    No mappings configured. Click "Add Row" to begin.
                                </TableCell>
                            </TableRow>
                        )}
                        {value.map((row, index)=> {

                            const usedScoreDEs = value.filter((_, i) => i !== index).map(r => r.scoreDataElement).filter(Boolean)
                            const usedGradeDEs = value.filter((_, i) => i !== index).map(r => r.gradeDataElement).filter(Boolean)

                            const availableScoreDEs = allDataElements
                              .filter(de =>
                                !usedScoreDEs.includes(de.id) &&
                                !usedGradeDEs.includes(de.id) &&
                                de.id !== row.gradeDataElement
                              )
                            const availableGradeDEs = allDataElements
                              .filter(de =>
                                !usedScoreDEs.includes(de.id) &&
                                !usedGradeDEs.includes(de.id)
                                && de.id !== row.scoreDataElement
                              )
                            /**
                             * TODO(): Use the code below when the score de.optionset is working and test.
                             * const availableScoreDEs = scoreDEs.filter(de =>
                             *       !usedScoreDEs.includes(de.id) && de.id !== row.gradeDataElement
                             *   )
                             *   const availableGradeDEs = gradeDEs.filter(de =>
                             *       !usedGradeDEs.includes(de.id) && de.id !== row.scoreDataElement
                             *   )
                             *
                             *   And split the fallback into two so each column also excludes the opposite:
                             *   const fallbackForScore = allDataElements.filter(de =>
                             *       !usedScoreDEs.includes(de.id) && !usedGradeDEs.includes(de.id) && de.id !== row.gradeDataElement
                             *   )
                             *   const fallbackForGrade = allDataElements.filter(de =>
                             *       !usedScoreDEs.includes(de.id) && !usedGradeDEs.includes(de.id) && de.id !== row.scoreDataElement
                             *   )
                             *
                             *   // on the usage inside the score and grade des you should have something like
                             *   <Select
                             *      value={row.scoreDataElement}
                             *      onChange={e => updateRow(index, 'scoreDataElement', e.target.value)}
                             *      displayEmpty
                             *    >
                             *        <MenuItem value=""><em>— Select score DE —</em></MenuItem>
                             *        {availableScoreDEs.map(de => (
                             *          <MenuItem key={de.id} value={de.id}>{de.displayName}</MenuItem>
                             *        ))}
                             *        {availableScoreDEs.length === 0 && fallbackForScore.map(de => (
                             *          <MenuItem key={de.id} value={de.id}>{de.displayName}</MenuItem>
                             *        ))}
                             *
                             *    </Select>
                             *
                             *    same thing applies for the grade select.
                             * */

                            return (
                              <TableRow key={index}>
                                  <TableCell>
                                      <FormControl fullWidth size="small">
                                          <Select
                                            value={row.scoreDataElement}
                                            onChange={e => updateRow(index, 'scoreDataElement', e.target.value)}
                                            displayEmpty
                                          >
                                              <MenuItem value=""><em>— Select score DE —</em></MenuItem>
                                              {availableScoreDEs.map(de => (
                                                <MenuItem key={de.id} value={de.id}>{de.displayName}</MenuItem>
                                              ))}
                                          </Select>
                                      </FormControl>
                                  </TableCell>
                                  <TableCell>
                                      <FormControl fullWidth size="small">
                                          <Select
                                            value={row.gradeDataElement}
                                            onChange={e => updateRow(index, 'gradeDataElement', e.target.value)}
                                            displayEmpty
                                          >
                                              <MenuItem value=""><em>— Select grade DE —</em></MenuItem>
                                              {availableGradeDEs.map(de => (
                                                <MenuItem key={de.id} value={de.id}>{de.displayName}</MenuItem>
                                              ))}
                                          </Select>
                                      </FormControl>
                                  </TableCell>
                                  <TableCell>
                                      <Button size="small" color="error" onClick={() => setPendingRemoveIndex(index)}>
                                          Remove
                                      </Button>
                                  </TableCell>
                              </TableRow>
                              )
                          }
                        )}
                    </TableBody>
                </Table>
            </Paper>
            <Box sx={{ mt: 1 }}>
                <Button variant="outlined" size="small" onClick={addRow}>
                    + Add Row
                </Button>
            </Box>
            <ConfirmDialog
                open={pendingRemoveIndex !== null}
                message="Are you sure you want to remove this subject mapping?"
                onConfirm={() => {
                    if (pendingRemoveIndex !== null) removeRow(pendingRemoveIndex)
                    setPendingRemoveIndex(null)
                }}
                onCancel={() => setPendingRemoveIndex(null)}
            />
        </Box>
    )
}

export default SubjectMappingTable
