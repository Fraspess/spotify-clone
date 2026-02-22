package org.example.utils.smtp;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailMessage {
    private String subject;
    private String body;
    private String to;

}
