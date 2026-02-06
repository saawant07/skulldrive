import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { supabase } from '../lib/supabase';
import { getUserId } from '../lib/identity';
import { calculateFileHash } from '../lib/hash';

export function UploadModal({ isOpen, onClose, onUploadSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        subjectName: '',
        subjectCode: '',
        semester: '1',
        resourceType: 'Notes'
    });

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setError('Only PDF files are allowed.');
                setFile(null);
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
                setError('File size must be under 10MB.');
                setFile(null);
                return;
            }
            setError(null);
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!file) throw new Error("Please select a file.");

            // 1. Calculate Hash & Check for Duplicates
            const fileHash = await calculateFileHash(file);

            const { data: existingFile, error: checkError } = await supabase
                .from('resources')
                .select('subject_name')
                .eq('file_hash', fileHash)
                .single();

            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "Row not found"
                throw checkError;
            }

            if (existingFile) {
                setError(`Duplicate found! This exact content was already uploaded with the name: ${existingFile.subject_name}`);
                setLoading(false);
                return;
            }

            // 2. Upload to Supabase Storage
            // Sanitize filename to avoid weird character issues
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('pdfs')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 3. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('pdfs')
                .getPublicUrl(filePath);

            // 3. Insert metadata to DB
            const { error: dbError } = await supabase.from('resources').insert({
                subject_name: formData.subjectName,
                subject_code: formData.subjectCode,
                semester: parseInt(formData.semester),
                resource_type: formData.resourceType,
                file_name: file.name,
                file_url: publicUrl,
                owner_id: getUserId(),
                file_hash: fileHash
            });

            if (dbError) throw dbError;

            onUploadSuccess();
            onClose();
            // Reset form
            setFile(null);
            setFormData({ subjectName: '', subjectCode: '', semester: '1', resourceType: 'Notes' });

        } catch (err) {
            console.error("Upload error:", err);
            setError(err.message || "Failed to upload resource. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0a0a0a] border-2 border-[#e11d48] rounded-2xl shadow-2xl shadow-red-900/20 w-full max-w-lg p-6 animate-in zoom-in-95">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-100">Upload Resource</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 text-red-200 text-sm rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Subject Name *</label>
                        <Input
                            required
                            placeholder="e.g. Data Structures & Algorithms"
                            value={formData.subjectName}
                            onChange={e => setFormData({ ...formData, subjectName: e.target.value })}
                            className="bg-slate-900/50 border-red-900/40 text-slate-50 placeholder-slate-500 focus:border-[#e11d48] focus:ring-[#e11d48]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Subject Code</label>
                            <Input
                                placeholder="e.g. CS201"
                                value={formData.subjectCode}
                                onChange={e => setFormData({ ...formData, subjectCode: e.target.value })}
                                className="bg-slate-900/50 border-red-900/40 text-slate-50 placeholder-slate-500 focus:border-[#e11d48] focus:ring-[#e11d48]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Semester *</label>
                            <select
                                className="w-full h-10 rounded-lg border border-red-900/40 bg-slate-900/50 px-3 py-2 text-sm text-slate-50 focus:ring-2 focus:ring-[#e11d48] focus:border-transparent focus:outline-none"
                                value={formData.semester}
                                onChange={e => setFormData({ ...formData, semester: e.target.value })}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s} className="bg-slate-900 text-slate-50">{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Resource Type *</label>
                        <select
                            className="w-full h-10 rounded-lg border border-red-900/40 bg-slate-900/50 px-3 py-2 text-sm text-slate-50 focus:ring-2 focus:ring-[#e11d48] focus:border-transparent focus:outline-none"
                            value={formData.resourceType}
                            onChange={e => setFormData({ ...formData, resourceType: e.target.value })}
                        >
                            {['Notes', 'Module', 'Question Paper', 'Question Set'].map(t => <option key={t} value={t} className="bg-slate-900 text-slate-50">{t}</option>)}
                        </select>
                    </div>

                    <div className="pt-2">
                        <label className="block text-sm font-medium text-slate-300 mb-1">Upload PDF *</label>
                        <div className="border-2 border-dashed border-[#e11d48] bg-red-900/5 rounded-xl p-6 hover:bg-red-900/10 transition-colors text-center cursor-pointer relative group">
                            <input
                                type="file"
                                accept="application/pdf"
                                required
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />

                            {file ? (
                                <div className="flex flex-col items-center text-[#e11d48]">
                                    <FileText className="h-8 w-8 mb-2" />
                                    <span className="text-sm font-medium truncate max-w-full px-4 text-slate-200">{file.name}</span>
                                    <span className="text-xs text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-slate-400 group-hover:text-slate-300">
                                    <UploadCloud className="h-8 w-8 mb-2 text-[#e11d48]" />
                                    <span className="text-sm font-medium">Click to browse or drag PDF here</span>
                                    <span className="text-xs mt-1 text-slate-500">PDF only, max 10MB</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex w-full">
                        <Button type="submit" disabled={loading} className="w-full gap-2 bg-[#e11d48] hover:bg-[#be123c] text-white border-transparent">
                            {loading ? 'Uploading…' : 'Upload Resource'}
                            {!loading && <CheckCircle2 className="h-4 w-4" />}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
