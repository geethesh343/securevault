package com.lifevault.controller;

import com.lifevault.model.SubscriptionRecord;
import com.lifevault.service.VaultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Subscriptions
 */
@RestController
@RequestMapping("/api/vault/subscriptions")
public class SubscriptionController {

    private final VaultService vaultService;

    public SubscriptionController(VaultService vaultService) {
        this.vaultService = vaultService;
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionRecord>> getAllSubscriptions() {
        return ResponseEntity.ok(vaultService.getAllSubscriptions());
    }

    @PostMapping
    public ResponseEntity<SubscriptionRecord> createSubscription(@RequestBody SubscriptionRecord subscription) {
        return ResponseEntity.ok(vaultService.saveSubscription(subscription));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubscription(@PathVariable String id) {
        boolean deleted = vaultService.deleteSubscription(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Subscription cancelled and archived"));
        }
        return ResponseEntity.notFound().build();
    }
}
