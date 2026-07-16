import React, { useState, useEffect, useRef } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../store/slices/taskSlice";

const Spinner: React.FC<{
  style?: React.CSSProperties;
  strokeWidth?: number;
  animationDuration?: string;
  className?: string;
}> = ({
  style = { width: "48px", height: "48px" },
  strokeWidth = 4,
  animationDuration = "0.8s",
  className = "",
}) => (
  <ProgressSpinner.Root
    style={style}
    strokeWidth={strokeWidth}
    animationDuration={animationDuration}
    className={className}
  >
    <ProgressSpinner.Track />
    <ProgressSpinner.Range />
  </ProgressSpinner.Root>
);

export const TaskList: React.FC = () => {
  const {
    tasks,
    loading,
    totalCount,
    currentPage,
    totalPages,
    fetchTasks,
    toggleTask,
  } = useTasks();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const showSkeleton = loading;

  const isMounted = useRef(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search input to avoid redundant API calls while typing
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch tasks when pagination, filters, or the debounced search term changes
  useEffect(() => {
    fetchTasks({
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, statusFilter, priorityFilter, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriorityFilter(e.target.value);
    setPage(1);
  };

  const getPriorityBadge = (priority: Task["priority"] | string) => {
    switch (priority) {
      case "low":
        return {
          label: "Low",
          badgeClass:
            "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10",
          icon: "pi pi-arrow-down text-[10px]",
        };
      case "medium":
        return {
          label: "Medium",
          badgeClass:
            "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10",
          icon: "pi pi-minus text-[10px]",
        };
      case "high":
        return {
          label: "High",
          badgeClass:
            "bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm shadow-rose-500/10",
          icon: "pi pi-arrow-up text-[10px]",
        };
      default:
        return {
          label: "Medium",
          badgeClass:
            "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10",
          icon: "pi pi-minus text-[10px]",
        };
    }
  };

  const getStatusInfo = (status: Task["status"] | string) => {
    switch (status) {
      case "todo":
        return {
          label: "To Do",
          badgeClass:
            "bg-slate-700/80 text-slate-300 border-slate-600 hover:bg-slate-600",
          icon: "pi pi-circle text-xs",
        };
      case "in_progress":
        return {
          label: "In Progress",
          badgeClass:
            "bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30",
          icon: "pi pi-spin pi-spinner text-xs",
        };
      case "completed":
      case "done":
        return {
          label: "Completed",
          badgeClass:
            "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30",
          icon: "pi pi-check-circle text-xs",
        };
      default:
        return {
          label: "To Do",
          badgeClass:
            "bg-slate-700/80 text-slate-300 border-slate-600 hover:bg-slate-600",
          icon: "pi pi-circle text-xs",
        };
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };



  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-xl flex flex-col gap-5">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="pi pi-list text-indigo-400 text-lg"></i> Task Directory
        </h2>
        <div className="flex items-center gap-2">
          <span className="bg-slate-900 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700">
            Total: {totalCount}
          </span>
          <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/20">
            {
              tasks.filter(
                (t) => t.status !== "done" && t.status !== "completed",
              ).length
            }{" "}
            Pending on Page
          </span>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/40">
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <i className="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-8 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
                setPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer p-1"
            >
              <i className="pi pi-times text-xs"></i>
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            aria-label="Filter tasks by status"
            className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="md:col-span-4">
          <select
            value={priorityFilter}
            onChange={handlePriorityChange}
            aria-label="Filter tasks by priority"
            className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>


      </div>

      {/* Task List Table or Empty State */}
      {tasks.length === 0 && !showSkeleton ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-700/50">
          <i className="pi pi-inbox text-5xl mb-3 text-slate-600"></i>
          <p className="text-base font-medium text-slate-400">No tasks found</p>
          <p className="text-xs text-slate-500 mt-1">
            {search || statusFilter || priorityFilter
              ? "Try adjusting your search query or filters above."
              : "Complete the form above to log your first task!"}
          </p>
          {(search || statusFilter || priorityFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
                setStatusFilter("");
                setPriorityFilter("");
                setPage(1);
              }}
              className="mt-4 px-4 py-1.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-semibold hover:bg-indigo-600/30 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="relative overflow-x-auto min-h-[300px] rounded-xl border border-slate-750/80 bg-slate-900/30">
          {showSkeleton && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 rounded-xl border border-indigo-500/20 shadow-2xl transition-all">
              <Spinner
                style={{ width: "48px", height: "48px" }}
                strokeWidth={4}
                animationDuration="0.8s"
              />
              <p className="text-xs font-semibold text-indigo-300 mt-3.5 tracking-wide animate-pulse">
                Loading...
              </p>
            </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-750 text-slate-400 text-xs uppercase tracking-wider select-none">
                <th className="py-3 px-4 font-semibold w-32 text-center">Status</th>
                <th className="py-3 px-4 font-semibold">Task Details</th>
                <th className="py-3 px-4 font-semibold w-32">Due Date</th>
                <th className="py-3 px-4 font-semibold w-28 text-center">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-750">
              {tasks.map((task) => {
                const statusInfo = getStatusInfo(task.status);
                const isDone =
                  task.status === "done" || task.status === "completed";
                return (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-750/30 transition-all duration-150"
                  >
                    {/* Status button */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        title="Click to change status (todo → in_progress → completed)"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer ${statusInfo.badgeClass}`}
                      >
                        <i className={statusInfo.icon}></i>
                        <span>{statusInfo.label}</span>
                      </button>
                    </td>

                    {/* Title & Description */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 max-w-xs md:max-w-md">
                        <span
                          className={`font-semibold text-slate-100 ${isDone ? "line-through text-slate-500 decoration-slate-500" : ""}`}
                        >
                          {task.title}
                        </span>
                        <span
                          className={`text-xs text-slate-400 leading-relaxed ${isDone ? "line-through text-slate-600" : ""}`}
                        >
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
                      {(() => {
                        const priorityInfo = getPriorityBadge(task.priority);
                        return (
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-150 ${priorityInfo.badgeClass}`}
                          >
                            <i className={priorityInfo.icon}></i>
                            <span>{priorityInfo.label}</span>
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-750 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              Showing{" "}
              <span className="font-semibold text-slate-200">
                {(currentPage - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-200">
                {Math.min(currentPage * limit, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-200">{totalCount}</span>{" "}
              tasks
            </div>
            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-750">
              <label
                htmlFor="rowsPerPage"
                className="text-slate-400 font-medium whitespace-nowrap"
              >
                Rows per page:
              </label>
              <select
                id="rowsPerPage"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-xs flex items-center gap-1 cursor-pointer"
            >
              <i className="pi pi-chevron-left text-[10px]"></i> Prev
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold text-xs">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-xs flex items-center gap-1 cursor-pointer"
            >
              Next <i className="pi pi-chevron-right text-[10px]"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
