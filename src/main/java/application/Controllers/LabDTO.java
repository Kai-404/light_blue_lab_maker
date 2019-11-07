package application.Controllers;

public class LabDTO {

    private String title;
    private String author;

    public LabDTO(String title, String author) {
        this.title = title;
        this.author = author;
    }

    public String getTitle() {
        return this.title;
    }

    public String getAuthor() {
        return this.author;
    }

}
