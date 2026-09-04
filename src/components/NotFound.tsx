import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="text-blue-500 hover:underline"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
