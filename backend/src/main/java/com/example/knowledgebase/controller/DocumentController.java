package com.example.knowledgebase.controller;

import com.example.knowledgebase.dto.*;
import com.example.knowledgebase.model.Document;
import com.example.knowledgebase.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    @Autowired
    private DocumentService documentService;

    @GetMapping
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @GetMapping("/{id}")
    public Document getDocument(@PathVariable String id) {
        return documentService.getDocumentById(id);
    }

    @PostMapping
    public Document createDocument(@RequestBody CreateDocumentRequest req) {
        // Map request to Document, set authorId, etc.
        // Save and return
        Document doc = new Document();
        doc.setTitle(req.getTitle());
        doc.setContent(req.getContent());
        doc.setPublic(req.isPublic());
        // Set other fields as needed
        return documentService.saveDocument(doc);
    }

    @PutMapping("/{id}")
    public Document updateDocument(@PathVariable String id, @RequestBody UpdateDocumentRequest req) {
        Document doc = documentService.getDocumentById(id);
        if (doc != null) {
            doc.setTitle(req.getTitle());
            doc.setContent(req.getContent());
            // Add versioning, changeDescription, etc.
            return documentService.saveDocument(doc);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteDocument(@PathVariable String id) {
        documentService.deleteDocument(id);
    }
} 