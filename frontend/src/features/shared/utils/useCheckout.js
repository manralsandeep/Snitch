import { useRazorpay } from "react-razorpay";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

// 1. Function ka naam 'useCheckout' rakha (Hook hamesha 'use' se start hota hai)
// 2. Yeh 'async' NAHI hoga
export const useCheckout = () => {

    // 3. Saare Hooks yahan top-level par call honge!
    const user = useSelector(state => state.auth.user);
    const { error, isLoading, Razorpay } = useRazorpay();
    const navigate = useNavigate();

    // 4. Tera main logic ek inner function ke andar jayega
    const handleCheckout = async (createOrderFnc, verifyOrderFnc) => {

        const order = await createOrderFnc();
        

        const options = {
            key: "rzp_test_TTc888fVo3xf71",
            amount: order.amount, // Amount in paise
            currency: order.currency,
            name: "Snitch",
            description: "Test Transaction",
            order_id: order.id,
            handler: async (response) => {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
                
                const isValid = await verifyOrderFnc({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
                if (isValid) {
                    navigate(`/order-success?order_id=${response?.razorpay_order_id}`);
                }
            },
            prefill: {
                name: user?.fullname,
                email: user?.email,
                contact: user?.contact,
            },
            theme: {
                color: "#000000", // Agar 'tokens.primary' undefined de raha hai, toh string pass kar de
            },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
    }

    // 5. Apne function ko return kar de taaki Component usko use kar sake
    return { handleCheckout, isLoading, error };
}