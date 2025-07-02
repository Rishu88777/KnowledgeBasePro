package com.knowledgebase.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.knowledgebase.model.DocumentVersion;
import com.knowledgebase.model.KnowledgeDocument;
import com.knowledgebase.repository.DocumentRepository;

@Service
public class DocumentService {
    
    @Autowired
    private DocumentRepository documentRepository;

    public List<KnowledgeDocument> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Optional<KnowledgeDocument> getDocumentById(String id) {
        return documentRepository.findById(id);
    }

    public List<KnowledgeDocument> getDocumentsByAuthor(String authorId) {
        return documentRepository.findAll();
    }

    public List<KnowledgeDocument> getPublicDocuments() {
        return documentRepository.findByIsPublicTrue();
    }

    public List<KnowledgeDocument> searchDocuments(String searchTerm) {
        return documentRepository.findByTitleOrContentContainingIgnoreCase(searchTerm);
    }

    public KnowledgeDocument createDocument(KnowledgeDocument document) {
        // Create initial version
        DocumentVersion initialVersion = new DocumentVersion(
            document.getContent(),
            document.getTitle(),
            "Initial version"
        );
        initialVersion.setId(UUID.randomUUID().toString());
        document.getVersions().add(initialVersion);
        return documentRepository.save(document);
    }

    public KnowledgeDocument updateDocument(String id, String title, String content, String changeDescription) {
        Optional<KnowledgeDocument> optionalDoc = documentRepository.findById(id);
        if (optionalDoc.isPresent()) {
            KnowledgeDocument document = optionalDoc.get();
            document.setTitle(title);
            document.setContent(content);
            document.setUpdatedAt(LocalDateTime.now());
            // Create new version
            DocumentVersion newVersion = new DocumentVersion(
                content,
                title,
                changeDescription != null ? changeDescription : "Document updated"
            );
            newVersion.setId(UUID.randomUUID().toString());
            document.getVersions().add(newVersion);
            return documentRepository.save(document);
        }
        throw new RuntimeException("Document not found");
    }

    public void deleteDocument(String id) {
        Optional<KnowledgeDocument> optionalDoc = documentRepository.findById(id);
        if (optionalDoc.isPresent()) {
            documentRepository.deleteById(id);
        } else {
            throw new RuntimeException("Document not found");
        }
    }
}