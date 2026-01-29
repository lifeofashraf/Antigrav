// Shared animation variants for consistent animations across the app

// Page transition animation
export const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94], // Smooth ease-out
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.2,
        },
    },
};

// Fade in animation for elements
export const fadeInVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 0.3 }
    },
};

// Slide up animation for cards and content
export const slideUpVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
        }
    },
};

// Stagger children animation (for lists/grids)
export const staggerContainerVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

export const staggerItemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
        }
    },
};

// Scale animation for buttons/interactive elements
export const scaleVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
};

// Card hover animation
export const cardHoverVariants = {
    initial: { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    hover: {
        y: -5,
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        transition: { duration: 0.2 }
    },
};

// Sidebar collapse animation
export const sidebarVariants = {
    expanded: { width: 260 },
    collapsed: { width: 80 },
};

// Smooth spring config for natural motion
export const springConfig = {
    type: 'spring',
    stiffness: 300,
    damping: 25,
};

// Standard easing curves
export const easing = {
    smooth: [0.25, 0.46, 0.45, 0.94],
    bouncy: [0.68, -0.55, 0.265, 1.55],
    snappy: [0.4, 0, 0.2, 1],
};
