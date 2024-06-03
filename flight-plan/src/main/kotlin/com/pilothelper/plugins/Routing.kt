package com.pilothelper.plugins

import com.pilothelper.FlightPlanPdfConverter
import com.pilothelper.model.FlightPlan
import com.pilothelper.services.FlightPlanService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Application.configureRouting() {
    val flightPlanService by inject<FlightPlanService>()

    routing {
        get("/") {
            call.respondText("This is the Flight Plan API")
        }
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
                call.respond(HttpStatusCode.OK, flightPlan)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }
        get("{id}/pdf") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException(INVALID_ID_FEEDBACK)
            val flightPlan = flightPlanService.read(id)
            if (flightPlan != null) {
                FlightPlanPdfConverter.fillFrom(flightPlan)
                    ?.let {
                        call.respondFile(it)
                        it.delete()
                    }
                    ?: call.respond(HttpStatusCode.InternalServerError)
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
