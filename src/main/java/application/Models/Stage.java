package application.Models;

import lombok.Data;
import lombok.Getter;

import java.util.List;

@Getter
public class Stage {

    private String instructions;
    private List<Tool> toolList;
    private int stageNum;

    public Stage() {}

    public Stage(int stageNum) {
        this.stageNum = stageNum;
    }
}
