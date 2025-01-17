import { IA2ChatbotResults } from "./IA2ApiResponse";

export interface IKeystrokeResult {
    data?:      IA2ChatbotResults;
    error?:     string;
    message?:   string;
}