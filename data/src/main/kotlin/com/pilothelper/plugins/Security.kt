package com.pilothelper.plugins

import com.pilothelper.model.UserProfile
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.apache.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import kotlinx.serialization.json.Json

val keycloakAddress = System.getenv("KEYCLOAK_URL") ?: "http://keycloak:8080"
val keycloakRealm = System.getenv("KEYCLOAK_REALM") ?: "realm-name"
val keycloakClientId = System.getenv("KEYCLOAK_CLIENT_ID") ?: "client-id"
val keycloakClientSecret = System.getenv("KEYCLOAK_CLIENT_SECRET") ?: ""

val client = HttpClient(Apache) {
    install(ContentNegotiation) {
        json(Json {
            ignoreUnknownKeys = true
        })
    }
}

fun ApplicationCall.getToken(): String? = request.cookies["Authorization"]?.removePrefix("Bearer ")

suspend fun requestUserInfo(token: String): UserProfile {
    return client.submitForm(
        "$keycloakAddress/realms/$keycloakRealm/protocol/openid-connect/token/introspect",
        parameters { append("token", token) }
    ) {
        basicAuth(keycloakClientId, keycloakClientSecret)
    }.body()
}