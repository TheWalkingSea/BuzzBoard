package buzzboard.backend.service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.NoSuchElementException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class GTSSOAuthService {

    private final HttpClient client;

    final static String GTSSOURI = "https://sso.gatech.edu/cas/login";
    final static String BUZZCARDURI = "https://eAcct-buzzcard-sp.transactcampus.com/buzzcard/AccountSummary.aspx";
    final static String SAMLIDPURI = "https://idp.gatech.edu/idp/profile/SAML2/POST/SSO";
    final static String SAMLAUTHURI = "https://eAcct-buzzcard-sp.transactcampus.com/buzzcard/TransactSP/SSO/SAML2/POST";

    @PostConstruct
    public void init() throws Exception {
        SSOAuthenticate();
        initializeViewState();
    }

    @Value("${gtsso.username}")
    public String username;
    @Value("${gtsso.password}")
    public String password;

    private String viewState;

    private record SAMLToken(String SAMLRequest, String relayState) {} 

    public GTSSOAuthService(HttpClient client) {
        this.client = client;
    }

    private String extractExecutionCode(String html) {
        Pattern pattern = Pattern.compile("<input type=\"hidden\" name=\"execution\" value=\"(.+?)\"");
        Matcher matcher = pattern.matcher(html);

        if (matcher.find()) {
            return matcher.group(1);
        }

        throw new NoSuchElementException("Regex could not match valid execution code or already authenticate with CAS.");
    }

    protected String getExecution() throws Exception {
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(GTSSOURI))
            .GET()
            .build();

        HttpResponse<String> html = client.send(request, HttpResponse.BodyHandlers.ofString());

        return extractExecutionCode(html.body());
    }

    private SAMLToken extractSAMLTokens(String html, String type) {
        
        // Extracting Tokens
        Pattern SAMLPattern = Pattern.compile("name=\\\"" + type + "\\\" value=\\\"(.+?)\\\"\\/>");
        Matcher SAMLMatcher = SAMLPattern.matcher(html);

        Pattern RelayPattern = Pattern.compile("name=\\\"RelayState\\\" value=\\\"(.+?)\\\"\\/>");
        Matcher relayMatcher = RelayPattern.matcher(html);

        // Extracting SAMLRequest Token
        if (!SAMLMatcher.find()) {
            throw new java.util.NoSuchElementException("Could not find" + type + "token");
        }
        if (!relayMatcher.find()) {
            throw new java.util.NoSuchElementException("Could not find RelayState token");
        }

        String SAMLRequest = SAMLMatcher.group(1);
        String relayState = relayMatcher.group(1);

        return new SAMLToken(SAMLRequest, relayState);
    }

    private String convertSAMLFormData(SAMLToken samlRequest, String type) {
        String encodedSAMLRequest = URLEncoder.encode(samlRequest.SAMLRequest(), StandardCharsets.UTF_8);
        String encodedRelayState = URLEncoder.encode(samlRequest.relayState(), StandardCharsets.UTF_8);
        return type + "=" + encodedSAMLRequest +
                "&RelayState=" + encodedRelayState;
    }

    /**
     * The SAML Handshake allows us to get an authentication token from CAS
     * to the BUZZCARDURI website
     */
    private void SAMLHandshake() throws Exception {
        
        // First request in handshake 
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BUZZCARDURI))
            .GET()
            .build();
        
        HttpResponse<String> htmlResponse = client.send(request, HttpResponse.BodyHandlers.ofString());

        SAMLToken samlRequest = extractSAMLTokens(htmlResponse.body(), "SAMLRequest");

        // Sending SAML Request to server
        final String data = convertSAMLFormData(samlRequest, "SAMLRequest");

        HttpRequest samlIDPRequest = HttpRequest.newBuilder()
            .uri(URI.create(SAMLIDPURI))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .POST(HttpRequest.BodyPublishers.ofString(data))
            .build();

        HttpResponse<String> samlResponse = client.send(samlIDPRequest, HttpResponse.BodyHandlers.ofString());
        
        // Second request in handshake (The auth handshake)
        SAMLToken samlRequest_auth = extractSAMLTokens(samlResponse.body(), "SAMLResponse");
        final String data_auth = convertSAMLFormData(samlRequest_auth, "SAMLResponse");

        HttpRequest samlAuthRequest = HttpRequest.newBuilder()
            .uri(URI.create(SAMLAUTHURI))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .POST(HttpRequest.BodyPublishers.ofString(data_auth))
            .build();

        client.send(samlAuthRequest, HttpResponse.BodyHandlers.discarding());

    }

    protected void SSOAuthenticate() throws Exception {
        String execution = getExecution();

        String data = "username=" + username +
                        "&password=" + password +
                        "&execution=" + execution +
                        "&_eventId=submit" +
                        "&geolocation=" + 
                        "&submitbutton=LOGIN";

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(GTSSOURI))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .POST(HttpRequest.BodyPublishers.ofString(data))
            .build();

        client.send(request, HttpResponse.BodyHandlers.discarding());

        SAMLHandshake();
    }

    protected DiningInformation parseDiningInformation(String html) throws Exception {

        Pattern dollarsPattern = Pattern.compile("MainContent_StoredValueAccountBalanceLabel.+?>([\\d.]+) USD<\\/span>");
        Matcher dollarsMatcher = dollarsPattern.matcher(html);

        Pattern swipesPattern = Pattern.compile("<span id=\"MainContent_mprYearValue\">(\\d+?)<\\/span><\\/p>");
        Matcher swipesMatcher = swipesPattern.matcher(html);

        // We are looking for the second match of dollarsMatcher
        if ((dollarsMatcher.find() && dollarsMatcher.find()) && swipesMatcher.find()) {
            Double diningDollars = Double.valueOf(dollarsMatcher.group(1));
            Integer mealSwipes = Integer.valueOf(swipesMatcher.group(1));
            return new DiningInformation(diningDollars, mealSwipes);
        }

        throw new NoSuchElementException("Regex could not match valid dining information");
    }

    private void initializeViewState() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BUZZCARDURI))
            .GET()
            .build();

        HttpResponse<String> htmlResponse = client.send(request, HttpResponse.BodyHandlers.ofString());
        
        // Extracting data
        Pattern viewstategenPattern = Pattern.compile("id=\"__VIEWSTATEGENERATOR\" value=\"(.+?)\" \\/>");
        Matcher viewstategenMatcher = viewstategenPattern.matcher(htmlResponse.body());

        Pattern viewstatePattern = Pattern.compile("id=\"__VIEWSTATE\" value=\"(.+?)\" \\/>");
        Matcher viewstateMatcher = viewstatePattern.matcher(htmlResponse.body());

        Pattern eventvalidationPattern = Pattern.compile("id=\"__EVENTVALIDATION\" value=\"(.+?)\" \\/>");
        Matcher eventvalidationMatcher = eventvalidationPattern.matcher(htmlResponse.body());

        if (!viewstategenMatcher.find() || !viewstateMatcher.find() || !eventvalidationMatcher.find()) {
            throw new java.util.NoSuchElementException("Cannot set viewstate because regex cannot find elements __VIEWSTATE or __VIEWSTATEGENERATOR or __EVENTVALIDATION");
        }

        // Setting viewState

        final String viewStateGeneratorVar = URLEncoder.encode(viewstategenMatcher.group(1), StandardCharsets.UTF_8);
        final String viewStateVar = URLEncoder.encode(viewstateMatcher.group(1), StandardCharsets.UTF_8);
        final String eventValidationVar = URLEncoder.encode(eventvalidationMatcher.group(1), StandardCharsets.UTF_8);

        viewState = "ctl00%24RadScriptManager1=ctl00%24MainContent%24ctl00%24MainContent%24AccountSummaryPanelPanel%7Cctl00%24MainContent%24BoardAccountContainer255&__EVENTTARGET=ctl00%24MainContent%24BoardAccountContainer255" + 
                    "&__VIEWSTATE=" + viewStateVar + 
                    "&__VIEWSTATEGENERATOR=" + viewStateGeneratorVar + 
                    "&__VIEWSTATEENCRYPTED=" + 
                    "&__EVENTVALIDATION=" + eventValidationVar;
    }

    public DiningInformation getDiningInformation () throws Exception {

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BUZZCARDURI))
            .header("content-type", "application/x-www-form-urlencoded; charset=UTF-8")
            .POST(HttpRequest.BodyPublishers.ofString(viewState))
            .build();
        
        HttpResponse<String> htmlResponse = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (htmlResponse.statusCode() != 200) {
            Thread.sleep(2000);
            SSOAuthenticate();
            initializeViewState();
            return getDiningInformation();
        }

        return parseDiningInformation(htmlResponse.body());
    }

    public record DiningInformation(Double diningDollars, Integer mealSwipes) {}

}
