import { useEffect, useReducer, useRef, useCallback } from "react";

interface State<T> {
  data?: T;
  error?: Error;
  status?: string;
}

type Action<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload: Error };

function useFetch<T = unknown>(
  fetchFunction: (...args: any[]) => Promise<T>,
  dependencies: any[] = []
): State<T> & { refetch: (...args: any[]) => void } {
  const cancelRequest = useRef<boolean>(false);

  const initialState: State<T> = {
    error: undefined,
    data: undefined,
    status: "idle",
  };

  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "loading":
        return { ...state, status: "loading" };
      case "fetched":
        return { ...state, data: action.payload, status: "fetched" };
      case "error":
        return { ...state, error: action.payload, status: "error" };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  const fetchData = useCallback(
    async (...args: any[]) => {
      dispatch({ type: "loading" });

      try {
        const data = await fetchFunction(...args);
        if (cancelRequest.current) return;

        dispatch({ type: "fetched", payload: data });
      } catch (error) {
        if (cancelRequest.current) return;

        dispatch({ type: "error", payload: error as Error });
      }
    },
    [fetchFunction]
  );

  useEffect(() => {
    fetchData();
    return () => {
      cancelRequest.current = true;
    };
  }, dependencies);

  return {
    ...state,
    refetch: fetchData,
  };
}

export default useFetch;
