package com.company.flowmodoro.configs.security;

import com.company.flowmodoro.exception.ErrorResponse.ErrorResponse;
import com.company.flowmodoro.exception.enums.CommonErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(
        HttpServletRequest request,
        HttpServletResponse response,
        AuthenticationException authException
    ) throws IOException {
        ErrorResponse errorResponse = ErrorResponse.builder()
            .code(CommonErrorCode.UNAUTHORIZED)
            .errors(List.of(
                authException.getMessage() != null && !authException.getMessage().isBlank()
                    ? authException.getMessage()
                    : "Token de autenticação ausente, inválido ou expirado."
            ))
            .build();

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
