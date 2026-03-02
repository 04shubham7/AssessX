import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

const CreateTest = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [testData, setTestData] = useState({
        title: '',
        duration: 10,
        settings: {
            negativeMarking: false,
            shuffleQuestions: false
        }
    });

    const [questions, setQuestions] = useState([
        {
            questionText: '',
            type: 'single',
            options: [
                { text: '', isCorrect: false },
                { text: '', isCorrect: false }
            ],
            allowFileUpload: true, // Default to true
            marks: 1
        }
    ]);

    const handleTestChange = (field, value) => {
        setTestData(prev => ({ ...prev, [field]: value }));
    };

    const handleSettingChange = (field) => {
        setTestData(prev => ({
            ...prev,
            settings: { ...prev.settings, [field]: !prev.settings[field] }
        }));
    };

    const addQuestion = () => {
        setQuestions([...questions, {
            questionText: '',
            type: 'single',
            options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
            allowFileUpload: true,
            marks: 1
        }]);
    };

    const removeQuestion = (idx) => {
        setQuestions(questions.filter((_, i) => i !== idx));
    };

    const updateQuestion = (idx, field, value) => {
        const updated = [...questions];
        updated[idx][field] = value;
        setQuestions(updated);
    };

    const addOption = (qIdx) => {
        const updated = [...questions];
        updated[qIdx].options.push({ text: '', isCorrect: false });
        setQuestions(updated);
    };

    const updateOption = (qIdx, oIdx, field, value) => {
        const updated = [...questions];
        updated[qIdx].options[oIdx][field] = value;
        setQuestions(updated);
    };

    const removeOption = (qIdx, oIdx) => {
        const updated = [...questions];
        updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== oIdx);
        setQuestions(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            // Validate Basic
            if (!testData.title) return alert('Title required');

            // Validate Questions
            if (questions.length === 0) return alert('At least one question is required');

            for (let i = 0; i < questions.length; i++) {
                if (questions[i].questionText.trim() === '') {
                    return alert(`Question ${i + 1} text is required`);
                }

                if (questions[i].type !== 'subjective') {
                    if (questions[i].options.length < 2) {
                        return alert(`Question ${i + 1} must have at least 2 options`);
                    }
                    for (let j = 0; j < questions[i].options.length; j++) {
                        if (!questions[i].options[j].text.trim()) {
                            return alert(`Option ${j + 1} in Question ${i + 1} is required`);
                        }
                    }
                    const correctOptions = questions[i].options.filter(o => o.isCorrect);
                    if (correctOptions.length === 0) {
                        return alert(`Question ${i + 1} must have at least one correct option`);
                    }
                }
            }

            const sanitizedQuestions = questions.map(q => {
                if (q.type === 'subjective') {
                    return { ...q, options: [] };
                }
                return q;
            });

            const payload = { ...testData, questions: sanitizedQuestions };

            await axios.post('http://localhost:5000/api/tests', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate('/admin/dashboard');
        } catch (error) {
            alert('Failed to create test');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create New Test</h1>
                        <p className="text-muted-foreground mt-1">Configure your assessment and add questions.</p>
                    </div>
                    <Button onClick={handleSubmit} disabled={loading} size="lg">
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Publishing...' : 'Publish Test'}
                    </Button>
                </div>

                {/* Test Basics */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Test Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="testTitle">Test Title</Label>
                                <Input
                                    id="testTitle"
                                    value={testData.title}
                                    onChange={(e) => handleTestChange('title', e.target.value)}
                                    placeholder="e.g. Midterm Assessment"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (minutes)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={testData.duration}
                                    onChange={(e) => handleTestChange('duration', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center space-x-6 pt-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={testData.settings.negativeMarking}
                                        onChange={() => handleSettingChange('negativeMarking')}
                                        className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-sm font-medium">Negative Marking</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={testData.settings.shuffleQuestions}
                                        onChange={() => handleSettingChange('shuffleQuestions')}
                                        className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-sm font-medium">Shuffle Questions</span>
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Questions */}
                <div className="space-y-4">
                    {questions.map((q, qIdx) => (
                        <Card key={qIdx} className="relative border-border/50 shadow-sm overflow-hidden group hover:border-primary/50 transition-colors">
                            <button
                                onClick={() => removeQuestion(qIdx)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-destructive bg-secondary/50 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <CardContent className="pt-6">
                                <div className="mb-6 pr-12">
                                    <div className="space-y-2 mb-4">
                                        <Label className="text-base font-semibold">Question {qIdx + 1}</Label>
                                        <Input
                                            value={q.questionText}
                                            onChange={(e) => updateQuestion(qIdx, 'questionText', e.target.value)}
                                            placeholder="Enter question text..."
                                            className="text-lg py-6"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <select
                                            value={q.type}
                                            onChange={(e) => updateQuestion(qIdx, 'type', e.target.value)}
                                            className="border border-input rounded-md px-3 py-2 text-sm bg-background hover:bg-accent/50 focus:ring-2 focus:ring-ring outline-none transition-colors"
                                        >
                                            <option value="single">Single Correct</option>
                                            <option value="multiple">Multiple Correct</option>
                                            <option value="subjective">Subjective (File Upload)</option>
                                        </select>
                                        <div className="flex items-center space-x-2">
                                            <Label className="text-muted-foreground whitespace-nowrap">Marks:</Label>
                                            <Input
                                                type="number"
                                                className="w-20"
                                                value={q.marks}
                                                onChange={(e) => updateQuestion(qIdx, 'marks', e.target.value)}
                                                placeholder="1"
                                                min={1}
                                            />
                                        </div>
                                    </div>
                                    {q.type === 'subjective' && (
                                        <div className="mt-4 bg-secondary/30 p-3 rounded-md inline-block">
                                            <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={q.allowFileUpload !== false}
                                                    onChange={(e) => updateQuestion(qIdx, 'allowFileUpload', e.target.checked)}
                                                    className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                                />
                                                <span>Allow File Upload for this question</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Options (Only for Single/Multiple) */}
                                {q.type !== 'subjective' && (
                                    <div className="space-y-3 bg-secondary/10 p-4 rounded-lg border border-border/50">
                                        <Label className="text-sm font-semibold mb-2 block">Answer Options</Label>
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} className="flex items-center space-x-3 bg-background p-2 rounded-md border border-border shadow-sm">
                                                <div className="flex items-center justify-center w-8">
                                                    <input
                                                        type={q.type === 'single' ? 'radio' : 'checkbox'}
                                                        name={`q-${qIdx}`}
                                                        checked={opt.isCorrect}
                                                        onChange={(e) => {
                                                            if (q.type === 'single') {
                                                                const updated = [...questions];
                                                                updated[qIdx].options.forEach(o => o.isCorrect = false);
                                                                updated[qIdx].options[oIdx].isCorrect = true;
                                                                setQuestions(updated);
                                                            } else {
                                                                updateOption(qIdx, oIdx, 'isCorrect', e.target.checked);
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-primary focus:ring-primary cursor-pointer"
                                                    />
                                                </div>
                                                <Input
                                                    placeholder={`Option ${oIdx + 1}`}
                                                    value={opt.text}
                                                    onChange={(e) => updateOption(qIdx, oIdx, 'text', e.target.value)}
                                                    className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent"
                                                />
                                                <button onClick={() => removeOption(qIdx, oIdx)} className="text-muted-foreground hover:text-destructive p-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <Button variant="outline" size="sm" onClick={() => addOption(qIdx)} className="mt-2 text-primary border-primary/20 hover:bg-primary/10">
                                            <Plus className="w-4 h-4 mr-1" /> Add Option
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="pt-4 pb-12 text-center">
                    <Button variant="outline" className="w-full max-w-md mx-auto py-8 border-dashed border-2 hover:bg-muted/50 text-muted-foreground hover:text-foreground group transition-all" onClick={addQuestion}>
                        <div className="flex flex-col items-center gap-2">
                            <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span className="font-semibold text-lg">Add New Question</span>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateTest;
