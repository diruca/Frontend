export default function Login() {
  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Iniciar Sessió</h2>

      <form>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" placeholder="exemple@gmail.com" />
        </div>

        <div className="mb-3">
          <label className="form-label">Contrasenya</label>
          <input type="password" className="form-control" />
        </div>

        <button type="submit" className="btn btn-primary w-100">Entrar</button>
      </form>
    </div>
  );
}
