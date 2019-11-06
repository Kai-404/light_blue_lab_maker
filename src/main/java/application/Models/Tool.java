package application.Models;


import lombok.Data;
import lombok.Getter;

import java.util.HashMap;


public class Tool {

    private String id;
    private String name;
    private String imageName;
    private HashMap<String,String> propertyList;

    public Tool(String name) {
        this.name = name;
    }

}
