export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  notes: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  createdAt: string;
};

export const SAMPLE_TASKS: Task[] = [
  { id: 'sample-1', title: 'Plan the week ahead', notes: 'Block focus time for the highest-impact work.', priority: 'high', dueDate: '2025-06-09', completed: false, createdAt: '2025-06-01T09:00:00.000Z' },
  { id: 'sample-2', title: 'Review product feedback', notes: 'Capture themes from the latest customer calls.', priority: 'medium', dueDate: '2025-06-10', completed: false, createdAt: '2025-06-01T10:00:00.000Z' },
  { id: 'sample-3', title: 'Update team workspace', notes: 'Archive old docs and refresh the welcome page.', priority: 'low', dueDate: '', completed: true, createdAt: '2025-05-30T13:00:00.000Z' },
];

export const priorityLabels: Record<Priority, string> = { low: 'Low', medium: 'Medium', high: 'High' };

export function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false;
  const task = value as Record<string, unknown>;
  return typeof task.id === 'string' && typeof task.title === 'string' && typeof task.notes === 'string' && ['low', 'medium', 'high'].includes(task.priority as string) && typeof task.dueDate === 'string' && typeof task.completed === 'boolean' && typeof task.createdAt === 'string';
}

export function formatDueDate(date: string) {
  if (!date) return 'No due date';
  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(parsed);
}

export function isOverdue(task: Task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  const date = new Date(`${task.dueDate}T23:59:59`);
  return date < today;
}
