export type User = {
  sub: string | null;
  isAuthenticated: boolean;
  claims: { type: string; value: string }[];
};
