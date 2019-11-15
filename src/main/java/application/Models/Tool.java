package application.Models;

import lombok.Data;
import lombok.Getter;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.HashMap;

@Getter
@Document
public class Tool {

    public String id;

    public int x;

    public int y;

    public String name;

    public String imageName;

    private HashMap<String,String> propertyList;

    public Tool() {
        this.propertyList = new HashMap<>();
    }

    public String getImageName(){
        return this.imageName;
    }

    public String getName(){
        return this.name;
    }

    public void setId(String id){
        this.id = id;
    }

    public void setX(int x){
        this.x = x;
    }
    public void setY(int y){
        this.y = y;
    }


    public JSONObject getToolAsJSON(){

        JSONObject toolJSONObject = new JSONObject();
        toolJSONObject.put( "id",this.id );
        toolJSONObject.put( "Img",this.imageName );
        toolJSONObject.put( "x",this.x );
        toolJSONObject.put( "y",this.y );

        JSONArray properties = new JSONArray();

        toolJSONObject.put( "Prop","No property for this tool!" );

        return  toolJSONObject;

    }
}