
"use client";

import { useEffect, useState } from 'react';
import Login from '@/app/login/page';
import { LoadingLogo } from '@/components/loading-logo';

export default function RootPage() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (isInitialLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <LoadingLogo />
            </div>
        )
    }

    return <Login />;
}
