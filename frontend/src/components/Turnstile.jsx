import { useEffect, useRef } from 'react';

export default function Turnstile({ onVerify, options = {} }) {
    const containerRef = useRef(null);

    useEffect(() => {
        // Check if turnstile is already loaded
        if (!window.turnstile) {
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }

        const interval = setInterval(() => {
            if (window.turnstile && containerRef.current) {
                clearInterval(interval);
                window.turnstile.render(containerRef.current, {
                    sitekey: '1x00000000000000000000AA', // Placeholder: Always passes in testing
                    callback: (token) => {
                        onVerify(token);
                    },
                    ...options
                });
            }
        }, 100);

        return () => clearInterval(interval);
    }, [onVerify, options]);

    return <div ref={containerRef} className="my-4" />;
}
