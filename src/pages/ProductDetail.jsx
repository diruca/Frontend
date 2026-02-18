import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Imagen1 from './img/7331940bbbfe1e45cd46cf79bab4d6d367355de7_original.jpeg';
import Imagen2 from './img/61zcNJiwpnL.jpg';
import Imagen3 from './img/71w7rKma8cL_40743863-5242-429a-9.jpg';
import './Home.css';

const PRODUCT_API_URL = "http://localhost:3000/api/products";
const CART_API_URL = "http://localhost:3000/api/cart";
const USER_ID = "65b2a3f4e4b0a1a2b3c4d5e6";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const imatgesDisponibles = [Imagen1, Imagen2, Imagen3];

    useEffect(() => {
        setLoading(true);
        fetch(`${PRODUCT_API_URL}/${id}`)
            .then(res => res.json())
            .then(json => {
                if (json.status === 'success' && json.data) {
                    // Assignem una imatge si no en té (per consistència amb Home.jsx)
                    const producteAmbImatge = {
                        ...json.data,
                        imatge: json.data.image || imatgesDisponibles[Math.floor(Math.random() * imatgesDisponibles.length)]
                    };
                    setProduct(producteAmbImatge);
                } else {
                    setError(json.message || "No s'ha pogut carregar el producte");
                }
            })
            .catch(err => {
                console.error("Error carregant el detall del producte:", err);
                setError("Error de connexió");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const afegirACistella = async () => {
        try {
            const resp = await fetch(`${CART_API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: USER_ID,
                    productId: id,
                    quantity: 1
                })
            });

            const json = await resp.json();
            if (json.status === 'success') {
                alert('Producte afegit a la cistella!');
            } else {
                alert('Error: ' + json.message);
            }
        } catch (err) {
            alert('Error de connexió');
        }
    };

    if (loading) return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregant...</span>
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="container mt-5">
            <div className="alert alert-danger">{error || "Producte no trobat"}</div>
            <Link to="/" className="btn btn-primary">Tornar al catàleg</Link>
        </div>
    );

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={product.imatge} alt={product.name} className="img-fluid rounded shadow" />
                </div>
                <div className="col-md-6">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Inici</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{product.category}</li>
                        </ol>
                    </nav>

                    <h1 className="display-4">{product.name}</h1>
                    <p className="lead text-muted">{product.brand}</p>
                    <h2 className="text-primary mb-4">{product.price.toFixed(2)} €</h2>

                    <div className="mb-4">
                        <h5>Descripció</h5>
                        <p>{product.description}</p>
                    </div>

                    <div className="mb-4">
                        <h5>Característiques</h5>
                        <ul className="list-group list-group-flush">
                            {product.features.appleCarPlay && <li className="list-group-item">✅ Apple CarPlay</li>}
                            {product.features.androidAuto && <li className="list-group-item">✅ Android Auto</li>}
                            {product.features.bluetooth && <li className="list-group-item">✅ Bluetooth</li>}
                            {product.features.touchscreen && <li className="list-group-item">✅ Pantalla Tàctil ({product.features.screenSize}")</li>}
                            {product.features.navigation && <li className="list-group-item">✅ Navegació</li>}
                        </ul>
                    </div>

                    <div className="d-grid gap-2">
                        <button className="btn btn-primary btn-lg" onClick={afegirACistella}>
                            Afegir a la cistella
                        </button>
                        <Link to="/" className="btn btn-outline-secondary">
                            Tornar al catàleg
                        </Link>
                    </div>

                    <div className="mt-3">
                        <small className="text-muted">Stock disponible: {product.stock} unitats</small>
                    </div>
                </div>
            </div>
        </div>
    );
}
