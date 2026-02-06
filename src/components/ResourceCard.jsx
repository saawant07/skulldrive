import { Calendar, FileText, Eye, Trash2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { getUserId } from '../lib/identity';
import { VoteButtons } from './VoteButtons';

export function ResourceCard({ resource, onView, onDelete, onVote }) {
    const date = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(new Date(resource.created_at));

    const isRecommended = (resource.upvotes || 0) >= 5 && (resource.score || 0) >= 3;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02, rotateY: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative h-full bg-slate-900/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:border-blue-500/30 transition-colors overflow-hidden"
        >
            {/* Inner Glow Hack */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />

            {/* Gradient Blob for "Premium" feel */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />

            {isRecommended && (
                <div className="absolute top-0 right-0 bg-yellow-500/20 text-yellow-200 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)] flex items-center gap-1 z-10">
                    <Star className="h-3 w-3 fill-current" />
                    RECOMMENDED
                </div>
            )}

            <div className="flex gap-4 h-full relative z-10">
                <VoteButtons resource={resource} onVote={onVote} />

                <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-slate-800/80 rounded-lg text-blue-400 ring-1 ring-white/5 group-hover:text-blue-300 transition-colors">
                                <FileText className="h-5 w-5" />
                            </div>
                            <span className="inline-flex items-center rounded-md bg-slate-800/50 px-2.5 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/5">
                                Sem {resource.semester}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-bold font-heading text-slate-100 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors" title={resource.subject_name}>
                            {resource.subject_name}
                        </h3>
                        <p className="text-sm text-slate-400 font-medium truncate">{resource.subject_code}</p>

                        <div className="pt-3 mt-1 border-t border-white/5 space-y-2">
                            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                                <span className="truncate max-w-[150px] bg-slate-800/50 px-2 py-1 rounded text-slate-300" title={resource.file_name}>
                                    {resource.file_name}
                                </span>
                                <span className="bg-slate-800/50 px-2 py-1 rounded text-slate-300">
                                    {resource.resource_type}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-2">
                        <span className="text-xs text-slate-500 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {date}
                        </span>
                        <div className="flex gap-2">
                            {resource.owner_id === getUserId() && (
                                <Button
                                    as={motion.button}
                                    whileTap={{ scale: 0.95 }}
                                    size="icon"
                                    variant="danger"
                                    className="h-9 w-9 rounded-xl"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(resource);
                                    }}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                as={motion.button}
                                whileTap={{ scale: 0.95 }}
                                size="sm"
                                variant="secondary"
                                className="h-9 text-xs px-4 rounded-xl shadow-none bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5"
                                onClick={() => onView(resource)}
                            >
                                <Eye className="h-3 w-3 mr-1.5" />
                                View
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
