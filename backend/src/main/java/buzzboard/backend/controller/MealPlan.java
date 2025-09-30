package buzzboard.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import buzzboard.backend.service.GTSSOAuthService;

@RestController
public class MealPlan {

    public final GTSSOAuthService authService;

    MealPlan(GTSSOAuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/mealplan")
    ResponseEntity<GTSSOAuthService.DiningInformation> getMealPlan() {
        try {
            return ResponseEntity.ok(authService.getDiningInformation());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}