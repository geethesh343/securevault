package com.lifevault.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Encrypted Document Entity stored in Amazon S3 with client-side metadata
 */
public class DocumentRecord implements Serializable {
    private String id;
    private String title;
    private String category; // "Identity", "Insurance", "Education", "Warranties", "Bills", "Medical", "Vehicle", "General"
    private String fileName;
    private String fileType;
    private String fileSize;
    private String s3Key;
    private String s3Url;
    private String presignedUrlExpiresAt;
    private String documentNumber;
    private String issuingAuthority;
    private String issueDate;
    private String expiryDate;
    private String renewalDate;
    private Double amount;
    private String ocrSummary;
    private List<String> tags = new ArrayList<>();
    private List<String> sharedWithFamilyIds = new ArrayList<>();
    private boolean isFavorite;
    private String createdAt;
    private String updatedAt;
    private String verifiedStatus; // "Verified", "Pending", "Needs Review"

    public DocumentRecord() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getFileSize() { return fileSize; }
    public void setFileSize(String fileSize) { this.fileSize = fileSize; }

    public String getS3Key() { return s3Key; }
    public void setS3Key(String s3Key) { this.s3Key = s3Key; }

    public String getS3Url() { return s3Url; }
    public void setS3Url(String s3Url) { this.s3Url = s3Url; }

    public String getPresignedUrlExpiresAt() { return presignedUrlExpiresAt; }
    public void setPresignedUrlExpiresAt(String presignedUrlExpiresAt) { this.presignedUrlExpiresAt = presignedUrlExpiresAt; }

    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

    public String getIssuingAuthority() { return issuingAuthority; }
    public void setIssuingAuthority(String issuingAuthority) { this.issuingAuthority = issuingAuthority; }

    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }

    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public String getRenewalDate() { return renewalDate; }
    public void setRenewalDate(String renewalDate) { this.renewalDate = renewalDate; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getOcrSummary() { return ocrSummary; }
    public void setOcrSummary(String ocrSummary) { this.ocrSummary = ocrSummary; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public List<String> getSharedWithFamilyIds() { return sharedWithFamilyIds; }
    public void setSharedWithFamilyIds(List<String> sharedWithFamilyIds) { this.sharedWithFamilyIds = sharedWithFamilyIds; }

    public boolean isFavorite() { return isFavorite; }
    public void setFavorite(boolean favorite) { isFavorite = favorite; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public String getVerifiedStatus() { return verifiedStatus; }
    public void setVerifiedStatus(String verifiedStatus) { this.verifiedStatus = verifiedStatus; }
}
