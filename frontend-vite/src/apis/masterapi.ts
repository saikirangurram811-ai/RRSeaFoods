import { api } from "../../src/config/services/axios";
import Products from "../pages/Dashboard/Product";

export interface Product {
  productId: number;
  productName: string;
  productPrice: string;
  productQuantity: string;
}

const API_URL = "http://localhost:8989/master";

// Get all products
export const getProducts = async (): Promise<Product[]> => {
   const res = await api.get<Product[]>("/master/products");
  return res.data;
}



// Add a product
export async function addProduct(
  product: Omit<Product, "productId">
): Promise<Product> {
  const res = await api.post<Product>("/master/addProduct", product);
  return res.data;
}

// Update a product

export async function updateProduct(
  id: number,
  product: Omit<Product, "productId">
): Promise<Product> {
  const res = await api.put<Product>(`/master/updateProduct/${id}`, product);
  return res.data;
}


// Delete a product

export async function deleteProduct(
  id: number,
  // product: Omit<Product, "productId">
): Promise<Product> {
  const res = await api.delete<Product>(`/master/deleteProduct/${id}`);
  return res.data;
}


// Read an error message from the backend
const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = await response.json();
    return data.message || "Request failed";
  } catch {
    return "Request failed. Please try again.";
  }
};
