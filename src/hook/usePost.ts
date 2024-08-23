import { useState } from "react";

interface PostState<T> {
  data?: T;
  error?: Error;
  status?: string;
}

type PostFunction<T> = (...args: any[]) => Promise<T>;

function usePost<T = unknown>(
  postFunction: PostFunction<T>
): [PostState<T>, (...args: any[]) => Promise<void>] {
  const [state, setState] = useState<PostState<T>>({
    data: undefined,
    error: undefined,
    status: "idle",
  });

  const executePost = async (...args: any[]) => {
    setState({ status: "loading" });

    try {
      const data = await postFunction(...args);
      setState({ data, status: "success" });
    } catch (error) {
      setState({ error: error as Error, status: "error" });
    }
  };

  return [state, executePost];
}

export default usePost;
