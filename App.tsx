import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, Priority, AITask } from './types';
import { parseTasksWithGemini } from './services/geminiService';
import { InputArea } from './components/InputArea';
import { TaskCard } from './components/TaskCard';
import { IconFilter, IconX, IconSparkles, IconCalendar } from './components/Icons';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Helper to safely clean AI/Storage output
  const cleanValue = (val: string | null | undefined): string | undefined => {
    if (!val) return undefined;
    if (val === 'null' || val === 'undefined') return undefined;
    if (val.trim() === '') return undefined;
    return val;
  };

  // Helper to get local date string YYYY-MM-DD
  const getLocalDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('velvet-tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Sanitize legacy data that might have "null" strings
        const sanitized = parsed.map((t: Task) => ({
          ...t,
          date: cleanValue(t.date),
          time: cleanValue(t.time),
          description: cleanValue(t.description)
        }));
        setTasks(sanitized);
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('velvet-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleProcess = async (input: string) => {
    setIsProcessing(true);
    try {
      const aiTasks = await parseTasksWithGemini(input);
      
      const newTasks: Task[] = aiTasks.map((aiTask: AITask) => ({
        id: uuidv4(),
        title: aiTask.title,
        description: cleanValue(aiTask.description),
        priority: mapPriority(aiTask.priority),
        date: cleanValue(aiTask.date),
        time: cleanValue(aiTask.time),
        isCompleted: false,
        createdAt: Date.now(),
      }));

      setTasks(prev => [...newTasks, ...prev]);

    } catch (error) {
      alert("Something went wrong while consulting the oracle. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const mapPriority = (p: string): Priority => {
    const upper = p.toUpperCase();
    if (upper === 'HIGH') return Priority.HIGH;
    if (upper === 'LOW') return Priority.LOW;
    return Priority.MEDIUM;
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredTasks = useMemo(() => {
    if (!isFocusMode) return tasks;

    const todayStr = getLocalDateString();
    
    return tasks.filter(task => {
      // Focus mode: High priority OR Today. Only uncompleted.
      const isHighPriority = task.priority === Priority.HIGH;
      
      // Strict Check for today
      const isToday = task.date === todayStr;

      return !task.isCompleted && (isHighPriority || isToday);
    });
  }, [tasks, isFocusMode]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
        
        const priorityOrder = { [Priority.HIGH]: 0, [Priority.MEDIUM]: 1, [Priority.LOW]: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        if (a.date && b.date) return a.date.localeCompare(b.date);
        if (a.date && !b.date) return -1;
        if (!a.date && b.date) return 1;

        return b.createdAt - a.createdAt;
    });
  }, [filteredTasks]);

  const handleSyncAll = () => {
    const syncable = sortedTasks.filter(t => !t.isCompleted && (t.date || t.time)).slice(0, 3);
    if (syncable.length === 0) {
      alert("No pending tasks with dates/times found to sync.");
      return;
    }
    
    syncable.forEach(task => {
      const title = encodeURIComponent(task.title);
      const details = encodeURIComponent(task.description || '');
      const startDate = (task.date || getLocalDateString()).replace(/-/g, '');
      let dates = `${startDate}/${startDate}`;
      
      if (task.time) {
        const timeStr = task.time.replace(':', '') + '00';
        const startDateTime = `${startDate}T${timeStr}`;
        const [hh, mm] = task.time.split(':').map(Number);
        const endHh = (hh + 1) % 24;
        const endTimeStr = endHh.toString().padStart(2, '0') + mm.toString().padStart(2, '0') + '00';
        const endDateTime = `${startDate}T${endTimeStr}`;
        dates = `${startDateTime}/${endDateTime}`;
      }
      
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
      window.open(url, '_blank');
    });
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${isFocusMode ? 'bg-[#1a0803]' : 'bg-[#0f050d]'} text-gray-100 selection:bg-velvet-500/30 selection:text-white pb-20`}>
      
      {/* Sensual Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-15%] left-[-15%] h-[800px] w-[800px] rounded-full blur-[160px] transition-all duration-1000 ${isFocusMode ? 'bg-orange-600/10' : 'bg-velvet-600/10'} animate-pulse-slow`} />
        <div className={`absolute bottom-[10%] right-[-10%] h-[600px] w-[600px] rounded-full blur-[140px] transition-all duration-1000 ${isFocusMode ? 'bg-red-800/10' : 'bg-blue-800/10'}`} />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-full w-px bg-gradient-to-b from-white/5 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 py-12">
        
        <header className="mb-12 text-center">
            <h1 className={`bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-6xl font-bold font-serif text-transparent tracking-tighter transition-all duration-700 ${isFocusMode ? 'tracking-widest italic' : ''}`}>
                {isFocusMode ? 'Obsidian Focus' : 'VelvetTodo'}
            </h1>
            <p className="mt-3 text-white/30 font-light tracking-[0.2em] uppercase text-[10px]">
                {isFocusMode ? 'The world fades. Only the task remains.' : 'Where intelligence meets aesthetic.'}
            </p>
        </header>

        <div className="mb-10">
            <InputArea onProcess={handleProcess} isProcessing={isProcessing} />
        </div>

        <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-medium text-white/80 flex items-center gap-3">
                {isFocusMode ? (
                  <span className="flex items-center gap-2 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.4)]">
                    <IconSparkles className="h-5 w-5 animate-pulse" />
                    Crucial Flow
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Current Agenda
                  </span>
                )}
                <span className="text-sm text-white/20 font-normal">
                    {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'}
                </span>
            </h2>
            
            <div className="flex gap-3">
              <button
                  onClick={handleSyncAll}
                  className="flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all bg-white/5 text-white/40 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300 group"
              >
                  <IconCalendar className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span>Sync GCal</span>
              </button>

              <button
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all shadow-xl ${
                      isFocusMode 
                      ? 'bg-orange-500 text-black border border-orange-400 hover:brightness-110' 
                      : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
              >
                  {isFocusMode ? <IconX className="h-4 w-4" /> : <IconFilter className="h-4 w-4" />}
                  <span>{isFocusMode ? 'Leave' : 'Focus'}</span>
              </button>
            </div>
        </div>

        <div className="space-y-5">
            {sortedTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="mb-6 rounded-full bg-white/[0.02] p-8 border border-white/[0.05] animate-pulse">
                        <IconSparkles className="h-10 w-10 text-white/10" />
                    </div>
                    <p className="text-white/20 font-serif text-xl italic tracking-wide max-w-sm">
                        {isFocusMode 
                          ? "Your path is clear. Pure tranquility awaits." 
                          : "Your mind is a blank canvas. Start unburdening."}
                    </p>
                </div>
            ) : (
                sortedTasks.map(task => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        onToggle={toggleTask} 
                        onDelete={deleteTask}
                    />
                ))
            )}
        </div>

      </div>
    </div>
  );
}

export default App;