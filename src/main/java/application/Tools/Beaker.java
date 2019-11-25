package application.Tools;

import application.Models.Tool;
import com.fasterxml.jackson.databind.ser.Serializers;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;

import java.lang.reflect.Array;
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
    double maxVolume = 100.0;
    double currentVolume = 50.0;
    ArrayList<String> currentChemicalsList = new ArrayList<>( Arrays.asList("H20"));
    String phStatus = "Neutral";

    //final property
    double finalMaxVolume = 100.0;
    double finalCurrentVolume = 50.0;
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

    public String chemicalListToString(ArrayList<String> list){
        String toReturn;
        toReturn = String.join( "," ,list );
        return toReturn;
    }

    public ArrayList<String> chemicalStringToList(String chemicalString){
        ArrayList<String> chemicalList = new ArrayList(Arrays.asList( chemicalString.split( "," )));
        for(String s : chemicalList){
            if (s.isBlank()){
                chemicalList.remove( s );
            }
        }
        return chemicalList;
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
        currentVolumeProp.put( "Name","Current Volume" );
        currentVolumeProp.put( "Value",this.currentVolume );
        currentVolumeProp.put( "Editable", true );
        currentVolumeProp.put( "Max", "9999" );
        currentVolumeProp.put( "Min", "1" );

        JSONObject phStatusProp = new JSONObject();
        phStatusProp.put( "Name","PH Status" );
        phStatusProp.put( "Value",this.phStatus );
        phStatusProp.put( "Editable", true );
        phStatusProp.put( "ValidStatus",
                new ArrayList<String>(
                        Arrays.asList( "BASE", "ACID", "NEUTRAL" )
                )
        );

        JSONObject chemicalsListProp = new JSONObject();
        chemicalsListProp.put( "Name","Chemicals List" );
        chemicalsListProp.put( "Value",chemicalListToString( this.currentChemicalsList ) );
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
        finalCurrentVolumeProp.put( "Name","Current Volume" );
        finalCurrentVolumeProp.put( "Value",this.finalCurrentVolume );
        finalCurrentVolumeProp.put( "Editable", true );
        finalCurrentVolumeProp.put( "Max", "9999" );
        finalCurrentVolumeProp.put( "Min", "1" );

        JSONObject finalPhStatusProp = new JSONObject();
        finalPhStatusProp.put( "Name","PH Status" );
        finalPhStatusProp.put( "Value",this.finalPhStatus );
        finalPhStatusProp.put( "Editable", true );
        finalPhStatusProp.put( "ValidStatus",
                new ArrayList<String>(
                        Arrays.asList( "BASE", "ACID", "NEUTRAL" )
                )
        );

        JSONObject finalChemicalsListProp = new JSONObject();
        finalChemicalsListProp.put( "Name","Chemicals List" );
        finalChemicalsListProp.put( "Value",chemicalListToString(this.finalCurrentChemicalsList ));
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

    public void updateProp(String toolProps){

        JSONObject jsonObject = new JSONObject(toolProps);

        JSONObject cTool = jsonObject.getJSONObject( "ctool" );
        this.x = (int)cTool.get( "x" );
        this.y = (int)cTool.get( "y" );

        JSONArray propArray = cTool.getJSONArray( "Prop" );

        System.out.println( propArray );

        propArray.forEach( e->{
            JSONObject prop = (JSONObject) e;
            if ( ((String)prop.get("Name")).equals( "Max Volume" ) ){
                this.maxVolume = Double.parseDouble( String.valueOf( prop.get( "Value" ) ) );

            }
            else if (((String)prop.get("Name")).equals( "Current Volume" )){
                this.currentVolume = Double.parseDouble( String.valueOf( prop.get( "Value" ) ) );

            }
            else if (((String)prop.get("Name")).equals( "PH Status" )){
                this.phStatus= (String) prop.get( "Value" );
            }
            else if (((String)prop.get("Name")).equals( "Chemicals List" )){
                this.currentChemicalsList = chemicalStringToList((String) prop.get( "Value" ) );
            }



        } );


        JSONArray finalPropArray = cTool.getJSONArray( "FinalProp" );

        System.out.println( finalPropArray );

        finalPropArray.forEach( e->{
            JSONObject prop = (JSONObject) e;
            if ( ((String)prop.get("Name")).equals( "Max Volume" ) ){
                this.finalMaxVolume = Double.parseDouble( String.valueOf( prop.get( "Value" ) ) );
            }
            else if (((String)prop.get("Name")).equals( "Current Volume" )){
                this.finalCurrentVolume = Double.parseDouble( String.valueOf( prop.get( "Value" ) ) );
            }
            else if (((String)prop.get("Name")).equals( "PH Status" )){
                this.finalPhStatus= (String) prop.get( "Value" );
            }
            else if (((String)prop.get("Name")).equals( "Chemicals List" )){
                this.finalCurrentChemicalsList = chemicalStringToList((String) prop.get( "Value" ) );
            }
        } );

    }

    public Beaker clone() throws CloneNotSupportedException {
        Beaker clone = (Beaker) super.clone();
        clone.setMaxVolume(this.maxVolume);
        clone.setCurrentVolume(this.currentVolume);
        clone.setCurrentChemicalsList( this.currentChemicalsList );
        clone.setPhStatus( this.phStatus );

        clone.setFinalMaxVolume(this.finalMaxVolume);
        clone.setFinalCurrentVolume(this.finalCurrentVolume);
        clone.setFinalCurrentChemicalsList( this.finalCurrentChemicalsList );
        clone.setFinalPhStatus( this.finalPhStatus );
        return clone;
    }

}
