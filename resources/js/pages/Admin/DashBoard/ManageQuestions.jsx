import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, Settings, X, Save, ArrowRight, Edit2, Search, Filter, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchQuestions, saveQuestions, saveOption, updateOption, saveFollowUpQuestions } from '../../../components/manageQuestions/api';
import AdminSidebarLayout from "./AdminSidebarLayout";
// Mock large dataset of follow-up questions with categories


// Virtualized list component for performance
const VirtualizedQuestionList = ({ questions, selectedQuestions, onToggle, height = 300 }) => {
    const [startIndex, setStartIndex] = useState(0);
    const itemHeight = 60;
    const visibleCount = Math.ceil(height / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + 5, questions.length);

    const visibleQuestions = questions.slice(startIndex, endIndex);

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        const newStartIndex = Math.floor(scrollTop / itemHeight);
        setStartIndex(Math.max(0, newStartIndex - 2));
    };

    return (
        <div
            className="border rounded-lg overflow-auto"
            style={{ height }}
            onScroll={handleScroll}
        >
            <div style={{ height: questions.length * itemHeight, position: 'relative' }}>
                {visibleQuestions.map((question, index) => {
                    const actualIndex = startIndex + index;
                    return (
                        <div
                            key={question.id}
                            className="absolute w-full px-3 py-2 border-b hover:bg-blue-50 flex items-start gap-3"
                            style={{
                                top: (startIndex + index) * itemHeight,
                                height: itemHeight
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedQuestions.includes(question.id)}
                                onChange={() => onToggle(question.id)}
                                className="mt-2 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                    {question.text}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {question.category}
                  </span>
                                    {question.tags.map(tag => (
                                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Smart search and filter component
const QuestionSearchFilter = ({
                                  questions,
                                  onFilteredQuestionsChange,
                                  selectedQuestions,
                                  onSelectionChange
                              }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [sortBy, setSortBy] = useState('relevance');
    const [showFilters, setShowFilters] = useState(false);

    const categories = useMemo(() => {
        return [...new Set(questions.map(q => q.category))];
    }, [questions]);

    const allTags = useMemo(() => {
        const tagSet = new Set();
        questions.forEach(q => q.tags.forEach(tag => tagSet.add(tag)));
        return Array.from(tagSet);
    }, [questions]);

    const filteredQuestions = useMemo(() => {
        let filtered = questions;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(q =>
                q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(q => q.category === selectedCategory);
        }

        // Tags filter
        if (selectedTags.length > 0) {
            filtered = filtered.filter(q =>
                selectedTags.some(tag => q.tags.includes(tag))
            );
        }

        // Sort
        if (sortBy === 'relevance') {
            filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
        } else if (sortBy === 'alphabetical') {
            filtered.sort((a, b) => a.text.localeCompare(b.text));
        } else if (sortBy === 'category') {
            filtered.sort((a, b) => a.category.localeCompare(b.category));
        }

        return filtered;
    }, [questions, searchTerm, selectedCategory, selectedTags, sortBy]);

    useEffect(() => {
        onFilteredQuestionsChange(filteredQuestions);
    }, [filteredQuestions, onFilteredQuestionsChange]);

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const selectAll = () => {
        const allIds = filteredQuestions.map(q => q.id);
        onSelectionChange([...new Set([...selectedQuestions, ...allIds])]);
    };

    const deselectAll = () => {
        const filteredIds = new Set(filteredQuestions.map(q => q.id));
        onSelectionChange(selectedQuestions.filter(id => !filteredIds.has(id)));
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Filter Toggle */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
                <Filter size={16} />
                Advanced Filters
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tags Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {allTags.slice(0, 10).map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1 rounded-full text-xs ${
                                        selectedTags.includes(tag)
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="relevance">Relevance</option>
                            <option value="alphabetical">Alphabetical</option>
                            <option value="category">Category</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Results Summary & Bulk Actions */}
            <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredQuestions.length} of {questions.length} questions
            {selectedQuestions.length > 0 && ` (${selectedQuestions.length} selected)`}
        </span>
                <div className="flex gap-2">
                    <button
                        onClick={selectAll}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Select All
                    </button>
                    <button
                        onClick={deselectAll}
                        className="text-red-600 hover:text-red-800"
                    >
                        Deselect All
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main component with simplified layout calculation
const calculateLayout = (nodes, edges) => {
    const levels = {};
    const positioned = {};

    nodes.forEach(node => {
        if (node.type === 'question' && !node.data.isFollowUp) {
            levels[0] = levels[0] || [];
            levels[0].push(node.id);
        }
    });

    nodes.forEach(node => {
        if (node.type === 'option') {
            levels[1] = levels[1] || [];
            levels[1].push(node.id);
        }
    });

    nodes.forEach(node => {
        if (node.type === 'question' && node.data.isFollowUp) {
            levels[2] = levels[2] || [];
            levels[2].push(node.id);
        }
    });

    Object.keys(levels).forEach(level => {
        levels[level].forEach((nodeId, index) => {
            positioned[nodeId] = {
                x: parseInt(level) * 350,
                y: index * 120 + 50
            };
        });
    });

    return positioned;
};

const FlowNode = ({ node, onEdit, onDelete, onConfigureFollowUps, edges }) => {
    const getConnectedOptions = () => {
        if (node.type !== 'question' || node.data.isFollowUp) return [];
        return edges.filter(e => e.source === node.id).length;
    };

    const getConnectedFollowUps = () => {
        if (node.type !== 'option') return [];
        return edges.filter(e => e.source === node.id).length;
    };

    const nodeStyle = {
        position: 'absolute',
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        width: '280px',
        transform: 'translate(-50%, -50%)'
    };

    if (node.type === 'question') {
        return (
            <div style={nodeStyle} className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 shadow-md">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-700">
              {node.data.isFollowUp ? 'Follow-up Question' : 'Main Question'}
            </span>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onEdit(node.id)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(node.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
                <div className="text-sm text-gray-800 mb-2">{node.data.text}</div>
                {!node.data.isFollowUp && (
                    <div className="text-xs text-blue-600">
                        Connected Options: {getConnectedOptions()}
                    </div>
                )}
            </div>
        );
    }

    if (node.type === 'option') {
        return (
            <div style={nodeStyle} className="bg-green-50 border-2 border-green-200 rounded-lg p-4 shadow-md">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-700">Option</span>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onConfigureFollowUps(node.id)}
                            className="p-1 text-orange-600 hover:bg-orange-100 rounded"
                            title="Configure Follow-ups"
                        >
                            <Settings size={14} />
                        </button>
                        <button
                            onClick={() => onEdit(node.id)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(node.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
                <div className="text-sm text-gray-800 mb-2">{node.data.text}</div>
                <div className="text-xs text-green-600">
                    Follow-ups: {getConnectedFollowUps()}
                </div>
            </div>
        );
    }

    return null;
};

const FlowEdge = ({ edge, nodes }) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return null;

    const startX = sourceNode.position.x + 140;
    const startY = sourceNode.position.y;
    const endX = targetNode.position.x - 140;
    const endY = targetNode.position.y;
    const midX = (startX + endX) / 2;

    return (
        <svg
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1
            }}
        >
            <path
                d={`M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${(startY + endY) / 2} Q ${midX} ${endY} ${endX} ${endY}`}
                stroke="#6b7280"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
            />
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                >
                    <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill="#6b7280"
                    />
                </marker>
            </defs>
        </svg>
    );
};

export default function QuestionOptionFlowBuilder() {
    const [nodes, setNodes] = useState([],[]);
    const [edges, setEdges] = useState([
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e1-3', source: '1', target: '3' },
        { id: 'e1-4', source: '1', target: '4' },
        { id: 'e1-5', source: '1', target: '5' },
        { id: 'e1-6', source: '1', target: '6' },
        { id: 'e1-7', source: '1', target: '7' },
        { id: 'e1-8', source: '1', target: '8' }
    ]);

    const [editingNode, setEditingNode] = useState(null);
    const [editText, setEditText] = useState('');
    const [configuringFollowUps, setConfiguringFollowUps] = useState(null);

    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [selectedFollowUpIds, setSelectedFollowUpIds] = useState([]);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const [allFollowUpQuestions, setAllFollowUpQuestions] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const response = await fetchQuestions(); // this should return an array of questions
                if (response && Array.isArray(response)) {
                    const formattedQuestions = response.map((q, index) => ({
                        id: q.id,
                        text: q.question_text, // adjust field names if needed
                        category: q.category || 'General', // optional fallback if no category
                        tags: ['dynamic'],
                        relevanceScore: Math.random(), // or remove if not needed
                    }));

                    setAllFollowUpQuestions(formattedQuestions);
                }
            } catch (error) {
                console.error("Failed to load questions:", error);
            }
        }

        load();
    }, []);

    useEffect(() => {
        const positions = calculateLayout(nodes, edges);
        setNodes(prevNodes =>
            prevNodes.map(node => ({
                ...node,
                position: positions[node.id] || node.position
            }))
        );
    }, [nodes.length, edges.length]);


    const getNextId = () => {
        const numericIds = nodes
            .map((n) => parseInt(n.id))
            .filter((n) => !isNaN(n));

        const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
        return (maxId + 1).toString();
    };

    const addQuestion = () => {
        setNewQuestionText('');
        setShowAddModal(true);
    };

    const saveQuestion = async () => {
        const isEditing = !!editingNode;

        const text = isEditing ? editText.trim() : newQuestionText.trim();
        if (!text) return;

        const tempId = isEditing ? editingNode : getNextId();

        const payload = {
            id: tempId,
            text,
            isFollowUp: false,
            category: null, // Optional: add category if needed
            isNew: !isEditing // <== Important flag
        };

        if (!isEditing) {
            const newQuestion = {
                id: tempId,
                type: 'question',
                data: {
                    text,
                    isFollowUp: false
                },
                position: { x: 150, y: nodes.length * 100 + 100 }
            };

            // Add temporary node
            setNodes(prev => [...prev, newQuestion]);
        } else {
            // Update node UI immediately
            setNodes(prev =>
                prev.map(n =>
                    n.id === editingNode ? { ...n, data: { ...n.data, text } } : n
                )
            );
        }

        try {
            const response = await saveQuestions([payload]);
            const saved = response?.questions?.[0];

            if (saved && saved.id && !isEditing) {
                // Replace tempId with DB ID
                setNodes(prev =>
                    prev.map(n =>
                        n.id === tempId ? { ...n, id: saved.id.toString() } : n
                    )
                );
            }

            console.log(`${isEditing ? 'Updated' : 'Created'} question ID:`, saved?.id);
        } catch (error) {
            console.error(`Failed to ${isEditing ? 'update' : 'create'} question:`, error);
        }

        // Reset state
        setShowAddModal(false);
        setNewQuestionText('');
        setEditingNode(null);
        setEditText('');
    };

    const editNode = (nodeId) => {
        const node = nodes.find(n => n.id === nodeId);
        if (node) {
            setEditingNode(nodeId);
            setEditText(node.data.text);
        }
    };

    const addOption = async (questionId) => {
        const question = nodes.find(n => n.id === questionId);
        if (!question || isNaN(parseInt(questionId))) {
            alert('Please save the question first.');
            return;
        }

        try {
            const optionPayload = {
                text: 'New Option', // This maps to `option_text` in backend
                score: 0            // Optional: use if backend allows passing score
            };
            const savedOption = await saveOption(optionPayload, questionId);

            console.log(savedOption);
            const newOptionNode = {
                id: savedOption.id.toString(),
                type: 'option',
                data: {
                    text: savedOption.text,
                    score: savedOption.score
                },
                position: { x: 500, y: nodes.length * 100 + 100 }
            };

            setNodes(prev => [...prev, newOptionNode]);
            setEdges(prev => [
                ...prev,
                {
                    id: `e${questionId}-${savedOption.id}`,
                    source: questionId,
                    target: savedOption.id.toString()
                }
            ]);
        } catch (error) {
            console.error('Error saving option:', error);
            alert('Failed to save option');
        }
    };

    const deleteNode = (nodeId) => {
        setNodes(nodes.filter(n => n.id !== nodeId));
        setEdges(edges.filter(e => e.source !== nodeId && e.target !== nodeId));
    };

    const saveEdit = async () => {
        const node = nodes.find(n => n.id === editingNode);
        if (!node) return;

        const updatedText = editText.trim();
        if (!updatedText) return;

        // Make backend API call based on node type
        if (node.type === 'question') {
            const payload = {
                id: node.id,
                text:updatedText,
                isFollowUp: false,
                category: null, // Optional: add category if needed
                isNew: false,
            };
            const response = await saveQuestions([payload]);


        } else if (node.type === 'option') {
            const optionPayload = {
                text: updatedText, // This maps to `option_text` in backend
                score: 0,
                isNew: false,
                id: node.id
            };

            const response = await updateOption(optionPayload);
            console.log(response);
        } else {
            console.warn('Unknown node type:', node.type);
            return;
        }

        // Update the node in UI
        setNodes(prevNodes =>
            prevNodes.map(n =>
                n.id === editingNode ? { ...n, data: { ...n.data, text: updatedText } } : n
            )
        );
        setEditingNode(null);
        setEditText('');
    };

    const configureFollowUps = (optionId) => {
        setConfiguringFollowUps(optionId);
        // Load existing selections for this option
        const existingFollowUps = edges
            .filter(e => e.source === optionId)
            .map(e => {
                const targetNode = nodes.find(n => n.id === e.target);
                return targetNode?.data.followUpQuestionId;
            })
            .filter(Boolean);
        setSelectedFollowUpIds(existingFollowUps);
    };

    const handleQuestionToggle = (questionId) => {
        setSelectedFollowUpIds(prev =>
            prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    const saveFollowUps = () => {
        // Remove existing follow-up connections for this option
        const newEdges = edges.filter(e => {
            if (e.source === configuringFollowUps) {
                const targetNode = nodes.find(n => n.id === e.target);
                // Only remove if the target is a follow-up question
                return !(targetNode?.data.isFollowUp);
            }
            return true;
        });

        // Remove orphaned follow-up nodes
        const connectedFollowUpIds = new Set();
        newEdges.forEach(e => {
            const targetNode = nodes.find(n => n.id === e.target);
            if (targetNode?.data.isFollowUp) {
                connectedFollowUpIds.add(e.target);
            }
        });

        const newNodes = nodes.filter(n => {
            if (n.data.isFollowUp && !connectedFollowUpIds.has(n.id)) {
                return false;
            }
            return true;
        });

        // Add new follow-up questions and edges
        let maxId = Math.max(...newNodes.map(n => parseInt(n.id)));
        const followUpNodes = [];
        const followUpEdges = [];

        selectedFollowUpIds.forEach((questionId, index) => {
            const question = allFollowUpQuestions.find(q => q.id === questionId);
            if (question) {
                maxId++;
                const followUpNodeId = maxId.toString();
                followUpNodes.push({
                    id: followUpNodeId,
                    type: 'question',
                    data: {
                        text: question.text,
                        isFollowUp: true,
                        followUpQuestionId: questionId,
                        category: question.category,
                        optionId: configuringFollowUps  // <-- this line links the follow-up to the option

                    },
                    position: { x: 850, y: index * 120 + 100 }
                });
                // Only allow option -> follow-up question connection
                followUpEdges.push({
                    id: `e${configuringFollowUps}-${followUpNodeId}`,
                    source: configuringFollowUps, // this is always an option node
                    target: followUpNodeId
                });
            }
        });

        const updatedNodes = [...newNodes, ...followUpNodes];
        const updatedEdges = [...newEdges, ...followUpEdges];

        setNodes(updatedNodes);
        setEdges(updatedEdges);
        setConfiguringFollowUps(null);
        setSelectedFollowUpIds([]);

        handleFollowupSave(updatedNodes);

    };

    const handleFollowupSave = async (updatedNodes) => {
        try {
            await saveFollowUpQuestions(updatedNodes);
            console.log('Follow-up questions saved successfully');
        } catch (error) {
            console.error('Error saving follow-up questions:', error);
        }
    };

    const questions = nodes.filter(n => n.type === 'question' && !n.data.isFollowUp);

    return (
        <AdminSidebarLayout>
        <div className="w-full h-screen bg-gray-50 relative overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b p-4 relative z-10">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-xl font-bold text-gray-800 text-center">Manage Questions, Options & Follow Ups</h1>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={addQuestion}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Add Question
                        </button>
                    </div>
                </div>

              {/* <div className="p-4">
                    <h2 className="text-sm font-semibold mb-2">Debug Nodes:</h2>
                    <pre className="text-xs bg-gray-200 p-3 rounded overflow-x-auto">
      {JSON.stringify(nodes, null, 2)}
    </pre>
                </div>*/}

                <div className="mt-4 grid grid-cols-4 gap-4 text-sm justify-center mx-auto max-w-4xl">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Questions</span>
                        </div>
                        <span className="font-semibold text-blue-700 mt-1">{nodes.filter(n => n.type === 'question').length}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Options</span>
                        </div>
                        <span className="font-semibold text-green-700 mt-1">{nodes.filter(n => n.type === 'option').length}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2">
                            <ArrowRight size={16} className="text-gray-500" />
                            <span>Connections</span>
                        </div>
                        <span className="font-semibold text-gray-700 mt-1">{edges.length}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2">
                            <Tag size={16} className="text-purple-500" />
                            <span>Follow-up Pool</span>
                        </div>
                        <span className="font-semibold text-purple-700 mt-1">{allFollowUpQuestions.length}</span>
                    </div>
                </div>
            </div>

            {/* Flow Canvas */}
            <div className="w-full flex justify-center">
                <div className="relative w-full max-w-6xl mx-auto h-full overflow-auto" style={{ height: 'calc(100vh - 140px)' }}>
                    {(() => {
                        // Center the graph horizontally by shifting all node positions
                        if (nodes.length === 0) return null;
                        const minX = Math.min(...nodes.map(n => n.position.x));
                        const maxX = Math.max(...nodes.map(n => n.position.x));
                        const canvasWidth = 1200; // or max-w-6xl (1536px), but 1200px is a good default
                        const graphWidth = maxX - minX + 300; // 300 is node width buffer
                        const offsetX = Math.max((canvasWidth - graphWidth) / 2 - minX, 0);
                        return (
                            <>
                                {edges.map(edge => (
                                    <FlowEdge key={edge.id} edge={edge} nodes={nodes.map(n => ({ ...n, position: { ...n.position, x: n.position.x + offsetX } }))} />
                                ))}
                                {nodes.map(node => (
                                    <FlowNode
                                        key={node.id}
                                        node={{ ...node, position: { ...node.position, x: node.position.x + offsetX } }}
                                        onEdit={editNode}
                                        onDelete={deleteNode}
                                        onConfigureFollowUps={configureFollowUps}
                                        edges={edges}
                                    />
                                ))}
                                {questions.map(question => (
                                    <button
                                        key={`add-${question.id}`}
                                        onClick={() => addOption(question.id)}
                                        className="absolute bg-green-600 text-white p-2 rounded-full hover:bg-green-700 shadow-lg"
                                        style={{
                                            left: `${question.position.x + offsetX + 200}px`,
                                            top: `${question.position.y - 15}px`,
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 10
                                        }}
                                        title="Add Option"
                                    >
                                        <Plus size={16} />
                                    </button>
                                ))}
                            </>
                        );
                    })()}
                </div>
            </div>

            {/* Edit Modal */}
            {editingNode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Edit Text</h3>
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-3 border rounded-lg resize-none"
                            rows="3"
                            placeholder="Enter text..."
                        />
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={saveEdit}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Save size={16} />
                                Save
                            </button>
                            <button
                                onClick={() => setEditingNode(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Scalable Follow-ups Configuration Modal */}
            {configuringFollowUps && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-4/5 max-w-4xl h-4/5 max-h-4xl flex flex-col">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold">Configure Follow-up Questions</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Select from {allFollowUpQuestions.length} available follow-up questions for:
                                <span className="font-medium"> "{nodes.find(n => n.id === configuringFollowUps)?.data.text}"</span>
                            </p>
                        </div>

                        <div className="flex-1 p-6 overflow-hidden">
                            <QuestionSearchFilter
                                questions={allFollowUpQuestions}
                                onFilteredQuestionsChange={setFilteredQuestions}
                                selectedQuestions={selectedFollowUpIds}
                                onSelectionChange={setSelectedFollowUpIds}
                            />

                            <div className="mt-4">
                                <VirtualizedQuestionList
                                    questions={filteredQuestions}
                                    selectedQuestions={selectedFollowUpIds}
                                    onToggle={handleQuestionToggle}
                                    height={350}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t bg-gray-50 flex gap-2 justify-end">
                            <button
                                onClick={() => setConfiguringFollowUps(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveFollowUps}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <Save size={16} />
                                Save {selectedFollowUpIds.length} Follow-ups
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingNode ? 'Edit Question' : 'Add New Question'}
                        </h3>

                        <textarea
                            value={editingNode ? editText : newQuestionText}
                            onChange={(e) =>
                                editingNode
                                    ? setEditText(e.target.value)
                                    : setNewQuestionText(e.target.value)
                            }
                            className="w-full p-3 border rounded-lg resize-none"
                            rows="3"
                            placeholder="Enter your question..."
                        />

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={saveQuestion}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Save size={16} />
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewQuestionText('');
                                    setEditText('');
                                    setEditingNode(null);
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </AdminSidebarLayout>
    );
}