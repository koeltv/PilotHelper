package com.pilothelper.plugins

import com.pilothelper.model.Aircraft
import com.pilothelper.service.AircraftService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.Database
import java.util.*

val dbUser = System.getenv("DB_USERNAME") ?: "root"
val dbPassword = System.getenv("DB_PASSWORD") ?: ""
val dbUrl = System.getenv("DB_URL") ?: "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1"
val dbDriver = System.getenv("DB_DRIVER") ?: "org.h2.Driver"

fun Application.configureDatabases() {
    val database = Database.connect(
        url = dbUrl,
        user = dbUser,
        driver = dbDriver,
        password = dbPassword
    )
    val aircraftService = AircraftService(database)
    routing {
        // Create aircraft
        post("/aircraft") {
            val aircraft = call.receive<Aircraft>()
            val token = call.getToken() ?: return@post call.respond(HttpStatusCode.Unauthorized)
            val response = requestUserInfo(token)

            val userId = UUID.fromString(response.sub)
            val id = aircraftService.create(aircraft, listOf(userId))
            call.respond(HttpStatusCode.Created, id)
        }

        // Read aircraft
        get("/aircraft/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            val aircraft = aircraftService.read(id)
            if (aircraft != null) {
                call.respond(HttpStatusCode.OK, aircraft)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        // Update aircraft
        put("/aircraft/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            val aircraft = call.receive<Aircraft>()
            aircraftService.update(id, aircraft)
            call.respond(HttpStatusCode.OK)
        }

        // Delete aircraft
        delete("/aircraft/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            val resultDelete = aircraftService.delete(id)
            if (resultDelete) {
                call.respond(HttpStatusCode.OK)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        //Read all Aircraft from connected User
        get("/aircraft/user/") {
            val token = call.getToken() ?: throw BadRequestException("Please login first")
            val id = UUID.fromString(requestUserInfo(token).sub)
            val userAircrafts = aircraftService.readUserAircrafts(id)
            call.respond(HttpStatusCode.OK, userAircrafts)
        }
    }
}
