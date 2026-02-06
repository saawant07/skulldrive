import { clsx } from 'clsx';

export function Filters({ filters, setFilters }) {
    const resourceTypes = ['All', 'Notes', 'Module', 'Question Paper', 'Question Set'];
    const semesters = ['All', '1', '2', '3', '4', '5', '6', '7', '8'];

    const toggleResourceType = (type) => {
        // If 'All' is selected, strictly set to All.
        // If a specific type is selected, switch to it.
        // Simplifying logic: Single select for MVP based on requirements "Resource type filters (pill buttons)" usually implies single active or toggle.
        // "Resource type (text)" in DB suggests one type per file.
        // Let's assume single select for now to keep it simple.

        // If clicking same type, do nothing or user might want to toggle off to clear? 
        // Requirement: "All Resources" is a pill. So it's radio-button functionality.
        setFilters(prev => ({ ...prev, type: type === 'All' ? null : type }));
    };

    const handleSemesterChange = (e) => {
        const val = e.target.value;
        setFilters(prev => ({ ...prev, semester: val === 'All' ? null : parseInt(val) }));
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-red-400/70 font-display tracking-widest uppercase text-xs">Type:</span>
                <div className="flex flex-wrap gap-2">
                    {resourceTypes.map((type) => {
                        // Check if active
                        const isActive = (filters.type === null && type === 'All') || filters.type === type;

                        return (
                            <button
                                key={type}
                                onClick={() => toggleResourceType(type)}
                                className={clsx(
                                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all font-display tracking-wide",
                                    isActive
                                        ? "bg-red-900 text-red-50 shadow-[0_0_10px_rgba(159,18,57,0.5)] border border-red-700"
                                        : "bg-red-950/20 backdrop-blur-md text-red-300/70 border border-red-900/30 hover:bg-red-900/30 hover:text-red-200 hover:border-red-800/50"
                                )}
                            >
                                {type}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-red-400/70 font-display tracking-widest uppercase text-xs">Semester:</span>
                <select
                    className="h-9 rounded-md border-red-900/50 bg-red-950/30 backdrop-blur-md px-3 py-1 text-sm text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 font-display tracking-wide"
                    value={filters.semester || 'All'}
                    onChange={handleSemesterChange}
                >
                    <option value="All">All Semesters</option>
                    {semesters.slice(1).map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
