package com.example.knowledgebase.model;

import java.util.Date;

public class DocumentPermission {
    private String userId;
    private String permission; // "view" or "edit"
    private Date grantedAt;

    // Getters and setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getPermission() { return permission; }
    public void setPermission(String permission) { this.permission = permission; }
    public Date getGrantedAt() { return grantedAt; }
    public void setGrantedAt(Date grantedAt) { this.grantedAt = grantedAt; }
} 