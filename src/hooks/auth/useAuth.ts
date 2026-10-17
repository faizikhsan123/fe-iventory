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

  // Satu-satunya sumber kebenaran hak ubah data. Role lain (mis. "office") read-only.
  const isAdmin = Boolean(user?.roles?.includes("admin"));

  return { user, isAdmin };
};

