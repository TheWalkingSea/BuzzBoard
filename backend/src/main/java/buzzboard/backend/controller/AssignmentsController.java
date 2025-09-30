package buzzboard.backend.controller;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import buzzboard.backend.service.CanvasLMS;
import buzzboard.backend.service.CanvasLMS.Assignment;


@RestController
public class AssignmentsController {

    public final CanvasLMS canvasService;

    public AssignmentsController(CanvasLMS canvasService) {
        this.canvasService = canvasService;
    }


    @GetMapping("/getAssignments")
    public ArrayList<Assignment> getAssignments() throws Exception {
        return canvasService.getCanvasToDo();
    }
    
}
