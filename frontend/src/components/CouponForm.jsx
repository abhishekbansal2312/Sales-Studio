import { useState, useEffect } from "react";

const CouponForm = ({ onSubmit, initialData, buttonText = "Save" }) => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code || "");
      setDiscount(initialData.discount || "");
      setDescription(initialData.description || "");
      setExpiryDate(
        initialData.expiryDate
          ? new Date(initialData.expiryDate).toISOString().split("T")[0]
          : ""
      );
      setIsActive(
        initialData.isActive !== undefined ? initialData.isActive : true
      );
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!code || !discount) {
      setError("Please enter both code and discount amount");
      return;
    }

    setError("");

    onSubmit({
      code,
      discount: Number(discount),
      description,
      expiryDate: expiryDate || null,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="coupon-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="code">Coupon Code*</label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={initialData?.isClaimed}
          required
        />
        {initialData?.isClaimed && (
          <small className="form-text text-muted">
            Code cannot be changed for claimed coupons
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="discount">Discount Amount*</label>
        <input
          type="number"
          id="discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          min="0"
          disabled={initialData?.isClaimed}
          required
        />
        {initialData?.isClaimed && (
          <small className="form-text text-muted">
            Discount cannot be changed for claimed coupons
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          disabled={initialData?.isClaimed}
        />
      </div>

      <div className="form-group">
        <label htmlFor="expiryDate">Expiry Date</label>
        <input
          type="date"
          id="expiryDate"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          disabled={initialData?.isClaimed}
        />
      </div>

      <div className="form-check">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="form-check-input"
        />
        <label htmlFor="isActive" className="form-check-label">
          Active
        </label>
      </div>

      <button type="submit" className="btn btn-primary">
        {buttonText}
      </button>
    </form>
  );
};

export default CouponForm;
