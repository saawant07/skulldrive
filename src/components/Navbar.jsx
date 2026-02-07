import { BookOpen, Upload } from 'lucide-react';
import { Button } from './ui/Button';

export function Navbar({ onUploadClick }) {
    return (
        <nav className="border-b border-transparent bg-transparent sticky top-0 z-50 transition-all duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold font-heading text-white tracking-tight">Skulldrive</span>
                </div>

            </div>
        </nav>
    );
}
