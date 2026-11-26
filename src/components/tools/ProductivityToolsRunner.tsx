import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  CheckSquare,
  Download,
  Droplet,
  FileText,
  Flame,
  HardDrive,
  Hourglass,
  Kanban,
  Pause,
  Pill,
  Play,
  Plus,
  RotateCcw,
  Smile,
  StickyNote,
  Timer,
  Trash2,
  Wallet,
} from 'lucide-react';
import type {Tool} from '../../data/tools';

interface Props {
  tool: Tool;
}

function getTodayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function shiftIsoDate(iso: string, deltaDays: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() + deltaDays);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function playAlertBeep() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const playTone = (startOffset: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startOffset);
      osc.stop(ctx.currentTime + startOffset + 0.26);
    };
    playTone(0, 880);
    playTone(0.28, 880);
    playTone(0.56, 1046.5);
  } catch {
    // Web Audio blocked or unavailable
  }
}

function downloadTxt(content: string, filename: string) {
  const encoded = new TextEncoder().encode(content);
  const u8 = new Uint8Array(new ArrayBuffer(encoded.byteLength));
  u8.set(encoded);
  const url = URL.createObjectURL(new Blob([u8], {type: 'text/plain;charset=utf-8'}));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function useLocalStorageState<T>(storageKey: string, defaultValue: T | (() => T)) {
  const readInitial = useCallback((): T => {
    const fallback =
      typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }, [storageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const [state, setState] = useState<T>(readInitial);

  useEffect(() => {
    setState(readInitial());
  }, [storageKey, readInitial]);

  const setPersisted = useCallback(
    (updater: React.SetStateAction<T>) => {
      setState((prev) => {
        const next =
          typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater;
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // Storage full or disabled
        }
        return next;
      });
    },
    [storageKey],
  );

  return [state, setPersisted] as const;
}

function ProductivityShell({
  icon,
  tool,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  tool: Tool;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto mt-6 max-w-5xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {icon}
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-[#0A8CFF] shrink-0" />
          <span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">Browser localStorage only:</span> Your data stays on this device and is not synced across browsers or uploaded to any server.
          </span>
        </div>
        {children}
      </div>
    </section>
  );
}

export function ProductivityToolsRunner({tool}: Props) {
  switch (tool.slug) {
    case 'productivity-smart-to-do-list':
      return <SmartTodoWorkspace tool={tool} />;
    case 'productivity-task-board':
      return <TaskBoardWorkspace tool={tool} />;
    case 'productivity-daily-planner':
      return <DailyPlannerWorkspace tool={tool} />;
    case 'productivity-sticky-notes':
      return <StickyNotesWorkspace tool={tool} />;
    case 'productivity-meeting-notes':
      return <MeetingNotesWorkspace tool={tool} />;
    case 'productivity-countdown-timer':
      return <CountdownTimerWorkspace tool={tool} />;
    case 'productivity-pomodoro-timer':
      return <PomodoroTimerWorkspace tool={tool} />;
    case 'productivity-habit-streak':
      return <HabitStreakWorkspace tool={tool} />;
    case 'productivity-water-tracker':
      return <WaterTrackerWorkspace tool={tool} />;
    case 'productivity-mood-tracker':
      return <MoodTrackerWorkspace tool={tool} />;
    case 'productivity-expense-reminder':
      return <ExpenseReminderWorkspace tool={tool} />;
    case 'productivity-medicine-reminder':
      return <MedicineReminderWorkspace tool={tool} />;
    default:
      return null;
  }
}

/* ===========================
   1. SMART TO-DO LIST
   =========================== */
interface TodoItem {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  done: boolean;
}

function SmartTodoWorkspace({tool}: Props) {
  const [todos, setTodos] = useLocalStorageState<TodoItem[]>('tp_prod_smart_todo_v1', []);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setTodos((prev) => [
      {id: makeId(), title: title.trim(), priority, dueDate, done: false},
      ...prev,
    ]);
    setTitle('');
  };

  const filtered = useMemo(() => {
    return todos.filter((t) =>
      filter === 'active' ? !t.done : filter === 'completed' ? t.done : true,
    );
  }, [todos, filter]);

  const activeCount = todos.filter((t) => !t.done).length;

  return (
    <ProductivityShell
      icon={<CheckSquare className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Add tasks with priorities & due dates · Filter active or completed"
    >
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Task
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to get done?"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs focus:border-[#0A8CFF] focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Due Date (optional)
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
          />
        </div>
        <button
          type="submit"
          className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add</span>
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                filter === tab
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          <span>{activeCount} remaining</span>
          {todos.some((t) => t.done) && (
            <button
              type="button"
              onClick={() => setTodos((prev) => prev.filter((t) => !t.done))}
              className="font-semibold text-rose-600 hover:underline cursor-pointer"
            >
              Clear completed
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-6 text-center text-xs text-slate-500">
          No tasks in this view yet. Add a task above to save it locally in your browser.
        </div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-900"
            >
              <label className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() =>
                    setTodos((prev) =>
                      prev.map((t) => (t.id === item.id ? {...t, done: !t.done} : t)),
                    )
                  }
                  className="rounded border-slate-300 shrink-0"
                />
                <div className="min-w-0">
                  <div
                    className={`text-sm font-medium ${
                      item.done
                        ? 'line-through text-slate-400'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    Priority:{' '}
                    <span
                      className={
                        item.priority === 'high'
                          ? 'font-semibold text-rose-600 dark:text-rose-400'
                          : item.priority === 'medium'
                            ? 'font-semibold text-amber-600 dark:text-amber-400'
                            : 'font-semibold text-emerald-600 dark:text-emerald-400'
                      }
                    >
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </span>
                    {item.dueDate ? ` · Due ${item.dueDate}` : ''}
                  </div>
                </div>
              </label>
              <button
                type="button"
                onClick={() => setTodos((prev) => prev.filter((t) => t.id !== item.id))}
                className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </ProductivityShell>
  );
}

/* ===========================
   2. TASK BOARD (Kanban To Do / Doing / Done)
   =========================== */
type BoardCol = 'todo' | 'doing' | 'done';

interface KanbanCard {
  id: string;
  title: string;
  note: string;
  column: BoardCol;
}

const BOARD_COLUMNS: Array<{id: BoardCol; label: string}> = [
  {id: 'todo', label: 'To Do'},
  {id: 'doing', label: 'Doing'},
  {id: 'done', label: 'Done'},
];

function TaskBoardWorkspace({tool}: Props) {
  const [cards, setCards] = useLocalStorageState<KanbanCard[]>('tp_prod_task_board_v1', []);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [dragId, setDragId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCards((prev) => [...prev, {id: makeId(), title: title.trim(), note: note.trim(), column: 'todo'}]);
    setTitle('');
    setNote('');
  };

  const moveCard = (id: string, targetCol: BoardCol) => {
    setCards((prev) => prev.map((c) => (c.id === id ? {...c, column: targetCol} : c)));
  };

  return (
    <ProductivityShell
      icon={<Kanban className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Kanban To Do / Doing / Done · Drag cards or use quick move arrows"
    >
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Card Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Draft quarterly roadmap"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs focus:border-[#0A8CFF] focus:outline-none"
          />
        </div>
        <div className="sm:col-span-5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Optional Note
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Short context..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs focus:border-[#0A8CFF] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Card</span>
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BOARD_COLUMNS.map((col, colIdx) => {
          const colCards = cards.filter((c) => c.column === col.id);
          return (
            <div
              key={col.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId) {
                  moveCard(dragId, col.id);
                  setDragId(null);
                }
              }}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 min-h-[260px] flex flex-col gap-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                <span>{col.label}</span>
                <span className="font-mono text-slate-500 tabular-nums">{colCards.length}</span>
              </div>

              {colCards.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-400 text-center py-8">
                  Drop cards here
                </div>
              ) : (
                <div className="space-y-2.5">
                  {colCards.map((card) => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => setDragId(card.id)}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 space-y-2 cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          {card.title}
                        </div>
                        <button
                          type="button"
                          onClick={() => setCards((prev) => prev.filter((c) => c.id !== card.id))}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer shrink-0"
                          aria-label="Delete card"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {card.note && <p className="text-[11px] text-slate-500">{card.note}</p>}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          disabled={colIdx === 0}
                          onClick={() => moveCard(card.id, BOARD_COLUMNS[colIdx - 1].id)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:text-[#0A8CFF] cursor-pointer"
                        >
                          <ArrowLeft className="h-3 w-3" />
                          <span>Back</span>
                        </button>
                        <button
                          type="button"
                          disabled={colIdx === BOARD_COLUMNS.length - 1}
                          onClick={() => moveCard(card.id, BOARD_COLUMNS[colIdx + 1].id)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:text-[#0A8CFF] cursor-pointer"
                        >
                          <span>Next</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ProductivityShell>
  );
}

/* ===========================
   3. DAILY PLANNER
   =========================== */
interface PlannerSlot {
  id: string;
  start: string;
  end: string;
  task: string;
  note: string;
  done: boolean;
}

function DailyPlannerWorkspace({tool}: Props) {
  const today = getTodayIso();
  const [slots, setSlots] = useLocalStorageState<PlannerSlot[]>(
    `tp_prod_daily_planner_${today}_v1`,
    [
      {id: 's1', start: '09:00', end: '10:00', task: 'Deep focus work block', note: '', done: false},
      {id: 's2', start: '10:30', end: '11:30', task: 'Team check-in & emails', note: '', done: false},
      {id: 's3', start: '14:00', end: '15:30', task: 'Afternoon project review', note: '', done: false},
    ],
  );
  const [start, setStart] = useState('16:00');
  const [end, setEnd] = useState('17:00');
  const [task, setTask] = useState('');
  const [note, setNote] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    setSlots((prev) =>
      [...prev, {id: makeId(), start, end, task: task.trim(), note: note.trim(), done: false}].sort((a, b) =>
        a.start.localeCompare(b.start),
      ),
    );
    setTask('');
    setNote('');
  };

  return (
    <ProductivityShell
      icon={<CalendarClock className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle={`Today's hourly schedule (${today}) · Add timed blocks, notes, and tick off completed hours`}
    >
      <form onSubmit={handleAdd} className="grid grid-cols-2 sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Start</label>
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-2 text-xs font-mono"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">End</label>
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-2 text-xs font-mono"
          />
        </div>
        <div className="col-span-2 sm:col-span-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Block Task</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Scheduled focus or meeting..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
          />
        </div>
        <div className="col-span-2 sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Note</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
          />
        </div>
        <button
          type="submit"
          className="col-span-2 inline-flex items-center justify-center gap-1 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-3 py-2 text-xs font-semibold cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Slot</span>
        </button>
      </form>

      {slots.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-500">
          No time blocks scheduled for today yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {slots.map((slot) => (
            <div key={slot.id} className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-900">
              <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={slot.done}
                  onChange={() =>
                    setSlots((prev) => prev.map((s) => (s.id === slot.id ? {...s, done: !s.done} : s)))
                  }
                  className="rounded border-slate-300"
                />
                <span className="font-mono text-xs font-semibold text-[#0A8CFF] tabular-nums shrink-0">
                  {slot.start}–{slot.end}
                </span>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold ${slot.done ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {slot.task}
                  </div>
                  {slot.note && <div className="text-[11px] text-slate-500">{slot.note}</div>}
                </div>
              </label>
              <button
                type="button"
                onClick={() => setSlots((prev) => prev.filter((s) => s.id !== slot.id))}
                className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                aria-label="Remove slot"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </ProductivityShell>
  );
}

/* ===========================
   4. STICKY NOTES (Yellow, Blue, Green, Pink, Purple)
   =========================== */
type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple';

interface StickyNoteItem {
  id: string;
  color: NoteColor;
  text: string;
  updatedAt: string;
}

const NOTE_PALETTE: Record<NoteColor, {bg: string; border: string; swatch: string; label: string}> = {
  yellow: {bg: 'bg-amber-50', border: 'border-amber-200', swatch: 'bg-amber-300', label: 'Yellow'},
  blue: {bg: 'bg-sky-50', border: 'border-sky-200', swatch: 'bg-sky-300', label: 'Blue'},
  green: {bg: 'bg-emerald-50', border: 'border-emerald-200', swatch: 'bg-emerald-300', label: 'Green'},
  pink: {bg: 'bg-rose-50', border: 'border-rose-200', swatch: 'bg-rose-300', label: 'Pink'},
  purple: {bg: 'bg-violet-50', border: 'border-violet-200', swatch: 'bg-violet-300', label: 'Purple'},
};

function StickyNotesWorkspace({tool}: Props) {
  const [notes, setNotes] = useLocalStorageState<StickyNoteItem[]>('tp_prod_sticky_notes_v1', [
    {id: 'n1', color: 'yellow', text: 'Call supplier before 3 PM regarding batch delivery.', updatedAt: 'Saved locally'},
    {id: 'n2', color: 'blue', text: 'Ideas for weekend sprint:\n- Clean garage\n- Update resume', updatedAt: 'Saved locally'},
  ]);
  const [selectedColor, setSelectedColor] = useState<NoteColor>('yellow');

  const addNote = () => {
    setNotes((prev) => [
      {id: makeId(), color: selectedColor, text: '', updatedAt: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})},
      ...prev,
    ]);
  };

  return (
    <ProductivityShell
      icon={<StickyNote className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Colour-coded sticky notes (Yellow, Blue, Green, Pink, Purple) · Auto-saved locally"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Note colour:</span>
          {(Object.keys(NOTE_PALETTE) as NoteColor[]).map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              title={NOTE_PALETTE[color].label}
              className={`h-6 w-6 rounded-full ${NOTE_PALETTE[color].swatch} border-2 cursor-pointer ${
                selectedColor === color ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addNote}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Sticky Note</span>
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-500">
          No sticky notes yet. Click &ldquo;New Sticky Note&rdquo; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => {
            const pal = NOTE_PALETTE[note.color] || NOTE_PALETTE.yellow;
            return (
              <div
                key={note.id}
                className={`rounded-xl border ${pal.border} ${pal.bg} p-3.5 flex flex-col gap-2 text-slate-900 shadow-xs`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {(Object.keys(NOTE_PALETTE) as NoteColor[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          setNotes((prev) => prev.map((n) => (n.id === note.id ? {...n, color: c} : n)))
                        }
                        aria-label={`Change colour to ${c}`}
                        className={`h-3.5 w-3.5 rounded-full ${NOTE_PALETTE[c].swatch} border cursor-pointer ${
                          note.color === c ? 'border-slate-800' : 'border-transparent opacity-70'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotes((prev) => prev.filter((n) => n.id !== note.id))}
                    className="text-slate-500 hover:text-rose-700 cursor-pointer"
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <textarea
                  rows={5}
                  value={note.text}
                  placeholder="Write a quick note..."
                  onChange={(e) =>
                    setNotes((prev) =>
                      prev.map((n) =>
                        n.id === note.id
                          ? {
                              ...n,
                              text: e.target.value,
                              updatedAt: new Date().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              }),
                            }
                          : n,
                      ),
                    )
                  }
                  className="w-full bg-transparent text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none resize-y"
                />

                <div className="text-[10px] text-slate-500 text-right tabular-nums">
                  {note.updatedAt}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ProductivityShell>
  );
}

/* ===========================
   5. MEETING NOTES
   =========================== */
interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: string;
  agenda: string;
  notes: string;
  actionItems: string;
}

function MeetingNotesWorkspace({tool}: Props) {
  const [history, setHistory] = useLocalStorageState<MeetingRecord[]>('tp_prod_meeting_notes_v1', []);
  const [title, setTitle] = useState('Weekly Product Sync');
  const [date, setDate] = useState(getTodayIso());
  const [time, setTime] = useState('10:00');
  const [attendees, setAttendees] = useState('Alex, Priya, Jordan');
  const [agenda, setAgenda] = useState('1. Q2 milestone progress\n2. Open blockers\n3. Next sprint priorities');
  const [notes, setNotes] = useState('Reviewed release checklist and confirmed Thursday staging window.');
  const [actionItems, setActionItems] = useState('- Alex: Share updated QA sign-off\n- Priya: Confirm analytics tags');
  const [savedBanner, setSavedBanner] = useState(false);

  const buildMeetingText = (rec: Omit<MeetingRecord, 'id'>) => {
    return [
      `MEETING NOTES: ${rec.title}`,
      `Date: ${rec.date} ${rec.time}`,
      `Attendees: ${rec.attendees}`,
      '',
      'AGENDA:',
      rec.agenda,
      '',
      'NOTES:',
      rec.notes,
      '',
      'ACTION ITEMS:',
      rec.actionItems,
      '',
    ].join('\n');
  };

  const handleSave = () => {
    const rec: MeetingRecord = {
      id: makeId(),
      title: title.trim() || 'Untitled Meeting',
      date,
      time,
      attendees,
      agenda,
      notes,
      actionItems,
    };
    setHistory((prev) => [rec, ...prev]);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 1800);
  };

  const loadRecord = (rec: MeetingRecord) => {
    setTitle(rec.title);
    setDate(rec.date);
    setTime(rec.time);
    setAttendees(rec.attendees);
    setAgenda(rec.agenda);
    setNotes(rec.notes);
    setActionItems(rec.actionItems);
  };

  return (
    <ProductivityShell
      icon={<FileText className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Structured meeting minutes with attendees, agenda, action items, history & .txt download"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Meeting Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Attendees</label>
            <input
              type="text"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Agenda</label>
            <textarea
              rows={3}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Discussion Notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Action Items</label>
            <textarea
              rows={3}
              value={actionItems}
              onChange={(e) => setActionItems(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer"
            >
              {savedBanner ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              <span>{savedBanner ? 'Saved to History!' : 'Save to History'}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                downloadTxt(
                  buildMeetingText({title, date, time, attendees, agenda, notes, actionItems}),
                  `${(title || 'meeting').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`,
                )
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-semibold cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download .txt</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-4 space-y-3">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
            Saved Meeting History ({history.length})
          </div>
          {history.length === 0 ? (
            <p className="text-xs text-slate-500">Click &ldquo;Save to History&rdquo; to store meeting snapshots locally.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => loadRecord(rec)}
                      className="text-left text-xs font-semibold text-slate-900 dark:text-white hover:text-[#0A8CFF] cursor-pointer"
                    >
                      {rec.title}
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistory((prev) => prev.filter((r) => r.id !== rec.id))}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer shrink-0"
                      aria-label="Delete meeting record"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
                    <span>{rec.date} {rec.time}</span>
                    <button
                      type="button"
                      onClick={() => downloadTxt(buildMeetingText(rec), `${rec.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`)}
                      className="text-[#0A8CFF] font-semibold hover:underline cursor-pointer"
                    >
                      .txt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProductivityShell>
  );
}

/* ===========================
   6. COUNTDOWN TIMER (Target Date/Time + Quick Minute Timer + Beep)
   =========================== */
interface CountdownPref {
  mode: 'target' | 'minutes';
  eventTitle: string;
  targetDatetime: string;
  minutesPreset: number;
}

function defaultTargetDatetime(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setMinutes(0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
}

function CountdownTimerWorkspace({tool}: Props) {
  const [pref, setPref] = useLocalStorageState<CountdownPref>('tp_prod_countdown_v1', {
    mode: 'target',
    eventTitle: 'Project Launch Target',
    targetDatetime: defaultTargetDatetime(),
    minutesPreset: 10,
  });

  const [nowMs, setNowMs] = useState(() => Date.now());
  const [secondsLeft, setSecondsLeft] = useState(pref.minutesPreset * 60);
  const [running, setRunning] = useState(false);
  const beepedTargetRef = useRef(false);

  useEffect(() => {
    setSecondsLeft(Math.max(1, pref.minutesPreset) * 60);
    setRunning(false);
  }, [pref.minutesPreset]);

  // Target datetime live ticker
  useEffect(() => {
    if (pref.mode !== 'target') return;
    const id = window.setInterval(() => {
      const current = Date.now();
      setNowMs(current);
      const targetMs = new Date(pref.targetDatetime).getTime();
      if (Number.isFinite(targetMs) && targetMs <= current && !beepedTargetRef.current) {
        beepedTargetRef.current = true;
        playAlertBeep();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [pref.mode, pref.targetDatetime]);

  // Minutes timer ticker
  useEffect(() => {
    if (pref.mode !== 'minutes' || !running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          playAlertBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [pref.mode, running]);

  const targetDiffMs = Math.max(0, new Date(pref.targetDatetime).getTime() - nowMs);
  const totalSecTarget = Math.floor(targetDiffMs / 1000);
  const days = Math.floor(totalSecTarget / 86400);
  const hours = Math.floor((totalSecTarget % 86400) / 3600);
  const mins = Math.floor((totalSecTarget % 3600) / 60);
  const secs = totalSecTarget % 60;

  const quickMins = Math.floor(secondsLeft / 60);
  const quickSecs = secondsLeft % 60;

  return (
    <ProductivityShell
      icon={<Timer className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Live countdown to target date/time or quick minute timer with browser alert beep"
    >
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setPref((p) => ({...p, mode: 'target'}))}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
            pref.mode === 'target' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Target Date & Time
        </button>
        <button
          type="button"
          onClick={() => setPref((p) => ({...p, mode: 'minutes'}))}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
            pref.mode === 'minutes' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Quick Minute Timer
        </button>
      </div>

      {pref.mode === 'target' ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Countdown Label
              </label>
              <input
                type="text"
                value={pref.eventTitle}
                onChange={(e) => setPref((p) => ({...p, eventTitle: e.target.value}))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Date & Time
              </label>
              <input
                type="datetime-local"
                value={pref.targetDatetime}
                onChange={(e) => {
                  beepedTargetRef.current = false;
                  setPref((p) => ({...p, targetDatetime: e.target.value}));
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-6 text-center space-y-3">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {pref.eventTitle || 'Countdown Target'}
            </div>
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto tabular-nums font-mono">
              {[
                {label: 'Days', val: days},
                {label: 'Hours', val: hours},
                {label: 'Mins', val: mins},
                {label: 'Secs', val: secs},
              ].map((cell) => (
                <div key={cell.label} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {String(cell.val).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{cell.label}</div>
                </div>
              ))}
            </div>
            {targetDiffMs === 0 && (
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Target time reached!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Minutes
              </label>
              <input
                type="number"
                min={1}
                max={300}
                value={pref.minutesPreset}
                onChange={(e) =>
                  setPref((p) => ({
                    ...p,
                    minutesPreset: Math.max(1, Math.min(300, Number(e.target.value) || 1)),
                  }))
                }
                className="w-28 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono tabular-nums"
              />
            </div>
            {[1, 5, 10, 15, 30].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPref((p) => ({...p, minutesPreset: m}))}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold hover:border-[#0A8CFF] cursor-pointer tabular-nums"
              >
                {m}m
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-8 text-center space-y-4">
            <div className="text-5xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {String(quickMins).padStart(2, '0')}:{String(quickSecs).padStart(2, '0')}
            </div>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setRunning((r) => !r)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-5 py-2.5 text-xs font-semibold cursor-pointer"
              >
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{running ? 'Pause' : 'Start'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRunning(false);
                  setSecondsLeft(pref.minutesPreset * 60);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </ProductivityShell>
  );
}

/* ===========================
   7. POMODORO TIMER (25 / 5 cycles + sessions)
   =========================== */
interface PomodoroState {
  focusMins: number;
  breakMins: number;
  sessionsCompleted: number;
  lastDate: string;
}

function PomodoroTimerWorkspace({tool}: Props) {
  const today = getTodayIso();
  const [pomo, setPomo] = useLocalStorageState<PomodoroState>('tp_prod_pomodoro_v1', {
    focusMins: 25,
    breakMins: 5,
    sessionsCompleted: 0,
    lastDate: today,
  });

  // Reset session count cleanly on a new day
  useEffect(() => {
    if (pomo.lastDate !== today) {
      setPomo((prev) => ({...prev, sessionsCompleted: 0, lastDate: today}));
    }
  }, [today, pomo.lastDate, setPomo]);

  const [phase, setPhase] = useState<'focus' | 'break'>('focus');
  const [secondsLeft, setSecondsLeft] = useState(pomo.focusMins * 60);
  const [running, setRunning] = useState(false);

  const switchPhase = useCallback(
    (nextPhase: 'focus' | 'break') => {
      setRunning(false);
      setPhase(nextPhase);
      setSecondsLeft((nextPhase === 'focus' ? pomo.focusMins : pomo.breakMins) * 60);
    },
    [pomo.focusMins, pomo.breakMins],
  );

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playAlertBeep();
          if (phase === 'focus') {
            setPomo((cur) => ({...cur, sessionsCompleted: cur.sessionsCompleted + 1, lastDate: getTodayIso()}));
            setPhase('break');
            setRunning(false);
            return pomo.breakMins * 60;
          } else {
            setPhase('focus');
            setRunning(false);
            return pomo.focusMins * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, phase, pomo.focusMins, pomo.breakMins, setPomo]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <ProductivityShell
      icon={<Hourglass className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Classic 25 min Focus / 5 min Break cycles · Adjustable lengths & persisted session count"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => switchPhase('focus')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              phase === 'focus' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Focus ({pomo.focusMins}m)
          </button>
          <button
            type="button"
            onClick={() => switchPhase('break')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              phase === 'break' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Break ({pomo.breakMins}m)
          </button>
        </div>

        <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
          Sessions Completed Today: <span className="text-[#0A8CFF] font-bold text-sm">{pomo.sessionsCompleted}</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-8 text-center space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {phase === 'focus' ? 'Focus Interval' : 'Break Interval'}
        </div>
        <div className="text-6xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-5 py-2.5 text-xs font-semibold cursor-pointer"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{running ? 'Pause' : 'Start'}</span>
          </button>
          <button
            type="button"
            onClick={() => switchPhase(phase)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Focus Length (minutes)
          </label>
          <input
            type="number"
            min={1}
            max={120}
            value={pomo.focusMins}
            onChange={(e) => {
              const val = Math.max(1, Math.min(120, Number(e.target.value) || 25));
              setPomo((p) => ({...p, focusMins: val}));
              if (phase === 'focus' && !running) setSecondsLeft(val * 60);
            }}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono tabular-nums"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Break Length (minutes)
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={pomo.breakMins}
            onChange={(e) => {
              const val = Math.max(1, Math.min(60, Number(e.target.value) || 5));
              setPomo((p) => ({...p, breakMins: val}));
              if (phase === 'break' && !running) setSecondsLeft(val * 60);
            }}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono tabular-nums"
          />
        </div>
      </div>
    </ProductivityShell>
  );
}

/* ===========================
   8. HABIT STREAK
   =========================== */
interface HabitItem {
  id: string;
  name: string;
  dates: string[]; // ISO YYYY-MM-DD sorted ascending
}

function computeStreaks(dates: string[], today: string): {current: number; longest: number} {
  if (dates.length === 0) return {current: 0, longest: 0};
  const set = new Set(dates);
  const sorted = Array.from(set).sort();

  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (shiftIsoDate(sorted[i - 1], 1) === sorted[i]) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }

  let current = 0;
  let cursor = set.has(today) ? today : shiftIsoDate(today, -1);
  while (set.has(cursor)) {
    current++;
    cursor = shiftIsoDate(cursor, -1);
  }

  return {current, longest};
}

function HabitStreakWorkspace({tool}: Props) {
  const today = getTodayIso();
  const [habits, setHabits] = useLocalStorageState<HabitItem[]>('tp_prod_habit_streak_v1', [
    {id: 'h1', name: 'Read 20 pages', dates: []},
    {id: 'h2', name: '20-minute walk', dates: []},
  ]);
  const [habitName, setHabitName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;
    setHabits((prev) => [...prev, {id: makeId(), name: habitName.trim(), dates: []}]);
    setHabitName('');
  };

  const toggleToday = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const exists = h.dates.includes(today);
        const nextDates = exists ? h.dates.filter((d) => d !== today) : [...h.dates, today];
        return {...h, dates: nextDates};
      }),
    );
  };

  return (
    <ProductivityShell
      icon={<Flame className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Add daily habits, mark today done, and track current & longest streaks"
    >
      <form onSubmit={handleAdd} className="flex gap-3">
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="Add a daily habit (e.g. Meditate 10 min)..."
          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs focus:border-[#0A8CFF] focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2 text-xs font-semibold cursor-pointer shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Habit</span>
        </button>
      </form>

      {habits.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-500">
          Add your first daily habit above to start tracking streaks.
        </div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {habits.map((h) => {
            const doneToday = h.dates.includes(today);
            const streaks = computeStreaks(h.dates, today);
            return (
              <div
                key={h.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 bg-white dark:bg-slate-900"
              >
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{h.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    Current Streak: <span className="font-bold text-slate-800 dark:text-slate-100">{streaks.current}d</span> · Longest Streak:{' '}
                    <span className="font-bold text-slate-800 dark:text-slate-100">{streaks.longest}d</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleToday(h.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                      doneToday
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:border-[#0A8CFF]'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{doneToday ? 'Done Today' : 'Mark Today Done'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHabits((prev) => prev.filter((item) => item.id !== h.id))}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    aria-label="Delete habit"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ProductivityShell>
  );
}

/* ===========================
   9. WATER TRACKER (250 / 500 / 1,000 ml + Goal + Glasses)
   =========================== */
interface WaterState {
  date: string;
  goalMl: number;
  intakeMl: number;
}

function WaterTrackerWorkspace({tool}: Props) {
  const today = getTodayIso();
  const [water, setWater] = useLocalStorageState<WaterState>('tp_prod_water_tracker_v1', {
    date: today,
    goalMl: 2000,
    intakeMl: 0,
  });

  useEffect(() => {
    if (water.date !== today) {
      setWater((prev) => ({...prev, date: today, intakeMl: 0}));
    }
  }, [today, water.date, setWater]);

  const pct = Math.min(100, Math.round((water.intakeMl / Math.max(250, water.goalMl)) * 100));
  const glasses = (water.intakeMl / 250).toFixed(1).replace(/\.0$/, '');
  const remaining = Math.max(0, water.goalMl - water.intakeMl);

  return (
    <ProductivityShell
      icon={<Droplet className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Log daily glasses & ml against an adjustable target goal · Auto-resets daily"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Daily Target (ml)
          </label>
          <input
            type="number"
            min={500}
            max={6000}
            step={250}
            value={water.goalMl}
            onChange={(e) =>
              setWater((prev) => ({
                ...prev,
                goalMl: Math.max(250, Math.min(10000, Number(e.target.value) || 2000)),
              }))
            }
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs font-mono tabular-nums"
          />
        </div>
        <div className="sm:col-span-2 flex flex-wrap gap-2">
          {[250, 500, 1000].map((ml) => (
            <button
              key={ml}
              type="button"
              onClick={() => setWater((prev) => ({...prev, date: today, intakeMl: prev.intakeMl + ml}))}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2 text-xs font-semibold cursor-pointer tabular-nums"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+{ml.toLocaleString()} ml</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setWater((prev) => ({...prev, intakeMl: Math.max(0, prev.intakeMl - 250)}))}
            disabled={water.intakeMl === 0}
            className="rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40"
          >
            -250 ml
          </button>
          <button
            type="button"
            onClick={() => setWater((prev) => ({...prev, intakeMl: 0}))}
            disabled={water.intakeMl === 0}
            className="rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-rose-600 cursor-pointer disabled:opacity-40"
          >
            Reset Today
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-5 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2 tabular-nums">
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {water.intakeMl.toLocaleString()} ml{' '}
            <span className="text-xs font-normal text-slate-500">
              / {water.goalMl.toLocaleString()} ml ({glasses} glasses @ 250 ml)
            </span>
          </div>
          <div className="text-xs font-semibold text-[#0A8CFF]">{pct}%</div>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-[#0A8CFF] transition-all duration-200"
            style={{width: `${pct}%`}}
          />
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          {remaining === 0 ? 'Daily hydration goal reached!' : `${remaining.toLocaleString()} ml remaining for today`}
        </div>
      </div>
    </ProductivityShell>
  );
}

/* ===========================
   10. MOOD TRACKER (6 Moods + Note + History)
   =========================== */
const MOOD_OPTIONS = [
  {id: 'great', label: 'Great'},
  {id: 'good', label: 'Good'},
  {id: 'calm', label: 'Calm'},
  {id: 'tired', label: 'Tired'},
  {id: 'stressed', label: 'Stressed'},
  {id: 'low', label: 'Low'},
] as const;

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  timestamp: string;
}

function MoodTrackerWorkspace({tool}: Props) {
  const [entries, setEntries] = useLocalStorageState<MoodEntry[]>('tp_prod_mood_tracker_v1', []);
  const [selectedMood, setSelectedMood] = useState<string>('Good');
  const [note, setNote] = useState('');

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    const stamp = `${getTodayIso()} · ${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
    setEntries((prev) => [{id: makeId(), mood: selectedMood, note: note.trim(), timestamp: stamp}, ...prev]);
    setNote('');
  };

  return (
    <ProductivityShell
      icon={<Smile className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Pick 1 of 6 moods, add an optional reflection note, and track recent entries locally"
    >
      <form onSubmit={handleLog} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            How are you feeling right now?
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMood(m.label)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  selectedMood === m.label
                    ? 'border-[#0A8CFF] bg-sky-50 dark:bg-sky-950/40 text-[#0A8CFF]'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note (sleep, energy, trigger, win)..."
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs focus:border-[#0A8CFF] focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-5 py-2 text-xs font-semibold cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log Mood</span>
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-100">
            Mood History ({entries.length})
          </span>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={() => setEntries([])}
              className="text-rose-600 font-semibold hover:underline cursor-pointer"
            >
              Clear history
            </button>
          )}
        </div>
        {entries.length === 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-500">
            No mood entries logged yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-900">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {entry.mood}{' '}
                    <span className="font-mono font-normal text-slate-500 ml-2 tabular-nums">
                      {entry.timestamp}
                    </span>
                  </div>
                  {entry.note && <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{entry.note}</div>}
                </div>
                <button
                  type="button"
                  onClick={() => setEntries((prev) => prev.filter((e) => e.id !== entry.id))}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                  aria-label="Delete mood entry"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProductivityShell>
  );
}

/* ===========================
   11. EXPENSE REMINDER (Amount, Due Date, Category Filter, Currency-Neutral)
   =========================== */
interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  category: string;
  note: string;
  paid: boolean;
}

const EXPENSE_CATEGORIES = ['Bills & Utilities', 'Rent / Housing', 'Subscriptions', 'Groceries', 'Transport', 'Other'];

function ExpenseReminderWorkspace({tool}: Props) {
  const [currency, setCurrency] = useLocalStorageState<string>('tp_prod_expense_currency_v1', '$');
  const [items, setItems] = useLocalStorageState<ExpenseItem[]>('tp_prod_expense_reminder_v1', []);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(getTodayIso());
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!title.trim() || !Number.isFinite(num) || num <= 0) return;
    setItems((prev) => [
      {id: makeId(), title: title.trim(), amount: num, dueDate, category, note: note.trim(), paid: false},
      ...prev,
    ]);
    setTitle('');
    setAmount('');
    setNote('');
  };

  const visible = useMemo(
    () => (filterCat === 'All' ? items : items.filter((i) => i.category === filterCat)),
    [items, filterCat],
  );
  const visibleTotal = visible.reduce((s, i) => s + i.amount, 0);
  const unpaidTotal = visible.filter((i) => !i.paid).reduce((s, i) => s + i.amount, 0);

  return (
    <ProductivityShell
      icon={<Wallet className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Currency-neutral expense reminders with amount, due date, category filter & paid status"
    >
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Currency</label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Expense Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Electric Bill"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono tabular-nums"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-2 text-xs"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-9">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
          />
        </div>
        <button
          type="submit"
          className="sm:col-span-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Reminder</span>
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 px-4 py-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Filter:</span>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs"
          >
            <option value="All">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="font-mono tabular-nums text-slate-700 dark:text-slate-200">
          Total: <span className="font-bold">{currency}{visibleTotal.toFixed(2)}</span> · Unpaid:{' '}
          <span className="font-bold text-amber-600 dark:text-amber-400">{currency}{unpaidTotal.toFixed(2)}</span>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-500">
          No expense reminders in this category yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {visible.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-900">
              <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.paid}
                  onChange={() =>
                    setItems((prev) => prev.map((x) => (x.id === item.id ? {...x, paid: !x.paid} : x)))
                  }
                  className="rounded border-slate-300"
                />
                <div className="min-w-0">
                  <div className={`text-xs font-semibold ${item.paid ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 tabular-nums">
                    {item.category} · Due {item.dueDate} {item.note ? `· ${item.note}` : ''}
                  </div>
                </div>
              </label>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                  {currency}{item.amount.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                  aria-label="Delete expense"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ProductivityShell>
  );
}

/* ===========================
   12. MEDICINE REMINDER (Name, Dose, Time, Recurring, Auto Daily Reset)
   =========================== */
interface MedicineItem {
  id: string;
  name: string;
  dose: string;
  time: string;
  recurring: boolean;
  takenToday: boolean;
}

interface MedicineStore {
  lastResetDate: string;
  items: MedicineItem[];
}

function MedicineReminderWorkspace({tool}: Props) {
  const today = getTodayIso();
  const [store, setStore] = useLocalStorageState<MedicineStore>('tp_prod_medicine_reminder_v1', {
    lastResetDate: today,
    items: [],
  });

  // Auto-reset daily "taken" ticks when a new calendar date starts
  useEffect(() => {
    if (store.lastResetDate !== today) {
      setStore((prev) => ({
        lastResetDate: today,
        items: prev.items
          .filter((item) => item.recurring || !item.takenToday)
          .map((item) => ({...item, takenToday: false})),
      }));
    }
  }, [today, store.lastResetDate, setStore]);

  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('08:00');
  const [recurring, setRecurring] = useState(true);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStore((prev) => ({
      lastResetDate: today,
      items: [
        ...prev.items,
        {
          id: makeId(),
          name: name.trim(),
          dose: dose.trim() || '1 tablet',
          time,
          recurring,
          takenToday: false,
        },
      ].sort((a, b) => a.time.localeCompare(b.time)),
    }));
    setName('');
    setDose('');
  };

  return (
    <ProductivityShell
      icon={<Pill className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle={`Medicine checklist with dose, time, recurring daily option & auto daily tick reset (${today})`}
    >
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Medicine Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Vitamin D3"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Dose</label>
          <input
            type="text"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="e.g. 1000 IU / 1 pill"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-2 text-xs font-mono"
          />
        </div>
        <label className="sm:col-span-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 pb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
            className="rounded border-slate-300"
          />
          <span>Daily</span>
        </label>
        <button
          type="submit"
          className="sm:col-span-2 inline-flex items-center justify-center gap-1 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-3 py-2 text-xs font-semibold cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add</span>
        </button>
      </form>

      {store.items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-500">
          No medicines listed yet. Add your schedule above—daily ticks reset automatically each calendar day.
        </div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {store.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-900">
              <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.takenToday}
                  onChange={() =>
                    setStore((prev) => ({
                      ...prev,
                      items: prev.items.map((x) =>
                        x.id === item.id ? {...x, takenToday: !x.takenToday} : x,
                      ),
                    }))
                  }
                  className="rounded border-slate-300"
                />
                <span className="font-mono text-xs font-semibold text-[#0A8CFF] tabular-nums shrink-0">
                  {item.time}
                </span>
                <div>
                  <div className={`text-xs font-semibold ${item.takenToday ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {item.name} — {item.dose}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {item.recurring ? 'Recurring daily (auto-resets tomorrow)' : 'One-time dose'}
                  </div>
                </div>
              </label>
              <button
                type="button"
                onClick={() =>
                  setStore((prev) => ({
                    ...prev,
                    items: prev.items.filter((x) => x.id !== item.id),
                  }))
                }
                className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                aria-label="Delete medicine"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </ProductivityShell>
  );
}
