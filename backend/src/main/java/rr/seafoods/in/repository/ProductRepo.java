package rr.seafoods.in.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import rr.seafoods.in.entity.Product;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
}
