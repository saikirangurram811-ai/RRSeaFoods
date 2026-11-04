package rr.seafoods.in.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import rr.seafoods.in.entity.StockIn;
@Repository 
public interface StockInRepo extends JpaRepository<StockIn, Long>{
    
}
