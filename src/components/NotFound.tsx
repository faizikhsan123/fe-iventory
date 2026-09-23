// NotFound.tsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 px-6 text-center">
      <p className="text-blue-600 text-sm font-semibold tracking-wide uppercase">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Page Not Found</h1>
      <p className="mt-3 text-sm text-slate-500 max-w-sm">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;