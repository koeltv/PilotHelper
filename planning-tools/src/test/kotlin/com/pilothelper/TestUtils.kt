package com.pilothelper

import io.ktor.client.*
import io.ktor.client.engine.mock.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.utils.io.*
import kotlinx.serialization.json.Json

fun setupClientWithResponse(
    content: String,
    status: HttpStatusCode,
    headers: Headers,
    json: Json = DefaultJson
): HttpClient {
    val mockEngine = MockEngine { _ ->
        respond(
            content = ByteReadChannel(content),
            status = status,
            headers = headers
        )
    }
    return HttpClient(mockEngine) {
        install(ContentNegotiation) {
            json(json)
        }
    }
}