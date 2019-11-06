package application.Models;


import lombok.Data;
import lombok.Getter;

import java.util.List;


public class Stage {

    private String instructions;
    private List<Tool> setup;
    private int stageNum;

    public Stage(int stageNum) {
        this.stageNum = stageNum;
    }

}
