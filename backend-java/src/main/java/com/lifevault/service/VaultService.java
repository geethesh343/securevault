package com.lifevault.service;

import com.lifevault.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Vault Service managing Documents, Subscriptions, Bills, and Health Analytics
 */
@Service
public class VaultService {

    private final Map<String, DocumentRecord> documents = new ConcurrentHashMap<>();
    private final Map<String, SubscriptionRecord> subscriptions = new ConcurrentHashMap<>();
    private final Map<String, BillRecord> bills = new ConcurrentHashMap<>();
    private final Map<String, FamilyMember> familyMembers = new ConcurrentHashMap<>();

    public VaultService() {
        seedInitialData();
    }

    private void seedInitialData() {
        // Seed default Aadhaar card
        DocumentRecord doc1 = new DocumentRecord();
        doc1.setId("doc_aadhaar_01");
        doc1.setTitle("Aadhaar Biometric Identity Card");
        doc1.setCategory("Identity");
        doc1.setFileName("Aadhaar_National_ID.pdf");
        doc1.setFileType("application/pdf");
        doc1.setFileSize("1.4 MB");
        doc1.setS3Key("vault/documents/usr_arvind/identity/Aadhaar_National_ID.pdf");
        doc1.setS3Url("https://lifevault-s3-ap-south-1.amazonaws.com/vault/documents/usr_arvind/identity/Aadhaar_National_ID.pdf");
        doc1.setDocumentNumber("XXXX-XXXX-8921");
        doc1.setIssuingAuthority("Unique Identification Authority of India (UIDAI)");
        doc1.setIssueDate("2021-04-12");
        doc1.setOcrSummary("Official Indian national biometric identification card. Contains verified 12-digit number and UIDAI QR code.");
        doc1.setTags(List.of("Identity", "Government", "UIDAI", "National ID"));
        doc1.setVerifiedStatus("Verified");
        doc1.setFavorite(true);
        documents.put(doc1.getId(), doc1);

        // Seed Health Insurance
        DocumentRecord doc2 = new DocumentRecord();
        doc2.setId("doc_star_health_02");
        doc2.setTitle("Star Health Comprehensive Insurance");
        doc2.setCategory("Insurance");
        doc2.setFileName("Star_Health_Policy_2026.pdf");
        doc2.setFileType("application/pdf");
        doc2.setFileSize("2.8 MB");
        doc2.setS3Key("vault/documents/usr_arvind/insurance/Star_Health_Policy_2026.pdf");
        doc2.setS3Url("https://lifevault-s3-ap-south-1.amazonaws.com/vault/documents/usr_arvind/insurance/Star_Health_Policy_2026.pdf");
        doc2.setDocumentNumber("POL-STAR-892341");
        doc2.setIssuingAuthority("Star Health & Allied Insurance");
        doc2.setIssueDate("2025-11-20");
        doc2.setExpiryDate("2026-11-19");
        doc2.setRenewalDate("2026-11-05");
        doc2.setAmount(450.0);
        doc2.setOcrSummary("Family floater cover for $15,000 / ₹10,00,000 with cashless claim facility across 14,000+ network hospitals.");
        doc2.setTags(List.of("Insurance", "Health", "Medical", "Cashless"));
        doc2.setVerifiedStatus("Verified");
        documents.put(doc2.getId(), doc2);

        // Seed Subscription
        SubscriptionRecord sub1 = new SubscriptionRecord();
        sub1.setId("sub_google_one");
        sub1.setServiceName("Google One 2TB Cloud");
        sub1.setProvider("Google LLC");
        sub1.setCategory("Cloud & AI");
        sub1.setCost(9.99);
        sub1.setCurrency("USD");
        sub1.setBillingCycle("Monthly");
        sub1.setNextRenewalDate("2026-10-28");
        sub1.setAutoRenew(true);
        sub1.setPaymentMethod("Google Pay (Visa •••• 4019)");
        sub1.setColor("#4285F4");
        subscriptions.put(sub1.getId(), sub1);

        // Seed Bill
        BillRecord bill1 = new BillRecord();
        bill1.setId("bill_electricity_01");
        bill1.setTitle("City Electricity Board Bill");
        bill1.setBiller("City Power Distribution");
        bill1.setCategory("Electricity");
        bill1.setAmount(74.50);
        bill1.setCurrency("USD");
        bill1.setDueDate("2026-10-25");
        bill1.setStatus("Pending");
        bill1.setRecurring(true);
        bills.put(bill1.getId(), bill1);
    }

    // Documents
    public List<DocumentRecord> getAllDocuments() {
        return new ArrayList<>(documents.values());
    }

    public Optional<DocumentRecord> getDocumentById(String id) {
        return Optional.ofNullable(documents.get(id));
    }

    public DocumentRecord saveDocument(DocumentRecord doc) {
        if (doc.getId() == null || doc.getId().isBlank()) {
            doc.setId("doc_" + System.currentTimeMillis());
        }
        documents.put(doc.getId(), doc);
        return doc;
    }

    public boolean deleteDocument(String id) {
        return documents.remove(id) != null;
    }

    // Subscriptions
    public List<SubscriptionRecord> getAllSubscriptions() {
        return new ArrayList<>(subscriptions.values());
    }

    public SubscriptionRecord saveSubscription(SubscriptionRecord sub) {
        if (sub.getId() == null || sub.getId().isBlank()) {
            sub.setId("sub_" + System.currentTimeMillis());
        }
        subscriptions.put(sub.getId(), sub);
        return sub;
    }

    public boolean deleteSubscription(String id) {
        return subscriptions.remove(id) != null;
    }

    // Bills
    public List<BillRecord> getAllBills() {
        return new ArrayList<>(bills.values());
    }

    public BillRecord saveBill(BillRecord bill) {
        if (bill.getId() == null || bill.getId().isBlank()) {
            bill.setId("bill_" + System.currentTimeMillis());
        }
        bills.put(bill.getId(), bill);
        return bill;
    }

    public boolean deleteBill(String id) {
        return bills.remove(id) != null;
    }

    // Health Report Computation
    public FinancialHealthMetrics calculateHealthReport() {
        FinancialHealthMetrics metrics = new FinancialHealthMetrics();

        double monthlySubs = subscriptions.values().stream().mapToDouble(SubscriptionRecord::getCost).sum();
        double pendingBills = bills.values().stream()
                .filter(b -> !"Paid".equalsIgnoreCase(b.getStatus()))
                .mapToDouble(BillRecord::getAmount).sum();

        long overdueCount = bills.values().stream()
                .filter(b -> "Overdue".equalsIgnoreCase(b.getStatus()))
                .count();

        metrics.setTotalMonthlyCommitment(monthlySubs + pendingBills);
        metrics.setProjectedAnnualCommitment(monthlySubs * 12 + pendingBills * 12);
        metrics.setPendingBillsTotal(pendingBills);
        metrics.setOverdueBillsCount((int) overdueCount);
        metrics.setUpcomingRenewals30dCount(2);

        int baseScore = 92;
        if (overdueCount > 0) baseScore -= 10;
        metrics.setOverallScore(baseScore);
        metrics.setGrade(baseScore >= 90 ? "A+" : baseScore >= 80 ? "A" : "B");
        metrics.setFinancialScore(88);
        metrics.setTaskScore(94);
        metrics.setComplianceScore(95);

        return metrics;
    }

    // Smart Search Across Vault
    public Map<String, Object> smartSearch(String query) {
        String q = query.toLowerCase();
        List<DocumentRecord> matchedDocs = documents.values().stream()
                .filter(d -> d.getTitle().toLowerCase().contains(q) ||
                             d.getCategory().toLowerCase().contains(q) ||
                             d.getOcrSummary().toLowerCase().contains(q))
                .collect(Collectors.toList());

        List<SubscriptionRecord> matchedSubs = subscriptions.values().stream()
                .filter(s -> s.getServiceName().toLowerCase().contains(q) || s.getCategory().toLowerCase().contains(q))
                .collect(Collectors.toList());

        Map<String, Object> results = new HashMap<>();
        results.put("query", query);
        results.put("documents", matchedDocs);
        results.put("subscriptions", matchedSubs);
        results.put("totalMatches", matchedDocs.size() + matchedSubs.size());
        return results;
    }
}
