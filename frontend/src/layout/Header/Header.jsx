import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 m-0 hover:text-blue-700 transition-colors"
          >
            AirFly
          </Link>
          <nav className="flex items-center gap-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Iniciar Sesión
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
