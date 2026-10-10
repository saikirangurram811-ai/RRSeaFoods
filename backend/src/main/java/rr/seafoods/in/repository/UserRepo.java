package rr.seafoods.in.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import rr.seafoods.in.entity.User;

public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}