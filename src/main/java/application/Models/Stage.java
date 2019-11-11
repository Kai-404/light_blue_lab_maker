package application.Models;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Stage {

    private String instructions;
    private ArrayList<Tool> stageToolList;
    private int stageNum;

    public Stage(int stageNum) {
        this.stageNum = stageNum;
        this.stageToolList =  new ArrayList<>( );
    }

    public ArrayList<Tool> getStageToolList(){
        return stageToolList;
    }
}
