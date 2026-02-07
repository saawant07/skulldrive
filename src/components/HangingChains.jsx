import { motion } from 'framer-motion';
import rustyChain from '../assets/rusty_chain.png';

export function HangingChains() {
    return (
        <>
            {/* Left Chain */}
            <motion.div
                className="absolute -top-20 left-10 w-24 pointer-events-none z-0 origin-top"
                initial={{ rotate: 2 }}
                animate={{ rotate: -2 }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                }}
            >
                <img
                    src={rustyChain}
                    alt="Rusty Chain"
                    className="w-full h-auto opacity-80 drop-shadow-2xl grayscale-[50%] sepia-[30%] brightness-75"
                />
            </motion.div>

            {/* Right Chain */}
            <motion.div
                className="absolute -top-20 right-10 w-24 pointer-events-none z-0 origin-top"
                initial={{ rotate: -2 }}
                animate={{ rotate: 2 }}
                transition={{
                    duration: 3.5, // Slightly different timing
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                }}
            >
                <img
                    src={rustyChain}
                    alt="Rusty Chain"
                    className="w-full h-auto opacity-80 drop-shadow-2xl grayscale-[50%] sepia-[30%] brightness-75"
                />
            </motion.div>
        </>
    );
}
