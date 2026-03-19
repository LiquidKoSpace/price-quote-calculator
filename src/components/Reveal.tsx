import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
    children: React.ReactNode;
    width?: 'fit-content' | '100%';
    className?: string;
    delay?: number; // Delay in ms
    duration?: number; // Duration in ms
    threshold?: number; // Intersection threshold 0-1
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'; // Initial offset direction
}

export const Reveal = ({
    children,
    width = '100%',
    className,
    delay = 0,
    duration = 500,
    threshold = 0.1,
    direction = 'up',
}: RevealProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Once visible, we can disconnect if we only want it to trigger once
                    if (ref.current) {
                        observer.unobserve(ref.current);
                    }
                }
            },
            {
                threshold,
                rootMargin: '0px 0px -50px 0px', // Trigger slightly before element is fully in view? No, slightly *after* it enters bottom.
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    const getTransform = () => {
        if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
        switch (direction) {
            case 'up':
                return 'translate3d(0, 30px, 0) scale(0.95)';
            case 'down':
                return 'translate3d(0, -30px, 0) scale(0.95)';
            case 'left':
                return 'translate3d(30px, 0, 0) scale(0.95)';
            case 'right':
                return 'translate3d(-30px, 0, 0) scale(0.95)';
            case 'none':
            default:
                return 'translate3d(0, 0, 0) scale(1)';
        }
    };

    const getOpacity = () => {
        return isVisible ? 1 : 0;
    };

    return (
        <div
            ref={ref}
            style={{
                width,
                transition: `all ${duration}ms cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}ms`,
                opacity: getOpacity(),
                transform: getTransform(),
                willChange: 'opacity, transform',
            }}
            className={cn(className)}
        >
            {children}
        </div>
    );
};

export default Reveal;
