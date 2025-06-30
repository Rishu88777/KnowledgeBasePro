package com.example.knowledgebase.service;

import com.example.knowledgebase.model.Document;
import com.example.knowledgebase.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DocumentService {
    @Autowired
    private DocumentRepository documentRepository;

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Document getDocumentById(String id) {
        return documentRepository.findById(id).orElse(null);
    }

    public Document saveDocument(Document doc) {
        return documentRepository.save(doc);
    }

    public void deleteDocument(String id) {
        documentRepository.deleteById(id);
    }
} 