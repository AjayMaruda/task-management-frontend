import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { BaseInput } from "../components/base/BaseInput";
import { BaseButton } from "../components/base/BaseButton";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  registerThunk,
  clearAuthError,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from "../store/slices/authSlice";
import { addToast } from "../store/slices/uiSlice";
import { APP_TEXT, FORM_LABELS, REGISTER_TEXT } from "../constants/uiConstants";
import { getPlaceholder } from "../constants/placeholders";
import { validateRegisterForm } from "../utils/validation";
import type { RegisterFormValues } from "../utils/validation";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);

  useEffect(() => {
    if (isAuth) navigate("/", { replace: true });
  }, [isAuth, navigate]);

  const formik = useFormik<RegisterFormValues>({
    initialValues: { name: "", phone: "", email: "", password: "" },
    validate: validateRegisterForm,
    onSubmit: async (values) => {
      try {
        await dispatch(
          registerThunk({ name: values.name, phone: values.phone, email: values.email, password: values.password }),
        ).unwrap();
        dispatch(addToast({ type: "success", message: "Account created successfully! Please sign in." }));
        navigate("/login");
      } catch {
        // Auth error is handled globally by toaster or auth slice.
      }
    },
  });

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (authError) dispatch(clearAuthError());
    formik.handleChange(e);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
            <i className="pi pi-check-square text-white text-2xl" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              {APP_TEXT.brandName}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">{APP_TEXT.tagline}</p>
          </div>
        </div>

        <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-slate-900/60">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">{REGISTER_TEXT.title}</h2>
            <p className="text-slate-400 text-sm mt-1">{REGISTER_TEXT.subtitle}</p>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <BaseInput
              id="name"
              name="name"
              type="text"
              label={FORM_LABELS.name}
              placeholder={getPlaceholder(FORM_LABELS.name)}
              required
              autoComplete="name"
              value={formik.values.name}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              touched={formik.touched.name}
              error={formik.errors.name}
            />

            <BaseInput
              id="phone"
              name="phone"
              type="tel"
              label={FORM_LABELS.phone}
              placeholder={getPlaceholder(FORM_LABELS.phone)}
              required
              autoComplete="tel"
              value={formik.values.phone}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              touched={formik.touched.phone}
              error={formik.errors.phone}
            />

            <BaseInput
              id="email"
              name="email"
              type="email"
              label={FORM_LABELS.email}
              placeholder={getPlaceholder(FORM_LABELS.email)}
              required
              autoComplete="email"
              value={formik.values.email}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              touched={formik.touched.email}
              error={formik.errors.email}
            />

            <BaseInput
              id="password"
              name="password"
              type="password"
              label={FORM_LABELS.password}
              placeholder={getPlaceholder(FORM_LABELS.password)}
              required
              autoComplete="new-password"
              value={formik.values.password}
              onChange={handleFieldChange}
              onBlur={formik.handleBlur}
              touched={formik.touched.password}
              error={formik.errors.password}
            />

            <BaseButton
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={isLoading}
              leftIcon="pi pi-user-plus"
              className="mt-1"
            >
              {isLoading ? REGISTER_TEXT.signingUp : REGISTER_TEXT.signUp}
            </BaseButton>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <p className="text-center text-slate-400 text-sm">
            {REGISTER_TEXT.haveAccount}{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              {REGISTER_TEXT.login}
            </button>
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          &copy; {new Date().getFullYear()} {APP_TEXT.brandName}.{" "}
          {APP_TEXT.footerRights}
        </p>
      </div>
    </div>
  );
};
