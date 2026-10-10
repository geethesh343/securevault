package com.lifevault.model;

import java.io.Serializable;
import java.time.Instant;

/**
 * User Entity representing a Google-authenticated Vault user
 */
public class User implements Serializable {
    private String id;
    private String name;
    private String email;
    private String avatar;
    private String googleSubId;
    private boolean masterUnlocked;
    private double storageUsedMb;
    private double storageLimitMb;
    private String currencyPreference;
    private String role; // "owner" or "family_member"
    private String accessLevel; // "Owner", "Full Access", "View Only"
    private String sessionToken;
    private String tokenExpiresAt;
    private boolean twoFactorEnabled;
    private String securityLevel;
    private String authProvider;
    private boolean verifiedEmail;
    private Instant createdAt;

    public User() {
        this.createdAt = Instant.now();
        this.verifiedEmail = true;
        this.twoFactorEnabled = true;
        this.securityLevel = "High (2FA Enforced)";
        this.authProvider = "google";
    }

    public User(String id, String name, String email, String avatar, String googleSubId, String role) {
        this();
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatar = avatar;
        this.googleSubId = googleSubId;
        this.role = role;
        this.accessLevel = "owner".equalsIgnoreCase(role) ? "Owner" : "Full Access";
        this.storageLimitMb = 5120.0;
        this.storageUsedMb = 428.5;
        this.currencyPreference = "USD";
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getGoogleSubId() { return googleSubId; }
    public void setGoogleSubId(String googleSubId) { this.googleSubId = googleSubId; }

    public boolean isMasterUnlocked() { return masterUnlocked; }
    public void setMasterUnlocked(boolean masterUnlocked) { this.masterUnlocked = masterUnlocked; }

    public double getStorageUsedMb() { return storageUsedMb; }
    public void setStorageUsedMb(double storageUsedMb) { this.storageUsedMb = storageUsedMb; }

    public double getStorageLimitMb() { return storageLimitMb; }
    public void setStorageLimitMb(double storageLimitMb) { this.storageLimitMb = storageLimitMb; }

    public String getCurrencyPreference() { return currencyPreference; }
    public void setCurrencyPreference(String currencyPreference) { this.currencyPreference = currencyPreference; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAccessLevel() { return accessLevel; }
    public void setAccessLevel(String accessLevel) { this.accessLevel = accessLevel; }

    public String getSessionToken() { return sessionToken; }
    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }

    public String getTokenExpiresAt() { return tokenExpiresAt; }
    public void setTokenExpiresAt(String tokenExpiresAt) { this.tokenExpiresAt = tokenExpiresAt; }

    public boolean isTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }

    public String getSecurityLevel() { return securityLevel; }
    public void setSecurityLevel(String securityLevel) { this.securityLevel = securityLevel; }

    public String getAuthProvider() { return authProvider; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }

    public boolean isVerifiedEmail() { return verifiedEmail; }
    public void setVerifiedEmail(boolean verifiedEmail) { this.verifiedEmail = verifiedEmail; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
