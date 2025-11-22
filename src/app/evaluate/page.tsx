'use client'; // This directive makes it a Client Component
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Activity, BarChart2 } from 'lucide-react';

// Type definitions
interface EvaluationData {
    score: number;
    max_score: number;
    max_similarity: number;
    llm_reasoning?: string;
    llm_evidence?: string;
    relevant_snippets?: string[];
}

interface EvaluationResults {
    evaluation_scores: Record<string, EvaluationData>;
    overall_score?: number;
    documents_processed?: any[];
}

type ExpandedCriteria = Record<string, boolean>;

// Default Rubric Configuration based on your request
const DEFAULT_RUBRIC = {
    "creative_writing_rubric": {
        "criteria": [
            {
                "name": "Creativity & Originality",
                "levels": {
                    "400": "Ideas are highly original, imaginative, and surprising; shows unique voice or perspective.",
                    "300": "Ideas are interesting and somewhat original; shows some creativity.",
                    "200": "Ideas are predictable or somewhat generic; creativity is limited.",
                    "100": "Little to no originality; relies heavily on clichés or copied ideas."
                }
            },
            {
                "name": "Plot, Structure & Organization",
                "levels": {
                    "4": "Plot is engaging, coherent, and flows smoothly; strong beginning, development, and conclusion.",
                    "3": "Plot is clear with minor inconsistencies; structure mostly works.",
                    "2": "Plot is loosely connected; pacing or transitions may feel off.",
                    "1": "Plot is confusing, incomplete, or lacks structure."
                }
            },
            {
                "name": "Character Development",
                "levels": {
                    "4": "Characters are vivid, multi-dimensional, consistent, and emotionally engaging.",
                    "3": "Characters are clear but could be deeper or more consistent.",
                    "2": "Characters feel underdeveloped or inconsistent.",
                    "1": "Characters lack definition or purpose."
                }
            },
            {
                "name": "Setting & World-Building",
                "levels": {
                    "4": "Setting is richly described and enhances the story; world feels real and immersive.",
                    "3": "Setting is clear but lacks depth or richness.",
                    "2": "Setting exists but is vague or loosely connected.",
                    "1": "Little to no sense of setting."
                }
            },
            {
                "name": "Language, Style & Voice",
                "levels": {
                    "4": "Language is vivid, expressive, and stylistically appropriate; strong voice.",
                    "3": "Language is clear with moments of expressiveness.",
                    "2": "Language is plain, repetitive, or lacks style.",
                    "1": "Language is unclear, awkward, or ineffective."
                }
            },
            {
                "name": "Grammar, Mechanics & Technical Accuracy",
                "levels": {
                    "4": "Virtually no errors; grammar supports clarity and style.",
                    "3": "Few errors that do not interfere with reading.",
                    "2": "Multiple errors occasionally affecting clarity.",
                    "1": "Frequent errors that distract and confuse."
                }
            },
            {
                "name": "Theme & Emotional Impact",
                "levels": {
                    "4": "Theme is meaningful and well-developed; writing evokes strong emotions.",
                    "3": "Theme is present and clear; some emotional depth.",
                    "2": "Theme is weak or shallow; emotional impact is limited.",
                    "1": "Theme is unclear; writing fails to evoke any response."
                }
            },
            {
                "name": "Dialogue (if applicable)",
                "levels": {
                    "4": "Natural, purposeful, and reveals character or advances plot.",
                    "3": "Mostly natural with minor issues.",
                    "2": "Sometimes stiff or unnecessary.",
                    "1": "Unnatural, confusing, or unrelated."
                }
            }
        ]
    }
};

export default function EvaluationDashboard() {
    const [files, setFiles] = useState<File[]>([]);
    const [rubric, setRubric] = useState<string>(JSON.stringify(DEFAULT_RUBRIC, null, 2));
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<EvaluationResults | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedCriteria, setExpandedCriteria] = useState<ExpandedCriteria>({});

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');

            if (selectedFiles.length !== pdfFiles.length) {
                alert('Only PDF files are allowed. Non-PDF files have been filtered out.');
                setError('Only PDF files are allowed.');
            } else {
                setError(null);
            }

            setFiles(pdfFiles);
        }
    };

    // Toggle criteria details
    const toggleCriteria = (criteriaName: string) => {
        setExpandedCriteria(prev => ({
            ...prev,
            [criteriaName]: !prev[criteriaName]
        }));
    };

    // API Call Function
    const handleEvaluate = async () => {
        // Validation with alerts
        if (files.length === 0) {
            alert("Please upload at least one PDF file before running evaluation.");
            setError("Please upload at least one PDF file.");
            return;
        }

        if (!rubric.trim()) {
            alert("Please define a rubric before running evaluation.");
            setError("Please define a rubric.");
            return;
        }

        // Validate JSON format
        try {
            JSON.parse(rubric);
        } catch {
            alert("Invalid rubric format. Please provide valid JSON.");
            setError("Invalid rubric format. Please provide valid JSON.");
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const formData = new FormData();

            // 1. Append files
            files.forEach((file) => {
                formData.append('files', file);
            });

            // 2. Append rubrics
            // The API expects a JSON string for the 'rubrics' key based on your curl
            formData.append('rubrics', rubric);

            // 3. Send Request
            const response = await fetch('https://navanihk-parsehk.hf.space/evaluate', {
                method: 'POST',
                body: formData,
                // Note: Do NOT set 'Content-Type' header manually when using FormData.
                // The browser sets it automatically to multipart/form-data with the boundary.
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setResults(data);

        } catch (err: unknown) {
            console.error("Evaluation failed:", err);
            setError(err instanceof Error ? err.message : "An unexpected error occurred during evaluation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xl">E</div>
                        EVAPRO Evaluation Dashboard
                    </h1>
                    <p className="text-slate-500 mt-2">Upload submissions and evaluate against the Creative Writing Rubric.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Inputs */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* File Upload Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Upload size={20} className="text-indigo-600" />
                                Submission Upload
                            </h2>

                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-slate-50 transition text-center">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                    accept=".pdf"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                                        <Upload size={24} />
                                    </div>
                                    <span className="text-sm font-medium text-indigo-600 hover:underline">Click to upload files</span>
                                    <span className="text-xs text-slate-400 mt-1">PDF files only (Max 10MB)</span>
                                </label>
                            </div>

                            {files.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {files.map((file: File, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm bg-slate-50 p-2 rounded border border-slate-100">
                                            <FileText size={16} className="text-slate-400" />
                                            <span className="truncate flex-1">{file.name}</span>
                                            <span className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Rubric Configuration (Read-only for demo, or editable) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Activity size={20} className="text-indigo-600" />
                                Rubric Configuration
                            </h2>
                            <div className="text-xs text-slate-500 mb-2">
                                Editing allowed. JSON format required.
                            </div>
                            <textarea
                                className="w-full h-64 p-3 text-xs font-mono bg-slate-900 text-green-400 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={rubric}
                                onChange={(e) => setRubric(e.target.value)}
                            />
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleEvaluate}
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center gap-2
                ${loading
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 active:transform active:scale-95'}`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    Run Evaluation
                                </>
                            )}
                        </button>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200 flex items-start gap-2">
                                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Results */}
                    <div className="lg:col-span-8">
                        {!results && !loading && (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <BarChart2 size={48} className="mb-4 opacity-20" />
                                <p>Results will appear here after analysis.</p>
                            </div>
                        )}

                        {loading && (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-indigo-600 border border-slate-200 rounded-xl bg-white">
                                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                                <h3 className="text-xl font-semibold">Analyzing Submission...</h3>
                                <p className="text-slate-500 mt-2">Applying OCR and Semantic Matching</p>
                            </div>
                        )}

                        {results && results.evaluation_scores && (
                            <div className="space-y-6 animate-fade-in">

                                {/* Summary Card */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Evaluation Report</h2>
                                        <p className="text-slate-500 text-sm mt-1">
                                            Processed {results.documents_processed?.length || 0} document(s)
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Overall Score</div>
                                        <div className="text-4xl font-bold text-indigo-600">
                                            {results.overall_score ? results.overall_score.toFixed(1) : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Criteria List */}
                                <div className="space-y-4">
                                    {Object.entries(results.evaluation_scores).map(([criterion, data]: [string, EvaluationData], index: number) => {
                                        const isExpanded = expandedCriteria[criterion];
                                        const scorePercent = (data.score / data.max_score) * 100;

                                        // Determine color based on score
                                        let scoreColor = 'bg-red-500';
                                        if (scorePercent >= 80) scoreColor = 'bg-green-500';
                                        else if (scorePercent >= 50) scoreColor = 'bg-yellow-500';

                                        return (
                                            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                                {/* Header */}
                                                <div
                                                    onClick={() => toggleCriteria(criterion)}
                                                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-2 h-12 rounded-full ${scoreColor}`}></div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800">{criterion}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                                                    Score: {data.score}/{data.max_score}
                                                                </span>
                                                                <span className="text-xs text-slate-400">
                                                                    Similarity: {(data.max_similarity * 100).toFixed(1)}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-slate-400">
                                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </div>
                                                </div>

                                                {/* Expanded Content */}
                                                {isExpanded && (
                                                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/30">

                                                        {/* AI Reasoning */}
                                                        <div className="mb-4">
                                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Reasoning</h4>
                                                            <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200 shadow-sm">
                                                                {data.llm_reasoning || "No reasoning provided."}
                                                            </p>
                                                        </div>

                                                        {/* Evidence */}
                                                        {data.llm_evidence && (
                                                            <div className="mb-4">
                                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Evidence</h4>
                                                                <p className="text-sm text-slate-600 italic">
                                                                    "{data.llm_evidence}"
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Snippets */}
                                                        {data.relevant_snippets && data.relevant_snippets.length > 0 && (
                                                            <div>
                                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Source Snippets</h4>
                                                                <div className="space-y-2">
                                                                    {data.relevant_snippets.map((snippet: string, sIdx: number) => (
                                                                        <div key={sIdx} className="text-xs font-mono text-slate-500 bg-slate-100 p-2 rounded border border-slate-200 overflow-x-auto whitespace-pre-wrap">
                                                                            ...{snippet.substring(0, 200)}...
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
