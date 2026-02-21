package org.example.services.smtp;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import org.example.utils.smtp.EmailConfiguration;
import org.example.utils.smtp.EmailMessage;

import java.util.Properties;

public class SmtpService {
    public void sendEmail(EmailMessage message){
        Properties props = new Properties();
        props.put("mail.smtp.auth","true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.smtp.starttls.enable", "false");
        props.put("mail.smtp.host", EmailConfiguration.SMTP_SERVER);
        props.put("mail.smtp.port", String.valueOf(EmailConfiguration.PORT));

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication(){
                return new PasswordAuthentication(
                        EmailConfiguration.USERNAME,
                        EmailConfiguration.PASSWORD
                );
            }

        });
        try{
            Message email = new MimeMessage(session);
            email.setFrom(new InternetAddress(EmailConfiguration.FROM));
            email.setRecipients(Message.RecipientType.TO, InternetAddress.parse(message.getTo()));
            email.setSubject(message.getSubject());

            MimeBodyPart mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setContent(message.getBody(), "text/html;charset=utf-8");

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(mimeBodyPart);

            email.setContent(multipart);

            Transport.send(email);

            System.out.println("Email sent successfully to " + message.getTo());


        }catch (Exception ex){
            System.out.println(ex.getMessage());
        }

    }
}
