export interface Task {
  id: string;
  title: string;
  description?: string;
  boardId: string;
  listId: string;
  label?: {
    text: string;
    color: string;
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface List {
  id: string;
  title: string;
  order: number;
  boardId: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  lists: List[];
  createdAt: Date;
  updatedAt: Date;
  background?: string;
}

export interface BoardSummary {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const LABEL_COLORS = {
  DONE: "#4CAF50", // Green
  DOING: "#FFC107", // Yellow
  TODO: "#2196F3", // Blue
  BLOCKED: "#FF5252", // Red
  REVIEW: "#9C27B0", // Purple
} as const;

export const DEFAULT_LABELS = [
  { text: "Done", color: LABEL_COLORS.DONE },
  { text: "Doing", color: LABEL_COLORS.DOING },
  { text: "ToDo", color: LABEL_COLORS.TODO },
  { text: "Blocked", color: LABEL_COLORS.BLOCKED },
  { text: "Review", color: LABEL_COLORS.REVIEW },
];
