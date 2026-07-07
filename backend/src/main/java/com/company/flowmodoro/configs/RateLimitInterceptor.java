package com.company.flowmodoro.configs;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;

import com.company.flowmodoro.exception.ErrorResponse.ErrorResponse;
import com.company.flowmodoro.exception.enums.CommonErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

	private final ObjectMapper objectMapper = new ObjectMapper();

	private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

	private Bucket createNewBucket() {
		Bandwidth limit = Bandwidth.classic(50, Refill.greedy(50, Duration.ofMinutes(1)));
		return Bucket.builder().addLimit(limit).build();
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {

		String userId = request.getHeader("X-User-Id");

		if (userId == null || userId.isBlank()) {
			userId = request.getRemoteAddr();
		}

		Bucket bucket = buckets.computeIfAbsent(userId, k -> createNewBucket());

		if (bucket.tryConsume(1)) {
			return true;
		}

		ErrorResponse error = ErrorResponse.builder()
			.code(CommonErrorCode.RATE_LIMIT_EXCEEDED)
			.errors(List.of("Muitas requisições. Por favor, tente novamente mais tarde."))
			.build();

		response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		response.getWriter().write(objectMapper.writeValueAsString(error));

		return false;
	}

}
