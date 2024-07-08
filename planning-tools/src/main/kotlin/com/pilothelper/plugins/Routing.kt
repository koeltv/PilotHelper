package com.pilothelper.plugins

import com.pilothelper.fetcher.IPInfoFetcher
import com.pilothelper.fetcher.RouteFetcher
import com.pilothelper.fetcher.WeatherFetcher
import com.pilothelper.model.Coordinates
import com.pilothelper.service.AircraftTypeService
import com.pilothelper.service.AirportService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.plugins.forwardedheaders.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.get
import org.koin.ktor.ext.inject

fun Application.configureRouting() {
    // Handle IP address even through reverse proxy
    install(ForwardedHeaders)

    val aircraftTypeService = get<AircraftTypeService>()
    val airportService = get<AirportService>()
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

            if (weather != null) call.respond(weather)
            else call.respond(HttpStatusCode.NotFound)
        }

        get("/route") {
            val from = call.request.queryParameters["from"]
                ?: throw MissingRequestParameterException("Missing \"from\" airport")
            val to =
                call.request.queryParameters["to"] ?: throw MissingRequestParameterException("Missing \"to\" airport")

            val routes = routeFetcher.fetchBetween(from, to)
            call.respond(routes)
        }

        get("/aircraft-type") {
            call.respond(aircraftTypeService.readAll())
        }

        get("/aircraft-type/name/{name}") {
            val partialAircraftName =
                call.parameters["name"] ?: throw MissingRequestParameterException("Missing aircraft name")
            call.respond(aircraftTypeService.readAllWithNameLike(partialAircraftName))
        }

        get("/aircraft-type/type/{type}") {
            val partialAircraftType =
                call.parameters["type"] ?: throw MissingRequestParameterException("Missing aircraft type")
            call.respond(aircraftTypeService.readAllWithDesignatorLike(partialAircraftType))
        }

        get("/airport") {
            call.respond(airportService.readAll())
        }

        get("/airport/name/{name}") {
            val partialAirportName =
                call.parameters["name"] ?: throw MissingRequestParameterException("Missing airport name")
            call.respond(airportService.readAllWithNameLike(partialAirportName.uppercase()))
        }

        get("/airport/icao/{icaoCode}") {
            val partialAirportName =
                call.parameters["icaoCode"] ?: throw MissingRequestParameterException("Missing icao code")
            call.respond(airportService.readAllWithICAOLike(partialAirportName))
        }

        get("/airport/iata/{iataCode}") {
            val partialAirportName =
                call.parameters["iataCode"] ?: throw MissingRequestParameterException("Missing iata code")
            call.respond(airportService.readAllWithIATALike(partialAirportName))
        }

        // Read all airports close to a given point
        get("/airport/nearby/location") {
            val latitude = call.request.queryParameters["latitude"]?.toFloatOrNull()
                ?: throw BadRequestException("Missing latitude")
            val longitude = call.request.queryParameters["longitude"]?.toFloatOrNull()
                ?: throw BadRequestException("Missing longitude")
            val radius = call.request.queryParameters["radius"]?.toFloatOrNull() ?: 2f
            val coordinates = Coordinates(latitude, longitude)

            val nearbyAirports = airportService.findAllNearby(coordinates, radius)
            call.respond(nearbyAirports)
        }

        // Read all airports close to a given point
        get("/airport/nearby/ip/{ip?}") {
            val radius = call.request.queryParameters["radius"]?.toFloatOrNull() ?: 2f

            val ip = call.parameters["ip"]
                ?.let { if (it.matches(Regex("\\d{1,3}(\\.\\d{1,3}){3}"))) it else null }
                ?: call.request.origin.remoteAddress

            val ipInfo = ipInfoFetcher.fetchInfo(ip)
                ?: throw BadRequestException("Address $ip is in a reserved range, client: ${call.request.origin}")
            val coordinates = Coordinates(ipInfo.lat, ipInfo.lon)

            val nearbyAirports = airportService.findAllNearby(coordinates, radius)
            call.respond(nearbyAirports)
        }
    }
}
