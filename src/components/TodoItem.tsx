import type { Todo } from '../api/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function TodoItem({ todo, onUpdate, onDelete, isUpdating, isDeleting }: TodoItemProps) {
  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => onUpdate(todo.id, e.target.checked)}
        disabled={isUpdating}
        className="h-4 w-4"
      />
      <span className={todo.completed ? 'line-through text-gray-500' : ''}>
        {todo.title}
      </span>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        disabled={isDeleting}
        className="ml-auto px-2 py-1 text-red-500 hover:bg-red-50 rounded"
      >
        Delete
      </button>
    </div>
  );
}
