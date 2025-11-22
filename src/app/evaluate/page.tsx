'use client'; // This directive makes it a Client Component

import { useState, useRef } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon, XCircleIcon } from '@heroicons/react/24/outline'; // Importing Heroicons

export default function EvaluationPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [rubricText, setRubricText] = useState<string>(''); // Simplified for demo
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files!)]);
            event.target.value = ''; // Clear input to allow re-uploading same file
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Prevent default to allow drop
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files) {
            setFiles(prevFiles => [...prevFiles, ...Array.from(event.dataTransfer.files)]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (files.length === 0 || !rubricText.trim()) {
            setSubmissionMessage('Please upload files and provide a rubric.');
            return;
        }

        setIsSubmitting(true);
        setSubmissionMessage(null);

        const formData = new FormData();

        // Append files
        files.forEach(file => {
            formData.append('files', file);
        });

        // Append rubrics (simplified: just sending the raw text for this demo)
        // In a real app, you'd parse rubricText into JSON here or in your API proxy
        formData.append('rubrics', JSON.stringify({ creative_writing_rubric: { raw_text: rubricText } }));


        try {
            // IMPORTANT: Call your local API proxy, NOT the external backend directly
            const response = await fetch('/api/evaluate', { // This will call your /app/api/evaluate/route.ts
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setSubmissionMessage('Evaluation request sent successfully!');
                console.log('Backend response:', result);
                // Here you would typically display the results to the user
            } else {
                const errorData = await response.json();
                setSubmissionMessage(`Error: ${errorData.message || response.statusText}`);
            }
        } catch (error: any) {
            setSubmissionMessage(`Network or submission error: ${error.message}`);
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
                    AI Evaluation Portal
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Files Section */}
                    <div>
                        <label className="block text-xl font-semibold text-gray-700 mb-4">
                            <CloudArrowUpIcon className="inline-block h-6 w-6 text-indigo-500 mr-2" />
                            Upload Files for Evaluation
                        </label>
                        <div
                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-400 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L40 32"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        Upload a file
                                    </span>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Any file type
                                </p>
                                <input
                                    ref={fileInputRef}
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    multiple
                                    className="sr-only"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        {files.length > 0 && (
                            <div className="mt-4 border border-gray-200 rounded-md p-4">
                                <p className="text-md font-medium text-gray-700 mb-2">Selected Files:</p>
                                <ul className="divide-y divide-gray-200">
                                    {files.map((file, index) => (
                                        <li key={file.name + index} className="py-2 flex items-center justify-between text-sm">
                                            <div className="flex items-center">
                                                <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                <span className="font-medium text-gray-900">{file.name}</span>
                                                <span className="ml-2 text-gray-500 text-xs">({(file.size / 1024).toFixed(2)} KB)</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
                                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                                title="Remove file"
                                            >
                                                <XCircleIcon className="h-5 w-5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Rubric Section (Simplified) */}
                    <div>
                        <label htmlFor="rubric-text" className="block text-xl font-semibold text-gray-700 mb-4">
                            <DocumentTextIcon className="inline-block h-6 w-6 text-indigo-500 mr-2" />
                            Define Evaluation Rubric (JSON or Text)
                        </label>
                        <textarea
                            id="rubric-text"
                            name="rubric-text"
                            rows={8}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={`Example JSON:\n{\n  "creative_writing_rubric": {\n    "criteria": [\n      {\n        "name": "Creativity & Originality",\n        "levels": {\n          "400": "Ideas are highly original...",\n          "300": "Ideas are interesting...",\n          "200": "Ideas are predictable..."\n        }\n      }\n    ]\n  }\n}`}
                            value={rubricText}
                            onChange={(e) => setRubricText(e.target.value)}
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            Paste your evaluation rubric here. For this demo, we'll send it as a string.
                        </p>
                    </div>

                    {/* Submission Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || files.length === 0 || !rubricText.trim()}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                'Start Evaluation'
                            )}
                        </button>
                    </div>

                    {/* Submission Message / Results Placeholder */}
                    {submissionMessage && (
                        <div className={`mt-4 p-4 rounded-md ${submissionMessage.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            <p className="font-medium">{submissionMessage}</p>
                        </div>
                    )}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Evaluation Results</h2>
                        <p className="text-gray-600">
                            Results from the backend will appear here after submission.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}