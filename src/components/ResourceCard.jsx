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
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative h-full flex flex-col bg-black/40 backdrop-blur-sm border border-red-900/40 rounded-xl p-5 hover:bg-red-950/10 transition-all overflow-hidden min-h-[220px] animate-[pulse_4s_ease-in-out_infinite] hover:animate-none"
        >
            {/* Inner Glow Hack */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-red-500/10 pointer-events-none group-hover:animate-flicker" />

            {/* Gradient Blob for "Premium" feel - kept subtle */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-900/20 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors" />

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
                            <div className="p-2 bg-red-950/30 rounded-lg text-rose-500 ring-1 ring-red-900/40 group-hover:text-rose-400 transition-colors group-hover:animate-flicker">
                                <FileText className="h-5 w-5" />
                            </div>
                            <span className="inline-flex items-center rounded-md bg-red-900/10 px-2.5 py-1 text-xs font-medium text-red-400 ring-1 ring-red-500/20">
                                Sem {resource.semester}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-bold font-sans text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors" title={resource.subject_name}>
                            {resource.subject_name}
                        </h3>
                        <p className="text-sm text-slate-400 font-medium truncate">{resource.subject_code}</p>

                        <div className="pt-3 mt-1 border-t border-white/5 space-y-2">
                            <div className="flex flex-wrap gap-2 text-xs font-medium">
                                <span className="truncate max-w-[150px] bg-red-950/30 px-2 py-1 rounded text-red-200 border border-red-900/30" title={resource.file_name}>
                                    {resource.file_name}
                                </span>
                                <span className="bg-rose-900/20 text-rose-300 px-2 py-1 rounded border border-rose-800/20">
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
                                    size="icon"
                                    variant="danger"
                                    className="h-9 w-9 rounded-xl hover:bg-red-500/10 text-emerald-500/70 hover:text-red-500"
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
                                className="h-9 text-xs px-4 rounded-xl shadow-none bg-slate-900 border border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400"
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
