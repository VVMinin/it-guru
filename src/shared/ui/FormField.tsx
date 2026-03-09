import { useId, type ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children: (id: string) => ReactNode;
}

export const FormField = ({ label, error, children }: FormFieldProps) => {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
      {children(id)}
      {error?.message && (
        <p role="alert" aria-live="polite" className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
};
