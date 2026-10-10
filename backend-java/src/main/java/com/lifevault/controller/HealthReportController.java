package com.lifevault.controller;

import com.lifevault.model.FinancialHealthMetrics;
import com.lifevault.service.VaultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for Financial & Task Health Reports and Search
 */
@RestController
@RequestMapping("/api/vault/analytics")
public class HealthReportController {

    private final VaultService vaultService;

    public HealthReportController(VaultService vaultService) {
        this.vaultService = vaultService;
    }

    @GetMapping("/health-report")
    public ResponseEntity<FinancialHealthMetrics> getHealthReport() {
        return ResponseEntity.ok(vaultService.calculateHealthReport());
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchVault(@RequestParam("q") String query) {
        return ResponseEntity.ok(vaultService.smartSearch(query));
    }
}
