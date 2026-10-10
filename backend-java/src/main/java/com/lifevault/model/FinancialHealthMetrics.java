package com.lifevault.model;

import java.io.Serializable;

/**
 * Health & Task Analytics Calculation Results
 */
public class FinancialHealthMetrics implements Serializable {
    private int overallScore; // 0 - 100
    private String grade; // "A+", "A", "B", etc.
    private int financialScore;
    private int taskScore;
    private int complianceScore;
    private double totalMonthlyCommitment;
    private double projectedAnnualCommitment;
    private double pendingBillsTotal;
    private int overdueBillsCount;
    private int upcomingRenewals30dCount;

    public FinancialHealthMetrics() {}

    // Getters and Setters
    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public int getFinancialScore() { return financialScore; }
    public void setFinancialScore(int financialScore) { this.financialScore = financialScore; }

    public int getTaskScore() { return taskScore; }
    public void setTaskScore(int taskScore) { this.taskScore = taskScore; }

    public int getComplianceScore() { return complianceScore; }
    public void setComplianceScore(int complianceScore) { this.complianceScore = complianceScore; }

    public double getTotalMonthlyCommitment() { return totalMonthlyCommitment; }
    public void setTotalMonthlyCommitment(double totalMonthlyCommitment) { this.totalMonthlyCommitment = totalMonthlyCommitment; }

    public double getProjectedAnnualCommitment() { return projectedAnnualCommitment; }
    public void setProjectedAnnualCommitment(double projectedAnnualCommitment) { this.projectedAnnualCommitment = projectedAnnualCommitment; }

    public double getPendingBillsTotal() { return pendingBillsTotal; }
    public void setPendingBillsTotal(double pendingBillsTotal) { this.pendingBillsTotal = pendingBillsTotal; }

    public int getOverdueBillsCount() { return overdueBillsCount; }
    public void setOverdueBillsCount(int overdueBillsCount) { this.overdueBillsCount = overdueBillsCount; }

    public int getUpcomingRenewals30dCount() { return upcomingRenewals30dCount; }
    public void setUpcomingRenewals30dCount(int upcomingRenewals30dCount) { this.upcomingRenewals30dCount = upcomingRenewals30dCount; }
}
