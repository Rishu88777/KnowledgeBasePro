package com.example.knowledgebase.dto;

public class CreateDocumentRequest {
    private String title;
    private String content;
    private boolean isPublic;
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
} 