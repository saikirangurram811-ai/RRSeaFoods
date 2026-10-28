package rr.seafoods.in;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "rr.seafoods.in.repository")
@EntityScan(basePackages = "rr.seafoods.in.entity")
public class InApplication {

    public static void main(String[] args) {
        SpringApplication.run(InApplication.class, args);
    }
}