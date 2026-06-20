import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function AdminChaptersPage() {
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
      alert('Please select a subject.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/api/admin/chapters', {
        subject_id: parseInt(newSubjectId, 10),
        name: newName,
        order_index: parseInt(newOrderIndex, 10),
      });
      setNewName('');
      setNewOrderIndex(0);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to create chapter.');
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
      setEditId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, qCount) => {
    if (qCount > 0) {
      alert('Cannot delete a chapter containing questions. Please delete the questions first.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this chapter?')) return;
    try {
      await api.delete(`/api/admin/chapters/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete chapter.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-white uppercase tracking-wider">Manage Chapters</h1>
        <p className="text-xs text-navy-400 mt-0.5">Configure subjects, chapters, and question orders.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-500/50 text-red-400 text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* Grid: Create New + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Create Chapter Panel */}
        <div className="lg:col-span-4 bg-navy-850 border border-navy-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Create Chapter</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-[9px] font-bold text-navy-500 uppercase tracking-wider mb-1">Subject</label>
              <select
                value={newSubjectId}
                onChange={(e) => setNewSubjectId(e.target.value)}
                className="w-full bg-navy-900 border border-navy-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand-red text-white"
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
              <label className="block text-[9px] font-bold text-navy-500 uppercase tracking-wider mb-1">Chapter Name</label>
              <input
                type="text"
                placeholder="e.g. Kinematics"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-navy-900 border border-navy-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-navy-500 focus:outline-none focus:border-brand-red"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-navy-500 uppercase tracking-wider mb-1">Order Index</label>
              <input
                type="number"
                value={newOrderIndex}
                onChange={(e) => setNewOrderIndex(e.target.value)}
                className="w-full bg-navy-900 border border-navy-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-red"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-lg transition disabled:opacity-40 cursor-pointer"
            >
              {saving ? 'Creating...' : 'Create Chapter'}
            </button>
          </form>
        </div>

        {/* Chapters Table */}
        <div className="lg:col-span-8 bg-navy-850 border border-navy-800 rounded-2xl overflow-hidden shadow-lg">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : chapters.length === 0 ? (
            <div className="p-8 text-center text-navy-400 text-xs">No chapters defined yet.</div>
          ) : (
            <table className="w-full text-left border-collapse table-auto text-xs">
              <thead>
                <tr className="bg-navy-900 border-b border-navy-800 text-[10px] font-bold text-navy-400 uppercase tracking-wider">
                  <th className="px-4 py-3 w-16 text-center">Index</th>
                  <th className="px-4 py-3">Chapter Name</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3 text-center w-24">Questions</th>
                  <th className="px-4 py-3 text-right w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/40 text-navy-300">
                {chapters.map((ch) => {
                  const isEditingThis = editId === ch.id;

                  if (isEditingThis) {
                    return (
                      <tr key={ch.id} className="bg-navy-900/40">
                        <td className="px-4 py-2 text-center">
                          <input
                            type="number"
                            value={editOrderIndex}
                            onChange={(e) => setEditOrderIndex(e.target.value)}
                            className="w-12 bg-navy-900 border border-navy-700 rounded px-1.5 py-1 text-xs text-white"
                          />
                        </td>
                        <td className="px-4 py-2" colSpan={2}>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-grow bg-navy-900 border border-navy-700 rounded px-2 py-1 text-xs text-white"
                            />
                            <select
                              value={editSubjectId}
                              onChange={(e) => setEditSubjectId(e.target.value)}
                              className="bg-navy-900 border border-navy-700 rounded px-2 py-1 text-xs text-white"
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
                          <button
                            onClick={handleSaveEdit}
                            disabled={saving}
                            className="text-green-400 hover:underline font-bold cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="text-navy-400 hover:underline font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={ch.id} className="hover:bg-navy-800/20 transition-colors">
                      <td className="px-4 py-3.5 text-center font-mono">{ch.order_index}</td>
                      <td className="px-4 py-3.5 font-bold text-white">{ch.name}</td>
                      <td className="px-4 py-3.5 text-navy-400">{ch.subject_name}</td>
                      <td className="px-4 py-3.5 text-center font-mono">{ch.question_count}</td>
                      <td className="px-4 py-3.5 text-right space-x-3">
                        <Link
                          to={`/admin/formulas/${ch.id}`}
                          className="text-amber-500 hover:text-amber-400 hover:underline transition font-bold cursor-pointer"
                        >
                          Formulas
                        </Link>
                        <button
                          onClick={() => handleEditInit(ch)}
                          className="text-blue-400 hover:text-blue-300 hover:underline transition font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ch.id, ch.question_count)}
                          className="text-brand-red hover:text-red-400 hover:underline transition font-bold cursor-pointer"
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
