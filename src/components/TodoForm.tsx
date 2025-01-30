import { useState } from 'react';
import type { CreateTodoInput } from '../api/todo';

interface TodoFormProps {
  onSubmit: (todo: CreateTodoInput) => void;
  isCreating: boolean;
}

export function TodoForm({ onSubmit, isCreating }: TodoFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({
      title: title.trim(),
      completed: false,
    });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 px-4 py-2 border rounded"
        disabled={isCreating}
      />
      <button
        type="submit"
        disabled={isCreating || !title.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Add Todo
      </button>
    </form>
  );
}
