export default function Register() {
  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Registra't</h2>

      <form>
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input type="text" className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Contrasenya</label>
          <input type="password" className="form-control" />
        </div>

        <button type="submit" className="btn btn-success w-100">Crear compte</button>
      </form>
    </div>
  );
}
