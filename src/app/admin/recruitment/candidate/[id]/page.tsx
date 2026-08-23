'use client';

import React from 'react';

export default function CandidateProfile({ params }: { params: { id: string } }) {
    // Demo Candidate matching the Explainable AI Prompt
    const candidate = {
        name: 'Rahul',
        role: 'Senior Backend Engineer',
        matchLevel: 'STRONG',
        evidence: [
            { skill: 'Node.js', requirement: 'Required', years: 5, found: true },
            { skill: 'PostgreSQL', requirement: 'Required', years: 4, found: true },
            { skill: 'AWS', requirement: 'Required', years: 3, found: true },
            { skill: 'Docker', requirement: 'Required', years: 2, found: true }
        ],
        gaps: ['Kubernetes (Preferred — not found)'],
        experience: { required: '5+ years', candidate: '6 years' },
        recommendation: 'Proceed to technical interview',
        confidence: 'Medium',
        limitations: ['Resume contains no verified AWS certification.']
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{candidate.name}</h1>
                    <p className="text-muted-foreground mt-1">Applying for: {candidate.role}</p>
                </div>
                <div className="space-x-3">
                    <button className="bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 rounded-md font-medium">Reject</button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">Advance Stage</button>
                </div>
            </div>

            <div className="border rounded-xl shadow-sm bg-card overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span>AI Screening Match:</span>
                        <span className="text-green-700">{candidate.matchLevel}</span>
                    </h2>
                </div>
                
                <div className="p-6 space-y-8">
                    {/* Evidence */}
                    <section>
                        <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-3">Evidence</h3>
                        <div className="space-y-2 font-mono text-sm">
                            {candidate.evidence.map((ev, i) => (
                                <div key={i} className="flex border-b border-gray-100 pb-2">
                                    <span className="w-40 font-medium">{ev.skill}</span>
                                    <span className="w-32 text-gray-500">{ev.requirement}</span>
                                    <span className="text-green-600 flex-1">✓ {ev.years} years</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skill Gaps */}
                    <section>
                        <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-3">Skill Gaps</h3>
                        <div className="font-mono text-sm text-amber-700">
                            {candidate.gaps.map((gap, i) => (
                                <div key={i}>• {gap}</div>
                            ))}
                        </div>
                    </section>

                    {/* Experience */}
                    <section>
                        <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-3">Experience</h3>
                        <div className="font-mono text-sm space-y-1">
                            <div>Required: {candidate.experience.required}</div>
                            <div>Candidate: {candidate.experience.candidate}</div>
                        </div>
                    </section>

                    {/* Recommendation */}
                    <section className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-800 text-sm uppercase tracking-wider mb-2">Recommendation</h3>
                        <p className="text-blue-900 font-medium">{candidate.recommendation}</p>
                        <div className="mt-2 text-sm text-blue-700 flex gap-4">
                            <span>Confidence: {candidate.confidence}</span>
                        </div>
                    </section>

                    {/* Limitations */}
                    <section className="border-l-4 border-yellow-400 pl-4">
                        <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-1">Limitations / AI Caveats</h3>
                        <p className="text-sm text-gray-700 italic">
                            {candidate.limitations.map((limit, i) => (
                                <span key={i}>{limit}</span>
                            ))}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
