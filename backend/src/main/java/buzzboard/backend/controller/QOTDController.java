package buzzboard.backend.controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class QOTDController {

	final private HttpClient client = HttpClient.newHttpClient();

    @GetMapping("/getQOTD")
	public QOTD getQuoteOfTheDay() throws Exception {
		final String QOTD_URI = "https://zenquotes.io/api/today";
		HttpRequest request = HttpRequest.newBuilder(URI.create(QOTD_URI))
			.timeout(Duration.ofSeconds(10))
			.GET()
			.build();
		HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

		ObjectMapper mapper = new ObjectMapper();
		JsonNode json = mapper.readTree(response.body());

		System.out.println("Raw JSON: " + json.toPrettyString());
		return new QOTD(json.get(0).get("q").asText(), json.get(0).get("a").asText());
	}

	public record QOTD(String quote, String author) {}
}
