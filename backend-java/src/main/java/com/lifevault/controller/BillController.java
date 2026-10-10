package com.lifevault.controller;

import com.lifevault.model.BillRecord;
import com.lifevault.service.VaultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Bills and Invoices
 */
@RestController
@RequestMapping("/api/vault/bills")
public class BillController {

    private final VaultService vaultService;

    public BillController(VaultService vaultService) {
        this.vaultService = vaultService;
    }

    @GetMapping
    public ResponseEntity<List<BillRecord>> getAllBills() {
        return ResponseEntity.ok(vaultService.getAllBills());
    }

    @PostMapping
    public ResponseEntity<BillRecord> createBill(@RequestBody BillRecord bill) {
        return ResponseEntity.ok(vaultService.saveBill(bill));
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<?> markBillPaid(@PathVariable String id) {
        return vaultService.getAllBills().stream()
                .filter(b -> b.getId().equals(id))
                .findFirst()
                .map(bill -> {
                    bill.setStatus("Paid");
                    vaultService.saveBill(bill);
                    return ResponseEntity.ok(bill);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBill(@PathVariable String id) {
        boolean deleted = vaultService.deleteBill(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Bill deleted"));
        }
        return ResponseEntity.notFound().build();
    }
}
