'use client';

import { useState } from 'react';
import { useAllMedications, updateMedication, deleteMedication } from '@/lib/db-hooks';
import { MedicationListItem } from '@/components/medications/MedicationListItem';
import { MedicationForm } from '@/components/medications/MedicationForm';
import { DeleteConfirmDialog } from '@/components/medications/DeleteConfirmDialog';
import { Dialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import type { Medication } from '@/types/medication';

export default function MedicationsPage() {
  const medications = useAllMedications();
  const { showToast } = useToast();
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [deletingMed, setDeletingMed] = useState<Medication | null>(null);

  const handleUpdate = async (data: { name: string; dosage: string; instructions: string; timeSlots: string[] }) => {
    if (!editingMed?.id) return;
    await updateMedication(editingMed.id, data);
    setEditingMed(null);
    showToast('Medication updated');
  };

  const handleDelete = async () => {
    if (!deletingMed?.id) return;
    await deleteMedication(deletingMed.id);
    setDeletingMed(null);
    showToast('Medication deleted');
  };

  if (medications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="text-6xl mb-4">📋</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No medications</h2>
        <p className="text-lg text-gray-600 mb-6">Add medications to manage them here</p>
        <Link href="/add">
          <Button size="lg">Add Medication</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {medications.map((med) => (
        <MedicationListItem
          key={med.id}
          medication={med}
          onEdit={() => setEditingMed(med)}
          onDelete={() => setDeletingMed(med)}
        />
      ))}

      <div className="mt-4">
        <Link href="/add">
          <Button variant="secondary" size="lg" className="w-full">
            + Add Medication
          </Button>
        </Link>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingMed}
        onClose={() => setEditingMed(null)}
        title="Edit Medication"
      >
        {editingMed && (
          <MedicationForm
            initialData={{
              name: editingMed.name,
              dosage: editingMed.dosage,
              instructions: editingMed.instructions,
              timeSlots: editingMed.timeSlots,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingMed(null)}
            submitLabel="Save Changes"
          />
        )}
      </Dialog>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={!!deletingMed}
        medicationName={deletingMed?.name ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeletingMed(null)}
      />
    </div>
  );
}
