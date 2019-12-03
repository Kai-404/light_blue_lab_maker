package application.Models;

import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@Document
@Data
@Getter
public class Announcement {
    @Id
    private String id;
    private String title;
    private String content;
    private Date date;
    private String author;
    private String courseId;

    public Announcement(String title, String content, String author, String courseId) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.courseId = courseId;
        this.date = new Date();
    }
}
