import React from "react";

export default function SourceDialog({
  isOpen,
  onClose,
  newSource,
  setNewSource,
  onAddSource,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-950/90 p-6 rounded-lg w-full max-w-md shadow-lg border border-gray-800">
        <h2 className="text-xl text-blue-400 font-bold mb-4">
          Add Data Source
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Source ID (unique identifier)
          </label>
          <input
            type="text"
            value={newSource.id}
            onChange={(e) => setNewSource({ ...newSource, id: e.target.value })}
            className="w-full text-white p-2 bg-neutral-700 border border-neutral-600 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., traffic, weather"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Name
          </label>
          <input
            type="text"
            value={newSource.name}
            onChange={(e) =>
              setNewSource({ ...newSource, name: e.target.value })
            }
            className="w-full text-white p-2 bg-neutral-700 border border-neutral-600 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Traffic Data, Weather Service"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            API URL
          </label>
          <input
            type="text"
            value={newSource.url}
            onChange={(e) =>
              setNewSource({ ...newSource, url: e.target.value })
            }
            className="w-full text-white p-2 bg-neutral-700 border border-neutral-600 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., http://localhost:5000/api/traffic"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-600 text-neutral-200 rounded hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAddSource}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add Source
          </button>
        </div>
      </div>
    </div>
  );
}
