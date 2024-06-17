package com.pilothelper.plugins

import com.pilothelper.model.UserProfile
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.apache.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*

val keycloakAddress = System.getenv("KEYCLOAK_URL") ?: "http://keycloak:8080"
val realm = System.getenv("KEYCLOAK_REALM") ?: "realm-name"
val keycloakCookieName = System.getenv("KEYCLOAK_COOKIE_NAME") ?: "some-cookie-name"

val client = HttpClient(Apache) {
    install(ContentNegotiation) {
        json()
    }
}

fun ApplicationCall.getToken(): String? = request.cookies[keycloakCookieName]

suspend fun requestUserInfo(token: String): UserProfile {
    return client.get("$keycloakAddress/realms/$realm/protocol/openid-connect/userinfo") {
        bearerAuth(token)
    }.body()
}