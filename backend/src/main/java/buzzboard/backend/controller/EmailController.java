package buzzboard.backend.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import buzzboard.backend.service.EmailService;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/emails")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    // Simple DTO for clean JSON output
    public static class EmailDTO {
        public String from;
        public String subject;
        public long receivedDate;
        public String account;

        public EmailDTO(String from, String subject, long receivedDate, String account) {
            this.from = from;
            this.subject = subject;
            this.receivedDate = receivedDate;
            this.account = account;
        }
    }

    @GetMapping
    public ResponseEntity<List<EmailDTO>> getAllEmails() {
        Map<String, List<Message>> emailsByAccount = emailService.fetchAllEmails();
        List<EmailDTO> allEmails = new ArrayList<>();

        for (Map.Entry<String, List<Message>> entry : emailsByAccount.entrySet()) {
            String account = entry.getKey();

            for (Message msg : entry.getValue()) {
                try {
                    String from = (msg.getFrom() != null && msg.getFrom().length > 0)
                            ? msg.getFrom()[0].toString()
                            : "Anonymous User";
                    String subject = msg.getSubject();
                    Date date = msg.getReceivedDate();

                    allEmails.add(new EmailDTO(from, subject, date.getTime(), account));
                } catch (MessagingException e) {
                    System.err.println("Failed to parse message from " + account + ": " + e.getMessage());
                }
            }
        }

        // Sort newest first
        allEmails.sort((a, b) -> Long.compare(b.receivedDate, a.receivedDate));


        return ResponseEntity.ok(allEmails);
    }
}
