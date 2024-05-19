package com.pilothelper.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.Database

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
    val userService = UserService(database)
    val aircraftService = AircraftService(database)
    routing {
        // Create user
        post("/users") {
            val user = call.receive<ExposedUser>()
            val id = userService.create(user)
            call.respond(HttpStatusCode.Created, id)
        }

        // Read user
        get("/users/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            val user = userService.read(id)
            if (user != null) {
                call.respond(HttpStatusCode.OK, user)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        // Update user
        put("/users/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            val user = call.receive<ExposedUser>()
            userService.update(id, user)
            call.respond(HttpStatusCode.OK)
        }

        // Delete user
        delete("/users/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            userService.delete(id)
            call.respond(HttpStatusCode.OK)
        }

        // Create aircraft
        post("/aircrafts") {
            val aircraft = call.receive<Aircraft>()
            val token = call.getToken() ?: return@post call.respond(HttpStatusCode.Unauthorized)
            val response = requestUserInfo(token)
            val user = ExposedUser(response["name"].toString().removeSurrounding("\""))
            val id = aircraftService.create(aircraft, listOf(user))
            call.respond(HttpStatusCode.Created, id)
        }

        // Read aircraft
        get("/aircrafts/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            val aircraft = aircraftService.read(id)
            if (aircraft != null) {
                call.respond(HttpStatusCode.OK, aircraft)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }

        // Update aircraft
        put("/aircrafts/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            val aircraft = call.receive<Aircraft>()
            aircraftService.update(id, aircraft)
            call.respond(HttpStatusCode.OK)
        }

        // Delete aircraft
        delete("/aircrafts/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            val resultDelete = aircraftService.delete(id)
            if(resultDelete) {
                call.respond(HttpStatusCode.OK)
            }else{
                call.respond(HttpStatusCode.NotFound)
            }
        }

        //Get Aircraft from User
        get("/aircraft/user/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            val allAicraftFromUser = userService.getAllAircrafts(id)
            call.respond(HttpStatusCode.OK, allAicraftFromUser)
        }
    }
}
