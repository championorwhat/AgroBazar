"use client";

import React from "react";

// Basic Input Field
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`border rounded-md p-2 w-full ${props.className || ""}`} />;
}

// Label Component
export function Label({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
  return <label htmlFor={htmlFor} className={`block font-semibold my-2 ${className || ""}`}>{children}</label>;
}

// Select Dropdown
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`border rounded-md p-2 w-full ${props.className || ""}`} />;
}

// Button Component
export function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${className || ""}`}>
      {children}
    </button>
  );
}

// Card UI
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`border rounded-lg p-4 shadow ${className || ""}`}>{children}</div>;
}

// Card Content
export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className || ""}>{children}</div>;
}

// Textarea Component
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`border rounded-md p-2 w-full ${props.className || ""}`} />;
}

// Form Components
export function Form({ children, onSubmit, className }: { children: React.ReactNode; onSubmit: (e: React.FormEvent) => void; className?: string }) {
  return <form onSubmit={onSubmit} className={className}>{children}</form>;
}

export function FormItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-4 ${className || ""}`}>{children}</div>;
}

export function FormLabel({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
  return <label htmlFor={htmlFor} className={`block font-semibold my-2 ${className || ""}`}>{children}</label>;
}

export function FormControl({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function FormMessage({ message, className }: { message?: string; className?: string }) {
  return message ? <p className={`text-red-500 text-sm ${className || ""}`}>{message}</p> : null;
}

// Slider Component
export function Slider({ min, max, step, value, onChange, className }: { min: number; max: number; step: number; value: number; onChange: (value: number) => void; className?: string }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full ${className || ""}`}
    />
  );
}

// Tabs Component
export function Tabs({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-b ${className || ""}`}>{children}</div>;
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex ${className || ""}`}>{children}</div>;
}

export function TabsTrigger({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`px-4 py-2 border-b-2 hover:border-blue-500 focus:border-blue-500 ${className || ""}`}>
      {children}
    </button>
  );
}

export function TabsContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

// Radio Group Component
interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function RadioGroup({ value, onValueChange, children, className }: RadioGroupProps) {
  return (
    <div className={className || ""}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<React.InputHTMLAttributes<HTMLInputElement>>(child)) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value),
          });
        }
        return child;
      })}
    </div>
  );
}

export function RadioGroupItem(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="radio" {...props} />;
}

// Toast Function
export function toast({ title, description, variant }: { title: string; description?: string; variant?: "info" | "success" | "error" }) {
  console.log(`${variant || "info"}: ${title} - ${description || ""}`);
}
