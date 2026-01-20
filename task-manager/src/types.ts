export type Priority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
  priority: Priority;
  createdAt: number; // We will use Date.now()
}
