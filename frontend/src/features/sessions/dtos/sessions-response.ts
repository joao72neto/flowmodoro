export interface DailySessionsDTO {
  date: string;
  totalFocus: number;
  totalRest: number;
  sessionGroups: SessionGroupDTO[];
}

export interface SessionGroupDTO {
  id: string;
  name: string;
  totalFocus: number;
  totalRest: number;
  sessions: SessionDTO[];
}

export interface SessionDTO {
  id: string;
  name: string;
  focus: number;
  rest: number;
  ratio: number;
  date: string;
  updatedAt?: string;
  deletedAt?: string | null;
  project: {
    id: string;
    name: string;
    color: string;
  };
  tag: {
    id: string;
    name: string;
  };
}

export interface SessionSuggestionDTO {
  id: string;
  name: string;
  project: {
    id: string;
    name: string;
    color?: string;
  } | null;
  tag: {
    id: string;
    name: string;
  } | null;
  date: string;
}
