import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function AdminChaptersPage() {
  const toast = useToast();
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing / Creation Forms
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSubjectId, setEditSubjectId] = useState('');
  const [editOrderIndex, setEditOrderIndex] = useState(0);

  const [newName, setNewName] = useState('');
  const [newSubjectId, setNewSubjectId] = useState('');
  const [newOrderIndex, setNewOrderIndex] = useState(0);

  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const chRes = await api.get('/api/admin/chapters');
      setChapters(chRes.data.data);

      const subRes = await api.get('/api/subjects');
      setSubjects(subRes.data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load chapters list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newSubjectId) {
      toast.warning('Please select a subject.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/api/admin/chapters', {
        subject_id: parseInt(newSubjectId, 10),
        name: newName,
        order_index: parseInt(newOrderIndex, 10),
      });
      toast.success('Chapter created successfully.');
      setNewName('');
      setNewOrderIndex(0);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create chapter.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditInit = (ch) => {
    setEditId(ch.id);
    setEditName(ch.name);
    setEditSubjectId(ch.subject_id);
    setEditOrderIndex(ch.order_index);
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/api/admin/chapters/${editId}`, {
        subject_id: parseInt(editSubjectId, 10),
        name: editName,
        order_index: parseInt(editOrderIndex, 10),
      });
      toast.success('Chapter updated successfully.');
      setEditId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, qCount) => {
    if (qCount > 0) {
      toast.warning('Cannot delete a chapter containing questions. Please delete the questions first.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this chapter?')) return;
    try {
      await api.delete(`/api/admin/chapters/${id}`);
      toast.success('Chapter deleted successfully.');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete chapter.');
    }
  };

  return (
    <div className="space-y-6 text-text-primary select-none animate-slide-in">
      <div className="border-b border-border-default/60 pb-5">
        <h1 className="text-[17px] font-semibold text-text-primary uppercase tracking-wider">Manage Chapters</h1>
        <p className="text-[12px] text-text-secondary mt-1">Configure subjects, chapters, and question orders.</p>
      </div>

      {error && (
        <div className="p-3 bg-danger-bg border border-danger/25 text-danger text-[12.5px] rounded-md flex items-start gap-2 animate-slide-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Create New + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Create Chapter Panel */}
        <div className="lg:col-span-4 bg-bg-surface border border-border-default p-5 rounded-lg space-y-4">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Create Chapter</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Subject</label>
              <select
                value={newSubjectId}
                onChange={(e) => setNewSubjectId(e.target.value)}
                className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2 py-1.5 text-xs text-text-primary h-[34px] transition"
                required
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Chapter Name</label>
              <Input
                type="text"
                placeholder="e.g. Kinematics"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Order Index</label>
              <Input
                type="number"
                value={newOrderIndex}
                onChange={(e) => setNewOrderIndex(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={saving}
              variant="primary"
              className="w-full mt-2"
            >
              {saving ? 'Creating...' : 'Create Chapter'}
            </Button>
          </form>
        </div>

        {/* Chapters Table */}
        <div className="lg:col-span-8 space-y-3">
          {loading ? (
            <div className="flex justify-center py-16 bg-bg-surface rounded-lg border border-border-default/60 shadow-xs">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : chapters.length === 0 ? (
            <div className="bg-bg-surface border border-border-default/60 p-12 text-center text-text-muted text-xs rounded-lg shadow-xs">
              No chapters defined yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {chapters.map((ch) => {
                const isEditingThis = editId === ch.id;

                if (isEditingThis) {
                  return (
                    <div
                      key={ch.id}
                      className="bg-bg-surface border border-accent/40 p-4 rounded-xl flex flex-col gap-3 shadow-sm"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">
                            Index
                          </label>
                          <Input
                            type="number"
                            value={editOrderIndex}
                            onChange={(e) => setEditOrderIndex(e.target.value)}
                            className="h-8 py-1"
                          />
                        </div>
                        <div className="sm:col-span-6">
                          <label className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">
                            Chapter Name
                          </label>
                          <Input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 py-1"
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <label className="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">
                            Subject
                          </label>
                          <select
                            value={editSubjectId}
                            onChange={(e) => setEditSubjectId(e.target.value)}
                            className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2 py-1 text-xs text-text-primary h-8 transition"
                          >
                            {subjects.map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2.5 border-t border-border-default/30">
                        <Button
                          onClick={handleSaveEdit}
                          disabled={saving}
                          variant="primary"
                          size="compact"
                          className="h-7"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={handleEditCancel}
                          variant="secondary"
                          size="compact"
                          className="h-7"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={ch.id}
                    className="bg-bg-surface border border-border-default hover:border-border-focus hover:bg-bg-subtle/20 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-150 shadow-xs"
                  >
                    {/* Index & Name */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <span className="bg-bg-app border border-border-default/80 text-text-muted px-2.5 py-1 rounded-md text-[10.5px] font-mono font-bold shrink-0">
                        Index: {ch.order_index}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-xs font-semibold text-text-primary truncate">{ch.name}</h3>
                        <p className="text-[10px] text-text-muted mt-0.5">{ch.subject_name}</p>
                      </div>
                    </div>

                    {/* Question Counter Pill */}
                    <div className="shrink-0 flex items-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border bg-accent/15 border-accent/25 text-accent">
                        📚 {ch.question_count} questions
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2.5 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border-default/30">
                      <Button
                        variant="secondary"
                        size="compact"
                        onClick={() => handleEditInit(ch)}
                        className="h-8 text-xs px-2.5 font-semibold border-border-default/60 hover:border-accent hover:text-accent"
                      >
                        Edit
                      </Button>
                      <Link
                        to={`/admin/formulas/${ch.id}`}
                        className="inline-flex items-center justify-center font-semibold rounded-md h-[28px] px-2.5 text-[11.5px] bg-transparent border border-border-default text-text-primary hover:bg-bg-subtle hover:text-amber-500 transition-colors"
                      >
                        Formulas
                      </Link>
                      <Button
                        variant="ghost"
                        size="compact"
                        onClick={() => handleDelete(ch.id, ch.question_count)}
                        className="h-8 text-xs px-2.5 font-semibold hover:bg-danger-bg hover:text-danger border border-transparent hover:border-danger/25"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
