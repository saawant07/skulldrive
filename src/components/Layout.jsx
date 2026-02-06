import { Navbar } from './Navbar';

export function Layout({ children, onUploadClick }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar onUploadClick={onUploadClick} />
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="border-t border-slate-200 py-6 bg-white mt-auto">
                <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>&copy; {new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(new Date())} Acadrive | Built with ❤️ by Saawant Gupta (1st Year)</p>
                    <p className="mt-1 text-slate-400 text-xs">Open source academic resources</p>
                </div>
            </footer>
        </div>
    );
}
