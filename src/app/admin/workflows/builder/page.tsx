'use client';

import React from 'react';

export default function WorkflowBuilder() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b px-6">
        <h1 className="text-lg font-semibold">Workflow Builder</h1>
        <div className="flex space-x-2">
          <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
            Save Draft
          </button>
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
            Publish Workflow
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Toolbox */}
        <aside className="w-64 border-r bg-muted/20 p-4 space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">Triggers</h3>
            <div className="space-y-2">
              <div className="cursor-grab rounded-md border bg-card p-2 text-sm shadow-sm hover:border-primary">
                Employee Created
              </div>
              <div className="cursor-grab rounded-md border bg-card p-2 text-sm shadow-sm hover:border-primary">
                Leave Submitted
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">Nodes</h3>
            <div className="space-y-2">
              <div className="cursor-grab rounded-md border bg-card p-2 text-sm shadow-sm hover:border-primary">
                Condition
              </div>
              <div className="cursor-grab rounded-md border bg-card p-2 text-sm shadow-sm hover:border-primary">
                Approval
              </div>
              <div className="cursor-grab rounded-md border bg-card p-2 text-sm shadow-sm hover:border-primary">
                Action
              </div>
              <div className="cursor-grab rounded-md border bg-card p-2 text-sm shadow-sm hover:border-primary">
                Notification
              </div>
            </div>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 bg-dot-pattern bg-[size:20px_20px] bg-muted/10 relative">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2 max-w-sm">
                    <h2 className="text-xl font-medium">Canvas Ready</h2>
                    <p className="text-sm text-muted-foreground">
                        Drag and drop triggers and nodes from the sidebar to build your workflow.
                        (ReactFlow integration placeholder)
                    </p>
                </div>
            </div>
        </main>

        {/* Sidebar: Properties */}
        <aside className="w-80 border-l bg-card p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Properties</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Select a node to configure its settings.
          </p>
        </aside>
      </div>
    </div>
  );
}
