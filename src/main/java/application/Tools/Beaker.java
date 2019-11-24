package application.Tools;

import application.Models.Tool;
import com.fasterxml.jackson.databind.ser.Serializers;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class Beaker extends Tool {
    @Field("BeakerName")
    String name = "Beaker";
    @Field("BeakerImageName")
    final String imageName = "beaker.png";
    @Field("BeakerX")
    int x = 0;
    @Field("BeakerY")
    int y = 0;

    //initial property
    double maxVolume = 100;
    double currentVolume = 50;
    ArrayList<String> currentChemicalsList = new ArrayList<>( Arrays.asList("H20"));
    String phStatus = "Neutral";

    //final property
    double finalMaxVolume = 100;
    double finalCurrentVolume = 50;
    ArrayList<String> finalCurrentChemicalsList = new ArrayList<>( Arrays.asList("H20"));
    String finalPhStatus = "Neutral";

    boolean canBeBurned = true;
    public Beaker(){

    }
    public String getName(){
        return this.name;
    }


    @Override
    public String getImageName() {
        return imageName;
    }

//    [
//    {
//          id: "1",
//          Name: "Beaker",
//          Img: "beakerTool.png",
//          x: 0,
//          y: 0,
//          Prop: [
//              { Name: "Size", Value: "100", Editable: true },
//              { Name: "Color", Value: "Green", Editable: true }
//          ],
//          Interaction: [Pour]
//    },
//    {

//     },
//    {

//     }
//    ]

    public JSONObject getToolAsJSON(){

        JSONObject toolJSONObject = new JSONObject();
        toolJSONObject.put( "id",this.id );
        toolJSONObject.put( "Name",this.name );
        toolJSONObject.put( "Img",this.imageName );
        toolJSONObject.put( "x",this.x );
        toolJSONObject.put( "y",this.y );

        //initial property
        JSONArray properties = new JSONArray();

        JSONObject maxVolumeProp = new JSONObject();
        maxVolumeProp.put( "Name","Max Volume" );
        maxVolumeProp.put( "Value",this.maxVolume );
        maxVolumeProp.put( "Editable", true );
        maxVolumeProp.put( "Max", "9999" );
        maxVolumeProp.put( "Min", "1" );

        JSONObject currentVolumeProp = new JSONObject();
        currentVolumeProp.put( "Name","current Volume" );
        currentVolumeProp.put( "Value",this.currentVolume );
        currentVolumeProp.put( "Editable", true );
        currentVolumeProp.put( "Max", "9999" );
        currentVolumeProp.put( "Min", "1" );

        JSONObject phStatusProp = new JSONObject();
        phStatusProp.put( "Name","Ph Value" );
        phStatusProp.put( "Value",this.phStatus );
        phStatusProp.put( "Editable", true );
        phStatusProp.put( "Valid Color",
                new HashMap<String,String>(
                        Map.of("BASE","#6a0dad", "ACID","#ff0000","Neutral","#00ff00")
                )
        );

        JSONObject chemicalsListProp = new JSONObject();
        chemicalsListProp.put( "Name","Chemical(s) List" );
        chemicalsListProp.put( "Value",this.currentChemicalsList );
        chemicalsListProp.put( "Editable", true );

        properties.put(maxVolumeProp);
        properties.put(currentVolumeProp);
        properties.put(phStatusProp);
        properties.put(chemicalsListProp);

        toolJSONObject.put( "Prop",properties );

        //final property
        JSONArray finalProperties = new JSONArray();

        JSONObject finalMaxVolumeProp = new JSONObject();
        finalMaxVolumeProp.put( "Name","Max Volume" );
        finalMaxVolumeProp.put( "Value",this.finalMaxVolume );
        finalMaxVolumeProp.put( "Editable", true );
        finalMaxVolumeProp.put( "Max", "9999" );
        finalMaxVolumeProp.put( "Min", "1" );

        JSONObject finalCurrentVolumeProp = new JSONObject();
        finalCurrentVolumeProp.put( "Name","current Volume" );
        finalCurrentVolumeProp.put( "Value",this.finalCurrentVolume );
        finalCurrentVolumeProp.put( "Editable", true );
        finalCurrentVolumeProp.put( "Max", "9999" );
        finalCurrentVolumeProp.put( "Min", "1" );

        JSONObject finalPhStatusProp = new JSONObject();
        finalPhStatusProp.put( "Name","Ph Value" );
        finalPhStatusProp.put( "Value",this.finalPhStatus );
        finalPhStatusProp.put( "Editable", true );
        finalPhStatusProp.put( "Valid Color",
                new HashMap<String,String>(
                        Map.of("BASE","#6a0dad", "ACID","#ff0000","Neutral","#00ff00")
                )
        );

        JSONObject finalChemicalsListProp = new JSONObject();
        finalChemicalsListProp.put( "Name","Chemical(s) List" );
        finalChemicalsListProp.put( "Value",this.finalCurrentChemicalsList );
        finalChemicalsListProp.put( "Editable", true );




        finalProperties.put(finalMaxVolumeProp);
        finalProperties.put(finalCurrentVolumeProp);
        finalProperties.put(finalPhStatusProp);
        finalProperties.put(finalChemicalsListProp);

        toolJSONObject.put( "FinalProp",finalProperties );


        JSONObject interactions = new JSONObject();
        interactions.put("Name", "Pour");

        toolJSONObject.put( "Interactions",interactions );

        return  toolJSONObject;

    }

//    public void updateProp(String toolProps){
//
//        JSONObject jsonObject = new JSONObject(toolProps);
//
//        JSONObject cTool = jsonObject.getJSONObject( "ctool" );
//        this.x = (int)cTool.get( "x" );
//        this.y = (int)cTool.get( "y" );
//
//        JSONArray propArray = cTool.getJSONArray( "Prop" );
//
//        System.out.println( propArray );
//
//        propArray.forEach( e->{
//            JSONObject prop = (JSONObject) e;
//            if ( ((String)prop.get("Name")).equals( "Size" ) ){
//                if (prop.get( "Value" ) instanceof String){
//                    this.size= Integer.parseInt((String) prop.get( "Value" ));
//                }else {
//                    this.size= (int)prop.get( "Value" );
//                }
//            }else if (((String)prop.get("Name")).equals( "Color" )){
//                this.color=(String) prop.get( "Value" );
//            }
//        } );
//
//
//        JSONArray finalPropArray = cTool.getJSONArray( "FinalProp" );
//
//        System.out.println( finalPropArray );
//
//        finalPropArray.forEach( e->{
//            JSONObject prop = (JSONObject) e;
//            if ( ((String)prop.get("Name")).equals( "Size" ) ){
//                if (prop.get( "Value" ) instanceof String){
//                    this.finalSize= Integer.parseInt((String) prop.get( "Value" ));
//                }else {
//                    this.finalSize= (int)prop.get( "Value" );
//                }
//            }else if (((String)prop.get("Name")).equals( "Color" )){
//                this.finalColor=(String) prop.get( "Value" );
//            }
//        } );
//
//    }
//
//    public Beaker clone() throws CloneNotSupportedException {
//        Beaker clone = (Beaker) super.clone();
//        clone.setSize(this.getSize());
//        clone.setColor(this.getColor());
//        return clone;
//    }

}
