import React from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../services/taskService';

export const TaskList: React.FC = () => {
  const { tasks, toggleTask, deleteTask } = useTasks();

  const getPrioritySeverity = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warn';
      case 'high':
        return 'danger';
      default:
        return undefined;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-xl flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="pi pi-list text-indigo-400 text-lg"></i> Task Directory
        </h2>
        <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/20">
          {tasks.filter(t => !t.completed).length} Pending
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <i className="pi pi-inbox text-5xl mb-3"></i>
          <p className="text-lg">No tasks logged yet. Complete the form to add one!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-750 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold w-16 text-center">Status</th>
                <th className="py-3 px-4 font-semibold">Task Details</th>
                <th className="py-3 px-4 font-semibold w-32">Due Date</th>
                <th className="py-3 px-4 font-semibold w-28 text-center">Priority</th>
                <th className="py-3 px-4 font-semibold w-16 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-750">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-750/30 transition-all duration-150">
                  {/* Status toggle checkbox */}
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className={`mx-auto w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        task.completed
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-600 hover:border-indigo-450'
                      }`}
                    >
                      {task.completed && <i className="pi pi-check text-[10px] font-bold"></i>}
                    </button>
                  </td>

                  {/* Title & Description */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1 max-w-xs md:max-w-md">
                      <span className={`font-semibold text-slate-100 ${task.completed ? 'line-through text-slate-500 decoration-slate-500' : ''}`}>
                        {task.title}
                      </span>
                      <span className={`text-xs text-slate-400 leading-relaxed ${task.completed ? 'line-through text-slate-600' : ''}`}>
                        {task.description}
                      </span>
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="py-4 px-4 text-slate-300 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <i className="pi pi-calendar text-[11px] text-slate-500"></i>
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </td>

                  {/* Priority Tag */}
                  <td className="py-4 px-4 text-center">
                    <Tag
                      value={task.priority}
                      severity={getPrioritySeverity(task.priority)}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    />
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-center">
                    <Button
                      icon="pi pi-trash"
                      rounded
                      text
                      severity="danger"
                      onClick={() => deleteTask(task.id)}
                      className="p-button-rounded p-button-danger p-button-text hover:bg-rose-500/10 hover:text-rose-450 p-2 cursor-pointer transition-colors duration-150"
                      aria-label="Delete task"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
