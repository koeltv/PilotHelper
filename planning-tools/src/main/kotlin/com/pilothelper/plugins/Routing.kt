package com.pilothelper.plugins

import com.pilothelper.fetcher.IPInfoFetcher
import com.pilothelper.fetcher.RouteFetcher
import com.pilothelper.fetcher.WeatherFetcher
import com.pilothelper.model.Coordinates
import com.pilothelper.service.AirportService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.plugins.forwardedheaders.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Application.configureRouting() {
    // Handle IP address even through reverse proxy
    install(ForwardedHeaders)

    val airportService by inject<AirportService>()
    val ipInfoFetcher by inject<IPInfoFetcher>()
    val weatherFetcher by inject<WeatherFetcher>()
    val routeFetcher by inject<RouteFetcher>()

    routing {
        get("/") {
            call.respondText("Hello World!")
        }

        get("/weather/{airportId}") {
            val airportId = call.parameters["airportId"] ?: throw MissingRequestParameterException("Missing airport ID")
            val weather = weatherFetcher.fetchInfo(airportId)
            call.respond(weather)
        }

        get("/route") {
            val from = call.request.queryParameters["from"]
                ?: throw MissingRequestParameterException("Missing \"from\" airport")
            val to =
                call.request.queryParameters["to"] ?: throw MissingRequestParameterException("Missing \"to\" airport")

            val routes = routeFetcher.fetchBetween(from, to)
            call.respond(routes)
        }

        get("/aircraft-type") { // TODO
            call.respondText("Not Yet Implemented", ContentType.Text.Plain, HttpStatusCode.NotImplemented)
        }

        get("/airport") { // TODO Expand for search
            call.respond(airportService.readAll())
        }

        // Read all airports close to a given point
        get("/airport/nearby") {
            val latitude = call.request.queryParameters["latitude"]?.toFloatOrNull()
            val longitude = call.request.queryParameters["longitude"]?.toFloatOrNull()

            val coordinates = if (latitude != null && longitude != null) {
                Coordinates(latitude, longitude)
            } else {
                val clientAddress = call.request.origin.remoteHost
                val ipInfo = ipInfoFetcher.fetchInfo(clientAddress)
                    ?: throw BadRequestException("Address $clientAddress is in a reserved range")
                Coordinates(ipInfo.lat, ipInfo.lon)
            }

            val nearbyAirports = airportService.findAllNearby(coordinates, 5)
            call.respond(nearbyAirports)
        }
    }
}
