import { rangeProblems } from "./validateRanges"

test("a range without an option, an inverted range and overlaps are reported", () => {
    const ranges = [
        { optionCode: "L1", minScore: 0, maxScore: 39.99 },
        { optionCode: "L2", minScore: 40, maxScore: 59.99 },
        { optionCode: "L3", minScore: 60, maxScore: 79.99 },
        { optionCode: "", minScore: 80, maxScore: 100 },
    ]
    expect(rangeProblems(ranges, "minScore", "maxScore", "Grade range")).toEqual(["Grade range row 4 (80-100): no option selected"])
    expect(rangeProblems([{ optionCode: "A", minScore: 90, maxScore: 80 }], "minScore", "maxScore", "Grade range"))
        .toEqual(["Grade range row 1 (90-80): minimum is above maximum"])
    expect(rangeProblems([{ optionCode: "A", minScore: 80, maxScore: 100 }, { optionCode: "B", minScore: 70, maxScore: 85 }], "minScore", "maxScore", "Grade range"))
        .toEqual(["Grade range rows 2 and 1 overlap"])
    expect(rangeProblems(ranges.slice(0, 3), "minScore", "maxScore", "Grade range")).toEqual([])
})
