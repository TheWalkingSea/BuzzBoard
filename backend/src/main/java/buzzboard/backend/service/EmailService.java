package buzzboard.backend.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.springframework.stereotype.Service;

import buzzboard.backend.config.MailConfig;
import jakarta.mail.FetchProfile;
import jakarta.mail.Folder;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.Store;

@Service
public class EmailService {

    private final MailConfig mailConfig;
    private final Map<String, Session> sessionMap = new HashMap<>();

    public EmailService(MailConfig mailConfig) {
        this.mailConfig = mailConfig;
        initializeMailboxes();
    }

    /**
     * Initialize a reusable Session for each mailbox.
     */
    private void initializeMailboxes() {
        for (MailConfig.EmailConfig config : mailConfig.getEmails()) {
            Properties props = new Properties();
            props.put("mail.store.protocol", "imap");
            props.put("mail.host", config.getHost());
            props.put("mail.port", "993");
            props.put("mail.imap.ssl.enable", "true");
            props.put("mail.debug", "true");

            Session session = Session.getInstance(props);
            sessionMap.put(config.getUsername(), session);
        }
    }

    /**
     * Fetch the 10 most recent emails for each configured account.
     */
    public Map<String, List<Message>> fetchAllEmails() {
        Map<String, List<Message>> allEmails = new HashMap<>();

        for (MailConfig.EmailConfig config : mailConfig.getEmails()) {
            try {
                List<Message> emails = fetchAccountInbox(config, 10);
                allEmails.put(config.getUsername(), emails);
            } catch (Exception e) {
                System.err.println("Failed to fetch emails for " + config.getUsername() + ": " + e.getMessage());
                System.exit(-1);
            }
        }

        return allEmails;
    }

    /**
     * Connect to an IMAP inbox and grab the 10 newest emails.
     */
    private List<Message> fetchAccountInbox(MailConfig.EmailConfig config, Integer count) throws Exception {
        Session session = sessionMap.get(config.getUsername());
        if (session == null) {
            throw new IllegalStateException("Session not initialized for " + config.getUsername());
        }

        List<Message> result;
        try (Store store = session.getStore("imap")) {
            try {
                store.connect(config.getHost(), config.getUsername(), config.getPassword());
            } catch (MessagingException e) {
                System.err.println("Failed to conenct to mail server with email: " + config.getUsername());
                System.exit(-1);
            }
            
            Folder folder = store.getFolder(config.getMailbox());
            if (folder == null) {
                System.err.println("Invalid folder.");
                System.exit(-1);
            }
            folder.open(Folder.READ_ONLY);

            int totalMessages = folder.getMessageCount();

            if (totalMessages == 0) {
                System.err.println("Empty folder");
                store.close();
                System.exit(-1);
            }

            int start = Math.max(1, totalMessages - (count + 1));
            Message[] messages = folder.getMessages(start, totalMessages);

            FetchProfile fp = new FetchProfile();
            fp.add(FetchProfile.Item.ENVELOPE);

            folder.fetch(messages, fp);

            result = Arrays.asList(messages);

            folder.close(false);
        }

        return result;
    }
}
