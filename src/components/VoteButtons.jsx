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
        <div className="flex flex-col items-center gap-2 mr-4">
            <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); handleVote('up'); }}
                disabled={!!hasVoted || voting}
                className={`transition-all duration-300 ${isUpvoted ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-slate-500 hover:text-red-400'}`}
                title="Upvote"
            >
                <ArrowBigUp className={`h-8 w-8 stroke-[1.5px] ${isUpvoted ? 'fill-red-500/20' : ''}`} />
            </motion.button>

            <span className="text-sm font-bold text-slate-300 font-display">
                {(resource.score || 0)}
            </span>

            <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); handleVote('down'); }}
                disabled={!!hasVoted || voting}
                className={`transition-all duration-300 ${isDownvoted ? 'text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'text-slate-500 hover:text-indigo-400'}`}
                title="Downvote"
            >
                <ArrowBigDown className={`h-8 w-8 stroke-[1.5px] ${isDownvoted ? 'fill-indigo-500/20' : ''}`} />
            </motion.button>
        </div>
    );
}
