package buzzboard.backend.controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class WeatherController {

    final static private HttpClient client = HttpClient.newBuilder()
        .followRedirects(HttpClient.Redirect.ALWAYS)
        .build();

    // Forcast Office ID (wfo) - https://en.wikipedia.org/wiki/List_of_National_Weather_Service_Weather_Forecast_Offices
    // Grid X, Y - (x, y) - https://api.weather.gov/points/{latitude},{longitude}
    // https://api.weather.gov/gridpoints/{wfo}/{x},{y}/forecast
    final static private String WEATHERURI = "https://api.weather.gov/gridpoints/JAX/50,88/forecast";

    @GetMapping("/getWeather")
    public WeatherData getMethodName() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(WEATHERURI))
            .GET()
            .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper mapper = new ObjectMapper();
        JsonNode json = mapper.readTree(response.body());

        json = json.get("properties").get("periods").get(0); // Gets today's forecast
        
        Integer temperature = json.get("temperature").asInt();
        Double precipitationProbability = json.get("probabilityOfPrecipitation").get("value").asInt() / 100.0;

        String windRange[] = json.get("windSpeed").asText().split(" ");
        int windSpeed;
        if (windRange.length > 2) {
            int minSpeed = Integer.parseInt(windRange[0]);
            int maxSpeed = Integer.parseInt(windRange[2]);
            windSpeed = (maxSpeed - minSpeed) / 2;
        } else {
            windSpeed = Integer.parseInt(windRange[0]);
        }

        String text = json.get("shortForecast").asText();

        return new WeatherData(
            temperature,
            precipitationProbability,
            windSpeed,
            text
        );
    }

    public record WeatherData (
        Integer temperature, 
        Double precipitationProbability, 
        Integer windSpeed, 
        String text
    ) {};


}
