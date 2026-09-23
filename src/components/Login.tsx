// Login.tsx
import { UseLogin } from "@/hooks/auth/login";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const { error, loading, HandleLogin, email, SetEmail, password, SetPassword } = UseLogin();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await HandleLogin(email, password);
  };

  const [hidepw, SethidePw] = useState(true);

  return (
    <>
      <div className="min-h-screen w-full flex flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-b from-blue-950 to-slate-900">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold tracking-tight text-white">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-slate-400">Masuk untuk melanjutkan ke Inventory System</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm bg-white/5 border border-white/10 rounded-2xl px-6 py-8 shadow-xl backdrop-blur-sm">
          {error && (
            <p className="mb-4 text-center text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
              {error}
            </p>
          )}

          <form
            onSubmit={handleCreate}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200"
              >
                Email address
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => SetEmail(e.target.value)}
                  className="block w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline outline-1 -outline-offset-1 outline-white/20 placeholder:text-slate-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-200"
                >
                  Password
                </label>
              </div>
              <div className="mt-1.5 relative">
                <input
                  id="password"
                  name="password"
                  type={hidepw ? "password" : "text"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => SetPassword(e.target.value)}
                  className="block w-full rounded-lg bg-white/10 px-3 py-2 pr-10 text-sm text-white outline outline-1 -outline-offset-1 outline-white/20 placeholder:text-slate-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                />
                <button
                  type="button"
                  // prev ni nilai sebelumnya
                  onClick={() => SethidePw((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                >
                  {hidepw ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-indigo-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}