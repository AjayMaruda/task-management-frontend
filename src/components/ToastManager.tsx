import React, { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectToasts, removeToast } from "../store/slices/uiSlice";

export const ToastManager: React.FC = () => {
  const toasts = useSelector(selectToasts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toasts.length > 0) {
      toasts.forEach((t) => {
        if (t.type === "success") {
          toast.success(t.message, { id: t.id });
        } else if (t.type === "error") {
          toast.error(t.message, { id: t.id });
        } else {
          toast(t.message, {
            id: t.id,
            icon: t.type === "warning" ? "⚠️" : "ℹ️",
          });
        }
        dispatch(removeToast(t.id));
      });
    }
  }, [toasts, dispatch]);

  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#1e293b",
          color: "#f8fafc",
          border: "1px solid #334155",
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#f43f5e",
            secondary: "#fff",
          },
        },
      }}
    />
  );
};
