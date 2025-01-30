import type { Todo, CreateTodoInput, UpdateTodoInput } from '../api/todo';

const TODOS_API_BASE = '/api/todos';

export const todosApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await fetch(TODOS_API_BASE);
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },

  getById: async (id: string): Promise<Todo> => {
    const response = await fetch(`${TODOS_API_BASE}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch todo');
    return response.json();
  },

  create: async (todo: CreateTodoInput): Promise<Todo> => {
    const response = await fetch(TODOS_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error('Failed to create todo');
    return response.json();
  },

  update: async ({ id, ...data }: UpdateTodoInput): Promise<Todo> => {
    const response = await fetch(`${TODOS_API_BASE}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update todo');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${TODOS_API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete todo');
  },
};
