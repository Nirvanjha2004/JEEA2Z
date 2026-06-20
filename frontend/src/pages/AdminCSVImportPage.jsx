import React, { useState } from 'react';
import api from '../api';

export default function AdminCSVImportPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const downloadTemplate = () => {
    const headers = 'chapter_id,title,difficulty,type,source,solution_url,correct_answer,notes,order_index\n';
    const sample = '1,"Evaluate the integral of sin(x) from 0 to pi/2",easy,practice,"JEE Main 2023",https://youtube.com/watch?v=xyz,A,"Basic integration formula",10\n2,"If a matrix A is symmetric...",medium,concept,"Practice Problem",,B,,20\n';
    const blob = new Blob([headers + sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jeesheet_questions_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setError('');

    // Read first 10 rows for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsed = parseCSVClient(text);
      setPreview(parsed);
    };
    reader.readAsText(selectedFile);
  };

  const parseCSVClient = (text) => {
    const lines = text.split('\n').filter((l) => l.trim() !== '');
    if (lines.length === 0) return [];
    
    // Very basic column parser that splits by comma, removing surrounding quotes
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const rows = [];

    for (let i = 1; i < Math.min(11, lines.length); i++) {
      const line = lines[i];
      // Regex splitter for simple quote matching
      const values = [];
      let currentVal = '';
      let inQuotes = false;
      
      for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentVal.trim());
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
      values.push(currentVal.trim());

      const row = {};
      headers.forEach((h, idx) => {
        row[h] = (values[idx] || '').replace(/^"|"$/g, '');
      });
      rows.push(row);
    }
    return rows;
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/api/admin/questions/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setResult(res.data.data);
        setFile(null);
        setPreview([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload CSV file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-lg font-bold text-white uppercase tracking-wider">Bulk CSV Import</h1>
        <p className="text-xs text-navy-400 mt-0.5">Upload questions in bulk using a CSV spreadsheet.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-500/50 text-red-400 text-sm rounded-xl">
          {error}
        </div>
      )}

      {result && (
        <div className="p-5 bg-green-950/25 border border-green-500/35 rounded-2xl space-y-2">
          <h3 className="text-sm font-bold text-green-400">✓ Bulk Import Complete</h3>
          <p className="text-xs text-navy-200">
            Successfully imported <strong className="text-white font-mono text-sm">{result.inserted}</strong> questions.
            Skipped <strong className="text-white font-mono text-sm">{result.skipped}</strong> rows.
          </p>
          {result.errors?.length > 0 && (
            <div className="pt-3 border-t border-green-500/10">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-green-500 mb-2">Error Log</h4>
              <div className="max-h-32 overflow-y-auto space-y-1.5 text-[10px] font-mono text-red-400 bg-navy-950 p-2.5 rounded-lg border border-navy-800">
                {result.errors.map((err, idx) => (
                  <div key={idx}>
                    Row {err.row}: {err.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSV Spec Panel */}
      <div className="bg-navy-850 border border-navy-800 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">CSV Structure Guide</h3>
          <button
            onClick={downloadTemplate}
            className="text-xs text-brand-red font-bold hover:underline transition cursor-pointer"
          >
            📥 Download Template CSV
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1 text-navy-300">
            <div>• <strong className="text-white font-mono">chapter_id</strong>: Positive integer. (Chapter identifier)</div>
            <div>• <strong className="text-white font-mono">title</strong>: Text. Question description markdown.</div>
            <div>• <strong className="text-white font-mono">difficulty</strong>: <code className="text-brand-red bg-navy-900 px-1 rounded">easy</code> | <code className="text-brand-red bg-navy-900 px-1 rounded">medium</code> | <code className="text-brand-red bg-navy-900 px-1 rounded">hard</code></div>
            <div>• <strong className="text-white font-mono">type</strong>: <code className="text-brand-red bg-navy-900 px-1 rounded">pyq</code> | <code className="text-brand-red bg-navy-900 px-1 rounded">concept</code> | <code className="text-brand-red bg-navy-900 px-1 rounded">practice</code></div>
          </div>
          <div className="space-y-1 text-navy-300">
            <div>• <strong className="text-white font-mono">source</strong>: Exam label. (e.g. "JEE Main 2024")</div>
            <div>• <strong className="text-white font-mono">solution_url</strong>: Watch explanation URL.</div>
            <div>• <strong className="text-white font-mono">correct_answer</strong>: Single choice character key (e.g. A, B) or decimal numeric.</div>
            <div>• <strong className="text-white font-mono">order_index</strong>: Integer to order chapter listings.</div>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div className="bg-navy-850 border-2 border-dashed border-navy-700 hover:border-brand-red transition rounded-3xl p-8 flex flex-col items-center justify-center text-center relative cursor-pointer">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <span className="text-3xl mb-2">📄</span>
        <h4 className="text-sm font-bold text-white mb-1">
          {file ? file.name : 'Select CSV Question Sheet'}
        </h4>
        <p className="text-xs text-navy-400 max-w-xs">
          {file
            ? `File size: ${(file.size / 1024).toFixed(2)} KB. Press import to complete upload.`
            : 'Click to select spreadsheet or drop it here. Accepts .csv format.'}
        </p>
      </div>

      {/* Preview Table */}
      {preview.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Preview (First 10 rows)</h3>
          <div className="bg-navy-850 border border-navy-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto text-[10px]">
                <thead>
                  <tr className="bg-navy-900 border-b border-navy-800 font-bold text-navy-400 uppercase tracking-wider">
                    <th className="px-4 py-2.5">chapter_id</th>
                    <th className="px-4 py-2.5">title</th>
                    <th className="px-4 py-2.5">difficulty</th>
                    <th className="px-4 py-2.5">type</th>
                    <th className="px-4 py-2.5">source</th>
                    <th className="px-4 py-2.5">correct_answer</th>
                    <th className="px-4 py-2.5">order_index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/40 text-navy-300">
                  {preview.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 font-mono">{row.chapter_id}</td>
                      <td className="px-4 py-2 truncate max-w-[200px]">{row.title}</td>
                      <td className="px-4 py-2">{row.difficulty}</td>
                      <td className="px-4 py-2">{row.type}</td>
                      <td className="px-4 py-2">{row.source}</td>
                      <td className="px-4 py-2 font-mono">{row.correct_answer}</td>
                      <td className="px-4 py-2 font-mono">{row.order_index}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleImport}
              disabled={loading}
              className="px-6 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-xl transition disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
            >
              {loading && <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin"></div>}
              Import Valid CSV Rows
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
