'use client';
import { useState, useEffect } from 'react';
import { FiUpload, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import Modal from '@/src/app/components/UI/Modal';
import Button from '@/src/app/components/UI/Button';

export default function Sidebar({ currentModel, onModelSelect, onModelUpload }) {
    const [models, setModels] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const [newModel, setNewModel] = useState({
        name: '',
        category: '',
        tags: '',
        file: null
    });

    const defaultCategories = [
        { name: '🏗 Architecture' },
        { name: '🚗 Vehicles' },
        { name: '👤 Characters' },
        { name: '🌄 Environment' },
        { name: '⚙️ Mechanical / Industrial' },
        { name: '🧱 Modular Kits' }
    ];

    const ensureCategoriesExist = async () => {
        const res = await fetch('/api/categories');
        let data = await res.json();

        if (data.length === 0) {
            // Seed default categories if empty
            await Promise.all(
                defaultCategories.map(cat =>
                    fetch('/api/categories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cat)
                    })
                )
            );

            const seededRes = await fetch('/api/categories');
            data = await seededRes.json();
        }

        return data;
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [modelsRes, categoriesData] = await Promise.all([
                fetch('/api/models'),
                ensureCategoriesExist()
            ]);

            if (!modelsRes.ok) throw new Error('Failed to fetch models');

            const modelsData = await modelsRes.json();
            setModels(modelsData);
            setCategories(categoriesData);

        } catch (err) {
            console.error('Load error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        try {
            console.log("uplaoding file");
            console.log("newModel", newModel);
            if (!newModel.file || !newModel.name || !newModel.category) {
                throw new Error('Name, file and category are required');
            }

            const formData = new FormData();
            formData.append('file', newModel.file);
            formData.append('name', newModel.name);
            formData.append('category', newModel.category);
            formData.append('tags', newModel.tags);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            console.log("response", response);

            if (!response.ok) throw new Error('Upload failed');

            const uploadedModel = await response.json();
            setModels([...models, uploadedModel]);
            onModelSelect(uploadedModel);

            setShowUploadModal(false);
            setNewModel({ name: '', category: '', tags: '', file: null });

        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <Button onClick={() => setShowUploadModal(true)} className="w-full flex items-center justify-center">
                    <FiUpload className="mr-2" /> Upload Model
                </Button>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 flex items-start">
                    <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                        <p className="font-medium">Error loading data</p>
                        <p className="text-sm">{error}</p>
                        <button onClick={loadData} className="mt-2 text-sm text-red-700 underline">Retry</button>
                    </div>
                </div>
            )}

            {loading && (
                <div className="p-4 flex items-center justify-center">
                    <FiRefreshCw className="animate-spin mr-2" />
                    Loading models...
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-2">
                {models.length === 0 && !loading ? (
                    <div className="text-center p-4 text-gray-500">No models found. Upload one to get started.</div>
                ) : (
                    <div className="space-y-1">
                        {models.map((model) => {
                            const categoryObj = categories.find(cat => cat._id === model.category);
                            return (
                                <div
                                    key={model._id}
                                    onClick={() => onModelSelect(model)}
                                    className={`p-3 rounded cursor-pointer transition-colors ${currentModel?._id === model._id
                                            ? 'bg-blue-100 border border-blue-200'
                                            : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <h4 className="font-medium truncate">{model.name}</h4>
                                    <div className="flex items-center mt-1">
                                        <span className="text-xs bg-gray-200 rounded px-1.5 py-0.5">
                                            {categoryObj?.name || 'Uncategorized'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {currentModel && (
                <div className="p-3 border-t border-gray-200 bg-white">
                    <h3 className="font-medium mb-1">Current Model</h3>
                    <p className="text-sm truncate">{currentModel.name}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {(Array.isArray(currentModel?.tags) ? currentModel.tags : currentModel?.tags?.split(',') || []).map((tag) => (
                            <span key={tag.trim()} className="text-xs bg-gray-100 rounded px-1.5 py-0.5">
                                {tag.trim()}
                            </span>
                        ))}
                    </div>

                </div>
            )}

            <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload 3D Model">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Model Name</label>
                        <input
                            type="text"
                            value={newModel.name}
                            onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="My 3D Model"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            value={newModel.category}
                            onChange={(e) => setNewModel({ ...newModel, category: e.target.value })}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={newModel.tags}
                            onChange={(e) => setNewModel({ ...newModel, tags: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="furniture, modern, wood"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Model File</label>
                        <input
                            type="file"
                            accept=".glb,.gltf"
                            onChange={(e) => setNewModel({ ...newModel, file: e.target.files[0] })}
                            className="w-full"
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                        <Button onClick={handleUpload} disabled={!newModel.name || !newModel.file}>Upload</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
