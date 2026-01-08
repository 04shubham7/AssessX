import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Card, CardHeader } from '../../components/Layout';

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

            const payload = { ...testData, questions };

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
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Test</h1>
                    <Button onClick={handleSubmit} isLoading={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        Publish Test
                    </Button>
                </div>

                {/* Test Basics */}
                <Card>
                    <CardHeader title="Test Configuration" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Test Title"
                            value={testData.title}
                            onChange={(e) => handleTestChange('title', e.target.value)}
                        />
                        <Input
                            label="Duration (minutes)"
                            type="number"
                            value={testData.duration}
                            onChange={(e) => handleTestChange('duration', e.target.value)}
                        />
                        <div className="flex items-center space-x-4 pt-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={testData.settings.negativeMarking}
                                    onChange={() => handleSettingChange('negativeMarking')}
                                    className="rounded text-indigo-600"
                                />
                                <span>Negative Marking</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={testData.settings.shuffleQuestions}
                                    onChange={() => handleSettingChange('shuffleQuestions')}
                                    className="rounded text-indigo-600"
                                />
                                <span>Shuffle Questions</span>
                            </label>
                        </div>
                    </div>
                </Card>

                {/* Questions */}
                <div className="space-y-4">
                    {questions.map((q, qIdx) => (
                        <Card key={qIdx} className="relative">
                            <button
                                onClick={() => removeQuestion(qIdx)}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>

                            <div className="mb-4 pr-10">
                                <Input
                                    label={`Question ${qIdx + 1}`}
                                    value={q.questionText}
                                    onChange={(e) => updateQuestion(qIdx, 'questionText', e.target.value)}
                                    placeholder="Enter question text..."
                                />
                                <div className="mt-2 flex space-x-4">
                                    <select
                                        value={q.type}
                                        onChange={(e) => updateQuestion(qIdx, 'type', e.target.value)}
                                        className="border rounded p-1 text-sm bg-white"
                                    >
                                        <option value="single">Single Correct</option>
                                        <option value="multiple">Multiple Correct</option>
                                        <option value="subjective">Subjective (File Upload)</option>
                                    </select>
                                    <Input
                                        type="number"
                                        className="w-20"
                                        value={q.marks}
                                        onChange={(e) => updateQuestion(qIdx, 'marks', e.target.value)}
                                        placeholder="Marks"
                                    />
                                </div>
                                {q.type === 'subjective' && (
                                    <div className="mt-2">
                                        <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                                            <input
                                                type="checkbox"
                                                checked={q.allowFileUpload !== false}
                                                onChange={(e) => updateQuestion(qIdx, 'allowFileUpload', e.target.checked)}
                                                className="rounded text-indigo-600"
                                            />
                                            <span>Allow File Upload</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Options (Only for Single/Multiple) */}
                            {q.type !== 'subjective' && (
                                <div className="space-y-2 ml-4 border-l-2 border-gray-100 pl-4">
                                    {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="flex items-center space-x-3">
                                            <input
                                                type={q.type === 'single' ? 'radio' : 'checkbox'}
                                                name={`q-${qIdx}`}
                                                checked={opt.isCorrect}
                                                onChange={(e) => {
                                                    if (q.type === 'single') {
                                                        // Uncheck others
                                                        const updated = [...questions];
                                                        updated[qIdx].options.forEach(o => o.isCorrect = false);
                                                        updated[qIdx].options[oIdx].isCorrect = true;
                                                        setQuestions(updated);
                                                    } else {
                                                        updateOption(qIdx, oIdx, 'isCorrect', e.target.checked);
                                                    }
                                                }}
                                            />
                                            <Input
                                                placeholder={`Option ${oIdx + 1}`}
                                                value={opt.text}
                                                onChange={(e) => updateOption(qIdx, oIdx, 'text', e.target.value)}
                                                className="flex-1"
                                            />
                                            <button onClick={() => removeOption(qIdx, oIdx)} className="text-gray-400 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <Button variant="ghost" size="sm" onClick={() => addOption(qIdx)}>
                                        <Plus className="w-3 h-3 mr-1" /> Add Option
                                    </Button>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                <Button variant="secondary" className="w-full py-4 border-dashed border-2" onClick={addQuestion}>
                    <Plus className="w-5 h-5 mr-2" /> Add Question
                </Button>
            </div>
        </div>
    );
};

export default CreateTest;
