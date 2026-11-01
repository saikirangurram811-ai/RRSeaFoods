package rr.seafoods.in.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import rr.seafoods.in.entity.Product;
import java.util.List;
import java.util.Optional;


@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {

    List<Product> findByStatus(String status);

    boolean existsByProductNameIgnoreCaseAndStatus(String productName, String status);

    Optional<Product> findByProductNameIgnoreCaseAndStatus(String productName, String status);
}
