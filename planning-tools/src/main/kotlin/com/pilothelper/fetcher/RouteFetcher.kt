package com.pilothelper.fetcher

import com.pilothelper.model.Route
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*

class RouteFetcher(private val client: HttpClient) {
    companion object {
        const val API_URL = "https://api.aviationapi.com/v1/preferred-routes/search"
    }

    suspend fun fetchBetween(startingAirport: String, arrivalAirport: String): List<Route> {
        val response = client.get(API_URL) {
            url {
                parameters.append("origin", startingAirport)
                parameters.append("dest", arrivalAirport)
            }
        }
        val routes: List<Route> = response.body()
        return routes
    }
}