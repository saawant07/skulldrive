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
                className="pl-10 h-12 text-lg rounded-full shadow-sm bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-800"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}
