package rr.seafoods.in.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Component
public class JwtUtil {

    @Value("${pr.app.jwtSecret:rrSeafoodsDefaultSecretKey12345678901234567890}")
    private String jwtSecret;

    @Value("${pr.app.jwtExpirationMs:86400000}")
    private long jwtExpirationMs;

    public String generateToken(String username, String role) {
        long now = System.currentTimeMillis();
        long exp = now + jwtExpirationMs;

        String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payloadJson = String.format(
                "{\"sub\":\"%s\",\"role\":\"%s\",\"iat\":%d,\"exp\":%d}",
                escapeJson(username),
                escapeJson(role),
                now / 1000,
                exp / 1000
        );

        String encodedHeader = base64UrlEncode(headerJson.getBytes(StandardCharsets.UTF_8));
        String encodedPayload = base64UrlEncode(payloadJson.getBytes(StandardCharsets.UTF_8));
        String contentToSign = encodedHeader + "." + encodedPayload;

        String signature = sign(contentToSign, jwtSecret);
        return contentToSign + "." + signature;
    }

    private String sign(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
            // Ensure valid key length for HmacSHA256
            byte[] keyBytes = MessageDigest.getInstance("SHA-256").digest(secretBytes);
            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
            mac.init(secretKey);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return base64UrlEncode(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Error signing JWT token", e);
        }
    }

    private String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}

