import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';
import Imagen1 from './img/7331940bbbfe1e45cd46cf79bab4d6d367355de7_original.jpeg';
import Imagen2 from './img/61zcNJiwpnL.jpg';
import Imagen3 from './img/71w7rKma8cL_40743863-5242-429a-9.jpg';



const USER_ID = "65b2a3f4e4b0a1a2b3c4d5e6";
const API_URL = "http://localhost:3000/api/cart";
const ORDER_URL = "http://localhost:3000/api/orders";

export default function Checkout() {
    const [cistella, setCistella] = useState([]);
    const [carregant, setCarregant] = useState(true);
    const [submetent, setSubmetent] = useState(false);
    const [missatge, setMissatge] = useState(null);
    const [pas, setPas] = useState(1); // 1: Enviament, 2: Pagament
    const [metodePagament, setMetodePagament] = useState('targeta');

    const navigate = useNavigate();
    const imatgesDisponibles = [Imagen1, Imagen2, Imagen3];

    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        postalCode: '',
        country: ''
    });

    useEffect(() => {
        fetch(`${API_URL}?userId=${USER_ID}`)
            .then(res => res.json())
            .then(json => {
                if (json.status === 'success' && json.data) {
                    setCistella(json.data.items);
                }
            })
            .catch(err => console.error("Error carregant cistella:", err))
            .finally(() => setCarregant(false));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const totalCistella = cistella.reduce((acc, item) => {
        const preu = item.product?.price || 0;
        return acc + preu * item.quantity;
    }, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pas === 1) {
            setPas(2);
            return;
        }

        setSubmetent(true);
        setMissatge(null);

        const orderData = {
            user: USER_ID,
            items: cistella.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total: totalCistella,
            shippingAddress: shippingAddress
        };

        try {
            const resp = await fetch(ORDER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const json = await resp.json();
            if (json.status === 'success') {
                setMissatge({ type: 'success', text: 'Comanda realitzada amb èxit! Redirigint...' });
                setTimeout(() => navigate('/'), 3000);
            } else {
                setMissatge({ type: 'error', text: 'Error: ' + json.message });
            }
        } catch (err) {
            setMissatge({ type: 'error', text: 'Error de connexió: ' + err.message });
        } finally {
            setSubmetent(false);
        }
    };

    if (carregant) return (
        <div className="home-container d-flex align-items-center justify-content-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregant...</span>
            </div>
        </div>
    );

    if (cistella.length === 0 && !missatge) {
        return (
            <div className="home-container d-flex align-items-center justify-content-center text-center">
                <div className="checkout-card">
                    <h2 className="mb-4">La cistella està buida</h2>
                    <p className="text-muted mb-4">Sembla que encara no has afegit cap producte a la teva cistella.</p>
                    <Link to="/" className="btn-afegir text-decoration-none">Tornar a la botiga</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container pt-5">
            <div className="container">
                <h1 className="text-center page-title mb-5">Finalitzar Compra</h1>

                {/* Progress Steps */}
                <div className="checkout-steps">
                    <div className={`step ${pas >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Enviament</div>
                    </div>
                    <div className="step-number" style={{ border: 'none', background: 'transparent', opacity: 0.3 }}>→</div>
                    <div className={`step ${pas >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">Pagament</div>
                    </div>
                </div>

                {missatge && (
                    <div className={`alert ${missatge.type === 'success' ? 'alert-success' : 'alert-danger'} mb-4 rounded-4`}>
                        {missatge.text}
                    </div>
                )}

                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="checkout-card h-100">
                            <form onSubmit={handleSubmit}>
                                {pas === 1 ? (
                                    <>
                                        <h4 className="mb-4 d-flex align-items-center">
                                            <span className="me-2">📍</span> Dades d'Enviament
                                        </h4>
                                        <div className="mb-4">
                                            <label className="form-label">Carrer i Número</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name="street"
                                                required
                                                placeholder="Ex: Gran Via de les Corts Catalanes, 123"
                                                value={shippingAddress.street}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label">Ciutat</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    name="city"
                                                    required
                                                    placeholder="Barcelona"
                                                    value={shippingAddress.city}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label">Codi Postal</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    name="postalCode"
                                                    required
                                                    placeholder="08001"
                                                    value={shippingAddress.postalCode}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label">País</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name="country"
                                                required
                                                placeholder="Espanya"
                                                value={shippingAddress.country}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <button type="submit" className="btn-confirmar w-100 mt-2">
                                            Continuar al Pagament
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h4 className="mb-4 d-flex align-items-center">
                                            <span className="me-2">💳</span> Mètode de Pagament
                                        </h4>
                                        <div className="payment-methods mb-4">
                                            <div
                                                className={`payment-method ${metodePagament === 'targeta' ? 'selected' : ''}`}
                                                onClick={() => setMetodePagament('targeta')}
                                            >
                                                <div className="payment-icon">
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                                </div>
                                                <div>
                                                    <div className="fw-bold">Targeta de Crèdit/Dèbit</div>
                                                    <div className="small text-muted">Visa, Mastercard, American Express</div>
                                                </div>
                                            </div>
                                            <div
                                                className={`payment-method ${metodePagament === 'paypal' ? 'selected' : ''}`}
                                                onClick={() => setMetodePagament('paypal')}
                                            >
                                                <div className="payment-icon">
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7 17h10V4H7v13z"></path></svg>
                                                </div>
                                                <div>
                                                    <div className="fw-bold">PayPal</div>
                                                    <div className="small text-muted">Paga de forma ràpida i segura</div>
                                                </div>
                                            </div>
                                            <div
                                                className={`payment-method ${metodePagament === 'apple' ? 'selected' : ''}`}
                                                onClick={() => setMetodePagament('apple')}
                                            >
                                                <div className="payment-icon">
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                                                </div>
                                                <div>
                                                    <div className="fw-bold">Apple Pay / Google Pay</div>
                                                    <div className="small text-muted">A través del teu dispositiu</div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="d-flex gap-3 mt-4">
                                            <button type="button" className="btn btn-outline-light flex-grow-1 p-3 rounded-3" onClick={() => setPas(1)}>
                                                Enrere
                                            </button>
                                            <button type="submit" className="btn-confirmar flex-grow-1" disabled={submetent}>
                                                {submetent ? 'Processant...' : 'Confirmar i Pagar'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="checkout-card h-100 d-flex flex-column">
                            <h4 className="mb-4">Resum de la Comanda</h4>
                            <div className="flex-grow-1 overflow-auto pe-2" style={{ maxHeight: '400px' }}>
                                {cistella.map((item, index) => (
                                    <div key={item._id} className="summary-item">
                                        <img
                                            src={item.product?.image || imatgesDisponibles[index % imatgesDisponibles.length]}
                                            alt={item.product?.name}
                                            className="summary-item-img"
                                        />
                                        <div className="summary-item-info">
                                            <div className="summary-item-title">{item.product?.name}</div>
                                            <div className="text-secondary small">Quantitat: {item.quantity}</div>
                                            <div className="summary-item-price">{(item.product?.price * item.quantity).toFixed(2)} €</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-top border-secondary">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-secondary">Subtotal</span>
                                    <span>{totalCistella.toFixed(2)} €</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-secondary">Enviament</span>
                                    <span className="text-success">Gratuït</span>
                                </div>
                                <div className="d-flex justify-content-between fw-bold fs-4 mt-3">
                                    <span>Total</span>
                                    <span style={{ color: '#4a90e2' }}>{totalCistella.toFixed(2)} €</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
