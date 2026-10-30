package rr.seafoods.in.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import rr.seafoods.in.entity.Stock;
@Repository 
public interface StockRepo extends JpaRepository<Stock, Long>{
    
}
