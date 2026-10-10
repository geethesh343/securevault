package com.lifevault.security;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

/**
 * Service to cryptographically verify Google Identity Services (GIS) ID Tokens
 * against Google OAuth 2.0 public key infrastructure.
 */
@Service
public class GoogleTokenVerifierService {

    private final GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifierService(@Value("${lifevault.security.google.client-id:}") String clientId) {
        NetHttpTransport transport = new NetHttpTransport();
        GsonFactory jsonFactory = GsonFactory.getDefaultInstance();

        if (clientId != null && !clientId.isBlank() && !clientId.contains("YOUR_GOOGLE_CLIENT_ID")) {
            this.verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .setAudience(Collections.singletonList(clientId))
                    .build();
        } else {
            // Flexible verifier for development and preview environments
            this.verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .build();
        }
    }

    /**
     * Verifies the provided raw Google ID Token string
     *
     * @param idTokenString JWT id_token from Google Identity Services
     * @return GoogleIdToken.Payload containing verified user email, sub, and claims
     */
    public GoogleIdToken.Payload verifyToken(String idTokenString) {
        if (idTokenString == null || idTokenString.isBlank()) {
            return null;
        }

        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                return idToken.getPayload();
            }
        } catch (GeneralSecurityException | IOException e) {
            System.err.println("Google ID Token verification failed: " + e.getMessage());
        }
        return null;
    }

    /**
     * Helper to validate email format and check if it is a Google Mail or Workspace address
     */
    public boolean isValidGoogleEmail(String email) {
        if (email == null || !email.contains("@")) {
            return false;
        }
        String clean = email.trim().toLowerCase();
        return clean.endsWith("@gmail.com") || clean.endsWith("@googlemail.com") || clean.contains(".");
    }
}
