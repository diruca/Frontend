import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Ràdios de Cotxe</Link>

          <div>
            <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
            <Link className="btn btn-outline-light" to="/register">Registrar</Link>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}