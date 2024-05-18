package com.pilothelper.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    routing {
        get("/") {
            val token = call.getToken() ?: return@get call.respond(HttpStatusCode.Unauthorized)
            val response = requestUserInfo(token)

            call.respondText("Hey ${response["name"].toString().removeSurrounding("\"")}, get ready to rock and roll !")
        }
    }
}