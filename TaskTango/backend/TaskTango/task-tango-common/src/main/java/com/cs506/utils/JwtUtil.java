package com.cs506.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

public class JwtUtil {
    /**
     * Generate a JWT
     * Uses the HS256 algorithm, with a fixed secret key
     *
     * @param secretKey the JWT secret key
     * @param ttlMillis the expiration time in milliseconds
     * @param claims    information to set in the token
     * @return the generated JWT as a String
     */
    public static String createJWT(String secretKey, long ttlMillis, Map<String, Object> claims) {
        // Specify the signature algorithm used, i.e., the "header" part
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

        // Generate the expiration time for the JWT
        long expMillis = System.currentTimeMillis() + ttlMillis;
        Date exp = new Date(expMillis);

        // Set up the body of the JWT
        JwtBuilder builder = Jwts.builder()
                // If there are custom claims, they must be set first;
                // this will assign values to the builder's claim.
                // If set after the standard claims, custom claims will override the standard ones.
                .setClaims(claims)
                // Set the signing algorithm and secret key
                .signWith(signatureAlgorithm, secretKey.getBytes(StandardCharsets.UTF_8))
                // Set the expiration time
                .setExpiration(exp);

        return builder.compact();
    }

    /**
     * Decrypt the token
     *
     * @param secretKey the JWT secret key. This key must be securely stored on the server and never exposed.
     *                  Otherwise, the signature can be forged. For multiple clients, consider using multiple keys.
     * @param token     the encrypted token
     * @return the claims extracted from the token
     */
    public static Claims parseJWT(String secretKey, String token) {
        // Obtain a DefaultJwtParser
        Claims claims = Jwts.parser()
                // Set the signing key
                .setSigningKey(secretKey.getBytes(StandardCharsets.UTF_8))
                // Set the JWT to be parsed
                .parseClaimsJws(token).getBody();
        return claims;
    }
}
