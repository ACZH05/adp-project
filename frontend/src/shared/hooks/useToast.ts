import { useState } from 'react';

export interface ToastState {
  message: string;
  type: 'success' | 'info';
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  return { toast, showToast };
};
