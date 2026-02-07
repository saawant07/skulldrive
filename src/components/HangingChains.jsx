export function HangingChains() {
    return (
        <>
            {/* Left Spectral Chain */}
            <div
                className="absolute top-0 left-16 w-1 h-[50vh] border-l-2 border-dashed border-red-900/60 z-10 animate-pulse pointer-events-none"
                style={{ animationDuration: '4s' }}
            >
                {/* Weight End-Cap */}
                <div className="absolute -bottom-1 -left-[5px] w-3 h-3 rounded-full bg-red-900 shadow-[0_0_10px_#7f1d1d]" />
            </div>

            {/* Right Spectral Chain */}
            <div
                className="absolute top-0 right-16 w-1 h-[50vh] border-l-2 border-dashed border-red-900/60 z-10 animate-pulse pointer-events-none"
                style={{ animationDuration: '5s' }}
            >
                {/* Weight End-Cap */}
                <div className="absolute -bottom-1 -left-[5px] w-3 h-3 rounded-full bg-red-900 shadow-[0_0_10px_#7f1d1d]" />
            </div>
        </>
    );
}
