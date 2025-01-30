import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";
import { useTodos } from "../hooks/useTodos";

export function TodoList() {
	const {
		query: { data: todos, isLoading, error },
		actions: { create, update, delete: deleteTodo },
	} = useTodos();

	if (isLoading) {
		return <div className="text-center">Loading todos...</div>;
	}

	if (error) {
		return (
			<div className="text-center text-red-500">
				Error: {error instanceof Error ? error.message : "Something went wrong"}
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Todo List</h1>

			<TodoForm onSubmit={create.execute} isCreating={create.isPending} />

			<div className="space-y-2">
				{todos.map((todo) => (
					<TodoItem
						key={todo.id}
						todo={todo}
						onUpdate={(id, completed) => update.execute({ id, completed })}
						onDelete={deleteTodo.execute}
						isUpdating={update.isPending}
						isDeleting={deleteTodo.isPending}
					/>
				))}
			</div>

			{todos.length === 0 && (
				<p className="text-center text-gray-500">
					No todos yet. Add one above!
				</p>
			)}
		</div>
	);
}
