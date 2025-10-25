package buzzboard.backend.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "emails")
public class MailConfig {

    private List<EmailConfig> emails = new ArrayList<>();

    public List<EmailConfig> getEmails() {
        return emails;
    }

    public void setEmails(List<EmailConfig> emails) {
        this.emails = emails;
    }

    public static class EmailConfig {
        private String name;
        private String host;
        private int port;
        private boolean useSSL;
        private String username;
        private String password;
        private String mailbox;

        // getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getHost() { return host; }
        public void setHost(String host) { this.host = host; }
        public int getPort() { return port; }
        public void setPort(int port) { this.port = port; }
        public boolean isUseSSL() { return useSSL; }
        public void setUseSSL(boolean useSSL) { this.useSSL = useSSL; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getMailbox() { return mailbox; }
        public void setMailbox(String mailbox) { this.mailbox = mailbox; }
    }
}
