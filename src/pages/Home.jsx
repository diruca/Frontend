import Imagen1 from './img/7331940bbbfe1e45cd46cf79bab4d6d367355de7_original.jpeg';
import Imagen2 from './img/61zcNJiwpnL.jpg';
import Imagen3 from './img/71w7rKma8cL_40743863-5242-429a-9.jpg';
export default function Home() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Ràdios de Cotxe - Productes Destacats</h1>

      <div className="row">
        
        <div className="col-md-4">
          <div className="card">
            <img src={Imagen1} className="card-img-top" alt="Ràdio" />
            <div className="card-body">
              <h5 className="card-title">Ràdio Bluetooth 1</h5>
              <p className="card-text">Alta qualitat i connexió ràpida.</p>
              <button className="btn btn-primary">Veure més</button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <img src={Imagen2} className="card-img-top" alt="Ràdio" />
            <div className="card-body">
              <h5 className="card-title">Ràdio Touch 2</h5>
              <p className="card-text">Pantalla tàctil i suport Android Auto.</p>
              <button className="btn btn-primary">Veure més</button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <img src={Imagen3} className="card-img-top" alt="Ràdio" />
            <div className="card-body">
              <h5 className="card-title">Ràdio Premium 3</h5>
              <p className="card-text">So d’alta fidelitat i GPS integrat.</p>
              <button className="btn btn-primary">Veure més</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
