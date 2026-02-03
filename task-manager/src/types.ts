export type Priority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
  priority: string;
}
