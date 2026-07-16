import React, { useState } from "react";
import { useFormik } from "formik";
import { useTasks } from "../hooks/useTasks";
import { validateTaskForm } from "../utils/validation";
import type { TaskFormValues } from "../utils/validation";
import { BaseInput, BaseTextarea, BaseButton } from "./base";

export const TaskForm: React.FC = () => {
  const { addTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<TaskFormValues>({
    initialValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
    },
    validate: validateTaskForm,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        await addTask({
          title: values.title.trim(),
          description: values.description.trim(),
          dueDate: values.dueDate,
          priority: values.priority,
        });
        resetForm();
      } catch (err) {
        console.error("Failed to create task:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      noValidate
      className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-xl flex flex-col gap-5"
    >
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <i className="pi pi-plus-circle text-indigo-400 text-lg" />
        Create New Task
      </h2>

      <BaseInput
        id="title"
        name="title"
        label="Task Title"
        placeholder="e.g. Design Landing Page"
        required
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        touched={formik.touched.title}
        error={formik.errors.title}
      />

      {/* Description */}
      <BaseTextarea
        id="description"
        name="description"
        label="Description"
        placeholder="Provide detailed description of the task..."
        required
        rows={3}
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        touched={formik.touched.description}
        error={formik.errors.description}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Due Date */}
        <BaseInput
          id="dueDate"
          name="dueDate"
          type="date"
          label="Due Date"
          required
          value={formik.values.dueDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          touched={formik.touched.dueDate}
          error={formik.errors.dueDate}
        />

        {/* Priority */}
        <div className="flex flex-col">
          <label
            htmlFor="priority"
            className="block text-slate-300 text-sm font-medium mb-1.5 select-none"
          >
            Priority Level
            <span
              className="text-rose-500 ml-0.5"
              aria-hidden="true"
              title="Required"
            >
              *
            </span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formik.values.priority}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-required
            aria-invalid={formik.touched.priority && !!formik.errors.priority}
            className={[
              "w-full px-3 py-2.5 rounded-lg text-slate-200 text-sm",
              "bg-slate-900 border outline-none",
              "transition-all duration-200",
              "focus:ring-2",
              formik.touched.priority && formik.errors.priority
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-500/5"
                : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20",
            ].join(" ")}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          {formik.touched.priority && formik.errors.priority && (
            <span className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
              <svg
                className="shrink-0 w-3 h-3"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 10.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM7.25 5.5a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0v-3z" />
              </svg>
              {formik.errors.priority}
            </span>
          )}
        </div>
      </div>

      <BaseButton
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        loading={isSubmitting}
        leftIcon="pi pi-check"
        className="mt-2"
      >
        {isSubmitting ? "Creating…" : "Create Task"}
      </BaseButton>
    </form>
  );
};
