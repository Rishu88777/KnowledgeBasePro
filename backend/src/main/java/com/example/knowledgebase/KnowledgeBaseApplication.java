package com.example.knowledgebase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.knowledgebase.service.UserService;

@SpringBootApplication
public class KnowledgeBaseApplication {
    public static void main(String[] args) {
        SpringApplication.run(KnowledgeBaseApplication.class, args);
    }

    @Bean
    public CommandLineRunner createDemoUser(@Autowired UserService userService) {
        return args -> {
            String demoEmail = "demo@example.com";
            String demoPassword = "demo1234";
            String demoName = "Demo User";
            if (userService.findByEmail(demoEmail).isEmpty()) {
                userService.register(demoName, demoEmail, demoPassword);
                System.out.println("Demo user created: " + demoEmail + " / " + demoPassword);
            } else {
                System.out.println("Demo user already exists: " + demoEmail);
            }

            // Add second demo user
            String demoEmail2 = "rishushrivastava264@gmail.com";
            String demoPassword2 = "Rishu@88777";
            String demoName2 = "Rishu Shrivastava";
            if (userService.findByEmail(demoEmail2).isEmpty()) {
                userService.register(demoName2, demoEmail2, demoPassword2);
                System.out.println("Demo user created: " + demoEmail2 + " / " + demoPassword2);
            } else {
                System.out.println("Demo user already exists: " + demoEmail2);
            }
        };
    }
} 