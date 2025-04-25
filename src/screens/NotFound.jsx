import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex-1 flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Oops! Page not found</p>

        <Link
          to="/"
          className="px-6 py-3 bg-lightPrimary text-white rounded-lg hover:bg-primary transition duration-300"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
