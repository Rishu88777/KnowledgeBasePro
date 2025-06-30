package com.example.knowledgebase.repository;

import com.example.knowledgebase.model.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DocumentRepository extends MongoRepository<Document, String> {
    List<Document> findByAuthorId(String authorId);
} 