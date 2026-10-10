package com.lifevault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * LifeVault AI Enterprise Backend Application
 * 
 * Provides secure digital life management, Google OAuth2 Identity verification,
 * AES-256 encrypted personal document storage, subscriptions tracking,
 * and automated financial task health analytics in pure Java 21 & Spring Boot 3.
 */
@SpringBootApplication
@EnableScheduling
public class LifeVaultApplication {

    public static void main(String[] args) {
        SpringApplication.run(LifeVaultApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  LifeVault AI Java Backend Initialized Successfully");
        System.out.println("  Security: Google OAuth 2.0 PKCE + JWT HMAC-SHA256");
        System.out.println("  Vault Cipher: AES-256 Server-Side S3 Encryption");
        System.out.println("=================================================");
    }
}
