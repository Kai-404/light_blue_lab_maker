package application.LabCreation;


import application.Models.Lab;
import application.Models.Tool;

import java.util.ArrayList;
import java.util.List;


public class MakeLab {

    private List<Tool> tools;
    private Lab lab;

    public MakeLab (String title, String author) {
        this.tools = new ArrayList<>();
        this.initTools();
        this.lab = new Lab(title, author);
    }

    public Lab getLab() {
        return this.lab;
    }

    private void initTools() {

    }

    public void addStage() {
        this.lab.addStage();
    }

}
