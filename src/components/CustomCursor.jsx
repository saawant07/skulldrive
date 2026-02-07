import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Spring for the outer ring (delayed follow)
    const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
    const ringX = useSpring(mouseX, springConfig);
    const ringY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleHoverStart = (e) => {
            // Check if hovering over interactive elements
            if (
                e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'A' ||
                e.target.tagName === 'INPUT' ||
                e.target.tagName === 'SELECT' ||
                e.target.tagName === 'LABEL' ||
                e.target.closest('button') ||
                e.target.closest('a') ||
                e.target.closest('.cursor-hover-target')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleHoverEnd = () => {
            setIsHovering(false);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleHoverStart);
        window.addEventListener('mouseout', handleHoverEnd);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHoverStart);
            window.removeEventListener('mouseout', handleHoverEnd);
        };
    }, [mouseX, mouseY, isVisible]);

    // Hidden on touch devices
    if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) return null;

    return (
        <div className="hidden sm:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Outer Ring - Delayed Follow */}
            <motion.div
                className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-red-500 transition-colors duration-300 ${isHovering ? 'bg-red-900/20' : 'bg-transparent'
                    }`}
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0
                }}
                animate={{
                    scale: isHovering ? 1.5 : 1
                }}
                transition={{ duration: 0.2 }}
            />

            {/* Inner Dot - Instant Follow */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-red-500 rounded-full"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0
                }}
            />
        </div>
    );
};

export default CustomCursor;
