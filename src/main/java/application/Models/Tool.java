package application.Models;

import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;

@Getter
@Document
public class Tool {
    @Id
    private String id;
    private String imageName;
    private HashMap<String,String> propertyList;

    public Tool() {
        this.propertyList = new HashMap<>();
    }

    public String getToolImg(){
        return this.imageName;
    }
}