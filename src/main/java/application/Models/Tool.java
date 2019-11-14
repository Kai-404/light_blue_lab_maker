package application.Models;

import lombok.Data;
import lombok.Getter;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;

import java.util.HashMap;

@Getter
public class Tool {

    public String id;

    public float x;

    public float y;

    public String imageName;

    private HashMap<String,String> propertyList;

    public Tool() {
        this.propertyList = new HashMap<>();
    }

    public String getImageName(){
        return this.imageName;
    }

    public void setId(String id){
        this.id = id;
    }

    public void setX(float x){
        this.x = x;
    }
    public void setY(float y){
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