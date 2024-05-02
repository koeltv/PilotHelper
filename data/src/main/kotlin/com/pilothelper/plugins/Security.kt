package com.pilothelper.plugins

import io.ktor.client.*
import io.ktor.client.engine.apache.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.server.application.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonObject

val keycloakAddress = System.getenv("KEYCLOAK_URL") ?: "http://keycloak:8080"
val realm = System.getenv("KEYCLOAK_REALM") ?: "realm-name"
val keycloakCookieName = System.getenv("KEYCLOAK_COOKIE_NAME") ?: "some-cookie-name"

fun ApplicationCall.getToken(): String = request.cookies[keycloakCookieName] ?: error("User doesn't have a token")

suspend fun requestUserInfo(token: String): JsonObject =
    Json.parseToJsonElement(
        HttpClient(Apache).get("$keycloakAddress/realms/$realm/protocol/openid-connect/userinfo") {
            bearerAuth(token)
        }.bodyAsText()
    ).jsonObject