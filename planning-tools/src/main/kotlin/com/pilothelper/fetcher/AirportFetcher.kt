package com.pilothelper.fetcher

import com.pilothelper.model.Airport
import com.pilothelper.model.OpenAIPPaginatedData
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

class AirportFetcher(private val client: HttpClient) {
    companion object {
        const val API_URL = "https://api.core.openaip.net/api/airports"
        private val apiKey = System.getenv("OPENAIP_API_KEY") ?: ""
    }

    suspend fun fetchAll(): List<Airport> {
        val airports = mutableListOf<Airport>()

        val totalPages = fetch()?.let {
            airports.addAll(it.items)
            it.totalPages
        } ?: return emptyList()

        var pageIndex = 1
        while (++pageIndex <= totalPages) {
            val partialData = fetch(pageIndex = pageIndex) ?: break
            airports.addAll(partialData.items)
        }

        return airports.toList()
    }

    internal suspend fun fetch(pageIndex: Int = 1): OpenAIPPaginatedData<Airport>? {
        val response = client.get(API_URL) {
            headers.append("x-openaip-client-id", apiKey)
            url {
                parameters.append("page", pageIndex.toString())
            }
        }
        return if (response.status != HttpStatusCode.OK) {
            System.err.println("Received ${response.status} from OpenAIP API: ${response.bodyAsText()}")
            null
        } else {
            response.body()
        }
    }
}