"use client";

import * as React from "react";

export type ToastProps = React.HTMLAttributes<HTMLDivElement>;

export function Toast({ className, ...props }: ToastProps) {
  return <div className={className} role="status" {...props} />;
}

export function Toaster() {
  return null;
}

export function useToast() {
  return {
    toast: () => undefined,
  };
}
