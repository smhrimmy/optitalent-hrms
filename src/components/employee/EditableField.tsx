'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Lock, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface EditableFieldProps {
    label: string;
    value: string;
    editable: boolean;
    controlledByHR?: boolean;
    onSave?: (newValue: string) => Promise<void>;
    onRequestChange?: () => void;
}

export function EditableField({ label, value, editable, controlledByHR, onSave, onRequestChange }: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!onSave) return;
        setIsSaving(true);
        try {
            await onSave(currentValue);
            toast.success(`${label} updated successfully`);
            setIsEditing(false);
        } catch (error) {
            toast.error(`Failed to update ${label}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setCurrentValue(value);
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            {isEditing ? (
                <div className="flex items-center gap-2">
                    <Input 
                        value={currentValue} 
                        onChange={(e) => setCurrentValue(e.target.value)}
                        disabled={isSaving}
                        className="h-8 text-sm"
                    />
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={handleSave} disabled={isSaving}>
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={handleCancel} disabled={isSaving}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center justify-between group">
                    <span className="text-base font-medium">{value}</span>
                    {controlledByHR ? (
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] bg-muted/50 hidden group-hover:flex">Managed by HR</Badge>
                            <Button size="sm" variant="outline" className="h-7 text-xs hidden group-hover:flex" onClick={onRequestChange}>
                                Request Change
                            </Button>
                            <Lock className="h-3 w-3 text-muted-foreground group-hover:hidden" />
                        </div>
                    ) : editable ? (
                        <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsEditing(true)}>
                            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                    ) : null}
                </div>
            )}
        </div>
    );
}
