package buzzboard.backend.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class AssignmentsServiceTests {
    
    @Autowired
    private CanvasLMS service;

    @Test
    void testExtraction() throws Exception {

        assertDoesNotThrow(service::getCanvasToDo);
    }
}
