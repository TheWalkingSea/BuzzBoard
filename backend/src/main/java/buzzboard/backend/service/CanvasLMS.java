package buzzboard.backend.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class CanvasLMS {
    
    private final HttpClient client;

    @Value("${canvas.token}")
    public String token;

    public static String TODOCANVASAPI = "https://gatech.instructure.com/api/v1/courses/%s/todo";

    public static final Map<Integer, String> map = Map.of(
        467128, "ECE2040", 
        465576, "CS1332", 
        516338, "ECE2020", 
        475046, "ECE1100", 
        475790, "APPH1050",
        483222, "PSYCH1101",
        469452, "ECE3077"
    );


    public CanvasLMS(HttpClient client) {
        this.client = client;
    }

    public ArrayList<Assignment> getCanvasToDo() throws Exception {
        ArrayList<Assignment> assignments = new ArrayList<>();

        for (var entry: map.entrySet()) {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(String.format(TODOCANVASAPI, entry.getKey())))
                .GET()
                .header("Authorization", "Bearer " + token)
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode js = mapper.readTree(response.body());


            for (JsonNode item: js) {
                JsonNode assignment = item.get("assignment");
                String due_at = assignment.get("due_at").asText();
                long epochSeconds = -1;
                if (due_at != null) {
                    Instant instant = Instant.parse(due_at);
                    epochSeconds = instant.getEpochSecond();
                }
                
                String name = assignment.get("name").asText();
                boolean is_quiz_assignment = assignment.get("is_quiz_assignment").asBoolean();
                assignments.add(new Assignment(name, epochSeconds, is_quiz_assignment, entry.getValue()));
            }
        }

        return assignments;
    }

    public record Assignment(
        String name,
        long due_at,
        boolean is_quiz_assignment,
        String course_name
    ) {}
}
