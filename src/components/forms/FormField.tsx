import { ReactNode } from "react";

export const FormField = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    {children}
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);