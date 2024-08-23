package com.example.backend;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Random;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

@SpringBootApplication

@RestController
public class BackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

    RestTemplate restTemplate = new RestTemplate();	
	String hostUrl = "http://localhost:8080";
	String proxyUrl = "http://localhost:3000";

	public String generateRandomString(int length) {
		String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        Random random = new Random();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            sb.append(characters.charAt(index));
        }
        return sb.toString();
    }

	private MultiplayerService multiplayerService;
	@Autowired
	public BackendApplication(MultiplayerService multiplayerService){
		this.multiplayerService = multiplayerService;
	}
	
	@GetMapping("/setup")
	public ResponseEntity<byte[]> setup(@RequestParam(required = false) String room){
		if(room == null){
			//Add room to url
			String roomKey = generateRandomString(16);
			multiplayerService.addRoom(roomKey, new GameInfo());
			return redirect("/setup?room="+roomKey);
		}else if(!multiplayerService.roomExists(room)){
			return redirect("/noRoom");
		}else if(multiplayerService.getRoom(room).isGameStarted()){
			return redirect("/game");
		}
		return proxyRequest();
	}

	@GetMapping("/game")
	public ResponseEntity<byte[]> game(@RequestParam(required = false) String room){
		if(room == null || !multiplayerService.roomExists(room)){
			return redirect("/noRoom");
		}else if(!multiplayerService.getRoom(room).isGameStarted()){
			return redirect("/setup");
		}
		//Proceed
		return proxyRequest();
	}

	//Captures everything execept /ws/**
	@GetMapping({"/", "/_next/**", "/*"})
    public ResponseEntity<byte[]> proxyRequest() {
        String path = ServletUriComponentsBuilder.fromCurrentRequest().toUriString().replace(hostUrl, proxyUrl);
		ResponseEntity<byte[]> response = restTemplate.getForEntity(path, byte[].class);
		return ResponseEntity.status(response.getStatusCode())
				.headers(response.getHeaders())
				.body(response.getBody());
	}

	public ResponseEntity<byte[]> redirect(String target){
		HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, target); 
        return new ResponseEntity<byte[]>(headers, HttpStatus.FOUND);
	}

}



