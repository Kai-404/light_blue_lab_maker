package application.Tools;

import application.Models.Tool;

public class AlcoholBurner extends Tool {

    final String imageName = "burner.png";

    public AlcoholBurner(){

    }

    @Override
    public String getImageName() {
        return imageName;
    }
}