import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  onBlur, 
  error, 
  placeholder,
  required = false 
}) => (
  <div>
    <Label htmlFor={name} className="text-sm font-medium text-gray-700 mb-2 block">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    <Input
      type={type}
      id={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
        error ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
      }`}
    />
    {error && (
      <div className="text-red-600 text-sm mt-1 flex items-center">
        <span className="w-4 h-4 mr-1">⚠</span>
        {error}
      </div>
    )}
  </div>
);