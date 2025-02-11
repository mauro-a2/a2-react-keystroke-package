
export interface IA2APIResponse {
    status:     'success' | 'error';
    results?:   IA2ApiResults;
    message?:   string;
    error?:     string;
}

export interface IA2ApiResults {
    // a2_chatbot?:   IA2ChatbotResults;
    // a2_extension?: IA2ExtensionResults;
    default?:       IA2DefaultResults;
    a2_compare?:    IA2CompareResults;
    a2_summary?:    IA2SummaryResults;
    a2_trends?:     IA2TrendsResults;
}

// export interface IA2ChatbotResults {
//     current_state:                IA2CurrentState;
//     daily_trends:                 IDailyTrends;
//     recommended_interaction_time: string;
//     timestamp:                    string;
//     weekly_trends:                IWeeklyTrends;
// }

export interface IA2CurrentState {
    behavioral:    number;
    cognitive:     number;
    fatigue_level: number;
    motor:         number;
    stress_level:  number;
}

export interface IDailyTrends {
    Afternoon: ITrend;
    Evening:   ITrend;
    Morning:   ITrend;
    Night:     ITrend;
}

export interface ITrend {
    cognitive:  number;
    emotional:  number;
    motor:      number;
    n_sessions: number;
}

export interface IWeeklyTrends {
    Friday:    ITrend;
    Monday:    ITrend;
    Saturday:  ITrend;
    Sunday:    ITrend;
    Thursday:  ITrend;
    Tuesday:   ITrend;
    Wednesday: ITrend;
}

// export interface IA2ExtensionResults {
//     ai_preamble:         string;
//     function_subscores:  IFunctionSubscores;
//     overall_state:       number;
//     peak_day_hours:      number[];
//     self_compare_scores: ISelfCompareScores;
//     session_id:          string;
//     timestamp:           string;
//     user_id:             string;
// }

// export interface IFunctionSubscores {
//     balance:  number;
//     energy:   number;
//     function: number;
// }

export interface ISelfCompareScores {
    average_pos: number;
    current_pos: number;
    // iqr_range:   number[];
}

export interface IA2DefaultResults {
    timestamp:  string;
    user_id:    string;
}


export interface IA2CompareResults {
    self_compare_scores: ISelfCompareScores;
    timestamp:           string;
}

export interface IA2SummaryResults {
    current_state: IA2CurrentState;
    timestamp:     string;
}

export interface IA2TrendsResults {
    daily_trends:  IDailyTrends;
    timestamp:     string;
    weekly_trends: IWeeklyTrends;
}
