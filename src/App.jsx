import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Ràdios de Cotxe</Link>

          <div>
            {isAuthenticated ? (
              <>
                <span className="text-light me-3">Hola, {user?.name}</span>
                <button className="btn btn-outline-danger" onClick={logout}>Sortir</button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
                <Link className="btn btn-outline-light" to="/register">Registrar</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}