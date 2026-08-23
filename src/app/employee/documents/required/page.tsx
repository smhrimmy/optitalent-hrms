'use client';

import React, { useEffect, useState } from 'react';
import { EmployeeContextService, EmployeeDocument } from '@/lib/employee/domain';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RequiredDocumentsPage() {
    const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await EmployeeContextService.getDocuments('emp-1');
            setDocuments(data.filter(d => d.isRequired));
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
                <div className="h-12 bg-muted/30 rounded-lg animate-pulse w-32 mb-8" />
                <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
                <div className="space-y-4">
                    <div className="h-32 bg-muted/30 rounded-lg animate-pulse" />
                    <div className="h-32 bg-muted/30 rounded-lg animate-pulse" />
                </div>
            </div>
        );
    }

    const pendingDocs = documents.filter(d => d.status === 'PENDING_UPLOAD' || d.status === 'REJECTED');
    const submittedDocs = documents.filter(d => d.status === 'UPLOADED' || d.status === 'UNDER_REVIEW' || d.status === 'VERIFIED');

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" asChild>
                <Link href="/employee/documents"><ArrowLeft className="h-4 w-4" /> Back to Documents</Link>
            </Button>

            <div>
                <h1 className="text-3xl font-bold tracking-tight text-destructive">Action Required</h1>
                <p className="text-muted-foreground mt-1">
                    Please provide the following required compliance and policy documents.
                </p>
            </div>

            <div className="space-y-6">
                {pendingDocs.map(doc => (
                    <Card key={doc.id} className="border-orange-200 shadow-sm overflow-hidden">
                        <div className="h-1 w-full bg-orange-400" />
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">{doc.category} • {doc.documentType}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {doc.reasonRequired && (
                                <div className="bg-orange-50/50 p-3 rounded-md flex gap-3 text-sm border border-orange-100">
                                    <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-semibold text-orange-900 block mb-0.5">Why is this required?</span>
                                        <span className="text-orange-800/80">{doc.reasonRequired}</span>
                                    </div>
                                </div>
                            )}

                            {doc.expiresAt && (
                                <p className="text-sm">
                                    <span className="text-muted-foreground">Due by: </span>
                                    <span className="font-medium text-destructive">{new Date(doc.expiresAt).toLocaleDateString()}</span>
                                </p>
                            )}

                            <div className="pt-2">
                                <Button className="gap-2">
                                    <Upload className="h-4 w-4" /> Upload Document
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {submittedDocs.length > 0 && (
                <div className="pt-8 space-y-4">
                    <h3 className="text-lg font-semibold text-muted-foreground">Previously Submitted</h3>
                    <div className="opacity-70 space-y-4">
                        {submittedDocs.map(doc => (
                            <Card key={doc.id}>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{doc.title}</p>
                                        <p className="text-xs text-muted-foreground">Status: {doc.status.replace('_', ' ')}</p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/employee/documents/${doc.id}`}>View Details</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
