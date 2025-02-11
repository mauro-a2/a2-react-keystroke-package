import { IA2DefaultResults, IA2CompareResults, IA2SummaryResults, IA2TrendsResults } from "./IA2ApiResponse";

export interface IKeystrokeResult {
    data?:      IA2DefaultResults | IA2CompareResults | IA2SummaryResults | IA2TrendsResults;
    error?:     string;
    message?:   string;
}