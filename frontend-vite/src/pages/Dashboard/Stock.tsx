
import React, { useEffect, useMemo, useState } from "react";

import {
    getProducts,
    addStockIn,
    getStockIn,
    type Product,
    type StockPayload,
    type StockResponse
} from "../../apis/masterapi";

import "../../components/DynamicTableForm/DynamicCSS/DynamicTable.css";
import toast from "react-hot-toast";

type StockType = "in" | "out" | "remaining";

type RemainingStock = {
    productId: number;
    productName: string;
    quantity: number;
    stockDate: string;
};

const getTodayDate = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const Stock: React.FC = () => {

    const today = getTodayDate();

    // Tabs
    const [activeTab, setActiveTab] = useState<StockType>("in");

    // Stock records
    const [stockIn, setStockIn] = useState<StockResponse[]>([]);
    const [stockOut, setStockOut] = useState<StockResponse[]>([]);

    // Products
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingStock, setLoadingStock] = useState(false);

    // Search and pagination
    const [search, setSearch] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    // Date filter
    const [selectedDate, setSelectedDate] = useState<string>(today);

    // Fetch products
    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);

            const data = await getProducts();

            setProducts(data);

        } catch (error) {
            console.error("Failed to fetch products:", error);
            toast.error("Unable to load products. Please try again.");
        } finally {
            setLoadingProducts(false);
        }
    };

    // Fetch Stock In records
    const fetchStockIn = async () => {
        try {
            setLoadingStock(true);

            const data = await getStockIn();

            setStockIn(data);

        } catch (error) {
            console.error("Failed to fetch stock in:", error);
            toast.error("Unable to load Stock In records.");
        } finally {
            setLoadingStock(false);
        }
    };

    // Load data when page opens
    useEffect(() => {
        fetchProducts();
        fetchStockIn();
    }, []);

    // Calculate remaining stock
    // Currently based only on Stock In because Stock Out API is not available.
    const remainingStock = useMemo((): RemainingStock[] => {

        return products.map((product) => {

            const totalIn = stockIn
                .filter(item => item.productId === product.productId)
                .filter(item => item.stockDate <= selectedDate)
                .reduce((sum, item) => sum + Number(item.quantity), 0);

            const totalOut = stockOut
                .filter(item => item.productId === product.productId)
                .filter(item => item.stockDate <= selectedDate)
                .reduce((sum, item) => sum + Number(item.quantity), 0);

            return {
                productId: product.productId,
                productName: product.productName,
                quantity: totalIn - totalOut,
                stockDate: selectedDate
            };

        }).filter(item => item.quantity > 0);

    }, [products, stockIn, stockOut, selectedDate]);

    // Summary calculations for selected date
    const totalStockIn = stockIn
        .filter(item => item.stockDate === selectedDate)
        .reduce((sum, item) => sum + Number(item.quantity), 0);

    const totalStockOut = stockOut
        .filter(item => item.stockDate === selectedDate)
        .reduce((sum, item) => sum + Number(item.quantity), 0);

    const totalRemaining = remainingStock.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    // Current table data
    const tableData =
        activeTab === "in"
            ? stockIn
            : activeTab === "out"
                ? stockOut
                : remainingStock;

    // Filter by selected date
    const dateFilteredData = tableData.filter(item => {
        if (activeTab === "remaining") {
            return true;
        }

        return item.stockDate === selectedDate;
    });

    // Search
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

    // Open Add Stock modal
    const handleAdd = () => {

        if (activeTab !== "in") {
            return;
        }

        setSelectedProduct("");
        setQuantity("");
        setError("");
        setShowModal(true);
    };

    // Save Stock In
    const handleSave = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (activeTab !== "in") {
            return;
        }

        const product = products.find(
            item => item.productId === Number(selectedProduct)
        );

        const enteredQuantity = Number(quantity);

        if (!product) {
            toast.error("Please select a product.");
            return;
        }

        if (
            !quantity ||
            !Number.isFinite(enteredQuantity) ||
            enteredQuantity <= 0
        ) {
            toast.error("Please enter a valid quantity.");
            return;
        }

        const payload: StockPayload = {
            productId: product.productId,
            productName: product.productName,
            quantity: enteredQuantity,
            stockDate: today,
            stockType: "IN"
        };

        try {

            setSaving(true);
            setError("");

            await addStockIn(payload);

            toast.success("Stock In added successfully!");

            setShowModal(false);
            setSelectedProduct("");
            setQuantity("");
            setSearch("");
            setPage(1);

            // Reload Stock In records after saving
            await fetchStockIn();

        } catch (err: any) {

            console.error("Failed to save stock:", err);

            const errorMessage =
                err?.response?.data?.message ||
                err?.response?.data ||
                "Failed to save stock. Please try again.";

            setError(
                typeof errorMessage === "string"
                    ? errorMessage
                    : "Failed to save stock. Please try again."
            );

        } finally {
            setSaving(false);
        }
    };

    const pageTitle =
        activeTab === "in"
            ? "Stock In"
            : activeTab === "out"
                ? "Stock Out"
                : "Remaining Stock";

    return (

        <div className="product-page">

            <div className="dt-root">

                {/* Header */}

                <div className="dt-header">

                    <div>
                        <h2 className="stock-page-title">
                            Stock Management
                        </h2>

                        <p className="stock-page-subtitle">
                            Manage your stock in, stock out and remaining stock.
                        </p>
                    </div>

                    {activeTab === "in" && (
                        <button
                            className="btn-primary"
                            onClick={handleAdd}
                        >
                            + Add Stock In
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

                        <small>Received Quantity</small>
                    </button>

                    <button
                        className={`stock-summary-card stock-out-card ${activeTab === "out" ? "active" : ""}`}
                        onClick={() => handleTabChange("out")}
                    >
                        <span>Stock Out Today</span>

                        <strong>{totalStockOut} Kg</strong>

                        <small>Dispatched Quantity</small>
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
                        <h3 className="stock-section-title">
                            {pageTitle} Details
                        </h3>

                        <p className="stock-section-description">
                            {activeTab === "remaining"
                                ? "View available product quantities."
                                : `View ${pageTitle.toLowerCase()} entries.`}
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
                            </tr>
                        </thead>

                        <tbody>

                            {loadingStock && activeTab === "in" ? (

                                <tr>
                                    <td colSpan={4} className="dt-state">
                                        Loading Stock In records...
                                    </td>
                                </tr>

                            ) : displayedData.length > 0 ? (

                                displayedData.map((item, index) => (

                                    <tr
                                        key={
                                            activeTab === "remaining"
                                                ? item.productId
                                                : (item as StockResponse).stockId
                                        }
                                    >

                                        <td>
                                            {startIndex + index + 1}
                                        </td>

                                        <td className="stock-product-name">
                                            {item.productName}
                                        </td>

                                        <td>
                                            {item.quantity} Kg
                                        </td>

                                        <td>
                                            {formatDate(item.stockDate)}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan={4} className="dt-state">

                                        {activeTab === "out"
                                            ? "Stock Out APIs are not implemented yet."
                                            : "No stock records found."}

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
                        {" "}to{" "}
                        {Math.min(startIndex + pageSize, filteredData.length)}
                        {" "}of {filteredData.length} entries
                    </span>

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(prev => prev - 1)}
                    >
                        Previous
                    </button>

                    <strong>
                        {page} / {totalPages}
                    </strong>

                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(prev => prev + 1)}
                    >
                        Next
                    </button>

                </div>

            </div>

            {/* Add Stock In Modal */}

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
                                        Add Stock In
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
                                        className="stock-product-select"
                                        disabled={loadingProducts}
                                    >

                                        <option value="">
                                            {loadingProducts
                                                ? "Loading products..."
                                                : "Select Product"}
                                        </option>

                                        {products.map(product => (

                                            <option
                                                key={product.productId}
                                                value={product.productId}
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

                                    <label>
                                        Date
                                    </label>

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
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="product-save-btn"
                                    disabled={saving || loadingProducts}
                                >
                                    {saving ? "Saving..." : "Save"}
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
