package com.knowledgebase.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.knowledgebase.dto.DocumentRequest;
import com.knowledgebase.model.KnowledgeDocument;
import com.knowledgebase.service.DocumentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:5175")
public class DocumentController {
    
    @Autowired
    private DocumentService documentService;

    @GetMapping
    public List<KnowledgeDocument> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<KnowledgeDocument> getDocumentById(@PathVariable String id) {
        Optional<KnowledgeDocument> document = documentService.getDocumentById(id);
        return document.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/author/{authorId}")
    public List<KnowledgeDocument> getDocumentsByAuthor(@PathVariable String authorId) {
        return documentService.getDocumentsByAuthor(authorId);
    }

    @GetMapping("/public")
    public List<KnowledgeDocument> getPublicDocuments() {
        return documentService.getPublicDocuments();
    }

    @GetMapping("/search")
    public List<KnowledgeDocument> searchDocuments(@RequestParam String q) {
        return documentService.searchDocuments(q);
    }

    @PostMapping
    public ResponseEntity<KnowledgeDocument> createDocument(@Valid @RequestBody DocumentRequest request) {
        KnowledgeDocument document = new KnowledgeDocument(
            request.getTitle(),
            request.getContent(),
            request.isPublic()
        );
        KnowledgeDocument createdDocument = documentService.createDocument(document);
        return ResponseEntity.ok(createdDocument);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KnowledgeDocument> updateDocument(
            @PathVariable String id,
            @Valid @RequestBody DocumentRequest request) {
        try {
            KnowledgeDocument updatedDocument = documentService.updateDocument(
                id,
                request.getTitle(),
                request.getContent(),
                request.getChangeDescription()
            );
            return ResponseEntity.ok(updatedDocument);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable String id) {
        try {
            documentService.deleteDocument(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}