package buzzboard.backend.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import buzzboard.backend.config.MailConfig;

@SpringBootTest
public class EmailServiceTests {
    @Autowired
    private MailConfig mailConfig;

    @Autowired
    private EmailService emailService;

    @Test
    void emailServiceInitializesSessionsProperly() {
        // Verify configuration loaded
        assertDoesNotThrow(() -> mailConfig.getEmails());
        assertNotEquals(0, mailConfig.getEmails().size());

        assertNotEquals(0, emailService.fetchAllEmails().size());
    }
}
