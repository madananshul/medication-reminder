'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TIME_SLOTS } from '@/lib/constants';
import type { PrescriptionMedication, PrescriptionAnalysis } from '@/lib/claude-vision';

interface PrescriptionReviewProps {
  analysis: PrescriptionAnalysis;
  onSave: (medications: PrescriptionMedication[]) => void;
  onCancel: () => void;
  saving: boolean;
}

const confidenceColors = {
  high: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-red-100 text-red-800',
};

export function PrescriptionReview({ analysis, onSave, onCancel, saving }: PrescriptionReviewProps) {
  const [medications, setMedications] = useState<PrescriptionMedication[]>(analysis.medications);
  const [selected, setSelected] = useState<boolean[]>(() => analysis.medications.map(() => true));
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const selectedCount = selected.filter(Boolean).length;
  const allSelected = selected.every(Boolean);

  const toggleAll = () => {
    const newValue = !allSelected;
    setSelected(selected.map(() => newValue));
  };

  const toggleOne = (index: number) => {
    setSelected(prev => prev.map((v, i) => (i === index ? !v : v)));
  };

  const updateMedication = (index: number, updates: Partial<PrescriptionMedication>) => {
    setMedications(prev => prev.map((m, i) => (i === index ? { ...m, ...updates } : m)));
  };

  const toggleTimeSlot = (medIndex: number, slotId: string) => {
    const med = medications[medIndex];
    const newSlots = med.timeSlots.includes(slotId)
      ? med.timeSlots.filter(s => s !== slotId)
      : [...med.timeSlots, slotId];
    if (newSlots.length > 0) {
      updateMedication(medIndex, { timeSlots: newSlots });
    }
  };

  const handleSave = () => {
    const selectedMeds = medications.filter((_, i) => selected[i]);
    onSave(selectedMeds);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Found {medications.length} medication{medications.length !== 1 ? 's' : ''}
            </h2>
            <p className="text-base text-gray-600 mt-1">Review and select which to add</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${confidenceColors[analysis.overallConfidence]}`}>
            {analysis.overallConfidence} confidence
          </span>
        </div>
      </Card>

      {/* Select All toggle */}
      <button
        type="button"
        onClick={toggleAll}
        className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${allSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}>
          {allSelected && <span className="text-white text-sm">✓</span>}
        </div>
        {allSelected ? 'Deselect All' : 'Select All'}
      </button>

      {/* Medication cards */}
      {medications.map((med, index) => (
        <Card key={index} className={`transition-opacity ${selected[index] ? '' : 'opacity-50'}`}>
          <div className="space-y-3">
            {/* Checkbox + Name + Dosage row */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => toggleOne(index)}
                className="mt-1 shrink-0"
              >
                <div className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-colors ${selected[index] ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}>
                  {selected[index] && <span className="text-white text-base">✓</span>}
                </div>
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-gray-900 truncate">{med.name}</p>
                <p className="text-base text-gray-600">{med.dosage}</p>
                {med.instructions && (
                  <p className="text-sm text-gray-500 mt-1">{med.instructions}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${confidenceColors[med.confidence]}`}>
                  {med.confidence}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                >
                  {editingIndex === index ? 'Done' : 'Edit'}
                </Button>
              </div>
            </div>

            {/* Time slot badges */}
            <div className="flex flex-wrap gap-2 ml-10">
              {TIME_SLOTS.filter(slot => med.timeSlots.includes(slot.id)).map(slot => (
                <span key={slot.id} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {slot.icon} {slot.label}
                </span>
              ))}
            </div>

            {/* Inline edit fields */}
            {editingIndex === index && (
              <div className="ml-10 space-y-3 pt-2 border-t border-gray-100">
                <Input
                  label="Medication Name"
                  value={med.name}
                  onChange={e => updateMedication(index, { name: e.target.value })}
                />
                <Input
                  label="Dosage"
                  value={med.dosage}
                  onChange={e => updateMedication(index, { dosage: e.target.value })}
                />
                <Input
                  label="Instructions"
                  value={med.instructions}
                  onChange={e => updateMedication(index, { instructions: e.target.value })}
                />
                <div className="space-y-1">
                  <p className="text-base font-medium text-gray-700">Time Slots</p>
                  <div className="flex flex-wrap gap-2">
                    {TIME_SLOTS.map(slot => {
                      const active = med.timeSlots.includes(slot.id);
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => toggleTimeSlot(index, slot.id)}
                          className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl text-base font-medium transition-colors ${
                            active
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {slot.icon} {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* Footer buttons */}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={handleSave}
          loading={saving}
          disabled={selectedCount === 0}
        >
          {saving ? 'Adding...' : `Add ${selectedCount} Medication${selectedCount !== 1 ? 's' : ''}`}
        </Button>
      </div>
    </div>
  );
}
