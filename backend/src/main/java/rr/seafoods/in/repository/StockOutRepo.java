package rr.seafoods.in.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import rr.seafoods.in.entity.StockOut;

@Repository 
public interface StockOutRepo extends JpaRepository<StockOut, Long>{
    
}
