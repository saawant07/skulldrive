import { useEffect, useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { SearchBar } from './components/SearchBar';
import { Filters } from './components/Filters';
import { ResourceCard } from './components/ResourceCard';
import { ResourceModal } from './components/ResourceModal';
import { UploadModal } from './components/UploadModal';
import { supabase } from './lib/supabase';
import { Loader2, Database, User, Upload, Skull, HelpCircle } from 'lucide-react';
import { getUserId } from './lib/identity';
import { Button } from './components/ui/Button';

import { AnimatePresence, motion } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import { BloodRain } from './components/BloodRain';
import { ArcaneRunes } from './components/ArcaneRunes';
import { HangingChains } from './components/HangingChains';
import { RequestResourceModal } from './components/RequestResourceModal';

function App() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ type: null, semester: null });
  const [showMyUploads, setShowMyUploads] = useState(false);

  const [viewResource, setViewResource] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

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
      <CustomCursor />
      {/* Roaming Light */}
      {/* Gothic Background */}
      <div className="gothic-bg" />


      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Gothic Elements - Framing the page content */}
        <div className="absolute inset-0 pointer-events-none">
          <ArcaneRunes />
          <HangingChains />
          <div className="absolute left-[2%] h-[150%] w-[1px] bg-gradient-to-b from-transparent via-red-900 to-transparent opacity-30 z-0" />
          <div className="absolute right-[2%] h-[150%] w-[1px] bg-gradient-to-b from-transparent via-red-900 to-transparent opacity-30 z-0" />
        </div>



        {/* Global Blood Rain (Fixed) */}
        <BloodRain className="opacity-80" />

        {/* Header Section / Hero - Open Layout */}
        <div className="flex flex-col items-center justify-center text-center space-y-8 py-20 relative z-20">
          <motion.img
            src="/skull.png"
            alt="Cursed Skull"
            className="mb-8 w-56 md:w-80 object-contain drop-shadow-[0_0_30px_rgba(185,28,28,0.8)] relative z-10"
            animate={{
              y: [0, -20, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Fluid Header Scaling */}
          <div className="w-full px-2 relative z-10">
            <h1 className="text-[clamp(2.5rem,10vw,5rem)] font-heading font-black text-white tracking-tighter md:tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(225,29,72,0.8)] mb-4 whitespace-nowrap overflow-wrap-anywhere" style={{ fontFamily: '"Grenze Gotisch", cursive' }}>
              Skulldrive
            </h1>
          </div>

          <h2 key="slogan-final" className="demonic-slogan text-2xl md:text-6xl font-heading font-normal tracking-wide text-balance px-4 max-w-[80%] md:max-w-4xl mx-auto relative z-10">
            Exhume the Syllabus. <br className="hidden md:block" />
            <span className="">Study the Souls of the Passed.</span>
          </h2>

          <div className="mt-10 flex flex-row flex-wrap justify-center gap-4 items-center relative z-50">
            <Button onClick={() => setIsUploadOpen(true)} className="px-10 py-5 text-xl font-bold bg-black/80 backdrop-blur-md border-2 border-[#ff0000] shadow-[0_0_20px_rgba(255,0,0,0.6)] hover:bg-[#e11d48] hover:shadow-[0_0_40px_rgba(255,0,0,0.8)] hover:scale-105 transition-all duration-300 text-white rounded-xl group relative overflow-hidden">
              <Upload className="mr-3 h-6 w-6 text-white group-hover:scale-110 transition-transform" />
              Upload Resource
            </Button>
            {/* Request Resource - Twin Style */}
            <Button
              onClick={() => setIsRequestOpen(true)}
              className="px-10 py-5 text-xl font-bold bg-black border-2 border-[#ff0000] shadow-[0_0_15px_rgba(220,38,38,0.5)] text-white rounded-xl hover:bg-[#e11d48] hover:shadow-[0_0_40px_rgba(255,0,0,0.8)] hover:scale-105 transition-all duration-300 group relative overflow-hidden"
            >
              <HelpCircle className="mr-3 h-6 w-6 text-white group-hover:scale-110 transition-transform" />
              Request Resource
            </Button>
          </div>

          <div className="max-w-4xl w-full mx-auto mt-12 flex flex-col gap-4 relative z-20">
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
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

      <RequestResourceModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
      />
    </Layout>
  );
}

export default App;
