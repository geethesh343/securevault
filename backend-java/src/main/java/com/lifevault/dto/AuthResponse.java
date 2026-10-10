package com.lifevault.dto;

import com.lifevault.model.User;
import java.io.Serializable;
import java.util.Map;

/**
 * Response payload returned after successful Google Authentication
 */
public class AuthResponse implements Serializable {
    private boolean success;
    private String message;
    private String token;
    private String tokenType;
    private String issuedAt;
    private String expiresAt;
    private String encryption;
    private String securityLevel;
    private User user;
    private Map<String, Object> sessionClaims;

    public AuthResponse() {
        this.tokenType = "Bearer";
        this.encryption = "TLS 1.3 / AES-256-GCM";
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public String getIssuedAt() { return issuedAt; }
    public void setIssuedAt(String issuedAt) { this.issuedAt = issuedAt; }

    public String getExpiresAt() { return expiresAt; }
    public void setExpiresAt(String expiresAt) { this.expiresAt = expiresAt; }

    public String getEncryption() { return encryption; }
    public void setEncryption(String encryption) { this.encryption = encryption; }

    public String getSecurityLevel() { return securityLevel; }
    public void setSecurityLevel(String securityLevel) { this.securityLevel = securityLevel; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Map<String, Object> getSessionClaims() { return sessionClaims; }
    public void setSessionClaims(Map<String, Object> sessionClaims) { this.sessionClaims = sessionClaims; }
}
