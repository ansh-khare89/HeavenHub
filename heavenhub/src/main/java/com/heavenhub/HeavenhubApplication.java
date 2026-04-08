package com.heavenhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HeavenhubApplication {

	public static void main(String[] args) {
		SpringApplication.run(HeavenhubApplication.class, args);
	}

}
