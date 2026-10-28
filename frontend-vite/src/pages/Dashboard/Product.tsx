import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct as deleteProductApi,
  type Product,
} from "../../apis/masterapi";

import "../../components/DynamicTableForm/DynamicCSS/DynamicTable.css";
import "./Dashboard.css";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Load products from database
  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  // Open dialog for adding product
  const openAddDialog = () => {
    setEditingId(null);
    setProductName("");
    setPrice("");
    setError("");
    setShowDialog(true);
  };

  // Open dialog for updating product
  const openEditDialog = (product: Product) => {
    setEditingId(product.productId);
    setProductName(product.productName);
    setPrice(String(product.productPrice ?? ""));
    setError("");
    setShowDialog(true);
  };

  // Save product using API
  const saveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!productName.trim()) {
      setError("Please enter product name");
      return;
    }

    if (
      price.trim() === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0
    ) {
      setError("Please enter a valid price");
      return;
    }

    const productData = {
      productName: productName.trim(),
      productPrice: price,
      productQuantity: "1",
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await updateProduct(editingId, productData);
      } else {
        await addProduct(productData);
      }

      setShowDialog(false);
      setEditingId(null);
      setProductName("");
      setPrice("");
      setError("");

      // Refresh list with database data
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete product using API
  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      await deleteProductApi(id);
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Search products
  const filteredProducts = products.filter((product) =>
    (product.productName ?? "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="dash-home product-page">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>

          <p className="page-sub">
            Manage your seafood products and price per KG
          </p>
        </div>

        <button
          className="btn-primary"
          type="button"
          onClick={openAddDialog}
        >
          + Add Product
        </button>
      </div>

      {/* Error Message */}
      {error && !showDialog && (
        <div className="product-form-error">
          {error}
          <button
            type="button"
            onClick={() => void loadProducts()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Product List */}
      <div className="dt-root">

        <div className="dt-toolbar">
          <input
            className="dt-search"
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="dt-toolbar-right">
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Total: <strong>{filteredProducts.length}</strong> products
            </span>
          </div>
        </div>

        <div className="dt-wrap">
          <table className="dt-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Price / KG</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="dt-state">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="dt-state">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.productId}>

                    <td>{product.productId}</td>

                    <td
                      style={{
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      {product.productName}
                    </td>

                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#2563eb",
                        }}
                      >
                        ₹{Number(product.productPrice || 0).toFixed(2)}
                      </span>
                    </td>

                    <td>
                      <div className="product-actions">

                        <button
                          type="button"
                          className="product-edit-btn"
                          onClick={() => openEditDialog(product)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="product-delete-btn"
                          disabled={deletingId === product.productId}
                          onClick={() =>
                            void handleDeleteProduct(product.productId)
                          }
                        >
                          {deletingId === product.productId
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Add / Update Product Dialog */}
      {showDialog && (
        <div
          className="product-modal-overlay"
          onClick={() => {
            if (!saving) setShowDialog(false);
          }}
        >
          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Dialog Header */}
            <div className="product-modal-header">

              <div>
                <h2>
                  {editingId !== null
                    ? "Update Product"
                    : "Add Product"}
                </h2>

                <p>Enter product details below</p>
              </div>

              <button
                type="button"
                className="product-modal-close"
                disabled={saving}
                onClick={() => setShowDialog(false)}
              >
                ×
              </button>

            </div>

            {/* Dialog Form */}
            <form onSubmit={saveProduct}>

              <div className="product-modal-body">

                <div className="product-form-group">

                  <label>
                    Product Name <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    autoFocus
                    required
                  />

                </div>

                <div className="product-form-group">

                  <label>
                    Price per KG <span>*</span>
                  </label>

                  <div className="product-price-input">

                    <span>₹</span>

                    <input
                      type="number"
                      placeholder="Enter price"
                      min="0.01"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />

                    <span className="product-price-unit">
                      / KG
                    </span>

                  </div>

                </div>

                {error && (
                  <div className="product-form-error">
                    {error}
                  </div>
                )}

              </div>

              {/* Dialog Footer */}
              <div className="product-modal-footer">

                <button
                  type="button"
                  className="product-cancel-btn"
                  disabled={saving}
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="product-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Update Product"
                      : "Save Product"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
