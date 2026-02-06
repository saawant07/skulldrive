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
                placeholder="Search for subjects, codes, or file names…"
                className="pl-10 h-12 text-lg rounded-full shadow-lg bg-[#111827] border-slate-800 placeholder:text-[#450a0a] focus:border-red-600 focus:ring-4 focus:ring-red-900/20 transition-all text-slate-200 font-display tracking-wide"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}
