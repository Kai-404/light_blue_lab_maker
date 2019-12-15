package application.Models;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Document
public class Tool implements Cloneable{

    public String id;

    public int x;

    public int y;

    public String name;

    public String nickName;

    public String imageName;

    public HashMap<String,Boolean> propertyList;

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

    Map<String,String> canInteractWith;

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

    @Override
    public Tool clone() throws CloneNotSupportedException {
        Tool newTool = (Tool) super.clone();

        newTool.setX(this.getX());
        newTool.setY(this.getY());
        newTool.setName(this.getName());
        newTool.setImageName(this.getImageName());
        newTool.setNickName( this.getNickName());
        for (Map.Entry<String,Boolean> property : this.getPropertyList().entrySet()) {
            newTool.getPropertyList().put(property.getKey(), property.getValue());
        }

        return newTool;
    }
}
