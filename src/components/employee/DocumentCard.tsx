'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmployeeDocument } from '@/lib/employee/domain';
import { FileText, Calendar, ShieldCheck, Download, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DocumentCardProps {
    document: EmployeeDocument;
}

export function DocumentCard({ document }: DocumentCardProps) {
    const statusConfig = {
        'VERIFIED': { color: 'bg-green-100 text-green-800', icon: <ShieldCheck className="h-3 w-3 mr-1" /> },
        'PENDING_UPLOAD': { color: 'bg-orange-100 text-orange-800', icon: <AlertCircle className="h-3 w-3 mr-1" /> },
        'UNDER_REVIEW': { color: 'bg-blue-100 text-blue-800', icon: <RefreshCw className="h-3 w-3 mr-1 animate-spin-slow" /> },
        'REJECTED': { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-3 w-3 mr-1" /> },
        'EXPIRED': { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="h-3 w-3 mr-1" /> },
        'ARCHIVED': { color: 'bg-gray-100 text-gray-600', icon: <FileText className="h-3 w-3 mr-1" /> },
        'DRAFT': { color: 'bg-gray-100 text-gray-600', icon: <FileText className="h-3 w-3 mr-1" /> },
        'REQUESTED': { color: 'bg-purple-100 text-purple-800', icon: <RefreshCw className="h-3 w-3 mr-1" /> },
        'UPLOADED': { color: 'bg-blue-100 text-blue-800', icon: <FileText className="h-3 w-3 mr-1" /> },
    };

    const config = statusConfig[document.status] || { color: 'bg-gray-100 text-gray-800', icon: null };

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow group">
            <CardHeader className="pb-3 border-b flex-row justify-between items-start">
                <div className="flex gap-3 items-start">
                    <div className="p-2 bg-muted rounded-md shrink-0">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-base leading-tight mb-1">
                            {document.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">{document.category} • {document.documentType}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <Badge variant="secondary" className={`${config.color} border-none flex items-center`}>
                        {config.icon}
                        {document.status.replace('_', ' ')}
                    </Badge>
                    {document.isRequired && document.status === 'PENDING_UPLOAD' && (
                        <Badge variant="destructive">Action Required</Badge>
                    )}
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                    {document.issuedAt && (
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" /> Issued
                            </span>
                            <span className="font-medium">{new Date(document.issuedAt).toLocaleDateString()}</span>
                        </div>
                    )}
                    {document.expiresAt && (
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <AlertCircle className="h-4 w-4" /> Expires
                            </span>
                            <span className="font-medium text-orange-600">{new Date(document.expiresAt).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-4 flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/employee/documents/${document.id}`}>View Details</Link>
                    </Button>
                    {document.status === 'VERIFIED' && (
                        <Button variant="secondary" size="icon" className="shrink-0" title="Download Securely">
                            <Download className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
