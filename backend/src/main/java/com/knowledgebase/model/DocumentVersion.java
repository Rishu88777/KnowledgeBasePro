package com.knowledgebase.model;

import java.time.LocalDateTime;

public class DocumentVersion {
    private String id;
    private String content;
    private String title;
    private LocalDateTime createdAt;
    private String changeDescription;

    public DocumentVersion() {
        this.createdAt = LocalDateTime.now();
    }

    public DocumentVersion(String content, String title, String changeDescription) {
        this();
        this.content = content;
        this.title = title;
        this.changeDescription = changeDescription;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getChangeDescription() { return changeDescription; }
    public void setChangeDescription(String changeDescription) { this.changeDescription = changeDescription; }
}