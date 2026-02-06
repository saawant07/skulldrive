import { Calendar, FileText, Eye, Trash2, Star } from 'lucide-react';
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
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex h-full group relative overflow-hidden">
            {isRecommended && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg shadow-sm flex items-center gap-1 z-10">
                    <Star className="h-3 w-3 fill-current" />
                    RECOMMENDED
                </div>
            )}

            <VoteButtons resource={resource} onVote={onVote} />

            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <FileText className="h-5 w-5" />
                        </div>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 whitespace-nowrap">
                            Sem {resource.semester}
                        </span>
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-900 line-clamp-2 leading-snug mb-1" title={resource.subject_name}>
                        {resource.subject_name}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium truncate">{resource.subject_code}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="truncate max-w-[150px] bg-slate-50 px-1.5 py-0.5 rounded" title={resource.file_name}>
                                {resource.file_name}
                            </span>
                            <span className="bg-slate-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                                {resource.resource_type}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {date}
                    </span>
                    <div className="flex gap-2">
                        {resource.owner_id === getUserId() && (
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={(e) => {
                                e.stopPropagation();
                                onDelete(resource);
                            }}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        <Button size="sm" variant="secondary" className="h-7 text-xs px-2" onClick={() => onView(resource)}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
