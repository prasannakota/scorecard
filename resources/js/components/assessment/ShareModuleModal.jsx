import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Alice Smith', designation: 'Developer', email: 'alice@example.com', image: 'https://i.pravatar.cc/40?img=1' },
  { id: 2, name: 'Bob Johnson', designation: 'Designer', email: 'bob@example.com', image: 'https://i.pravatar.cc/40?img=2' },
  { id: 3, name: 'Charlie Brown', designation: 'Product Manager', email: 'charlie@example.com', image: 'https://i.pravatar.cc/40?img=3' },
];

const mockModules = [
  'Frontend Module',
  'Backend Module',
  'DevOps Module',
  'QA Module',
];

export default function ShareModuleModal({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [users, setUsers] = useState(mockUsers);

  const handleInvite = () => {
    if (!searchTerm.trim() || !selectedModule) return;
    const newUser = {
      id: Date.now(),
      name: searchTerm,
      designation: selectedModule,
      email: `${searchTerm.toLowerCase().replace(/\s+/g, '')}@example.com`,
      image: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70)}`,
    };
    setUsers((prev) => [...prev, newUser]);
    setSearchTerm('');
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-[650px] max-w-[90%] relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-2">Share Module</h2>
        <hr className="my-3" />

        {/* Search + Select + Invite Row */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
          />

          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
          >
            <option value="">Select Module</option>
            {mockModules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>

          <button
            onClick={handleInvite}
            disabled={!selectedModule}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            Invite
          </button>
        </div>

        {/* User List */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.designation}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-600">{user.email}</span>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-sm text-gray-500 text-center">No users yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
