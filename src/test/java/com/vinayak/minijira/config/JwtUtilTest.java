package com.vinayak.minijira.config;

import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();

        String testKey = Base64.getEncoder().encodeToString(
                Keys.hmacShaKeyFor(
                        "test-secret-key-for-unit-tests-only-32bytes!"
                                .getBytes()
                ).getEncoded()
        );

        // @Value does not run in a plain unit test,
        // so inject the value manually.
        ReflectionTestUtils.setField(
                jwtUtil,
                "base64Secret",
                testKey
        );
    }

    @Test
    void shouldGenerateAndValidateToken() {

        String token = jwtUtil.generateToken(
                "test@test.com",
                "ADMIN",
                42L
        );

        assertTrue(jwtUtil.isTokenValid(token));
        assertEquals("test@test.com", jwtUtil.extractEmail(token));
        assertEquals("ADMIN", jwtUtil.extractRole(token));
        assertEquals(42L, jwtUtil.extractUserId(token));
    }

    @Test
    void shouldRejectInvalidToken() {

        assertFalse(
                jwtUtil.isTokenValid("not.a.valid.token")
        );
    }

    @Test
    void shouldRejectTamperedToken() {

        String token = jwtUtil.generateToken(
                "test@test.com",
                "MEMBER",
                42L
        );

        String tampered =
                token.substring(0, token.length() - 5) + "xxxxx";

        assertFalse(
                jwtUtil.isTokenValid(tampered)
        );
    }
}