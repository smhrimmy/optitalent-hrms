'use client';

import React, { useEffect, useState } from 'react';
import { EmployeeContextService, EmployeeDocument } from '@/lib/employee/domain';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, ShieldCheck, Download, AlertCircle, RefreshCw, ArrowLeft, UploadCloud, History, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
    const [document, setDocument] = useState<EmployeeDocument | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await EmployeeContextService.getDocuments('emp-1');
            const doc = data.find(d => d.id === params.id) || null;
            setDocument(doc);
            setLoading(false);
        }
        fetchData();
    }, [params.id]);

    if (loading || !document) {
        return (
            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
                <div className="h-12 bg-muted/30 rounded-lg animate-pulse w-32 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 h-[600px] bg-muted/30 rounded-lg animate-pulse" />
                    <div className="h-96 bg-muted/30 rounded-lg animate-pulse" />
                </div>
            </div>
        );
    }

    const statusConfig = {
        'VERIFIED': { color: 'bg-green-100 text-green-800', icon: <ShieldCheck className="h-4 w-4 mr-1.5" /> },
        'PENDING_UPLOAD': { color: 'bg-orange-100 text-orange-800', icon: <AlertCircle className="h-4 w-4 mr-1.5" /> },
        'UNDER_REVIEW': { color: 'bg-blue-100 text-blue-800', icon: <RefreshCw className="h-4 w-4 mr-1.5 animate-spin-slow" /> },
        'REJECTED': { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-4 w-4 mr-1.5" /> },
        'EXPIRED': { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="h-4 w-4 mr-1.5" /> },
        'ARCHIVED': { color: 'bg-gray-100 text-gray-600', icon: <FileText className="h-4 w-4 mr-1.5" /> },
        'DRAFT': { color: 'bg-gray-100 text-gray-600', icon: <FileText className="h-4 w-4 mr-1.5" /> },
        'REQUESTED': { color: 'bg-purple-100 text-purple-800', icon: <RefreshCw className="h-4 w-4 mr-1.5" /> },
        'UPLOADED': { color: 'bg-blue-100 text-blue-800', icon: <FileText className="h-4 w-4 mr-1.5" /> },
    };

    const config = statusConfig[document.status] || { color: 'bg-gray-100 text-gray-800', icon: null };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" asChild>
                <Link href="/employee/documents"><ArrowLeft className="h-4 w-4" /> Back to Documents</Link>
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{document.title}</h1>
                    <p className="text-muted-foreground mt-1">
                        {document.category} • {document.documentType} • Version {document.version}
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    {document.status === 'VERIFIED' && (
                        <Button variant="outline" className="gap-2">
                            <Share2 className="h-4 w-4" /> Share
                        </Button>
                    )}
                    {document.status === 'PENDING_UPLOAD' ? (
                        <Button className="gap-2">
                            <UploadCloud className="h-4 w-4" /> Upload File
                        </Button>
                    ) : (
                        <Button className="gap-2">
                            <Download className="h-4 w-4" /> Download
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Document Viewer (Mock) */}
                <Card className="md:col-span-2 overflow-hidden border-2 bg-muted/10 h-[600px] flex flex-col items-center justify-center text-center">
                    {document.status === 'PENDING_UPLOAD' ? (
                        <div className="p-8 max-w-sm mx-auto space-y-4">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <UploadCloud className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Upload Required</h3>
                            <p className="text-sm text-muted-foreground">Please upload the required document to continue.</p>
                            <Button className="w-full mt-4">Select File</Button>
                            <p className="text-xs text-muted-foreground">Supports PDF, JPG, PNG (Max 5MB)</p>
                        </div>
                    ) : (
                        <div className="p-8 text-muted-foreground">
                            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p>Secure Document Preview</p>
                            <p className="text-xs mt-2 opacity-50">Preview is handled via short-lived signed URLs to prevent direct bucket access.</p>
                        </div>
                    )}
                </Card>

                {/* Metadata Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="secondary" className={`${config.color} border-none flex items-center text-sm w-fit px-3 py-1`}>
                                {config.icon}
                                {document.status.replace('_', ' ')}
                            </Badge>
                            
                            {document.status === 'VERIFIED' && document.verifiedAt && (
                                <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-green-600" />
                                    Verified on {new Date(document.verifiedAt).toLocaleDateString()}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-y-3">
                                <div className="text-muted-foreground">Category</div>
                                <div className="font-medium text-right">{document.category}</div>
                                
                                <div className="text-muted-foreground">Type</div>
                                <div className="font-medium text-right">{document.documentType}</div>
                                
                                <div className="text-muted-foreground">Source</div>
                                <div className="font-medium text-right">{document.source}</div>

                                {document.issuedAt && (
                                    <>
                                        <div className="text-muted-foreground">Issued Date</div>
                                        <div className="font-medium text-right">{new Date(document.issuedAt).toLocaleDateString()}</div>
                                    </>
                                )}
                                
                                {document.expiresAt && (
                                    <>
                                        <div className="text-muted-foreground">Expiry Date</div>
                                        <div className="font-medium text-right text-orange-600">{new Date(document.expiresAt).toLocaleDateString()}</div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <History className="h-5 w-5" /> Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm relative before:absolute before:inset-y-0 before:left-[21px] before:w-[2px] before:bg-muted pt-2 pl-4">
                            {/* Mock Timeline */}
                            {document.verifiedAt && (
                                <div className="relative pl-6">
                                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-background" />
                                    <p className="font-medium">Document Verified</p>
                                    <p className="text-xs text-muted-foreground">By HR Compliance</p>
                                </div>
                            )}
                            {document.uploadedAt && (
                                <div className="relative pl-6">
                                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-background" />
                                    <p className="font-medium">Document Uploaded</p>
                                    <p className="text-xs text-muted-foreground">System automation</p>
                                </div>
                            )}
                            {document.issuedAt && (
                                <div className="relative pl-6">
                                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-background" />
                                    <p className="font-medium">Document Generated</p>
                                    <p className="text-xs text-muted-foreground">{document.source}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
