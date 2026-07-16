import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/** Typed dispatch — preserves async thunk types */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/** Typed selector — no need to annotate RootState manually */
export const useAppSelector = useSelector.withTypes<RootState>();
