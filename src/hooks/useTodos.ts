import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todosApi } from "../api/todosApi";
import type { Todo } from "../api/todo";

const TODOS_QUERY_KEY = ["todos"] as const;

export const useTodos = () => {
	const queryClient = useQueryClient();

	const todosQuery = useQuery({
		queryKey: TODOS_QUERY_KEY,
		queryFn: todosApi.getAll,
	});

	const createTodoMutation = useMutation({
		mutationFn: todosApi.create,
		onSuccess: (newTodo) => {
			queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old = []) => [
				...old,
				newTodo,
			]);
		},
	});

	const updateTodoMutation = useMutation({
		mutationFn: todosApi.update,
		onMutate: async (updatedTodo) => {
			await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY });

			const previousTodos = queryClient.getQueryData<Todo[]>(TODOS_QUERY_KEY);

			queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old = []) =>
				old.map((todo) =>
					todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo,
				),
			);

			return { previousTodos };
		},
		onError: (_, __, context) => {
			if (context?.previousTodos) {
				queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
		},
	});

	const deleteTodoMutation = useMutation({
		mutationFn: todosApi.delete,
		onMutate: async (todoId) => {
			await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY });

			const previousTodos = queryClient.getQueryData<Todo[]>(TODOS_QUERY_KEY);

			queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old = []) =>
				old.filter((todo) => todo.id !== todoId),
			);

			return { previousTodos };
		},
		onError: (_, __, context) => {
			if (context?.previousTodos) {
				queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
		},
	});

	return {
		// Query state
		query: {
			data: todosQuery.data ?? [],
			isLoading: todosQuery.isLoading,
			error: todosQuery.error,
		},
		// Mutation actions
		actions: {
			create: {
				execute: createTodoMutation.mutate,
				isPending: createTodoMutation.isPending,
			},
			update: {
				execute: updateTodoMutation.mutate,
				isPending: updateTodoMutation.isPending,
			},
			delete: {
				execute: deleteTodoMutation.mutate,
				isPending: deleteTodoMutation.isPending,
			},
		},
	};
};
