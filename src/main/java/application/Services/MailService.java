package application.Services;

import com.sun.mail.smtp.SMTPTransport;
import org.springframework.stereotype.Service;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.Properties;

@Service("mailService")
public class MailService {
    private static final String SMTP_SERVER = "smtp.gmail.com";
    private static final String USERNAME = "lightbluelabnoreply@gmail.com";
    private static final String PASSWORD = "qazwsxedC1@";

    private static final String EMAIL_FROM = "From@gmail.com";

    private static final String NOTIFICATION_EMAIL_SUBJECT = "Notification";
    private static final String NOTIFICATION_EMAIL_TEXT = "New announcement has been posted in class ";
    private static final String VERIFICATION_EMAIL_SUBJECT = "Verify your email";
    private static final String VERIFICATION_EMAIL_TEXT = "Please confirm your email address by clicking on the link below.<br/>";
    private static final String RESETPASSWORD_EMAIL_SUBJECT = "Reset password";
    private static final String RESETPASSWORD_EMAIL_TEXT = "Here is the code and link for reset password. <br/> Please click below link to reset your password.<br/>";

    private static final String VERIFICATION_API = "http://lightbluelabmaker.herokuapp.com/verify-email?userId=";
    private static final String RESETPASSWORD_API = "http://lightbluelabmaker.herokuapp.com/resetpassword";

    public void sendVerificationEmail(String userId, String email) {
        String link = "<a href='" + VERIFICATION_API + userId + "'>link</a>";
        sendEmail(VERIFICATION_EMAIL_SUBJECT, VERIFICATION_EMAIL_TEXT + link, email);
    }

    public void sendNotificationEmail(String className, String emails) {
        sendEmail(NOTIFICATION_EMAIL_SUBJECT, NOTIFICATION_EMAIL_TEXT + className, emails);
    }

    public void sendResetPasswordEmail(String email, String userId) {
        String link = "<a href='" + RESETPASSWORD_API +"'>link</a><br/>";
        String code = "Code : " + userId;
        sendEmail(RESETPASSWORD_EMAIL_SUBJECT, RESETPASSWORD_EMAIL_TEXT + link + code, email);
    }

    private void sendEmail(String subject, String text, String recipients) {
        Properties prop = System.getProperties();
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(prop, null);
        Message msg = new MimeMessage(session);

        try {
            msg.setFrom(new InternetAddress(EMAIL_FROM));

            msg.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(recipients, false));

            msg.setSubject(subject);
            msg.setDataHandler(new DataHandler(new HTMLDataSource(text)));

            SMTPTransport t = (SMTPTransport) session.getTransport("smtp");

            // connect
            t.connect(SMTP_SERVER, USERNAME, PASSWORD);

            // send
            t.sendMessage(msg, msg.getAllRecipients());

            //System.out.println("Response: " + t.getLastServerResponse());

            t.close();
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    static class HTMLDataSource implements DataSource {

        private String html;

        public HTMLDataSource(String htmlString) {
            html = htmlString;
        }

        @Override
        public InputStream getInputStream() throws IOException {
            if (html == null) throw new IOException("html message is null!");
            return new ByteArrayInputStream(html.getBytes());
        }

        @Override
        public OutputStream getOutputStream() throws IOException {
            throw new IOException("This DataHandler cannot write HTML");
        }

        @Override
        public String getContentType() {
            return "text/html";
        }

        @Override
        public String getName() {
            return "HTMLDataSource";
        }
    }
}
