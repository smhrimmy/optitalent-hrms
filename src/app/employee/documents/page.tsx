'use client';

import React, { useEffect, useState } from 'react';
import { EmployeeContextService, EmployeeDocument } from '@/lib/employee/domain';
import { DocumentCard } from '@/components/employee/DocumentCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ShieldCheck, AlertCircle, Clock, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function EmployeeDocumentCenterOS() {
    const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await EmployeeContextService.getDocuments('emp-1');
            setDocuments(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
                <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-48 bg-muted/30 rounded-lg animate-pulse" />
                    <div className="h-48 bg-muted/30 rounded-lg animate-pulse" />
                    <div className="h-48 bg-muted/30 rounded-lg animate-pulse" />
                </div>
            </div>
        );
    }

    const verifiedDocs = documents.filter(d => d.status === 'VERIFIED');
    const actionRequiredDocs = documents.filter(d => d.status === 'PENDING_UPLOAD' || d.status === 'REJECTED');
    const expiringSoonDocs = documents.filter(d => d.expiresAt && new Date(d.expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

    const filteredDocs = documents.filter(d => 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
                    <p className="text-muted-foreground mt-1">
                        Securely manage your official documents, compliance records, and certificates.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Request Document</Button>
                    <Button>Upload Document</Button>
                </div>
            </div>

            {/* Document Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center h-full">
                        <FileText className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-2xl font-bold">{documents.length}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Documents</span>
                    </CardContent>
                </Card>
                <Card className="bg-green-50/50 border-green-100">
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center h-full">
                        <ShieldCheck className="h-6 w-6 text-green-600 mb-2" />
                        <span className="text-2xl font-bold text-green-700">{verifiedDocs.length}</span>
                        <span className="text-xs text-green-700/80 uppercase tracking-wider font-semibold">Verified</span>
                    </CardContent>
                </Card>
                <Card className={actionRequiredDocs.length > 0 ? "bg-orange-50/50 border-orange-200" : ""}>
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center h-full">
                        <AlertCircle className={`h-6 w-6 mb-2 ${actionRequiredDocs.length > 0 ? 'text-orange-600' : 'text-muted-foreground'}`} />
                        <span className={`text-2xl font-bold ${actionRequiredDocs.length > 0 ? 'text-orange-700' : ''}`}>{actionRequiredDocs.length}</span>
                        <span className={`text-xs uppercase tracking-wider font-semibold ${actionRequiredDocs.length > 0 ? 'text-orange-700/80' : 'text-muted-foreground'}`}>Action Required</span>
                    </CardContent>
                </Card>
                <Card className={expiringSoonDocs.length > 0 ? "bg-red-50/50 border-red-200" : ""}>
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center h-full">
                        <Clock className={`h-6 w-6 mb-2 ${expiringSoonDocs.length > 0 ? 'text-red-600' : 'text-muted-foreground'}`} />
                        <span className={`text-2xl font-bold ${expiringSoonDocs.length > 0 ? 'text-red-700' : ''}`}>{expiringSoonDocs.length}</span>
                        <span className={`text-xs uppercase tracking-wider font-semibold ${expiringSoonDocs.length > 0 ? 'text-red-700/80' : 'text-muted-foreground'}`}>Expiring Soon</span>
                    </CardContent>
                </Card>
            </div>

            {/* Required Documents Alert */}
            {actionRequiredDocs.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-orange-900">Missing Required Documents</h4>
                            <p className="text-sm text-orange-800/80">Company policy or compliance regulations require you to provide {actionRequiredDocs.length} document(s).</p>
                        </div>
                    </div>
                    <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100 shrink-0" asChild>
                        <Link href="/employee/documents/required">View Requirements</Link>
                    </Button>
                </div>
            )}

            {/* Document Browser */}
            <div className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            type="search" 
                            placeholder="Search documents..." 
                            className="pl-9 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                        <Button variant="outline" size="sm" className="shrink-0 gap-2">
                            <Filter className="h-4 w-4" /> Category
                        </Button>
                        <Button variant="outline" size="sm" className="shrink-0">Status</Button>
                        <Button variant="outline" size="sm" className="shrink-0">Sort: Newest</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocs.map(doc => (
                        <DocumentCard key={doc.id} document={doc} />
                    ))}
                    {filteredDocs.length === 0 && (
                        <div className="col-span-full py-12 text-center border rounded-lg border-dashed text-muted-foreground">
                            No documents found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
