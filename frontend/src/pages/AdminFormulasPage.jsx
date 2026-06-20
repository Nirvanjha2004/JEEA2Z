import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import katex from 'katex';
import api from '../api';
import { useToast } from '../components/Toast';
import { ArrowLeft, Plus, Trash2, Edit2, Move, HelpCircle } from 'lucide-react';

// Dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Row Wrapper Component
function SortableFormulaRow({ formula, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: formula.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderedLatex = (() => {
    try {
      return katex.renderToString(formula.latex, {
        throwOnError: false,
        displayMode: false, // compact inline mode for rows
      });
    } catch (err) {
      return formula.latex;
    }
  })();

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-border-default hover:bg-bg-subtle/50 transition-colors"
    >
      <td className="px-3 py-3 w-10 text-center">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-text-muted hover:text-text-primary cursor-grab active:cursor-grabbing p-1"
        >
          <Move className="w-3.5 h-3.5" />
        </button>
      </td>
      <td className="px-3 py-3 font-medium text-text-primary text-[13px] max-w-[140px] truncate">
        {formula.title}
      </td>
      <td className="px-3 py-3 text-[13px] text-text-secondary overflow-x-auto max-w-[200px] scrollbar-none">
        <div dangerouslySetInnerHTML={{ __html: renderedLatex }} />
      </td>
      <td className="px-3 py-3 text-right w-28 space-x-1.5">
        <button
          onClick={() => onEdit(formula)}
          className="text-accent hover:text-accent-hover transition p-1 cursor-pointer inline-flex"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(formula.id)}
          className="text-danger hover:text-red-400 transition p-1 cursor-pointer inline-flex"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

export default function AdminFormulasPage() {
  const { chapterId } = useParams();
  const toast = useToast();
  const [chapter, setChapter] = useState(null);
  const [sheetId, setSheetId] = useState(null);
  const [intro, setIntro] = useState('');
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editingFormulaId, setEditingFormulaId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formLatex, setFormLatex] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState([]);
  const [variables, setVariables] = useState([{ key: '', value: '' }]);

  // Sensors for DnD reordering
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px threshold to prevent accidental drags on clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const availableTags = ['important', 'frequently asked', 'derivation', 'memorize'];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [chListRes, sheetRes] = await Promise.all([
        api.get('/api/admin/chapters'),
        api.get(`/api/formulas/chapter/${chapterId}`),
      ]);

      const foundChapter = chListRes.data?.data?.find(
        (c) => c.id === parseInt(chapterId, 10)
      );
      setChapter(foundChapter);

      if (sheetRes.data.success) {
        setSheetId(sheetRes.data.id || null);
        setIntro(sheetRes.data.intro || '');
        setFormulas(sheetRes.data.formulas || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load formulas details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [chapterId]);

  // Live KaTeX formula preview helper
  const formLatexPreview = (() => {
    if (!formLatex.trim()) return '';
    try {
      return katex.renderToString(formLatex, {
        throwOnError: false,
        displayMode: true,
      });
    } catch (err) {
      return `<span class="text-danger">${err.message}</span>`;
    }
  })();

  const handleUpsertSheet = async () => {
    try {
      const res = await api.post('/api/admin/formulas/sheet', {
        chapterId: parseInt(chapterId, 10),
        intro,
      });
      setSheetId(res.data.sheet.id);
      toast.success('Chapter intro saved successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save sheet details.');
    }
  };

  const handleVariableChange = (idx, field, val) => {
    setVariables((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: val } : v))
    );
  };

  const addVariableRow = () => {
    setVariables((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeVariableRow = (idx) => {
    setVariables((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleTagToggle = (tag) => {
    setFormTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearForm = () => {
    setEditingFormulaId(null);
    setFormTitle('');
    setFormLatex('');
    setFormDescription('');
    setFormTags([]);
    setVariables([{ key: '', value: '' }]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!sheetId) {
      toast.error('Please save the chapter intro first to initialize the sheet.');
      return;
    }

    // Map variables array to object
    const varsObject = {};
    variables.forEach((v) => {
      if (v.key.trim() && v.value.trim()) {
        varsObject[v.key.trim()] = v.value.trim();
      }
    });

    const body = {
      sheetId,
      title: formTitle,
      latex: formLatex,
      description: formDescription,
      variables: varsObject,
      tags: formTags,
      orderIndex: formulas.length,
    };

    try {
      if (editingFormulaId) {
        await api.patch(`/api/admin/formulas/${editingFormulaId}`, body);
        toast.success('Formula updated successfully.');
      } else {
        await api.post('/api/admin/formulas', body);
        toast.success('Formula created successfully.');
      }
      clearForm();
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save formula.');
    }
  };

  const handleEditInit = (f) => {
    setEditingFormulaId(f.id);
    setFormTitle(f.title);
    setFormLatex(f.latex);
    setFormDescription(f.description || '');
    setFormTags(f.tags || []);

    const parsedVars = typeof f.variables === 'string' ? JSON.parse(f.variables) : f.variables;
    const vRows = Object.keys(parsedVars || {}).map((key) => ({
      key,
      value: parsedVars[key],
    }));
    setVariables(vRows.length > 0 ? vRows : [{ key: '', value: '' }]);
  };

  const handleDeleteFormula = async (id) => {
    if (!window.confirm('Are you sure you want to delete this formula?')) return;
    try {
      await api.delete(`/api/admin/formulas/${id}`);
      toast.success('Formula deleted successfully.');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete formula.');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = formulas.findIndex((f) => f.id === active.id);
    const newIndex = formulas.findIndex((f) => f.id === over.id);

    const nextFormulas = arrayMove(formulas, oldIndex, newIndex);
    setFormulas(nextFormulas);

    try {
      await api.post('/api/admin/formulas/reorder', {
        formulaIds: nextFormulas.map((f) => f.id),
      });
      toast.success('Ordering updated successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save formula ordering.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-muted text-[12px] mt-2.5">Loading editor details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left select-none text-text-primary">
      {/* Header Banner */}
      <div className="flex items-center gap-4 border-b border-border-default/60 pb-5">
        <Link
          to="/admin/chapters"
          className="p-1.5 rounded-md hover:bg-bg-subtle text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-[17px] font-semibold flex items-center gap-2">
            📐 Formula Editor: {chapter?.name}
          </h1>
          <p className="text-[11.5px] text-text-secondary mt-0.5">
            Configure equations, tags, variable descriptions, and order sequences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Chapter Intro & Drag List */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Chapter Intro Editor */}
          <div className="bg-bg-surface border border-border-default rounded-lg p-5 space-y-4">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-text-primary">
              Chapter Introduction
            </h3>
            <div>
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                Intro Markdown
              </label>
              <textarea
                rows={3}
                placeholder="Give a short summary of this chapter, key topics, etc. (Supports Markdown)"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                className="w-full bg-bg-surface border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-3 py-2 text-[12.5px] placeholder-text-muted resize-y"
              />
            </div>
            <button
              onClick={handleUpsertSheet}
              className="px-4 py-1.5 bg-white text-black font-semibold text-[12px] rounded-md hover:bg-neutral-200 transition cursor-pointer"
            >
              Save Chapter Intro
            </button>

            {intro && (
              <div className="border-t border-border-default/50 pt-3">
                <h5 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Live Preview
                </h5>
                <div className="prose prose-sm max-w-none text-text-secondary text-[11.5px] bg-bg-subtle/30 rounded border border-border-default/45 p-3 leading-relaxed">
                  <ReactMarkdown>{intro}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {/* Formulas Drag List */}
          <div className="bg-bg-surface border border-border-default rounded-lg p-5">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-text-primary mb-4">
              Formulas & Order sequence
            </h3>

            {formulas.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-[12px] italic">
                No formulas added to this sheet yet. Use the form on the right.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <table className="w-full text-left border-collapse table-auto">
                    <thead>
                      <tr className="bg-bg-subtle border-b border-border-default text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                        <th className="px-3 py-2 w-10 text-center">Drag</th>
                        <th className="px-3 py-2">Title</th>
                        <th className="px-3 py-2">Equation</th>
                        <th className="px-3 py-2 text-right w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default/50">
                      <SortableContext
                        items={formulas.map((f) => f.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {formulas.map((f) => (
                          <SortableFormulaRow
                            key={f.id}
                            formula={f}
                            onEdit={handleEditInit}
                            onDelete={handleDeleteFormula}
                          />
                        ))}
                      </SortableContext>
                    </tbody>
                  </table>
                </DndContext>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Add/Edit Formula Form */}
        <div className="lg:col-span-5 bg-bg-surface border border-border-default rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-text-primary">
              {editingFormulaId ? 'Edit Formula' : 'Add New Formula'}
            </h3>
            {editingFormulaId && (
              <button
                onClick={clearForm}
                className="text-[11px] font-semibold text-text-secondary hover:text-text-primary hover:underline cursor-pointer"
              >
                Clear / New
              </button>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4.5">
            {/* Title */}
            <div>
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                Formula Title
              </label>
              <input
                type="text"
                placeholder="e.g. Velocity-Displacement Relation"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-bg-surface border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-3 py-1.5 text-[12px] placeholder-text-muted h-9"
                required
              />
            </div>

            {/* LaTeX Equation */}
            <div>
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                LaTeX Formula
              </label>
              <input
                type="text"
                placeholder="e.g. v^2 = u^2 + 2as"
                value={formLatex}
                onChange={(e) => setFormLatex(e.target.value)}
                className="w-full bg-bg-surface border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-3 py-1.5 text-[12px] placeholder-text-muted h-9 font-mono"
                required
              />
              <p className="text-[10px] text-text-muted mt-1 leading-normal">
                Use standard LaTeX syntax. Avoid surrounding it in $$ dollar symbols.
              </p>

              {/* KaTeX Live Preview */}
              {formLatex.trim() && (
                <div className="mt-2.5 p-3 bg-bg-subtle/30 rounded border border-border-default/45 flex items-center justify-center min-h-[50px]">
                  <div
                    className="text-[14px] text-text-primary"
                    dangerouslySetInnerHTML={{ __html: formLatexPreview }}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                Explanation Description
              </label>
              <textarea
                rows={2}
                placeholder="Briefly describe what this equation calculates and represents."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full bg-bg-surface border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-3 py-2 text-[12px] placeholder-text-muted resize-none"
              />
            </div>

            {/* Variables builder */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                  Variables definitions
                </label>
                <button
                  type="button"
                  onClick={addVariableRow}
                  className="text-[10.5px] font-bold text-accent hover:text-accent-hover cursor-pointer"
                >
                  + Add Row
                </button>
              </div>
              <div className="space-y-1.5">
                {variables.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Symbol"
                      value={v.key}
                      onChange={(e) => handleVariableChange(idx, 'key', e.target.value)}
                      className="w-20 bg-bg-surface border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2 py-1 text-[11px] placeholder-text-muted font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Definition / Units"
                      value={v.value}
                      onChange={(e) => handleVariableChange(idx, 'value', e.target.value)}
                      className="flex-grow bg-bg-surface border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2 py-1 text-[11px] placeholder-text-muted"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariableRow(idx)}
                      className="text-text-muted hover:text-danger p-1 shrink-0 cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags selection */}
            <div>
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Formula Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const selected = formTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`text-[10px] px-2.5 py-0.5 rounded-full border transition cursor-pointer font-medium ${
                        selected
                          ? 'bg-accent text-white border-accent'
                          : 'bg-bg-subtle text-text-secondary border-border-default hover:text-text-primary'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={!sheetId}
              className="w-full py-2 bg-white text-black font-semibold text-[13px] rounded-md hover:bg-neutral-200 transition disabled:opacity-40 cursor-pointer"
            >
              {editingFormulaId ? 'Save Changes' : 'Create Formula'}
            </button>
            {!sheetId && (
              <p className="text-[10px] text-danger text-center">
                Configure & Save the Chapter Introduction first to add formulas.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
