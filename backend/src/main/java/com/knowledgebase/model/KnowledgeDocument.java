package com.knowledgebase.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "documents")
public class KnowledgeDocument {
    @Id
    private String id;
    
    @TextIndexed
    private String title;
    
    @TextIndexed
    private String content;
    
    private boolean isPublic;
    private List<String> mentions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<DocumentVersion> versions;

    public KnowledgeDocument() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.mentions = new ArrayList<>();
        this.versions = new ArrayList<>();
    }

    public KnowledgeDocument(String title, String content, boolean isPublic) {
        this();
        this.title = title;
        this.content = content;
        this.isPublic = isPublic;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }

    public List<String> getMentions() { return mentions; }
    public void setMentions(List<String> mentions) { this.mentions = mentions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<DocumentVersion> getVersions() { return versions; }
    public void setVersions(List<DocumentVersion> versions) { this.versions = versions; }
}