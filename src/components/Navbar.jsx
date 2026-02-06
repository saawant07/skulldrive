import { BookOpen, Upload } from 'lucide-react';
import { Button } from './ui/Button';

export function Navbar({ onUploadClick }) {
    return (
        <nav className="border-b border-white/5 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <BookOpen className="h-6 w-6 text-emerald-400" />
                    </div>
                    <span className="text-xl font-bold font-heading text-white tracking-tight">Acadrive</span>
                </div>

            </div>
        </nav>
    );
}
