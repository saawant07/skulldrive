import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Button } from './ui/Button';

export function VoteButtons({ resource, onVote }) {
    const [voting, setVoting] = useState(false);

    // Check local storage for vote status
    const getVoteStatus = () => {
        return localStorage.getItem(`acadrive_vote_${resource.id}`);
    };

    const handleVote = async (type) => {
        const currentVote = getVoteStatus();
        if (currentVote) return; // Already voted

        setVoting(true);
        try {
            const updates = {
                upvotes: resource.upvotes || 0,
                downvotes: resource.downvotes || 0,
                score: resource.score || 0
            };

            if (type === 'up') {
                updates.upvotes += 1;
                updates.score += 1;
            } else {
                updates.downvotes += 1;
                updates.score -= 1;
            }

            // Optimistic update
            onVote({ ...resource, ...updates });

            // Call RPC function
            const { error } = await supabase.rpc('increment_vote', {
                row_id: resource.id,
                vote_type: type
            });

            if (error) throw error;

            // Save to local storage
            localStorage.setItem(`acadrive_vote_${resource.id}`, type);

        } catch (err) {
            console.error("Voting error:", err);
            // Revert changes if needed (not implemented for simplicity, relying on refresh or refetch)
        } finally {
            setVoting(false);
        }
    };

    const hasVoted = getVoteStatus();
    const isUpvoted = hasVoted === 'up';
    const isDownvoted = hasVoted === 'down';

    return (
        <div className="flex flex-col items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100 mr-3">
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); handleVote('up'); }}
                disabled={!!hasVoted || voting}
                className={`p-1 rounded transition-colors ${isUpvoted ? 'text-orange-500 bg-orange-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`}
                title="Upvote"
            >
                <ArrowBigUp className={`h-6 w-6 ${isUpvoted ? 'fill-current' : ''}`} />
            </motion.button>

            <span className={`text-xs font-bold ${isUpvoted ? 'text-orange-600' : isDownvoted ? 'text-slate-500' : 'text-slate-700'}`}>
                {(resource.score || 0)}
            </span>

            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); handleVote('down'); }}
                disabled={!!hasVoted || voting}
                className={`p-1 rounded transition-colors ${isDownvoted ? 'text-blue-500 bg-blue-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`}
                title="Downvote"
            >
                <ArrowBigDown className={`h-6 w-6 ${isDownvoted ? 'fill-current' : ''}`} />
            </motion.button>
        </div>
    );
}
