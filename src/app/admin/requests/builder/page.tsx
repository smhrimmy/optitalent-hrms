import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, CheckSquare, Users, Clock, Save, Plus } from 'lucide-react';

export default function RequestBuilderPage() {
    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Request Builder</h1>
                    <p className="text-sm text-gray-500">Design a new operational request type</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">Discard</Button>
                    <Button className="gap-2">
                        <Save className="w-4 h-4" />
                        Save & Publish
                    </Button>
                </div>
            </header>

            {/* Main Content Workspace */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-5xl mx-auto grid grid-cols-12 gap-6">
                    
                    {/* Sidebar Configuration */}
                    <div className="col-span-4 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    General Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Request Name</label>
                                    <input type="text" className="w-full mt-1 p-2 border rounded-md" placeholder="e.g. Work From Home" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Category</label>
                                    <select className="w-full mt-1 p-2 border rounded-md bg-white">
                                        <option>Attendance</option>
                                        <option>HR</option>
                                        <option>IT</option>
                                        <option>Expenses</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Eligibility & Policy
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500 mb-4">Who can submit this request?</p>
                                <Button variant="outline" className="w-full text-sm border-dashed">
                                    <Plus className="w-4 h-4 mr-2" /> Add Rule
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Workflow & SLA
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2 text-sm border rounded-md bg-gray-50">
                                        <span>1. Manager Approval</span>
                                    </div>
                                    <Button variant="outline" className="w-full text-sm border-dashed">
                                        <Plus className="w-4 h-4 mr-2" /> Add Step
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form Builder Canvas */}
                    <div className="col-span-8">
                        <Card className="h-full min-h-[600px]">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4" />
                                    Form Canvas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 flex flex-col items-center justify-center h-[500px]">
                                <div className="text-center p-8 border-2 border-dashed rounded-xl border-gray-200">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-900">Add form fields</h3>
                                    <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                        Drag and drop fields here to build the request form that employees will fill out.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
