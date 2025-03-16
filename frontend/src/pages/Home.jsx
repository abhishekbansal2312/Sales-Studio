import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import ClaimCoupon from "../components/ClaimCoupon";

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-rose-500 to-rose-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Sales Studio
          </h1>
          <p className="text-xl mb-8">
            Discover exclusive discounts just for you!
          </p>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-rose-600 hover:bg-rose-100 font-medium px-6 py-3 rounded-lg transition duration-300 shadow-md"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-rose-700 text-white hover:bg-rose-800 font-medium px-6 py-3 rounded-lg transition duration-300 shadow-md"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 bg-white shadow-md">
        <div className="max-w-4xl mx-auto">
          <ClaimCoupon />
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Why Sales Studio?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="text-4xl mb-4 text-center">🎁</div>
              <h3 className="text-xl font-semibold text-rose-600 mb-3">
                Exclusive Deals
              </h3>
              <p className="text-gray-600">
                Get access to unique discounts not available elsewhere.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="text-4xl mb-4 text-center">🔒</div>
              <h3 className="text-xl font-semibold text-rose-600 mb-3">
                Secure Claims
              </h3>
              <p className="text-gray-600">
                Our system ensures fair distribution and prevents abuse.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="text-4xl mb-4 text-center">📱</div>
              <h3 className="text-xl font-semibold text-rose-600 mb-3">
                Easy Access
              </h3>
              <p className="text-gray-600">
                Claim coupons with a single click, no complicated process.
              </p>
            </div>

            {!user && (
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="text-4xl mb-4 text-center">📊</div>
                <h3 className="text-xl font-semibold text-rose-600 mb-3">
                  Track Your Savings
                </h3>
                <p className="text-gray-600">
                  <Link
                    to="/register"
                    className="text-rose-500 hover:text-rose-700 underline"
                  >
                    Create an account
                  </Link>{" "}
                  to save and manage your coupons.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
