package com.lifevault.controller;

import com.lifevault.model.DocumentRecord;
import com.lifevault.service.VaultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Vault Documents
 */
@RestController
@RequestMapping("/api/vault/documents")
public class DocumentController {

    private final VaultService vaultService;

    public DocumentController(VaultService vaultService) {
        this.vaultService = vaultService;
    }

    @GetMapping
    public ResponseEntity<List<DocumentRecord>> getAllDocuments() {
        return ResponseEntity.ok(vaultService.getAllDocuments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocument(@PathVariable String id) {
        return vaultService.getDocumentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DocumentRecord> createDocument(@RequestBody DocumentRecord document) {
        DocumentRecord saved = vaultService.saveDocument(document);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentRecord> updateDocument(@PathVariable String id, @RequestBody DocumentRecord document) {
        document.setId(id);
        DocumentRecord saved = vaultService.saveDocument(document);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable String id) {
        boolean deleted = vaultService.deleteDocument(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Document purged from S3 and database"));
        }
        return ResponseEntity.notFound().build();
    }
}
