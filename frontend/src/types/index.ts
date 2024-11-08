// frontend/src/types/index.ts

export interface Execution {
    id: number;
    start_time: string;
    end_time?: string;
    total_searches: number;
    total_clicks: number;
    total_lidery_found: number;
    is_running: boolean;
    execution_mode: 'visible' | 'headless';
    status: 'running' | 'completed' | 'error';
    error_message?: string;
  }
  
  export interface Keyword {
    id: number;
    text: string;
    is_active: boolean;
    created_at: string;
    last_used?: string;
    use_count: number;
  }
  
  export interface Competitor {
    id: number;
    domain: string;
    business_name?: string;
    first_seen: string;
    last_seen: string;
    total_appearances: number;
  }
  
  export interface Contact {
    id: number;
    competitor_id: number;
    type: string;
    value: string;
    first_seen: string;
    last_seen: string;
    times_found: number;
    competitor_domain?: string;
    competitor_name?: string;
  }
  
  export interface PerformanceStats {
    date: string;
    total_executions: number;
    total_searches: number;
    total_clicks: number;
    total_lidery: number;
  }
  
  export interface LideryPosition {
    position: number;
    count: number;
    percentage: number;
  }
  
  export interface CompetitorDetails extends Competitor {
    keyword_analysis: {
      keyword: string;
      appearances: number;
      average_position: number;
    }[];
  }