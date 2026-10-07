// Checks a grade or term-remark range table before it is saved. A range saved without its option
// (for example 80-100 with no grade picked) gives an empty grade on screen, in the template and on
// import, so the configuration must not be saved like that.

type Range = { optionCode?: string } & Record<string, any>

export function rangeProblems(ranges: Range[], minKey: string, maxKey: string, label: string): string[] {
    const problems: string[] = []
    ranges.forEach((r, i) => {
        const min = Number(r?.[minKey]), max = Number(r?.[maxKey])
        const name = `${label} row ${i + 1} (${r?.[minKey]}-${r?.[maxKey]})`
        if (!r?.optionCode) problems.push(`${name}: no option selected`)
        if (Number.isFinite(min) && Number.isFinite(max) && min > max) problems.push(`${name}: minimum is above maximum`)
    })
    const sorted = ranges.map((r, i) => ({ i, min: Number(r?.[minKey]), max: Number(r?.[maxKey]) })).sort((a, b) => a.min - b.min)
    for (let k = 1; k < sorted.length; k++) {
        if (sorted[k].min <= sorted[k - 1].max) problems.push(`${label} rows ${sorted[k - 1].i + 1} and ${sorted[k].i + 1} overlap`)
    }
    return problems
}
