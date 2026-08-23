import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-xl border-dashed bg-gray-50/50">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gray-100 text-gray-500">
                {icon || <FileQuestion className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction} className="mt-6" variant="outline">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
