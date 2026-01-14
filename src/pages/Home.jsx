import { useState } from 'react';
import Imagen1 from './img/7331940bbbfe1e45cd46cf79bab4d6d367355de7_original.jpeg';
import Imagen2 from './img/61zcNJiwpnL.jpg';
import Imagen3 from './img/71w7rKma8cL_40743863-5242-429a-9.jpg';
import './Home.css';

const productes = [
  { id: 1, nom: 'Ràdio Bluetooth 1', descripcio: 'Alta qualitat i connexió ràpida.', preu: 89.99, imatge: Imagen1 },
  { id: 2, nom: 'Ràdio Touch 2', descripcio: 'Pantalla tàctil i suport Android Auto.', preu: 149.99, imatge: Imagen2 },
  { id: 3, nom: 'Ràdio Premium 3', descripcio: 'So d\'alta fidelitat i GPS integrat.', preu: 249.99, imatge: Imagen3 },
];

export default function Home() {
  const [cistella, setCistella] = useState([]);
  const [cistellaOberta, setCistellaOberta] = useState(false);

  const afegirACistella = (producte) => {
    setCistella((prev) => {
      const existeix = prev.find((item) => item.id === producte.id);
      if (existeix) {
        return prev.map((item) =>
          item.id === producte.id ? { ...item, quantitat: item.quantitat + 1 } : item
        );
      }
      return [...prev, { ...producte, quantitat: 1 }];
    });
  };

  const eliminarDeCistella = (id) => {
    setCistella((prev) => prev.filter((item) => item.id !== id));
  };

  const actualitzarQuantitat = (id, quantitat) => {
    if (quantitat <= 0) {
      eliminarDeCistella(id);
      return;
    }
    setCistella((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantitat } : item))
    );
  };

  const totalCistella = cistella.reduce((acc, item) => acc + item.preu * item.quantitat, 0);
  const totalItems = cistella.reduce((acc, item) => acc + item.quantitat, 0);

  return (
    <div className="home-container">
      { }
      <div className={`cistella-widget ${cistellaOberta ? 'oberta' : ''}`}>
        { }
        <div className="cistella-header" onClick={() => setCistellaOberta(!cistellaOberta)}>
          <span className="cistella-title">Cistella</span>
          <span className="cistella-toggle">{cistellaOberta ? '▼' : '▲'}</span>
        </div>

        { }
        {cistellaOberta && (
          <div className="cistella-contingut">
            {cistella.length === 0 ? (
              <p className="cistella-buida">La cistella és buida</p>
            ) : (
              <>
                <div className="cistella-items">
                  {cistella.map((item) => (
                    <div key={item.id} className="cistella-item">
                      <img src={item.imatge} alt={item.nom} className="cistella-item-img" />
                      <div className="cistella-item-info">
                        <h6>{item.nom}</h6>
                        <p className="cistella-item-preu">{item.preu.toFixed(2)} €</p>
                      </div>
                      <div className="cistella-item-controls">
                        <button
                          className="btn-quantitat"
                          onClick={() => actualitzarQuantitat(item.id, item.quantitat - 1)}
                        >
                          -
                        </button>
                        <span className="quantitat">{item.quantitat}</span>
                        <button
                          className="btn-quantitat"
                          onClick={() => actualitzarQuantitat(item.id, item.quantitat + 1)}
                        >
                          +
                        </button>
                        <button
                          className="btn-eliminar"
                          onClick={() => eliminarDeCistella(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cistella-footer">
                  <div className="cistella-total">
                    <strong>Total:</strong>
                    <span>{totalCistella.toFixed(2)} €</span>
                  </div>
                  <button className="btn-comprar">
                    Finalitzar Compra
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      { }
      <div className="container mt-4">
        <h1 className="text-center mb-4 page-title">Ràdios de Cotxe - Productes Destacats</h1>

        <div className="row g-4">
          {productes.map((producte) => (
            <div key={producte.id} className="col-md-4">
              <div className="card product-card">
                <img src={producte.imatge} className="card-img-top" alt={producte.nom} />
                <div className="card-body">
                  <h5 className="card-title">{producte.nom}</h5>
                  <p className="card-text">{producte.descripcio}</p>
                  <p className="product-price">{producte.preu.toFixed(2)} €</p>
                  <button
                    className="btn btn-afegir"
                    onClick={() => afegirACistella(producte)}
                  >
                    Afegir a la cistella
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}