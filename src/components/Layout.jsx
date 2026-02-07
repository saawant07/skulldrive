import { Navbar } from './Navbar';

export function Layout({ children, onUploadClick }) {
    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-50 selection:bg-blue-500/30">
            <Navbar onUploadClick={onUploadClick} />
            <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
                {children}
            </main>
            <footer className="w-full mt-auto relative z-10 bg-gradient-to-t from-black to-transparent pt-20 pb-8 pointer-events-none">
                <div className="container mx-auto px-4 text-center pointer-events-auto">
                    <p className="text-sm font-medium text-slate-400">
                        &copy; 2026 Skulldrive by{' '}
                        <span className="inline-block font-display font-bold text-red-500 tracking-widest animate-glitch opacity-80 drop-shadow-[0_0_5px_rgba(225,29,72,0.8)]">
                            Saawant Gupta
                        </span>
                    </p>
                    <p className="mt-2 text-slate-500 text-xs tracking-wide uppercase opacity-70">
                        Open source academic resources
                    </p>
                </div>
            </footer>
        </div>
    );
}
