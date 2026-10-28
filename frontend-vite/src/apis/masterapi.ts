
export interface Product {
  productId: number;
  productName: string;
  productPrice: string;
  productQuantity: string;
}

const API_URL = "http://localhost:8989/master";

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};


// Add a product
export const addProduct = async (
  product: Omit<Product, "productId">
): Promise<Product> => {
  const response = await fetch(`${API_URL}/addProduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// Update a product
export const updateProduct = async (
  id: number,
  product: Omit<Product, "productId">
): Promise<Product> => {
  const response = await fetch(`${API_URL}/updateProduct/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// Delete a product
export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/deleteProduct/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
};

// Read an error message from the backend
const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = await response.json();
    return data.message || "Request failed";
  } catch {
    return "Request failed. Please try again.";
  }
};
