import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const RUNES = ['∫', 'Ω', 'Σ', 'π', 'Ψ', 'Φ', 'Δ', '∇', '∃', '∀', '∂', '∞', '⋈', '∴', '∵', '†', '‡', '⏃', '⏄', '⏅'];

export function ArcaneRunes() {
    const [leftRunes, setLeftRunes] = useState([]);
    const [rightRunes, setRightRunes] = useState([]);

    useEffect(() => {
        const generateRunes = (count) => Array.from({ length: count }).map((_, i) => ({
            id: i,
            char: RUNES[Math.floor(Math.random() * RUNES.length)],
            delay: Math.random() * 20,
            duration: 15 + Math.random() * 15, // Slow float
            xOffset: Math.random() * 80, // % within the container
            fontSize: 1 + Math.random() * 2 + 'rem',
            opacity: 0.1 + Math.random() * 0.3
        }));

        setLeftRunes(generateRunes(20));
        setRightRunes(generateRunes(20));
    }, []);

    return (
        <>
            {/* Left Column */}
            <div className="absolute top-0 left-0 w-48 h-full overflow-hidden pointer-events-none z-0 select-none">
                {leftRunes.map(rune => (
                    <motion.div
                        key={rune.id}
                        className="absolute text-red-900 font-serif font-bold shadow-red-900/20 drop-shadow-md"
                        style={{
                            left: `${rune.xOffset}%`,
                            fontSize: rune.fontSize,
                            opacity: rune.opacity
                        }}
                        initial={{ y: '100vh', opacity: 0 }}
                        animate={{
                            y: '-20vh',
                            opacity: [0, rune.opacity, rune.opacity, 0]
                        }}
                        transition={{
                            duration: rune.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: rune.delay
                        }}
                    >
                        {rune.char}
                    </motion.div>
                ))}
            </div>

            {/* Right Column */}
            <div className="absolute top-0 right-0 w-48 h-full overflow-hidden pointer-events-none z-0 select-none">
                {rightRunes.map(rune => (
                    <motion.div
                        key={rune.id}
                        className="absolute text-red-900 font-serif font-bold shadow-red-900/20 drop-shadow-md"
                        style={{
                            right: `${rune.xOffset}%`,
                            fontSize: rune.fontSize,
                            opacity: rune.opacity
                        }}
                        initial={{ y: '100vh', opacity: 0 }}
                        animate={{
                            y: '-20vh',
                            opacity: [0, rune.opacity, rune.opacity, 0]
                        }}
                        transition={{
                            duration: rune.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: rune.delay
                        }}
                    >
                        {rune.char}
                    </motion.div>
                ))}
            </div>
        </>
    );
}
