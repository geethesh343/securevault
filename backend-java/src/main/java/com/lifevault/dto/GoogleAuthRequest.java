package com.lifevault.dto;

import java.io.Serializable;

/**
 * Request payload for Google Authentication
 */
public class GoogleAuthRequest implements Serializable {
    private String email;
    private String name;
    private String idToken;
    private String twoFactorCode;
    private String role; // "owner" or "family_member"

    public GoogleAuthRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIdToken() { return idToken; }
    public void setIdToken(String idToken) { this.idToken = idToken; }

    public String getTwoFactorCode() { return twoFactorCode; }
    public void setTwoFactorCode(String twoFactorCode) { this.twoFactorCode = twoFactorCode; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
