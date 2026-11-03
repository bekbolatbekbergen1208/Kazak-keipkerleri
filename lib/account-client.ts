import type { Player } from "@/types/game";
import type { RequiredKind } from "@/data/required-learning";
export type ServerUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
};
export type AccountSession = {
  user: ServerUser | null;
  state: Player | null;
  completed: RequiredKind[];
};
export async function accountRequest<T = AccountSession>(
  action: string,
  data?: unknown,
  options?: { keepalive?: boolean },
) {
  const response = await fetch(`/api/account/${action}`, {
    method: data === undefined ? "GET" : "POST",
    headers:
      data === undefined ? undefined : { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
    cache: "no-store",
    ...options,
  });
  const value = await response.json();
  if (!response.ok)
    throw new Error(value.error || "Серверге қосылу мүмкін болмады.");
  return value as T;
}
export function answerOnServer(
  module: RequiredKind,
  question: number,
  answer: number,
  attemptId: string,
) {
  return accountRequest<{ correct: boolean; completed: RequiredKind[] }>(
    "answer",
    { module, question, answer, attemptId },
  );
}
