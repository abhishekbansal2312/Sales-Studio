import React, { createContext, useReducer, useContext } from "react";

// Initial state
const initialState = {
  adminInfo: localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo"))
    : null,
  loading: false,
  error: null,
  coupons: [],
  claims: [],
  nextCoupon: null,
  message: null,
};

// Create context
const CouponContext = createContext();

// Reducer function
function couponReducer(state, action) {
  switch (action.type) {
    case "REQUEST_START":
      return { ...state, loading: true, error: null };
    case "REQUEST_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "ADMIN_LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        adminInfo: action.payload,
      };
    case "ADMIN_LOGOUT":
      return {
        ...state,
        adminInfo: null,
      };
    case "GET_COUPONS_SUCCESS":
      return {
        ...state,
        loading: false,
        coupons: action.payload,
      };
    case "GET_CLAIMS_SUCCESS":
      return {
        ...state,
        loading: false,
        claims: action.payload,
      };
    case "GET_NEXT_COUPON_SUCCESS":
      return {
        ...state,
        loading: false,
        nextCoupon: action.payload,
      };
    case "COUPON_CLAIM_SUCCESS":
      return {
        ...state,
        loading: false,
        message: action.payload.message,
        nextCoupon: action.payload.coupon,
      };
    case "ADD_COUPON_SUCCESS":
      return {
        ...state,
        loading: false,
        coupons: [...state.coupons, action.payload],
      };
    case "UPDATE_COUPON_SUCCESS":
      return {
        ...state,
        loading: false,
        coupons: state.coupons.map((coupon) =>
          coupon._id === action.payload._id ? action.payload : coupon
        ),
      };
    case "DELETE_COUPON_SUCCESS":
      return {
        ...state,
        loading: false,
        coupons: state.coupons.filter(
          (coupon) => coupon._id !== action.payload
        ),
      };
    case "CLEAR_MESSAGE":
      return {
        ...state,
        message: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Provider component
export const CouponProvider = ({ children }) => {
  const [state, dispatch] = useReducer(couponReducer, initialState);

  return (
    <CouponContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

// Custom hook to use the context
export const useCouponContext = () => {
  return useContext(CouponContext);
};
