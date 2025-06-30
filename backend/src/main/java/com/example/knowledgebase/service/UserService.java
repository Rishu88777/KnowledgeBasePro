package com.example.knowledgebase.service;

import com.example.knowledgebase.model.User;
import com.example.knowledgebase.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User register(String name, String email, String password) {
        String hash = BCrypt.hashpw(password, BCrypt.gensalt());
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(hash);
        user.setCreatedAt(new Date());
        return userRepository.save(user);
    }

    public Optional<User> authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && BCrypt.checkpw(password, userOpt.get().getPasswordHash())) {
            return userOpt;
        }
        return Optional.empty();
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
} 