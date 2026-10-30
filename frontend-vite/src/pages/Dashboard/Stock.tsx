
import React, { useMemo, useState } from "react";
import "../../components/DynamicTableForm/DynamicCSS/DynamicTable.css";

type StockType = "in" | "out" | "remaining";

type Product = {
  id: number;
  productName: string;
};

type StockEntry = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  date: string;
};

// Static product dropdown data
const products: Product[] = [
  { id: 1, productName: "Rohu Fish" },
  { id: 2, productName: "Hilsa Fish" },
  { id: 3, productName: "Prawn" },
  { id: 4, productName: "Vannamei Prawn" },
  { id: 5, productName: "Squid" },
  { id: 6, productName: "Tilapia" },
  { id: 7, productName: "Pomfret" },
  { id: 8, productName: "King Fish" },
  { id: 9, productName: "Crab" },
  { id: 10, productName: "Mackerel" },
];

// Static Stock In data
const initialStockIn: StockEntry[] = [
  { id: 1, productId: 1, productName: "Rohu Fish", quantity: 100, date: "2026-10-29" },
  { id: 2, productId: 2, productName: "Hilsa Fish", quantity: 50, date: "2026-10-30" },
  { id: 3, productId: 3, productName: "Prawn", quantity: 75, date: "2026-10-29" },
  { id: 4, productId: 4, productName: "Vannamei Prawn", quantity: 60, date: "2026-10-30" },
  { id: 5, productId: 5, productName: "Squid", quantity: 40, date: "2026-10-30" },
  { id: 6, productId: 6, productName: "Tilapia", quantity: 80, date: "2026-10-29" },
  { id: 7, productId: 7, productName: "Pomfret", quantity: 45, date: "2026-10-30" },
  { id: 8, productId: 8, productName: "King Fish", quantity: 30, date: "2026-10-28" },
  { id: 9, productId: 9, productName: "Crab", quantity: 25, date: "2026-10-28" },
  { id: 10, productId: 10, productName: "Mackerel", quantity: 70, date: "2026-10-28" },
];

// Static Stock Out data
const initialStockOut: StockEntry[] = [
  { id: 1, productId: 1, productName: "Rohu Fish", quantity: 25, date: "2026-10-29" },
  { id: 2, productId: 3, productName: "Prawn", quantity: 30, date: "2026-10-30" },
  { id: 3, productId: 4, productName: "Vannamei Prawn", quantity: 20, date: "2026-10-30" },
  { id: 4, productId: 5, productName: "Squid", quantity: 12, date: "2026-10-28" },
  { id: 5, productId: 6, productName: "Tilapia", quantity: 40, date: "2026-10-30" },
  { id: 6, productId: 7, productName: "Pomfret", quantity: 10, date: "2026-10-28" },
];

const formatDate = (date: string) => {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Stock: React.FC = () => {

  const [activeTab, setActiveTab] = useState<StockType>("in");

  const [stockIn, setStockIn] = useState<StockEntry[]>(initialStockIn);
  const [stockOut, setStockOut] = useState<StockEntry[]>(initialStockOut);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  const today = "2026-10-30";

  // Calculate remaining stock product-wise
  const remainingStock = useMemo(() => {

    return products.map((product) => {

      const totalIn = stockIn
        .filter(item => item.productId === product.id)
        .reduce((sum, item) => sum + item.quantity, 0);

      const totalOut = stockOut
        .filter(item => item.productId === product.id)
        .reduce((sum, item) => sum + item.quantity, 0);

      return {
        id: product.id,
        productId: product.id,
        productName: product.productName,
        quantity: totalIn - totalOut,
        date: today,
      };

    }).filter(item => item.quantity > 0);

  }, [stockIn, stockOut]);

  // Summary calculations
  const totalStockIn = stockIn.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalStockOut = stockOut.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalRemaining = remainingStock.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const [selectedDate, setSelectedDate] = useState("2026-10-30");

  // Current table data
  const tableData =
    activeTab === "in"
      ? stockIn
      : activeTab === "out"
        ? stockOut
        : remainingStock;

  const dateFilteredData = tableData.filter(
    item => item.date === selectedDate
  );

  const filteredData = dateFilteredData.filter(item =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / pageSize)
  );

  const startIndex = (page - 1) * pageSize;

  const displayedData = filteredData.slice(
    startIndex,
    startIndex + pageSize
  );

  // Change tabs
  const handleTabChange = (tab: StockType) => {
    setActiveTab(tab);
    setSearch("");
    setPage(1);
  };

  // Open modal
  const handleAdd = () => {
    setSelectedProduct("");
    setQuantity("");
    setError("");
    setShowModal(true);
  };

  // Save stock entry
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const product = products.find(
      item => item.id === Number(selectedProduct)
    );

    const enteredQuantity = Number(quantity);

    if (!product) {
      setError("Please select a product.");
      return;
    }

    if (!quantity || !Number.isFinite(enteredQuantity) || enteredQuantity <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    // Check available quantity before Stock Out
    if (activeTab === "out") {

      const available = remainingStock.find(
        item => item.productId === product.id
      )?.quantity || 0;

      if (enteredQuantity > available) {
        setError(
          `Only ${available} Kg available for ${product.productName}.`
        );
        return;
      }
    }

    const newEntry: StockEntry = {
      id: Date.now(),
      productId: product.id,
      productName: product.productName,
      quantity: enteredQuantity,
      date: today,
    };

    if (activeTab === "in") {
      setStockIn(prev => [...prev, newEntry]);
    } else if (activeTab === "out") {
      setStockOut(prev => [...prev, newEntry]);
    }

    setShowModal(false);
    setSearch("");
    setPage(1);
  };

  // Delete stock entry
  const handleDelete = (id: number) => {

    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    if (activeTab === "in") {
      setStockIn(prev => prev.filter(item => item.id !== id));
    } else if (activeTab === "out") {
      setStockOut(prev => prev.filter(item => item.id !== id));
    }
  };

  const pageTitle =
    activeTab === "in"
      ? "Stock In Today"
      : activeTab === "out"
        ? "Stock Out Today"
        : "Remaining Stock";

  return (

    <div className="product-page">

      <div className="dt-root">

        {/* Header */}

        <div className="dt-header">

          <div>
            <h2 style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              color: "#12141a"
            }}>
              Stock Management
            </h2>

            <p style={{
              marginTop: 6,
              color: "#64748b",
              fontSize: 13
            }}>
              Manage your stock in, stock out and remaining stock.
            </p>
          </div>

          {activeTab !== "remaining" && (
            <button
              className="btn-primary"
              onClick={handleAdd}
            >
              + Add {activeTab === "in" ? "Stock In" : "Stock Out"}
            </button>
          )}

        </div>

        {/* Summary Cards */}

        <div className="stock-summary-grid">

          <button
            className={`stock-summary-card stock-in-card ${activeTab === "in" ? "active" : ""}`}
            onClick={() => handleTabChange("in")}
          >
            <span>Stock In Today</span>
            <strong>{totalStockIn} Kg</strong>
            <small>Total Received Quantity</small>
          </button>

          <button
            className={`stock-summary-card stock-out-card ${activeTab === "out" ? "active" : ""}`}
            onClick={() => handleTabChange("out")}
          >
            <span>Stock Out Today</span>
            <strong>{totalStockOut} Kg</strong>
            <small>Total Dispatched Quantity</small>
          </button>

          <button
            className={`stock-summary-card stock-remaining-card ${activeTab === "remaining" ? "active" : ""}`}
            onClick={() => handleTabChange("remaining")}
          >
            <span>Remaining Stock</span>
            <strong>{totalRemaining} Kg</strong>
            <small>Available Quantity</small>
          </button>

          {/* Date Filter */}

          <div className="stock-date-filter">

            <label htmlFor="stockDate">
              <i className="bi bi-calendar3"></i>
              Select Date:
            </label>

            <input
              type="date"
              id="stockDate"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setPage(1);
              }}
            />

          </div>

        </div>

        {/* Table Header and Search */}

        <div className="dt-toolbar">

          <div>
            <h3 style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "#12141a"
            }}>
              {pageTitle} Details
            </h3>

            <p style={{
              marginTop: 5,
              fontSize: 12,
              color: "#64748b"
            }}>
              {activeTab === "remaining"
                ? "View available product quantities."
                : "Manage today's stock entries."}
            </p>
          </div>

          <div className="dt-toolbar-right">

            <input
              type="text"
              className="dt-search"
              placeholder="Search product name..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <select
              className="dt-pagesize"
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>

          </div>

        </div>

        {/* Stock Table */}

        <div className="dt-wrap">

          <table className="dt-table">

            <thead>
              <tr>
                <th>S.No</th>
                <th>Product Name</th>
                <th>Quantity (Kg)</th>
                <th>Date</th>
                {activeTab !== "remaining" && <th>Action</th>}
              </tr>
            </thead>

            <tbody>

              {displayedData.length > 0 ? (

                displayedData.map((item, index) => (

                  <tr key={item.id}>

                    <td>{startIndex + index + 1}</td>

                    <td style={{ fontWeight: 600 }}>
                      {item.productName}
                    </td>

                    <td>{item.quantity} Kg</td>

                    <td>{formatDate(item.date)}</td>

                    {activeTab !== "remaining" && (
                      <td>
                        <div className="action-btns">
                          <button
                            className="act-btn delete"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan={activeTab === "remaining" ? 4 : 5}
                    className="dt-state"
                  >
                    No stock records found.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* Pagination */}

        <div className="dt-pagination">

          <span>
            Showing {filteredData.length === 0 ? 0 : startIndex + 1}
            {" "}to {Math.min(startIndex + pageSize, filteredData.length)}
            {" "}of {filteredData.length} entries
          </span>

          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
          >
            Previous
          </button>

          <strong>{page} / {totalPages}</strong>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(prev => prev + 1)}
          >
            Next
          </button>

        </div>

      </div>

      {/* Add Stock Modal */}

      {showModal && (

        <div
          className="product-modal-overlay"
          onMouseDown={e => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >

          <div className="product-modal">

            <form onSubmit={handleSave}>

              <div className="product-modal-header">

                <div>
                  <h2>
                    Add {activeTab === "in" ? "Stock In" : "Stock Out"}
                  </h2>

                  <p>
                    Enter product and quantity details.
                  </p>
                </div>

                <button
                  type="button"
                  className="product-modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>

              </div>

              <div className="product-modal-body">

                {error && (
                  <div className="product-form-error">
                    {error}
                  </div>
                )}

                {/* Product Dropdown */}

                <div className="product-form-group">

                  <label>
                    Product Name <span>*</span>
                  </label>

                  <select
                    value={selectedProduct}
                    onChange={e => setSelectedProduct(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      height: 44,
                      padding: "0 12px",
                      border: "1px solid #cbd5e1",
                      borderRadius: 7,
                      background: "#fff",
                      fontSize: 14
                    }}
                  >

                    <option value="">
                      Select Product
                    </option>

                    {products.map(product => (

                      <option
                        key={product.id}
                        value={product.id}
                      >
                        {product.productName}
                      </option>

                    ))}

                  </select>

                </div>

                {/* Quantity */}

                <div className="product-form-group">

                  <label>
                    Quantity <span>*</span>
                  </label>

                  <div className="product-price-input">

                    <input
                      type="number"
                      placeholder="Enter quantity"
                      min="0.01"
                      step="0.01"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      required
                    />

                    <span className="product-price-unit">
                      Kg
                    </span>

                  </div>

                </div>

                {/* Date */}

                <div className="product-form-group">

                  <label>Date</label>

                  <input
                    type="date"
                    value={today}
                    readOnly
                  />

                </div>

              </div>

              <div className="product-modal-footer">

                <button
                  type="button"
                  className="product-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="product-save-btn"
                >
                  Save
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Stock;
