package application.Models;

import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;

@Document
@Data
@Getter
public class Tool {
    @Id
    private String id;
    private String name;
    private String image_name;
    private HashMap<String, String> property_list;

    public Tool(String name, String image_name) {
        this.name = name;
        this.image_name = image_name;
        this.property_list = new HashMap<>();
    }
}
