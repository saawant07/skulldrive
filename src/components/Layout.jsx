import { Navbar } from './Navbar';

export function Layout({ children, onUploadClick }) {
    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-50 selection:bg-blue-500/30">
            <Navbar onUploadClick={onUploadClick} />
            <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
                {children}
            </main>
            <footer className="border-t border-white/5 py-8 bg-slate-950/50 backdrop-blur-sm mt-auto relative z-10">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm font-medium text-slate-400">
                        &copy; {new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(new Date())} Acadrive | Built with <span className="text-red-700">❤️</span> by{' '}
                        <span className="inline-block font-display font-bold text-red-500 tracking-widest animate-glitch opacity-80">
                            Saawant Gupta (1st Year)
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
