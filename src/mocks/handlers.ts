import { http, HttpResponse, delay } from "msw";
import type { Todo } from "../api/todo";

let todos: Todo[] = [
	{
		id: "1",
		title: "Learn TanStack Query",
		completed: false,
		createdAt: new Date().toISOString(),
	},
];

export const handlers = [
	http.get("/api/todos", async () => {
		await delay(500);
		return HttpResponse.json(todos);
	}),

	http.get("/api/todos/:id", async ({ params }) => {
		await delay(500);
		const todo = todos.find((t) => t.id === params.id);
		if (!todo) {
			return new HttpResponse(null, { status: 404 });
		}
		return HttpResponse.json(todo);
	}),

	http.post("/api/todos", async ({ request }) => {
		await delay(500);
		const data = (await request.json()) as Omit<Todo, "id" | "createdAt">;
		const newTodo: Todo = {
			...data,
			id: Math.random().toString(36).substring(2),
			createdAt: new Date().toISOString(),
		};
		todos.push(newTodo);
		return HttpResponse.json(newTodo);
	}),

	http.patch("/api/todos/:id", async ({ params, request }) => {
		await delay(500);
		const data = (await request.json()) as Partial<Todo>;
		const todoIndex = todos.findIndex((t) => t.id === params.id);
		if (todoIndex === -1) {
			return new HttpResponse(null, { status: 404 });
		}
		todos[todoIndex] = { ...todos[todoIndex], ...data };
		return HttpResponse.json(todos[todoIndex]);
	}),

	http.delete("/api/todos/:id", async ({ params }) => {
		await delay(500);
		const todoIndex = todos.findIndex((t) => t.id === params.id);
		if (todoIndex === -1) {
			return new HttpResponse(null, { status: 404 });
		}
		todos = todos.filter((t) => t.id !== params.id);
		return new HttpResponse(null, { status: 200 });
	}),
];
