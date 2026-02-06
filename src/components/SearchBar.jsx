import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from './ui/Input';

export function SearchBar({ onSearch, className }) {
    const [value, setValue] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(value);
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [value, onSearch]);

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
                type="text"
                name="search"
                autoComplete="off"
                placeholder="Search for subjects, codes, question papers, or file names..."
                className="search-input-global pl-10 h-12 text-lg rounded-full shadow-lg bg-black/60 backdrop-blur-md border-2 border-red-500 placeholder:text-slate-100 focus:border-red-500 focus:ring-4 focus:ring-red-900/40 transition-all text-slate-100 font-display tracking-wide"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}
