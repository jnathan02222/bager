package com.example.backend;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.backend.websocket.MultiplayerService;
import com.example.backend.websocket.models.GameInfo;

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
	String secureHostUrl = "https://floppyfingers.online";
	String hostUrl = "http://floppyfingers.online";


	String proxyUrl = "http://localhost:3000";
	String[] words = { 
		"pig", "bench", "boat", "helicopter", "nail", "lizard", "ear", "kitten", "roly poly", "truck", 
		"ring", "hook", "seashell", "hat", "banana", "zebra", "rock", "duck", "crack", "dinosaur", 
		"bee", "motorcycle", "girl", "stairs", "carrot", "ladybug", "turtle", "person", "fly", "desk", 
		"parka", "pinecone", "rhinoceros", "rope", "chip", "celery", "brick", "coyote", "positive", 
		"fork", "bowtie", "yarn", "narwhal", "juice", "screwdriver", "electricity", "puppet", "pumpkin", 
		"soup", "thief", "mask", "earmuffs", "newborn", "manatee", "swarm", "mayor", "ski lift", "flavor", 
		"elope", "rubber", "pain", "jeans", "houseboat", "hut", "cloak", "cattle", "sweater", "student", 
		"hoop", "sickle", "password", "irrational", "income tax", "member", "dictate", "overture", 
		"practice", "offstage", "soulmate"
	};

	String wordsString = String.join(",", words);

	public String generateRandomString(int length) {
		// Rest of the code
	
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
	

	@GetMapping("/createRoom")
	public ResponseEntity<byte[]> createRoom(){
		String roomKey = generateRandomString(16);
		multiplayerService.addRoom(roomKey, new GameInfo());
		return redirect("/game?room="+roomKey);
	}

	@GetMapping("/game")
	public ResponseEntity<byte[]> setup(@RequestParam(required = false) String room){
		if(room == null){
			return redirect("/noRoom");
		}else if(!multiplayerService.roomExists(room)){
			return redirect("/noRoom");
		}else if(multiplayerService.getRoom(room).getGameStarted()){
			return redirect("/inProgress");
		}
		return proxyRequest();
	}

	@GetMapping("/threeWords")
	public String[] threeWords(){
		Random random = new Random();
		String[] guessingWords = new String[3];
		for(int i=0; i<3; i++){
			guessingWords[i] = words[random.nextInt(words.length)];
		}
		return guessingWords;
	}

	//Captures everything execept /ws/**
	@GetMapping({"/", "/_next/**", "/*"})
    public ResponseEntity<byte[]> proxyRequest() {
        String path = ServletUriComponentsBuilder.fromCurrentRequest().toUriString().replace(hostUrl, proxyUrl);
		path.replace(secureHostUrl, proxyUrl);
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



