import { motion } from 'framer-motion';

export function BloodRain({ className = "" }) {
    return (
        <>
            {/* Cluster Heavy Central Drips (Slow Permanent Ooze) */}
            <div className={`absolute top-0 left-0 w-full h-full pointer-events-none z-0 ${className}`}>
                {/* Define Drip Positions: Central Cluster + Sparse Edges */}
                {[
                    // Outer Edges (Sparse)
                    { left: 4, width: 4 },
                    { left: 96, width: 5 },
                    { left: 12, width: 6 },
                    { left: 88, width: 4 },

                    // Central Cluster (Dense & Heavy)
                    { left: 35, width: 10 },
                    { left: 42, width: 5 }, // Thin trailer
                    { left: 48, width: 12 }, // Heavy Core
                    { left: 55, width: 4 },
                    { left: 62, width: 11 }, // Heavy Core
                    { left: 68, width: 6 }
                ].map((drip, i) => {
                    const isThick = drip.width > 7;

                    // Animation props
                    const duration = 15 + Math.random() * 3; // 15s - 18s (Slow Ooze)
                    const delay = Math.random() * 5; // Staggered starts
                    const finalHeight = 30 + Math.random() * 20; // 30vh - 50vh (Permanent Stop)

                    return (
                        <div key={i} className="absolute top-0 h-full" style={{ left: `${drip.left}%`, width: `${drip.width}px` }}>
                            <motion.div
                                initial={{ height: "0vh" }}
                                animate={{ height: `${finalHeight}vh` }} // Animate once and stay
                                transition={{
                                    duration: duration,
                                    ease: [0.25, 0.1, 0.25, 1], // Slow, viscous easing
                                    delay: delay
                                }}
                                className="absolute top-0 w-full rounded-b-full relative"
                                style={{
                                    background: 'linear-gradient(to bottom, #1a0505, #4a0404)', // Deep Dark Maroon
                                    boxShadow: '0 0 5px rgba(26, 5, 5, 0.8)'
                                }}
                            >
                                {/* Bulbous Head - Static Hanging Drop */}
                                <div
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-[#4a0404]"
                                    style={{
                                        width: '180%', // Bulbous
                                        height: `${drip.width * 1.5}px`,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                                    }}
                                />

                                {/* Specular Highlight (Wet Look) - Only on thick drips */}
                                {isThick && (
                                    <div className="absolute bottom-2 left-[20%] w-[2px] h-[20%] bg-white/80 blur-[0.5px] rounded-full z-10" />
                                )}
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            {/* Spores Layer */}
            <div className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * window.innerWidth, // Might need adjust if container is smaller, but percentages work better usually. Here spread across window width might be issue if container is smaller? window.innerWidth is global...
                            // Better to use percentages if inside a constrained container? 
                            // Framer motion x: 100% etc. 
                            // Actually, since we're restricting it to a container, using window.innerWidth for initial X position is risky if the container is centered.
                            // Let's change X to use percentages 0-100% of parent width.
                            // But initial x is pixels in the original code.
                            // Let's stick to user request "Restricted to Hero". 
                            // If I use window.innerWidth here, it might spawn spores outside the container if overflow is hidden, which is fine.
                            // But if the container is small, `x: Math.random() * window.innerWidth` will place spores way outside. 
                            // Let's use percentage.

                            // Wait, in previous code it was `x: Math.random() * window.innerWidth`.
                            // If I change this to just `left: ...`?
                            // `x` in framer motion is translate.
                            // I should use `left: `${Math.random() * 100}%`` and animate x slightly.
                        }}
                        // actually, let's keep the original logic for now but realize it might need tweaking for a smaller container. 
                        // The user didn't ask to fix spores logic, just restrict container. 
                        // If I put this inside a `relative overflow-hidden` container, `x` values larger than container width will be hidden.
                        // If the container is full width, it's fine.
                        // If the container is `max-w-7xl` (approx 1280px), and screen is 1920px, `window.innerWidth` is 1920.
                        // So some spores will be invisible. That's acceptable.

                        animate={{
                            y: [null, Math.random() * -100],
                            x: [null, (Math.random() - 0.5) * 50],
                            opacity: [0, 0.4, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5,
                        }}
                        className="absolute w-1 h-1 bg-rose-900/40 rounded-full blur-[1px]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>
        </>
    );
}
