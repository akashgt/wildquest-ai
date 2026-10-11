import React, { useState, useRef } from 'react';
import { CheckCircle2, Camera, X, ArrowRight, BookOpen } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import type { Quest } from '../../services/ai/types';

interface QuestCompletionModalProps {
  isOpen: boolean;
  quest: Quest | null;
  stepNumber: number;
  totalSteps: number;
  isFinalQuest: boolean;
  onComplete: (note?: string, photoUrl?: string) => Promise<void>;
  onClose: () => void;
}

export const QuestCompletionModal: React.FC<QuestCompletionModalProps> = ({
  isOpen,
  quest,
  stepNumber,
  totalSteps,
  isFinalQuest,
  onComplete,
  onClose
}) => {
  const [reflectionNote, setReflectionNote] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!quest) return null;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to base64 with downscaling for local storage efficiency
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDimension = 1200;
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        setPhotoUrl(compressedBase64);
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(reflectionNote, photoUrl || undefined);
      setReflectionNote('');
      setPhotoUrl(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-forest-600" />
          </div>
          <span>Quest Completed!</span>
        </div>
      }
      maxWidth="md"
    >
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between text-xs text-forest-600 mb-1 font-mono">
            <span>Step {stepNumber} of {totalSteps}</span>
            <Badge variant="sage" size="sm">{quest.category}</Badge>
          </div>
          <h4 className="text-xl font-bold font-display text-forest-900">
            {quest.title}
          </h4>
        </div>

        {/* Reflection prompt */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-forest-600" />
            {quest.reflectionPrompt || 'What did you observe or feel? (Optional)'}
          </label>
          <textarea
            value={reflectionNote}
            onChange={e => setReflectionNote(e.target.value)}
            rows={3}
            placeholder="Jot down a quick thought, a sensation, or a pattern you noticed..."
            className="w-full rounded-2xl border border-sage-200 bg-ivory-100/70 p-3.5 text-xs sm:text-sm text-forest-900 placeholder:text-forest-600/50 focus:outline-none focus:ring-2 focus:ring-forest-600 resize-none"
          />
        </div>

        {/* Optional photo capture */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-2">
            Optional Field Photo
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelect}
            className="hidden"
          />

          {photoUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-sage-200 h-40 bg-black/5">
              <img src={photoUrl} alt="Quest observation" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotoUrl(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-forest-950/70 text-ivory-50 hover:bg-forest-900 transition-colors"
                aria-label="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-sage-300 rounded-2xl text-xs font-medium text-forest-700 hover:border-forest-600 hover:bg-sage-100/40 transition-colors flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-forest-600" />
              <span>Attach a photo of your observation</span>
            </button>
          )}
        </div>

        <div className="pt-2 flex justify-end gap-3 border-t border-sage-200/60">
          <Button
            variant="sunlight"
            size="md"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            {isFinalQuest ? 'Complete Adventure' : 'Next Quest'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
