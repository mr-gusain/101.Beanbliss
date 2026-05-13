import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ordersAPI, paymentAPI } from '../services/api';
import { CreditCard, Check, User, AlertCircle, Lock, IndianRupee, ChevronRight, Package, ShieldCheck, X } from 'lucide-react';
import { gsap } from 'gsap';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getImageUrl } from '../utils/imageUtils';

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState('details');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [stripePaymentMethod, setStripePaymentMethod] = useState(null);
  const [cardComplete, setCardComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const formRef = useRef(null);

  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: isDark ? '#f3f4f6' : '#111827',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        '::placeholder': {
          color: isDark ? '#9ca3af' : '#9ca3af',
        },
        iconColor: '#3b82f6',
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };


  const isFreeShipping = totalPrice >= 100;
  const shippingCost = isFreeShipping ? 0 : 10.00;
  const taxAmount = totalPrice * 0.085;
  const orderTotal = totalPrice + shippingCost + taxAmount;


  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);


  useEffect(() => {
    if (user) {
      setPaymentInfo(prev => ({ ...prev, cardHolder: `${user.firstName} ${user.lastName}` }));
      setShippingInfo(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);


  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', force3D: true }
      );
    }
  }, [currentStep]);


  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };


  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep === 'details') {
      setCurrentStep('payment');
      window.scrollTo(0, 0);
    } else if (currentStep === 'payment') {
      if (paymentMethod === 'Card') {
        if (!stripe || !elements) return;

        const cardNumberElement = elements.getElement(CardNumberElement);
        try {
          setProcessing(true);
          const { error, paymentMethod: pm } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardNumberElement,
            billing_details: {
              name: paymentInfo.cardHolder,
              email: shippingInfo.email,
              address: {
                line1: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                postal_code: shippingInfo.zipCode,
                country: shippingInfo.country,
              },
            },
          });

          if (error) {
            console.error(error);
            alert(error.message);
            setProcessing(false);
            return;
          }

          setStripePaymentMethod(pm);
          setCurrentStep('review');
          window.scrollTo(0, 0);
          setProcessing(false);
        } catch (err) {
          console.error(err);
          alert('Payment processing error');
          setProcessing(false);
        }
      } else {
        setCurrentStep('review');
        window.scrollTo(0, 0);
      }
    } else {

      const processOrder = async () => {
        try {
          setProcessing(true);
          if (paymentMethod === 'Card') {

            const { clientSecret } = await paymentAPI.createPaymentIntent('standard');


            const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
              payment_method: stripePaymentMethod.id,
            });

            if (confirmError) {
              setProcessing(false);
              throw new Error(confirmError.message);
            }
          }

          const orderData = {
            shippingInfo,
            shippingMethod: 'standard',
            paymentMethod
          };


          const newOrder = await ordersAPI.create(orderData);
          setProcessing(false);

          const orderAnimation = gsap.timeline();

          orderAnimation
            .to('.checkout-container', {
              opacity: 0,
              y: -20,
              duration: 0.4,
              ease: 'power2.in',
            })
            .add(() => {
              clearCart();
              navigate('/thank-you', { state: { order: newOrder } });
            });
        } catch (error) {
          console.error('Failed to create order:', error);
          alert(`Failed to process order: ${error.message}`);
          setProcessing(false);
        }
      };

      processOrder();
    }
  };


  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('details');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
    window.scrollTo(0, 0);
  };


  const isStepComplete = () => {
    if (currentStep === 'details') {
      return (
        shippingInfo.firstName &&
        shippingInfo.lastName &&
        shippingInfo.email &&
        shippingInfo.address &&
        shippingInfo.city &&
        shippingInfo.state &&
        shippingInfo.zipCode
      );
    } else if (currentStep === 'payment') {

      if (paymentMethod === 'COD') {
        return true;
      } else {
        return (
          !!paymentInfo.cardHolder &&
          cardComplete.number &&
          cardComplete.expiry &&
          cardComplete.cvc
        );
      }
    } else if (currentStep === 'review') {
      return acceptedTerms && !processing;
    }
    return false;
  };

  const steps = [
    { id: 'details', label: 'Personal details', icon: User },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: Check },
  ];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="checkout-container">
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-10 tracking-tight text-center lg:text-left">
            Checkout
          </h1>

          {/* Checkout Progress */}
          <div className="mb-12 max-w-3xl mx-auto lg:mx-0">
            <div className="relative flex justify-between">
              {/* Progress Bar Background */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary-200 dark:bg-secondary-700 -translate-y-1/2 z-0"></div>

              {/* Active Progress Bar */}
              <div
                className="absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
                style={{
                  width: currentStep === 'details' ? '0%' : currentStep === 'payment' ? '50%' : '100%'
                }}
              ></div>

              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted =
                  (currentStep === 'payment' && step.id === 'details') ||
                  (currentStep === 'review' && (step.id === 'details' || step.id === 'payment'));

                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isActive || isCompleted
                        ? 'bg-primary-600 border-primary-100 dark:border-primary-900 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-600 text-secondary-400 dark:text-secondary-500'
                        }`}
                    >
                      {isCompleted ? <Check size={20} /> : <step.icon size={20} />}
                    </div>
                    <span className={`mt-3 text-sm font-semibold transition-colors duration-300 ${isActive || isCompleted ? 'text-secondary-900 dark:text-secondary-100' : 'text-secondary-400 dark:text-secondary-500'
                      }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              <div ref={formRef} className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft border border-secondary-100 dark:border-secondary-700 p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                  {/* Personal details */}
                  {currentStep === 'details' && (
                    <>
                      <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 flex items-center gap-3 border-b border-secondary-100 dark:border-secondary-700 pb-4">
                        <User className="text-primary-600 dark:text-primary-400" size={24} />
                        Personal details
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={shippingInfo.firstName}
                            onChange={handleShippingChange}
                            required
                            className="w-full px-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-secondary-50 dark:bg-secondary-800 focus:bg-white dark:focus:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500"
                            placeholder="First Name"
                          />
                        </div>

                        <div>
                          <label htmlFor="lastName" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={shippingInfo.lastName}
                            onChange={handleShippingChange}
                            required
                            className="w-full px-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-secondary-50 dark:bg-secondary-800 focus:bg-white dark:focus:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500"
                            placeholder="Last Name"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={shippingInfo.email}
                            onChange={handleShippingChange}
                            required
                            className="w-full px-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-secondary-50 dark:bg-secondary-800 focus:bg-white dark:focus:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500"
                            placeholder="email@example.com"
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={shippingInfo.phone}
                            onChange={handleShippingChange}
                            className="w-full px-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-secondary-50 dark:bg-secondary-800 focus:bg-white dark:focus:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label htmlFor="address" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleShippingChange}
                          required
                          className="w-full px-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-secondary-50 dark:bg-secondary-800 focus:bg-white dark:focus:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500"
                          placeholder="Your full address..."
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                        <div className="col-span-2">
                          <label htmlFor="city" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={shippingInfo.city}
                            onChange={handleShippingChange}
                            required
                            className="w-full px-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-secondary-50 dark:bg-secondary-800 focus:bg-white dark:focus:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500"
                            placeholder="Your City"
                          />
                        </div>

                        <div>
                          <label htmlFor="state" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={shippingInfo.state}
                            onChange={handleShippingChange}
                            required
                            className="w-full px-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-secondary-50 dark:bg-secondary-800 focus:bg-white dark:focus:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500"
                            placeholder="Your State"
                          />
                        </div>

                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                            ZIP *
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={shippingInfo.zipCode}
                            onChange={handleShippingChange}
                            required
                            className="w-full px-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-secondary-50 dark:bg-secondary-800 focus:bg-white dark:focus:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500"
                            placeholder="Pincode"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                          Country *
                        </label>
                        <div className="relative">
                          <select
                            id="country"
                            name="country"
                            value={shippingInfo.country}
                            onChange={handleShippingChange}
                            required
                            className="w-full px-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-secondary-50 dark:bg-secondary-800 focus:bg-white dark:focus:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] appearance-none"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="IN">India</option>
                            <option value="AU">Australia</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary-500 dark:text-secondary-400">
                            <ChevronRight className="rotate-90" size={20} />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Payment Information */}
                  {currentStep === 'payment' && (
                    <>
                      <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 flex items-center gap-3 border-b border-secondary-100 dark:border-secondary-700 pb-4">
                        <CreditCard className="text-primary-600 dark:text-primary-400" size={24} />
                        Payment Method
                      </h2>

                      {/* Payment Method Selection */}
                      <div className="mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all h-full ${paymentMethod === 'Card'
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500'
                            : 'border-secondary-200 dark:border-secondary-600 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50'
                            }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="Card"
                              checked={paymentMethod === 'Card'}
                              onChange={() => setPaymentMethod('Card')}
                              className="text-primary-600 focus:ring-primary-500 w-5 h-5"
                            />
                            <div className="ml-3 flex items-center gap-3">
                              <div className="p-2 bg-white dark:bg-secondary-800 rounded-lg shadow-sm">
                                <CreditCard size={24} className="text-secondary-700 dark:text-secondary-300" />
                              </div>
                              <span className="block font-semibold text-secondary-900 dark:text-secondary-100">
                                Card Payment
                              </span>
                            </div>
                          </label>

                          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all h-full ${paymentMethod === 'COD'
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500'
                            : 'border-secondary-200 dark:border-secondary-600 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50'
                            }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="COD"
                              checked={paymentMethod === 'COD'}
                              onChange={() => setPaymentMethod('COD')}
                              className="text-primary-600 focus:ring-primary-500 w-5 h-5"
                            />
                            <div className="ml-3 flex items-center gap-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <IndianRupee size={24} className="text-success-600 dark:text-success-400" />
                              </div>
                              <span className="block font-semibold text-secondary-900 dark:text-secondary-100">
                                Cash on Delivery
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {paymentMethod === 'Card' && (
                        <div className="animate-fade-in">
                          <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-6 flex items-center gap-2">
                            Enter Card Details
                            <span className="ml-auto flex gap-2">
                              <img src="https://img.icons8.com/color/32/000000/visa.png" alt="Visa" className="h-6" />
                              <img src="https://img.icons8.com/color/32/000000/mastercard.png" alt="Mastercard" className="h-6" />
                              <img src="https://img.icons8.com/color/32/000000/amex.png" alt="Amex" className="h-6" />
                            </span>
                          </h3>

                          <div className="bg-secondary-50 dark:bg-secondary-700/30 p-6 rounded-2xl border border-secondary-100 dark:border-secondary-600 mb-6">
                            <div className="mb-6">
                              <label htmlFor="cardHolder" className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                                Cardholder Name *
                              </label>
                              <input
                                type="text"
                                id="cardHolder"
                                name="cardHolder"
                                value={paymentInfo.cardHolder}
                                onChange={handlePaymentChange}
                                required={paymentMethod === 'Card'}
                                className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500"
                                placeholder="Data Lore"
                              />
                            </div>
                            <div className="mb-6">
                              <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                                Card Number *
                              </label>
                              <div className="p-3.5 border border-secondary-300 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-800 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
                                <CardNumberElement
                                  options={elementOptions}
                                  onChange={(e) => setCardComplete(prev => ({ ...prev, number: e.complete }))}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                                  Expiry Date *
                                </label>
                                <div className="p-3.5 border border-secondary-300 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-800 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
                                  <CardExpiryElement
                                    options={elementOptions}
                                    onChange={(e) => setCardComplete(prev => ({ ...prev, expiry: e.complete }))}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                                  CVC *
                                </label>
                                <div className="p-3.5 border border-secondary-300 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-800 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
                                  <CardCvcElement
                                    options={elementOptions}
                                    onChange={(e) => setCardComplete(prev => ({ ...prev, cvc: e.complete }))}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 text-sm bg-primary-50 dark:bg-primary-900/20 text-secondary-700 dark:text-secondary-300 p-4 rounded-xl mb-6 border border-primary-100 dark:border-primary-800">
                            <div className="bg-white dark:bg-primary-900/50 p-1 rounded-full text-primary-600 dark:text-primary-400 mt-0.5">
                              <Lock size={14} />
                            </div>
                            <p>
                              Your payment information is encrypted and secure. We never store your full credit card details.
                            </p>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'COD' && (
                        <div className="mb-6 p-6 bg-secondary-50 dark:bg-secondary-700/30 rounded-2xl border border-secondary-200 dark:border-secondary-600 animate-fade-in flex flex-col items-center text-center">
                          <div className="w-16 h-16 bg-white dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4 shadow-sm text-success-600 dark:text-success-400">
                            <IndianRupee size={32} />
                          </div>
                          <h4 className="text-lg font-bold text-secondary-900 dark:text-white mb-2">Cash on Delivery</h4>
                          <p className="text-secondary-600 dark:text-secondary-400 max-w-md">
                            You can pay with cash when your order is delivered to your doorstep. Please have the exact amount ready for a smooth process.
                          </p>
                        </div>
                      )}

                      <div className="mb-6">
                        <label className="flex items-center mb-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={true}
                            readOnly
                            className="text-primary-600 focus:ring-primary-500 rounded border-gray-300 w-4 h-4"
                          />
                          <span className="ml-3 text-secondary-700 dark:text-secondary-300 font-medium">
                            Billing address is same as delivery address
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* Order Review */}
                  {currentStep === 'review' && (
                    <>
                      <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 flex items-center gap-3 border-b border-secondary-100 dark:border-secondary-700 pb-4">
                        <ShieldCheck className="text-primary-600 dark:text-primary-400" size={24} />
                        Review Your Order
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-secondary-50 dark:bg-secondary-700/30 p-6 rounded-2xl border border-secondary-100 dark:border-secondary-600">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                              <User size={18} className="text-primary-600 dark:text-primary-400" /> Personal details
                            </h3>
                            <button
                              type="button"
                              onClick={() => setCurrentStep('details')}
                              className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="space-y-1 text-secondary-700 dark:text-secondary-400 text-sm">
                            <p className="font-semibold text-secondary-900 dark:text-secondary-100 text-base mb-1">
                              {shippingInfo.firstName} {shippingInfo.lastName}
                            </p>
                            <p>{shippingInfo.address}</p>
                            <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                            <p>{shippingInfo.country}</p>
                            <div className="mt-3 pt-3 border-t border-secondary-200 dark:border-secondary-600">
                              <p className="font-medium">{shippingInfo.email}</p>
                              <p>{shippingInfo.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-secondary-50 dark:bg-secondary-700/30 p-6 rounded-2xl border border-secondary-100 dark:border-secondary-600">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                              <CreditCard size={18} className="text-primary-600 dark:text-primary-400" /> Payment
                            </h3>
                            <button
                              type="button"
                              onClick={() => setCurrentStep('payment')}
                              className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="text-secondary-700 dark:text-secondary-400 text-sm">
                            {paymentMethod === 'Card' ? (
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-secondary-900 dark:text-secondary-100 font-semibold text-base mb-1">
                                  <CreditCard size={20} />
                                  Card Payment
                                </div>
                                <p className="font-medium">
                                  {stripePaymentMethod?.billing_details?.name || paymentInfo.cardHolder}
                                </p>
                                <p>
                                  Card ending in •••• {stripePaymentMethod?.card?.last4 || '****'}
                                </p>
                                <p>
                                  Expires {stripePaymentMethod?.card?.exp_month}/{stripePaymentMethod?.card?.exp_year}
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-secondary-900 dark:text-white font-semibold text-base mb-1">
                                  <IndianRupee size={20} className="text-success-600 dark:text-success-400" />
                                  Cash on Delivery
                                </div>
                                <p className="text-secondary-600 dark:text-secondary-400">Pay upon delivery</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h3 className="font-bold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
                          <Package size={20} className="text-primary-600 dark:text-primary-400" />
                          Items in Order
                        </h3>

                        <div className="bg-secondary-50 dark:bg-secondary-700/30 rounded-2xl border border-secondary-100 dark:border-secondary-600 overflow-hidden divide-y divide-secondary-100 dark:divide-secondary-600">
                          {cart.map((item) => {
                            const product = item.product;
                            if (!product) return null;
                            return (
                              <div key={item._id || product._id || product.id} className="flex items-center p-4 hover:bg-white dark:hover:bg-secondary-700/50 transition-colors">
                                <div className="w-16 h-16 bg-white dark:bg-secondary-800 rounded-lg overflow-hidden border border-secondary-200 dark:border-secondary-600 mr-4 shrink-0 flex items-center justify-center p-1">
                                  <img
                                    src={getImageUrl(product.image)}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <p className="text-secondary-900 dark:text-secondary-100 font-bold mb-1">
                                    {product.name}
                                  </p>
                                  <p className="text-secondary-500 dark:text-secondary-400 text-xs uppercase tracking-wider font-semibold">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-secondary-900 dark:text-secondary-100 font-bold text-lg">
                                  ₹{(product.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-8">
                        <label className="flex items-start p-4 bg-secondary-50 dark:bg-secondary-700/30 rounded-xl cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              checked={acceptedTerms}
                              onChange={(e) => setAcceptedTerms(e.target.checked)}
                              className="text-primary-600 focus:ring-primary-500 rounded border-secondary-300 w-5 h-5"
                              required
                            />
                          </div>
                          <span className="ml-3 text-secondary-700 dark:text-secondary-300 text-sm">
                            I accept the <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">Terms and Conditions</a> and <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">Privacy Policy</a>. I consent to receive order updates via email.
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-6 border-t border-secondary-100 dark:border-secondary-700 gap-4 sm:gap-0">
                    <div className="flex gap-3 w-full sm:w-auto">
                      {currentStep !== 'details' && (
                        <button
                          type="button"
                          onClick={handleBack}
                          className="py-3 px-6 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white hover:border-secondary-300 dark:hover:border-secondary-500 transition-all font-semibold w-full sm:w-auto flex-1 sm:flex-none justify-center"
                        >
                          Back
                        </button>
                      )}

                      {currentStep === 'review' && (
                        <button
                          type="button"
                          onClick={() => navigate('/order-cancelled')}
                          className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-bold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 w-full sm:w-auto flex-1 sm:flex-none"
                        >
                          Cancel Order <X size={18} />
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={!isStepComplete() || processing}
                      className={`py-3 px-8 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${isStepComplete() && !processing
                        ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-1 w-full sm:w-auto'
                        : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-400 dark:text-secondary-500 cursor-not-allowed w-full sm:w-auto'
                        }`}
                    >
                      {processing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        currentStep === 'details'
                          ? <>Continue to Payment <ChevronRight size={18} /></>
                          : currentStep === 'payment'
                            ? <>Review Order <ChevronRight size={18} /></>
                            : <>Place Order <Check size={18} /></>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft border border-secondary-100 dark:border-secondary-700 p-6 md:p-8 sticky top-32">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-secondary-100 dark:border-secondary-700">
                  <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                    Order Summary
                  </h2>
                  <span className="text-sm font-semibold bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 px-3 py-1 rounded-full">
                    {cart.length} {cart.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto mb-6 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-secondary-200 scrollbar-track-transparent">
                  {cart.map((item) => {
                    const product = item.product;
                    if (!product) return null;
                    return (
                      <div key={item._id || product._id || product.id} className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg overflow-hidden border border-secondary-100 dark:border-secondary-600 shrink-0 flex items-center justify-center p-1">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-secondary-900 dark:text-secondary-100 text-sm font-semibold line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-secondary-500 dark:text-secondary-400 text-xs">
                            Qty: <span className="font-medium text-secondary-700 dark:text-secondary-300">{item.quantity}</span>
                          </p>
                        </div>
                        <div className="text-secondary-900 dark:text-secondary-100 text-sm font-bold">
                          ₹{(product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 pt-6 border-t border-dashed border-secondary-200 dark:border-secondary-600">
                  <div className="flex justify-between text-secondary-600 dark:text-secondary-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-secondary-900 dark:text-secondary-100">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary-600 dark:text-secondary-400">
                    <span>Delivery</span>
                    <span className="font-semibold text-secondary-900 dark:text-secondary-100">₹{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary-600 dark:text-secondary-400">
                    <span>Tax (8.5%)</span>
                    <span className="font-semibold text-secondary-900 dark:text-secondary-100">₹{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-secondary-200 dark:border-secondary-600 pt-4 mt-2 flex justify-between items-end">
                    <span className="font-bold text-xl text-secondary-900 dark:text-white">Total</span>
                    <span className="font-bold text-2xl text-primary-600 dark:text-primary-400">₹{orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                  <div className="flex items-start gap-3">
                    <div className="bg-white dark:bg-primary-900/50 p-1 rounded-full text-primary-600 dark:text-primary-400 mt-0.5 shadow-sm">
                      <ShieldCheck size={16} />
                    </div>
                    <p className="text-sm text-primary-800 dark:text-primary-300 font-medium">
                      {paymentMethod === 'COD'
                        ? 'Payment due upon delivery details sent to your email.'
                        : 'Secure SSL Payment. Your order will be processed immediately.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;