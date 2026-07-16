import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import { BaseButton } from '../components/base/BaseButton';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

export const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tasks } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Premium Header */}
      <header className="border-b border-slate-800 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <i className="pi pi-check-square text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white m-0">TaskFlow</h1>
              <p className="text-xs text-slate-400 m-0">Premium Workspace Dashboard</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right hidden sm:block">
              <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold">Progress</span>
              <span className="text-sm font-bold text-slate-200">
                {completedTasks}/{totalTasks} Completed ({completionPercentage}%)
              </span>
            </div>
            <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <BaseButton
              type="button"
              variant="ghost"
              size="sm"
              leftIcon="pi pi-sign-out"
              onClick={handleLogout}
            >
              Logout
            </BaseButton>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Welcome Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">
              Task Workspace
            </h2>
            <p className="text-slate-300 max-w-xl text-sm md:text-base leading-relaxed">
              Create, organize, and track your daily tasks using our sleek dashboard built with PrimeReact interactive components, Formik validation, and Tailwind CSS.
            </p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="bg-slate-850 border border-slate-700/50 p-4 rounded-xl flex-1 sm:flex-initial text-center sm:text-left min-w-[100px]">
              <span className="block text-2xl font-black text-white">{totalTasks}</span>
              <span className="text-xs text-slate-400">Total Tasks</span>
            </div>
            <div className="bg-slate-850 border border-slate-700/50 p-4 rounded-xl flex-1 sm:flex-initial text-center sm:text-left min-w-[100px]">
              <span className="block text-2xl font-black text-emerald-400">{completedTasks}</span>
              <span className="text-xs text-slate-400">Completed</span>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <TaskForm />
          </div>

          {/* List Column */}
          <div className="lg:col-span-2">
            <TaskList />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/20 py-6 text-center text-xs text-slate-500 mt-auto">
        <p>&copy; {new Date().getFullYear()} TaskFlow Workspace. Driven by React, PrimeReact, & Tailwind CSS.</p>
      </footer>
    </div>
  );
};
