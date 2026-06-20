import { useToastStore } from '../store/toastStore';

export default function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  return {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
  };
}
export { useToast };
