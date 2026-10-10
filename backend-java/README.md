# LifeVault AI - Enterprise Java 21 & Spring Boot 3 Backend

Complete production-grade Java implementation for LifeVault AI personal digital wallet.

## Architecture Overview

- **Java Version**: Java 21 LTS
- **Framework**: Spring Boot 3.2.3
- **Security Engine**: Spring Security 6 with Google OAuth2 PKCE & JWT HMAC-SHA256
- **Identity Provider**: Google Identity Services (GIS) / OpenID Connect
- **Storage Layer**: Amazon S3 (AES-256 Server-Side Encryption)
- **Database Model**: JPA/Hibernate with Postgres/H2

## Package Structure

```
backend-java/
├── pom.xml                                   # Maven build configuration
├── src/main/resources/
│   └── application.yml                       # Spring Boot configuration
└── src/main/java/com/lifevault/
    ├── LifeVaultApplication.java             # Main application entry point
    ├── config/
    │   ├── SecurityConfig.java               # Spring Security 6 & OAuth2 Filter Chain
    │   └── CorsConfig.java                   # Cross-Origin Resource Sharing
    ├── security/
    │   ├── GoogleTokenVerifierService.java   # Google ID Token cryptographic verifier
    │   ├── JwtTokenProvider.java             # HMAC-SHA256 token generator & validator
    │   └── JwtAuthenticationFilter.java      # OncePerRequestFilter for Bearer tokens
    ├── model/
    │   ├── User.java                         # Google user identity & 2FA clearance
    │   ├── DocumentRecord.java               # Encrypted document entity
    │   ├── SubscriptionRecord.java           # Recurring service subscription
    │   ├── BillRecord.java                   # Bill & invoice entity
    │   ├── FamilyMember.java                 # RBAC family member access
    │   └── FinancialHealthMetrics.java       # Health score & burn analytics
    ├── dto/
    │   ├── GoogleAuthRequest.java            # Google login & 2FA DTO
    │   └── AuthResponse.java                 # Signed session response
    ├── service/
    │   └── VaultService.java                 # Business logic, search & audit engine
    └── controller/
        ├── AuthController.java               # /api/auth/google/verify & /api/auth/2fa/verify
        ├── DocumentController.java           # /api/vault/documents CRUD
        ├── SubscriptionController.java       # /api/vault/subscriptions CRUD
        ├── BillController.java               # /api/vault/bills CRUD
        └── HealthReportController.java       # /api/vault/analytics & search
```

## How to Build & Run

### Prerequisites
- JDK 21 installed (`java -version`)
- Apache Maven 3.9+ (`mvn -version`)

### Build
```bash
cd backend-java
mvn clean package
```

### Run
```bash
java -jar target/lifevault-backend-1.0.0.jar
```
Server starts on `http://localhost:8080`.

## Google Authentication Flow in Java

1. **Client Request**: Client sends Google email or Google ID token (`idToken`) to `POST /api/auth/google/verify`.
2. **Google Public Key Verification**: `GoogleTokenVerifierService` verifies the digital signature against Google's public certificates (`https://www.googleapis.com/oauth2/v3/certs`).
3. **2-Step Verification**: If 2FA is requested, user verifies the 6-digit code via `POST /api/auth/2fa/verify`.
4. **JWT Issuance**: `JwtTokenProvider` issues a 256-bit HMAC signed session token with 24-hour expiration.
5. **Role Clearance**: Requests to `/api/vault/**` are authenticated via `JwtAuthenticationFilter` with `ROLE_OWNER` or `ROLE_FAMILY_MEMBER`.
