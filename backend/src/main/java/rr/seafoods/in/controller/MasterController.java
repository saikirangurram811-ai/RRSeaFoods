package rr.seafoods.in.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import rr.seafoods.in.entity.Product;
import rr.seafoods.in.repository.ProductRepo;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/master")
@CrossOrigin(origins = "http://localhost:3001", allowCredentials = "true")
public class MasterController {

    private final ProductRepo productRepo;

    @Autowired
    public MasterController(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }

     @GetMapping("/products")
    public List<Product> getProducts() {
        return productRepo.findAll();
    }

    // Add product
    @PostMapping("/addProduct")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {

        if (product.getProductName() == null ||
                product.getProductName().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Product name is required"));
        }

        product.setProductId(null);

        product.setProductQuantity("1");

        Product savedProduct = productRepo.save(product);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    // Update product
    @PutMapping("/updateProduct/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        Product existingProduct = productRepo.findById(id).orElse(null);

        if (existingProduct == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Product not found"));
        }

        if (product.getProductName() == null ||
                product.getProductName().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Product name is required"));
        }

        existingProduct.setProductName(product.getProductName().trim());
        existingProduct.setProductPrice(product.getProductPrice());
        existingProduct.setProductQuantity(product.getProductQuantity());

        Product updatedProduct = productRepo.save(existingProduct);

        return ResponseEntity.ok(updatedProduct);
    }

    // Delete product
    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {

        if (!productRepo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Product not found"));
        }

        productRepo.deleteById(id);

        return ResponseEntity.ok(
                Map.of("message", "Product deleted successfully"));
    }
}
