import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Search, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Plus
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { dbService } from '../../services/db/indexedDb';
import type { JournalEntry } from '../../services/db/types';
import { useApp } from '../../context/AppContext';

export const JournalView: React.FC = () => {
  const { refreshStatsAndAchievements, setCurrentView } = useApp();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all');

  // Edit entry modal state
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [editedNotes, setEditedNotes] = useState<string>('');

  // Delete single confirmation
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Wipe all data confirmation
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  // Photo viewer modal
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Import feedback
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadEntries = async () => {
    try {
      const list = await dbService.getJournalEntries();
      setEntries(list);
    } catch (err) {
      console.error('Failed to load journal entries:', err);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.adventureTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.personalNotes && entry.personalNotes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      entry.completedQuests.some(q => q.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesEnv = selectedEnvironment === 'all' || entry.environment === selectedEnvironment;

    return matchesSearch && matchesEnv;
  });

  const handleDeleteEntry = async (id: string) => {
    await dbService.deleteJournalEntry(id);
    setDeleteTargetId(null);
    await loadEntries();
    await refreshStatsAndAchievements();
  };

  const handleSaveEdit = async () => {
    if (!editingEntry) return;
    const updated: JournalEntry = {
      ...editingEntry,
      personalNotes: editedNotes,
      updatedAt: new Date().toISOString()
    };
    await dbService.saveJournalEntry(updated);
    setEditingEntry(null);
    await loadEntries();
    await refreshStatsAndAchievements();
  };

  const handleExportJSON = async () => {
    const jsonStr = await dbService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wildquest-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const res = await dbService.importData(content);
        if (res.success) {
          setImportStatus({
            message: `Successfully imported ${res.count} records.`,
            isError: false
          });
          await loadEntries();
          await refreshStatsAndAchievements();
        } else {
          setImportStatus({
            message: res.error || 'Import failed. Check JSON schema.',
            isError: true
          });
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleWipeAll = async () => {
    await dbService.wipeAllData();
    setShowWipeConfirm(false);
    await loadEntries();
    await refreshStatsAndAchievements();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-forest-700/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sunlight-400 font-mono">
              On-Device Records
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-sunlight-400" />
            <span className="text-xs text-sage-200">100% Private</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-ivory-50 tracking-tight drop-shadow-sm">
            Nature Journal
          </h1>
          <p className="text-sm text-sage-200/90 mt-0.5">
            Reflections, photos, and micro-observations recorded from your outdoor quests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />

          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload className="w-3.5 h-3.5" />}
          >
            Import JSON
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportJSON}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export JSON
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowWipeConfirm(true)}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Wipe Data
          </Button>
        </div>
      </div>

      {importStatus && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
          importStatus.isError
            ? 'bg-terracotta-100 text-terracotta-800 border-terracotta-300'
            : 'bg-sage-100 text-forest-800 border-sage-300'
        }`}>
          <span>{importStatus.message}</span>
          <button onClick={() => setImportStatus(null)} className="p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-600/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search reflections, adventures, or observed species..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-sage-200 bg-ivory-50 text-xs sm:text-sm text-forest-900 placeholder:text-forest-600/50 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'garden', 'urban', 'park', 'forest', 'waterfront'] as const).map(env => (
            <button
              key={env}
              onClick={() => setSelectedEnvironment(env)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize shrink-0 transition-all ${
                selectedEnvironment === env
                  ? 'bg-forest-700 text-ivory-50 shadow-soft-sm'
                  : 'bg-sage-100 text-forest-800 hover:bg-sage-200'
              }`}
            >
              {env}
            </button>
          ))}
        </div>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <Card variant="default" className="p-12 text-center text-forest-700">
          <BookOpen className="w-12 h-12 text-sage-300 mx-auto mb-3" />
          <h3 className="font-bold font-display text-lg text-forest-900 mb-1">
            {searchQuery ? 'No matching entries found' : 'Your nature journal is empty'}
          </h3>
          <p className="text-xs sm:text-sm text-forest-600 max-w-sm mx-auto mb-6">
            {searchQuery 
              ? 'Try modifying your search keywords or clear the environment filter.' 
              : 'Start your first adventure today to capture sensory reflections and field observations.'}
          </p>
          {!searchQuery && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentView('dashboard')}
              icon={<Plus className="w-4 h-4" />}
            >
              Go to Adventures
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredEntries.map(entry => (
            <Card key={entry.id} variant="default" className="p-5 sm:p-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sage-200/50 pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-forest-600 mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {entry.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {entry.outdoorMinutes} minutes
                    </span>
                    <span>·</span>
                    <span className="capitalize">{entry.environment}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-forest-900">
                    {entry.adventureTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setEditingEntry(entry);
                      setEditedNotes(entry.personalNotes || '');
                    }}
                    className="p-1.5 rounded-xl hover:bg-forest-100 text-forest-700 transition-colors"
                    title="Edit personal notes"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(entry.id)}
                    className="p-1.5 rounded-xl hover:bg-terracotta-100 text-terracotta-600 transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Completed Quests List */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-forest-800 uppercase tracking-wider font-mono">
                  Completed Quests ({entry.completedQuests.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {entry.completedQuests.map((q, qIdx) => (
                    <div 
                      key={qIdx}
                      className="p-2.5 rounded-xl bg-sage-100/60 border border-sage-200/80 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 font-medium text-forest-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                        <span className="truncate">{q.title}</span>
                      </div>
                      <Badge variant="sage" size="sm">{q.category}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Notes */}
              {entry.personalNotes && (
                <div className="p-4 rounded-2xl bg-ivory-100 border border-sage-200/80 text-xs sm:text-sm text-forest-850 leading-relaxed whitespace-pre-line italic">
                  "{entry.personalNotes}"
                </div>
              )}

              {/* Optional Field Photo */}
              {entry.photoUrl && (
                <div>
                  <div className="text-xs font-bold text-forest-800 uppercase tracking-wider font-mono mb-2">
                    Field Photograph
                  </div>
                  <div 
                    onClick={() => setPreviewPhoto(entry.photoUrl!)}
                    className="w-full sm:w-64 h-44 rounded-2xl overflow-hidden border border-sage-200 cursor-pointer shadow-soft-sm hover:opacity-95 transition-opacity"
                  >
                    <img src={entry.photoUrl} alt="Nature reflection" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Edit Entry Modal */}
      <Modal
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        title="Edit Nature Reflection"
      >
        <div className="space-y-4">
          <textarea
            value={editedNotes}
            onChange={e => setEditedNotes(e.target.value)}
            rows={5}
            className="w-full p-3.5 rounded-2xl border border-sage-200 bg-ivory-100/70 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 resize-none"
            placeholder="Write your observation notes..."
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setEditingEntry(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveEdit}>
              Save Notes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Single Entry Confirmation Modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Journal Entry?"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
            Are you sure you want to delete this journal entry? This action removes it permanently from your local device storage.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteTargetId && handleDeleteEntry(deleteTargetId)}
            >
              Delete Entry
            </Button>
          </div>
        </div>
      </Modal>

      {/* Wipe All Data Confirmation Modal */}
      <Modal
        isOpen={showWipeConfirm}
        onClose={() => setShowWipeConfirm(false)}
        title="Wipe All Application Data?"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-terracotta-100 border border-terracotta-300 text-xs text-terracotta-800 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-terracotta-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Warning:</strong> This permanently erases all saved adventures, nature journal reflections, photographs, recorded outdoor minutes, and unlocked badges from IndexedDB.
            </div>
          </div>
          <p className="text-xs text-forest-700">
            Consider using <strong>Export JSON</strong> before wiping if you want to keep an offline backup file.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setShowWipeConfirm(false)}>
              Keep My Data
            </Button>
            <Button variant="danger" size="sm" onClick={handleWipeAll}>
              Wipe Everything
            </Button>
          </div>
        </div>
      </Modal>

      {/* Photo Lightbox Modal */}
      <Modal
        isOpen={!!previewPhoto}
        onClose={() => setPreviewPhoto(null)}
        title="Field Photograph"
        maxWidth="lg"
      >
        {previewPhoto && (
          <div className="flex flex-col items-center">
            <img src={previewPhoto} alt="Field observation" className="max-h-[70vh] rounded-2xl object-contain border border-sage-200" />
          </div>
        )}
      </Modal>
    </div>
  );
};
