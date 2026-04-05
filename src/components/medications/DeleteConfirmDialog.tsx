'use client';

import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface DeleteConfirmDialogProps {
  open: boolean;
  medicationName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({ open, medicationName, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} title="Delete Medication?">
      <p className="text-lg text-gray-700 mb-6">
        Are you sure you want to delete <strong>{medicationName}</strong>? This will also remove all tracking history for this medication.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" size="lg" className="flex-1" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Dialog>
  );
}
