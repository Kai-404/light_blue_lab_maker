package application.LabCreation;


import application.Models.Lab;
import application.Models.Tool;

import java.util.ArrayList;
import java.util.List;


public class MakeLab {

    List<Tool> tools;
    Lab lab;

    private void initTools() {
        tools.add(new Tool("test"));
    }

    public MakeLab (String title, String author) {
        this.tools = new ArrayList<Tool>();
        this.initTools();
        this.lab = new Lab(title, author);

    }

    public void addStage() {
        lab.addStage();
    }

    public Lab getLab() {
        return this.lab;
    }



}
