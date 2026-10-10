package com.lifevault.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Family Member Entity with RBAC permissions
 */
public class FamilyMember implements Serializable {
    private String id;
    private String name;
    private String relationship; // "Spouse", "Parent", "Child", "Sibling", "Guardian", "Other"
    private String email;
    private String avatarUrl;
    private String accessLevel; // "View Only", "Download", "Full Access"
    private List<String> accessibleDocumentIds = new ArrayList<>();
    private String status; // "Active", "Pending Invitation"
    private String joinedDate;
    private String phone;

    public FamilyMember() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getAccessLevel() { return accessLevel; }
    public void setAccessLevel(String accessLevel) { this.accessLevel = accessLevel; }

    public List<String> getAccessibleDocumentIds() { return accessibleDocumentIds; }
    public void setAccessibleDocumentIds(List<String> accessibleDocumentIds) { this.accessibleDocumentIds = accessibleDocumentIds; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getJoinedDate() { return joinedDate; }
    public void setJoinedDate(String joinedDate) { this.joinedDate = joinedDate; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
