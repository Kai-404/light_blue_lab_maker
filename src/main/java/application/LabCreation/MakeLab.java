package application.LabCreation;


import application.Models.Lab;
import application.Models.Tool;

import java.util.ArrayList;
import java.util.List;


public class MakeLab {

    private List<Tool> tools;
    private Lab lab;

    public MakeLab (String title, String author) {
        this.tools = new ArrayList<Tool>();
        this.initTools();
        this.lab = new Lab(title, author);
    }

    public Lab getLab() {
        return this.lab;
    }

    public List<Tool> getTools() {
        return this.tools;
    }

    private void initTools() {
        this.tools.add(new Tool("Test_tool"));
    }

    public void addStage() {
        this.lab.addStage();
    }

}
