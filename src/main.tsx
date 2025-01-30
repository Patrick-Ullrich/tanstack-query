import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
	MutationCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Disable automatic refetching when window regains focus
			refetchOnWindowFocus: false,

			// Disable retrying failed queries
			retry: false,

			// How long to cache data after becoming inactive (in milliseconds)
			// Default: 5 minutes (Infinity = never garbage collect)
			gcTime: 5 * 60 * 1000,

			// How long to consider data "fresh" (in milliseconds)
			// Default: 0 (always stale)
			staleTime: 1000 * 60, // 1 minute

			// // Enable automatic background refetching
			// refetchInterval: 1000 * 30, // 30 seconds

			// // Prevent automatic refetching when query mounts or changes
			// enabled: true,

			// // Configure what happens when a query fails
			// retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			// retryOnMount: true,

			// // Configure suspense mode for React Suspense
			// suspense: false,
		},
		mutations: {
			// Disable retrying failed mutations
			retry: false,

			// // Configure what happens when a mutation fails
			// retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
	},
	mutationCache: new MutationCache({
		// Invalidate all queries after any mutation succeeds
    // Invalidate => refetches active queries
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
	}),
});

async function enableMocking() {
	if (process.env.NODE_ENV !== "development") {
		return;
	}

	const { worker } = await import("./mocks/browser");
	return worker.start({
		onUnhandledRequest: "bypass",
	});
}

enableMocking().then(() => {
	// biome-ignore lint/style/noNonNullAssertion:
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</StrictMode>,
	);
});
