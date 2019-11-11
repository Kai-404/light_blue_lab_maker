package application.Models;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class Stage {

    private String instructions;
    private List<Tool> toolList;
    private int stageNum;

    public Stage() {}

    public Stage(int stageNum) {
        this.stageNum = stageNum;
    }
}
