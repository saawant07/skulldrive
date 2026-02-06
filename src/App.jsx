import { useEffect, useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { SearchBar } from './components/SearchBar';
import { Filters } from './components/Filters';
import { ResourceCard } from './components/ResourceCard';
import { ResourceModal } from './components/ResourceModal';
import { UploadModal } from './components/UploadModal';
import { supabase } from './lib/supabase';
import { Loader2, Database, User } from 'lucide-react';
import { getUserId } from './lib/identity';

import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ type: null, semester: null });
  const [showMyUploads, setShowMyUploads] = useState(false);

  const [viewResource, setViewResource] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('resources')
        .select('*')
        .order('score', { ascending: false })
        .order('created_at', { ascending: false });

      if (searchQuery) {
        // Search in subject name, code or file name
        query = query.or(`subject_name.ilike.%${searchQuery}%,subject_code.ilike.%${searchQuery}%,file_name.ilike.%${searchQuery}%`);
      }

      if (filters.type) {
        query = query.eq('resource_type', filters.type);
      }

      if (filters.semester) {
        query = query.eq('semester', filters.semester);
      }

      if (showMyUploads) {
        query = query.eq('owner_id', getUserId());
      }

      const { data, error } = await query;

      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, showMyUploads]);



  const handleVote = (updatedResource) => {
    setResources(prev => prev.map(r => r.id === updatedResource.id ? updatedResource : r));
  };

  const handleDelete = async (resource) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      // 1. Delete from Storage
      // We stored the public URL, so we need to extract the path.
      // However, we made the file path just the filename in UploadModal (line 50).
      // Let's assume the public URL format allows us to just use the filename, or better, we can just use the file_name if we stored it as the path.
      // Looking at UploadModal: 
      // const fileName = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
      // const filePath = `${fileName}`;
      // ... .upload(filePath, file);
      // ... file_name: file.name (Original name) 
      // WAIT. We stored the original filename in DB `file_name` column, but the storage path is DIFFERENT. 
      // We don't have the storage path in the DB row explicitly.
      // But we have `file_url`. The public URL is `.../pdfs/<filePath>`.
      // So we can extract the last part of file_url.

      const storagePath = resource.file_url.split('/').pop();

      const { error: storageError } = await supabase.storage
        .from('pdfs')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // 2. Delete from DB
      const { error: dbError } = await supabase
        .from('resources')
        .delete()
        .eq('id', resource.id);

      if (dbError) throw dbError;

      // 3. Update UI
      setResources(prev => prev.filter(r => r.id !== resource.id));
    } catch (err) {
      console.error("Error deleting resource:", err);
      alert("Failed to delete resource.");
    }
  };

  // Initial fetch and refetch on filter/search change
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return (
    <Layout onUploadClick={() => setIsUploadOpen(true)}>
      {/* Roaming Light */}
      {/* Spores Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * -100],
              x: [null, (Math.random() - 0.5) * 50],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
            className="absolute w-1 h-1 bg-rose-900/40 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Header Section */}
        <div className="text-center space-y-4 py-8 relative">
          <h1 className="text-5xl md:text-7xl font-heading font-normal text-red-600 tracking-wide text-balance drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]">
            Built for the <span className="text-red-500 drop-shadow-[0_0_20px_rgba(190,18,60,0.8)]">Grustle.</span>
            <br className="hidden md:block" />
            <span className="text-rose-700 drop-shadow-[0_0_30px_rgba(159,18,57,1)]">Master the Syllabus.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
            Share and discover academic resources anonymously. No login required.
          </p>

          <div className="max-w-2xl mx-auto mt-8 flex flex-col gap-4">
            <SearchBar onSearch={setSearchQuery} />

            <div className="flex justify-center">
              <button
                onClick={() => setShowMyUploads(!showMyUploads)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${showMyUploads
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
              >
                <User className="h-4 w-4" />
                {showMyUploads ? 'Showing My Uploads' : 'My Uploads'}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Filters filters={filters} setFilters={setFilters} />

        {/* content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : resources.length > 0 ? (
          <motion.div
            layout
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {resources.map((res) => (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  onView={setViewResource}
                  onDelete={handleDelete}
                  onVote={handleVote}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200">
            <div className="mx-auto bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Database className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No resources found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-1">
              {searchQuery || filters.type || filters.semester
                ? "Try adjusting your search or filters."
                : "Be the first to upload a resource!"}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ResourceModal
        resource={viewResource}
        onClose={() => setViewResource(null)}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={fetchResources}
      />
    </Layout>
  );
}

export default App;
