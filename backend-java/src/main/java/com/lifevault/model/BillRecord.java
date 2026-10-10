package com.lifevault.model;

import java.io.Serializable;

/**
 * Bill & Invoice Record Entity
 */
public class BillRecord implements Serializable {
    private String id;
    private String title;
    private String biller;
    private String category;
    private double amount;
    private String currency;
    private String dueDate;
    private String status; // "Pending", "Paid", "Overdue"
    private boolean recurring;
    private String receiptDocId;
    private String paidAt;
    private String notes;

    public BillRecord() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBiller() { return biller; }
    public void setBiller(String biller) { this.biller = biller; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isRecurring() { return recurring; }
    public void setRecurring(boolean recurring) { this.recurring = recurring; }

    public String getReceiptDocId() { return receiptDocId; }
    public void setReceiptDocId(String receiptDocId) { this.receiptDocId = receiptDocId; }

    public String getPaidAt() { return paidAt; }
    public void setPaidAt(String paidAt) { this.paidAt = paidAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
