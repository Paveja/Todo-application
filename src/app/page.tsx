'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Icon } from '@/components/icons';
import { formatDueDate, isOverdue, isTask, priorityLabels, SAMPLE_TASKS, type Priority, type Task } from '@/lib/tasks';

const STORAGE_KEY = 'tempo-tasks-v1';
type Filter = 'all' | 'active' | 'completed' | Priority;

function StatCard({ label, value, hint, tone }: { label: string; value: number; hint: string; tone: string }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon name={tone === 'purple' ? 'sparkle' : tone === 'green' ? 'check' : tone === 'orange' ? 'sun' : 'inbox'} /></div><div><p className="stat-label">{label}</p><strong className="stat-value">{value}</strong><p className="stat-hint">{hint}</p></div></article>;
}

function TaskForm({ initial, onSave, onCancel }: { initial?: Task; onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void; onCancel?: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [error, setError] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) { setError('Give your task a clear title first.'); return; }
    if (cleanTitle.length > 100) { setError('Keep the title under 100 characters.'); return; }
    setError(''); onSave({ title: cleanTitle, notes: notes.trim(), priority, dueDate });
    if (!initial) { setTitle(''); setNotes(''); setPriority('medium'); setDueDate(''); }
  }

  return <form className="task-form" onSubmit={submit} noValidate><div className="form-heading"><div><span className="eyebrow">{initial ? 'Edit task' : 'New task'}</span><h2>{initial ? 'Refine the details' : 'What needs your attention?'}</h2></div>{onCancel && <button type="button" className="icon-button" onClick={onCancel} aria-label="Cancel editing"><Icon name="close" /></button>}</div><label className="field"><span>Task title</span><input autoFocus={Boolean(initial)} value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Prepare presentation" maxLength={100} /></label><label className="field"><span>Notes <small>Optional</small></span><textarea value={notes} onChange={event => setNotes(event.target.value)} placeholder="Add a little context..." rows={3} maxLength={240} /></label><div className="form-row"><label className="field"><span>Priority</span><select value={priority} onChange={event => setPriority(event.target.value as Priority)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label className="field"><span>Due date <small>Optional</small></span><div className="date-input"><Icon name="calendar" /><input type="date" value={dueDate} onChange={event => setDueDate(event.target.value)} /></div></label></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-button" type="submit"><Icon name={initial ? 'check' : 'plus'} />{initial ? 'Save changes' : 'Add task'}</button></form>;
}

function TaskItem({ task, onToggle, onEdit, onDelete }: { task: Task; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  return <article className={`task-item ${task.completed ? 'is-complete' : ''}`}><button className="check-button" onClick={onToggle} aria-label={task.completed ? `Mark ${task.title} active` : `Complete ${task.title}`} aria-pressed={task.completed}>{task.completed && <Icon name="check" />}</button><div className="task-copy"><div className="task-title-row"><h3>{task.title}</h3><span className={`priority-dot ${task.priority}`} title={`${priorityLabels[task.priority]} priority`} /></div>{task.notes && <p>{task.notes}</p>}<div className="task-meta"><span className={`priority-label ${task.priority}`}>{priorityLabels[task.priority]}</span>{task.dueDate && <span className={isOverdue(task) ? 'overdue' : ''}><Icon name="calendar" />{isOverdue(task) ? 'Overdue' : formatDueDate(task.dueDate)}</span>}</div></div><div className="task-actions"><button className="icon-button" onClick={onEdit} aria-label={`Edit ${task.title}`}><Icon name="edit" /></button><button className="icon-button danger-hover" onClick={onDelete} aria-label={`Delete ${task.title}`}><Icon name="trash" /></button></div></article>;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  // localStorage is a browser-only source of truth, so hydrate it after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { const saved = window.localStorage.getItem(STORAGE_KEY); const parsed: unknown = saved ? JSON.parse(saved) : null; setTasks(Array.isArray(parsed) && parsed.every(isTask) ? parsed : SAMPLE_TASKS); } catch { setTasks(SAMPLE_TASKS); setNotice('We couldn’t read your saved tasks, so sample tasks were restored.'); } finally { setHydrated(true); }
  }, []);
  useEffect(() => { if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }, [tasks, hydrated]);

  const counts = useMemo(() => ({ total: tasks.length, completed: tasks.filter(task => task.completed).length, pending: tasks.filter(task => !task.completed).length, high: tasks.filter(task => task.priority === 'high' && !task.completed).length }), [tasks]);
  const visibleTasks = useMemo(() => tasks.filter(task => { const matchesSearch = `${task.title} ${task.notes}`.toLowerCase().includes(search.toLowerCase()); const matchesFilter = filter === 'all' || (filter === 'active' && !task.completed) || (filter === 'completed' && task.completed) || task.priority === filter; return matchesSearch && matchesFilter; }).sort((a, b) => Number(a.completed) - Number(b.completed)), [tasks, search, filter]);

  function addTask(data: Omit<Task, 'id' | 'createdAt' | 'completed'>) { setTasks(current => [{ ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString(), completed: false }, ...current]); setNotice('Task added to your list.'); }
  function updateTask(data: Omit<Task, 'id' | 'createdAt' | 'completed'>) { setTasks(current => current.map(task => task.id === editingId ? { ...task, ...data } : task)); setEditingId(null); setNotice('Task updated.'); }
  function deleteTask(id: string) { const task = tasks.find(item => item.id === id); if (task && window.confirm(`Delete “${task.title}”? This can’t be undone.`)) { setTasks(current => current.filter(item => item.id !== id)); setNotice('Task deleted.'); } }
  const editingTask = editingId ? tasks.find(task => task.id === editingId) : undefined;
  const filters: { label: string; value: Filter }[] = [{ label: 'All tasks', value: 'all' }, { label: 'Active', value: 'active' }, { label: 'Completed', value: 'completed' }, { label: 'High priority', value: 'high' }];

  return <main className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark"><Icon name="sparkle" /></span><span>tempo</span></div><nav className="side-nav" aria-label="Main navigation"><a className="nav-item active" href="#tasks"><Icon name="inbox" />My tasks <span>{counts.total}</span></a><a className="nav-item" href="#today"><Icon name="sun" />Today</a></nav><div className="sidebar-footer"><div className="quote"><span>“</span><p>Small steps every day add up to big results.</p></div><div className="profile"><span className="avatar">AR</span><div><strong>Alex Rivera</strong><small>Personal workspace</small></div><Icon name="dots" /></div></div></aside><section className="content"><header className="topbar"><div><p className="welcome">Monday, June 9, 2025</p><h1>Good morning, Alex <span>✦</span></h1><p className="subtitle">Let&apos;s make today count.</p></div><div className="top-actions"><button className="theme-button" aria-label="Toggle theme"><Icon name="sun" /></button><div className="mini-avatar">AR</div></div></header><div className="dashboard" id="today"><section className="stats-grid" aria-label="Task overview"><StatCard label="Total tasks" value={counts.total} hint="in your workspace" tone="purple" /><StatCard label="Completed" value={counts.completed} hint={counts.total ? `${Math.round((counts.completed / counts.total) * 100)}% of all tasks` : 'Keep going'} tone="green" /><StatCard label="Pending" value={counts.pending} hint="still to do" tone="orange" /><StatCard label="High priority" value={counts.high} hint="needs your focus" tone="pink" /></section><div className="workspace" id="tasks"><section className="list-panel"><div className="list-heading"><div><span className="eyebrow">Your focus</span><h2>My tasks <span className="count-pill">{visibleTasks.length}</span></h2></div><div className="search-box"><Icon name="search" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search tasks..." aria-label="Search tasks" /></div></div><div className="filter-bar" role="tablist" aria-label="Filter tasks">{filters.map(item => <button key={item.value} className={filter === item.value ? 'filter-button selected' : 'filter-button'} onClick={() => setFilter(item.value)} role="tab" aria-selected={filter === item.value}>{item.label}</button>)}</div>{notice && <p className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss message"><Icon name="close" /></button></p>}<div className="task-list">{!hydrated ? <div className="loading-state">Loading your tasks...</div> : visibleTasks.length ? visibleTasks.map(task => <TaskItem key={task.id} task={task} onToggle={() => setTasks(current => current.map(item => item.id === task.id ? { ...item, completed: !item.completed } : item))} onEdit={() => setEditingId(task.id)} onDelete={() => deleteTask(task.id)} />) : <div className="empty-state"><span className="empty-icon"><Icon name={search ? 'search' : 'inbox'} /></span><h3>{search ? 'No matching tasks' : 'Nothing here yet'}</h3><p>{search ? 'Try a different keyword or clear your search.' : 'Add a task to start shaping your day.'}</p></div>}</div></section><aside className="composer-panel">{editingTask ? <TaskForm initial={editingTask} onSave={updateTask} onCancel={() => setEditingId(null)} /> : <TaskForm onSave={addTask} />}<div className="tip-card"><span className="tip-icon"><Icon name="sparkle" /></span><div><strong>Make it actionable</strong><p>Clear, specific tasks are easier to start and finish.</p></div></div></aside></div></div></section></main>;
}
