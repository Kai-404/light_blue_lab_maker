package application.Tools;

import application.Models.Tool;

public class Beaker extends Tool {

    final String imageName = "beaker.png";

    public Beaker(){

    }

    @Override
    public String getImageName() {
        return imageName;
    }
}
