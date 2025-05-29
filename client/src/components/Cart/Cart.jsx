import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { BsCartX } from "react-icons/bs";

import CartItem from "./CartItem/CartItem";
import { Context } from "../../utils/context";
import "./Cart.scss";
import { makePaymentRequest } from "../../utils/api";

import { loadStripe } from "@stripe/stripe-js";

const Cart = ({ setShowCart }) => {
    const { cartItems, cartSubTotal, user, clearCartItems } = useContext(Context);
    const navigate = useNavigate();

    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

    const handlePayment = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            const stripe = await stripePromise;
            const res = await makePaymentRequest.post("/api/orders", {
                products: cartItems,
                username: user.username, // Include the username here
            });

            // Clear the cart items after successfully initiating the payment process
            clearCartItems();

            await stripe.redirectToCheckout({
                sessionId: res.data.stripeSession.id,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="cart-panel">
            <div className="opac-layer"></div>
            <div className="cart-content">
                <div className="cart-header">
                    <span className="heading">Shopping Cart</span>
                    <span className="close-btn" onClick={() => setShowCart(false)}>
                        <MdClose />
                        <span className="text">close</span>
                    </span>
                </div>

                {!cartItems?.length && (
                    <div className="empty-cart">
                        <BsCartX />
                        <span>No products in the cart.</span>
                        <button className="return-cta" onClick={() => setShowCart(false)}>RETURN TO SHOP</button>
                    </div>
                )}

                {!!cartItems?.length && (
                    <>
                        <CartItem />
                        <div className="cart-footer">
                            <div className="subtotal">
                                <span className="text">Subtotal:</span>
                                <span className="text total">&#36;{cartSubTotal}</span>
                            </div>
                            <div className="button">
                                <button className="checkout-cta" onClick={handlePayment}>Checkout</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
