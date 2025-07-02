package com.knowledgebase.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.knowledgebase.model.KnowledgeDocument;

@Repository
public interface DocumentRepository extends MongoRepository<KnowledgeDocument, String> {
    List<KnowledgeDocument> findByIsPublicTrue();
    
    @Query("{ '$or': [ " +
           "{ 'title': { '$regex': ?0, '$options': 'i' } }, " +
           "{ 'content': { '$regex': ?0, '$options': 'i' } } " +
           "] }")
    List<KnowledgeDocument> findByTitleOrContentContainingIgnoreCase(String searchTerm);
}