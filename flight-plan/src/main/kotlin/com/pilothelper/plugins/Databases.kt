package com.pilothelper.plugins

import com.pilothelper.FlightPlanPdfConverter
import com.pilothelper.model.FlightPlan
import com.pilothelper.services.FlightPlanService
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

const val INVALID_ID_FEEDBACK = "Invalid ID"

fun Application.configureDatabases() {
    val database = Database.connect(
        url = dbUrl,
        user = dbUser,
        driver = dbDriver,
        password = dbPassword
    )
    val flightPlanService = FlightPlanService(database)
    routing {
        // Create flight-plan
        post("") {
            val flightPlan = call.receive<FlightPlan>()
            val id = flightPlanService.create(flightPlan)
            call.respond(HttpStatusCode.Created, id)
        }
        // Read flight-plan
        get("{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException(INVALID_ID_FEEDBACK)
            val flightPlan = flightPlanService.read(id)
            if (flightPlan != null) {
                if (call.request.contentType() == ContentType.Application.Pdf) {
                    FlightPlanPdfConverter.fillFrom(flightPlan)
                        ?.let { call.respondFile(it) }
                        ?: call.respond(HttpStatusCode.InternalServerError)
                } else {
                    call.respond(HttpStatusCode.OK, flightPlan)
                }
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }
        // Update flight-plan
        put("{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException(INVALID_ID_FEEDBACK)
            val flightPlan = call.receive<FlightPlan>()
            flightPlanService.update(id, flightPlan)
            call.respond(HttpStatusCode.OK)
        }
        // Delete flight-plan
        delete("{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException(INVALID_ID_FEEDBACK)
            flightPlanService.delete(id)
            call.respond(HttpStatusCode.OK)
        }
    }
}
