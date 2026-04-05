'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="backdrop:bg-black/50 bg-white rounded-2xl p-0 m-auto max-w-md w-[calc(100%-2rem)] shadow-xl"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        {children}
      </div>
    </dialog>
  );
}
