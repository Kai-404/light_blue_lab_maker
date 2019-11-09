package application.Models;

import lombok.Data;
import lombok.Getter;

import java.util.HashMap;

@Getter
public class Tool {

    private String id;
    private HashMap<String,String> propertyList;

     public Tool() {
        this.propertyList = new HashMap<>();
    }
}
