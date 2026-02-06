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
        <div className={`relative max-w-5xl w-full mx-auto ${className}`}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-red-500 z-10" />
            <Input
                type="text"
                name="search"
                autoComplete="off"
                placeholder="Search for resources..."
                className="search-input-global pl-12 h-16 text-xl rounded-full shadow-[0_0_20px_rgba(225,29,72,0.5)] bg-black/95 backdrop-blur-md border-2 border-[#e11d48] placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-900/40 transition-all text-slate-100 font-display tracking-wide w-full"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}
