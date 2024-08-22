package com.example.backend;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;



@SpringBootApplication
@RestController
public class BackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	RestTemplate restTemplate = new RestTemplate();



	@GetMapping("/**")
    public ResponseEntity<byte[]> proxyRequest() {
        String path = ServletUriComponentsBuilder.fromCurrentRequest().toUriString().replace("http://localhost:8080", "http://localhost:3000");
	
		ResponseEntity<byte[]> response = restTemplate.getForEntity(path, byte[].class);
		return ResponseEntity.status(response.getStatusCode())
				.headers(response.getHeaders())
				.body(response.getBody());
	}
}
