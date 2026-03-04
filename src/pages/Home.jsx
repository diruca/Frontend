import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Imagen1 from './img/7331940bbbfe1e45cd46cf79bab4d6d367355de7_original.jpeg';
import Imagen2 from './img/61zcNJiwpnL.jpg';
import Imagen3 from './img/71w7rKma8cL_40743863-5242-429a-9.jpg';
import './Home.css';

const USER_ID = "65b2a3f4e4b0a1a2b3c4d5e6";
const API_URL = "http://localhost:3000/api/cart";
const PRODUCTS_URL = "http://localhost:3000/api/products";

export default function Home() {
  const [productes, setProductes] = useState([]);
  const [cistella, setCistella] = useState([]);
  const [cistellaOberta, setCistellaOberta] = useState(false);
  const [carregant, setCarregant] = useState(true);
  const [carregantProductes, setCarregantProductes] = useState(true);

  // Estats per als filtres
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    appleCarPlay: false,
    androidAuto: false
  });

  // Imatges disponibles per assignar als productes del backend (ja que no tenen imatge)
  const imatgesDisponibles = [Imagen1, Imagen2, Imagen3];

  // Carregar productes des del backend amb filtres
  useEffect(() => {
    setCarregantProductes(true);

    // Construir la query string
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.brand) queryParams.append('brand', filters.brand);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.appleCarPlay) queryParams.append('appleCarPlay', 'true');
    if (filters.androidAuto) queryParams.append('androidAuto', 'true');

    fetch(`${PRODUCTS_URL}?${queryParams.toString()}`)
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success' && json.data) {
          const productesAmbImatges = json.data.map((prod, index) => ({
            ...prod,
            imatge: prod.image || imatgesDisponibles[index % imatgesDisponibles.length],
            id: prod._id
          }));
          setProductes(productesAmbImatges);
        }
      })
      .catch(err => console.error("Error carregant productes:", err))
      .finally(() => setCarregantProductes(false));
  }, [filters]);

  // Carregar la cistella des del backend al iniciar
  useEffect(() => {
    fetch(`${API_URL}?userId=${USER_ID}`)
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success' && json.data) {
          const itemsProcessats = json.data.items.map(item => {
            // Si el backend ha fet populate, 'item.product' és un objecte
            const p = item.product;

            // Si no està populat (només ID), busquem a la llista local com a fallback
            // però amb el nou backend sempre hauria d'estar populat.
            const producteBase = (typeof p === 'object' && p !== null)
              ? p
              : productes.find(prod => prod._id === p);

            if (!producteBase) {
              return {
                id: (typeof p === 'object') ? p._id : p,
                nom: 'Producte no disponible',
                preu: 0,
                quantitat: item.quantity,
                imatge: null
              };
            }

            return {
              ...producteBase,
              id: producteBase._id,
              nom: producteBase.name,
              preu: producteBase.price,
              quantitat: item.quantity,
              // Assignem imatge si no en té (per productes afegits des de detalls)
              imatge: producteBase.image || imatgesDisponibles[Math.floor(Math.random() * imatgesDisponibles.length)]
            };
          });
          setCistella(itemsProcessats);
        }
      })
      .catch(err => console.error("Error carregant cistella:", err))
      .finally(() => setCarregant(false));
  }, [productes]); // Encara depenem de productes per si canvien les imatges locals, però és més robust

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const afegirACistella = async (e, producte) => {
    e.preventDefault();
    try {
      const requestBody = {
        userId: USER_ID,
        productId: producte._id || producte.id,
        quantity: 1
      };

      const resp = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const json = await resp.json();
      if (json.status === 'success') {
        setCistella((prev) => {
          const idBuscat = producte._id || producte.id;
          const existeix = prev.find((item) => (item._id === idBuscat || item.id === idBuscat));

          if (existeix) {
            return prev.map((item) =>
              (item._id === idBuscat || item.id === idBuscat)
                ? { ...item, quantitat: item.quantitat + 1 }
                : item
            );
          }
          return [...prev, { ...producte, quantitat: 1 }];
        });
      } else {
        alert('Error: ' + json.message);
      }
    } catch (err) {
      alert('Error de connexió: ' + err.message);
    }
  };

  const eliminarDeCistella = async (id) => {
    try {
      const resp = await fetch(`${API_URL}/remove/${id}?userId=${USER_ID}`, {
        method: 'DELETE'
      });
      const json = await resp.json();
      if (json.status === 'success') {
        setCistella((prev) => prev.filter((item) => item.id !== id && item._id !== id));
      }
    } catch (err) {
      console.error("Error eliminant de la cistella:", err);
    }
  };

  const actualitzarQuantitat = async (id, novaQuantitat) => {
    if (novaQuantitat <= 0) {
      eliminarDeCistella(id);
      return;
    }
    setCistella((prev) =>
      prev.map((item) => ((item.id === id || item._id === id) ? { ...item, quantitat: novaQuantitat } : item))
    );
  };

  const totalCistella = cistella.reduce((acc, item) => acc + (item.price || item.preu || 0) * item.quantitat, 0);

  return (
    <div className="home-container">
      <div className={`cistella-widget ${cistellaOberta ? 'oberta' : ''}`}>
        <div className="cistella-header" onClick={() => setCistellaOberta(!cistellaOberta)}>
          <span className="cistella-title">Cistella ({cistella.length})</span>
          <span className="cistella-toggle">{cistellaOberta ? '▼' : '▲'}</span>
        </div>

        {cistellaOberta && (
          <div className="cistella-contingut">
            {carregant ? (
              <p className="cistella-buida">Carregant...</p>
            ) : cistella.length === 0 ? (
              <p className="cistella-buida">La cistella és buida</p>
            ) : (
              <>
                <div className="cistella-items">
                  {cistella.map((item) => (
                    <div key={item.id || item._id} className="cistella-item">
                      {item.imatge && <img src={item.imatge} alt={item.name || item.nom} className="cistella-item-img" />}
                      <div className="cistella-item-info">
                        <h6>{item.name || item.nom}</h6>
                        <p className="cistella-item-preu">{(item.price || item.preu || 0).toFixed(2)} €</p>
                      </div>
                      <div className="cistella-item-controls">
                        <button
                          className="btn-quantitat"
                          onClick={() => actualitzarQuantitat(item.id || item._id, item.quantitat - 1)}
                        >
                          -
                        </button>
                        <span className="quantitat">{item.quantitat}</span>
                        <button
                          className="btn-quantitat"
                          onClick={() => actualitzarQuantitat(item.id || item._id, item.quantitat + 1)}
                        >
                          +
                        </button>
                        <button
                          className="btn-eliminar"
                          onClick={() => eliminarDeCistella(item.id || item._id)}
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
                  <Link to="/checkout" className="btn-comprar text-center d-block text-decoration-none">
                    Finalitzar Compra
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="container mt-4">
        <h1 className="text-center mb-4 page-title">Ràdios de Cotxe - Catàleg</h1>

        <div className="row">
          {/* Sidebar de Filtres */}
          <div className="col-md-3">
            <div className="card p-3 shadow-sm border-0 mb-4">
              <h5 className="mb-3">Filtres</h5>

              <div className="mb-3">
                <label className="form-label">Categoria</label>
                <select className="form-select" name="category" value={filters.category} onChange={handleFilterChange}>
                  <option value="">Totes</option>
                  <option value="1DIN">1DIN</option>
                  <option value="2DIN">2DIN</option>
                  <option value="Universal">Universal</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Marca</label>
                <input type="text" className="form-control" name="brand" placeholder="Ex: Sony" value={filters.brand} onChange={handleFilterChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Preu Màxim ({filters.maxPrice || '∞'} €)</label>
                <input type="range" className="form-range" name="maxPrice" min="0" max="1000" step="10" value={filters.maxPrice} onChange={handleFilterChange} />
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="appleCarPlay" id="filterApple" checked={filters.appleCarPlay} onChange={handleFilterChange} />
                  <label className="form-check-label" htmlFor="filterApple">Apple CarPlay</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="androidAuto" id="filterAndroid" checked={filters.androidAuto} onChange={handleFilterChange} />
                  <label className="form-check-label" htmlFor="filterAndroid">Android Auto</label>
                </div>
              </div>

              <button className="btn btn-sm btn-outline-danger w-100" onClick={() => setFilters({ category: '', brand: '', minPrice: '', maxPrice: '', appleCarPlay: false, androidAuto: false })}>
                Netejar Filtres
              </button>
            </div>
          </div>

          {/* Llistat de Productes */}
          <div className="col-md-9">
            {carregantProductes ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregant...</span>
                </div>
                <p className="mt-2">Filtrant productes...</p>
              </div>
            ) : productes.length === 0 ? (
              <div className="alert alert-info text-center">
                Cap producte coincideix amb aquests filtres.
              </div>
            ) : (
              <div className="row g-4">
                {productes.map((producte) => (
                  <div key={producte._id} className="col-md-6 col-lg-4">
                    <div className="card product-card h-100">
                      <Link to={`/product/${producte._id}`}>
                        <img src={producte.imatge} className="card-img-top" alt={producte.name} />
                      </Link>
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title text-truncate">{producte.name}</h5>
                        <p className="card-text text-muted small flex-grow-1" style={{ maxHeight: '3em', overflow: 'hidden' }}>{producte.description}</p>
                        <div className="mt-2 d-flex justify-content-between align-items-center">
                          <span className="product-price fw-bold">{producte.price.toFixed(2)} €</span>
                          <button
                            className="btn btn-sm btn-afegir"
                            onClick={(e) => afegirACistella(e, producte)}
                          >
                            Afegir
                          </button>
                        </div>
                        <Link to={`/product/${producte._id}`} className="btn btn-sm btn-outline-primary mt-3 w-100">
                          Veure Detall
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
