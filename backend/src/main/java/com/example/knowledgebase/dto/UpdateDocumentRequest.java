package com.example.knowledgebase.dto;

public class UpdateDocumentRequest {
    private String title;
    private String content;
    private String changeDescription;
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getChangeDescription() { return changeDescription; }
    public void setChangeDescription(String changeDescription) { this.changeDescription = changeDescription; }
} 