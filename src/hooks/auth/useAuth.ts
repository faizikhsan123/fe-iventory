// hooks/useAuth.ts
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export const useAuth = () => {
  const raw = localStorage.getItem("user");
  const user: AuthUser | null = raw ? JSON.parse(raw) : null;

  return { user };
};

