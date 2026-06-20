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
        <div className="lg:col-span-8 bg-bg-surface border border-border-default rounded-lg overflow-hidden shadow-xs">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : chapters.length === 0 ? (
            <div className="p-12 text-center text-text-muted text-xs">No chapters defined yet.</div>
          ) : (
            <table className="w-full text-left border-collapse table-auto text-xs">
              <thead>
                <tr className="bg-bg-subtle/30 border-b border-border-default text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                  <th className="px-4 py-3 w-16 text-center">Index</th>
                  <th className="px-4 py-3">Chapter Name</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3 text-center w-24">Questions</th>
                  <th className="px-4 py-3 text-right w-44">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/40 text-text-secondary">
                {chapters.map((ch) => {
                  const isEditingThis = editId === ch.id;

                  if (isEditingThis) {
                    return (
                      <tr key={ch.id} className="bg-bg-subtle/20">
                        <td className="px-4 py-2 text-center">
                          <Input
                            type="number"
                            value={editOrderIndex}
                            onChange={(e) => setEditOrderIndex(e.target.value)}
                            className="w-16"
                          />
                        </td>
                        <td className="px-4 py-2" colSpan={2}>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-grow"
                            />
                            <select
                              value={editSubjectId}
                              onChange={(e) => setEditSubjectId(e.target.value)}
                              className="bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2 py-1 text-xs text-text-primary transition"
                            >
                              {subjects.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                  {sub.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center font-mono">{ch.question_count}</td>
                        <td className="px-4 py-2 text-right space-x-2">
                          <Button
                            onClick={handleSaveEdit}
                            disabled={saving}
                            variant="primary"
                            size="compact"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={handleEditCancel}
                            variant="secondary"
                            size="compact"
                          >
                            Cancel
                          </Button>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={ch.id} className="hover:bg-bg-subtle/30 transition-colors">
                      <td className="px-4 py-3.5 text-center font-mono">{ch.order_index}</td>
                      <td className="px-4 py-3.5 font-semibold text-text-primary">{ch.name}</td>
                      <td className="px-4 py-3.5 text-text-muted">{ch.subject_name}</td>
                      <td className="px-4 py-3.5 text-center font-mono">{ch.question_count}</td>
                      <td className="px-4 py-3.5 text-right space-x-3">
                        <Link
                          to={`/admin/formulas/${ch.id}`}
                          className="text-amber-500 hover:text-amber-600 hover:underline transition font-semibold"
                        >
                          Formulas
                        </Link>
                        <button
                          onClick={() => handleEditInit(ch)}
                          className="text-accent hover:text-accent-hover hover:underline transition font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ch.id, ch.question_count)}
                          className="text-text-muted hover:text-text-primary hover:underline transition font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
