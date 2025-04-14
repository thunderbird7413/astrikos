'use client';
import { useState, useEffect } from 'react';
import Button from '../UI/Button';

const POIForm = ({ initialData, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'generic',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        type: initialData.type || 'generic',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="generic">Generic</option>
          <option value="entrance">Entrance</option>
          <option value="exit">Exit</option>
          <option value="room">Room</option>
          <option value="feature">Feature</option>
        </select>
      </div>

      {initialData?.position && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">Position</p>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-500">X</label>
              <input
                type="number"
                value={initialData.position.x.toFixed(2)}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Y</label>
              <input
                type="number"
                value={initialData.position.y.toFixed(2)}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Z</label>
              <input
                type="number"
                value={initialData.position.z.toFixed(2)}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <div>
          {onDelete && (
            <Button type="button" variant="danger" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </div>
    </form>
  );
};

export default POIForm;
