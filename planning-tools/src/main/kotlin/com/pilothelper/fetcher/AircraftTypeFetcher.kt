package com.pilothelper.fetcher

import com.pilothelper.model.AircraftType
import com.pilothelper.model.AviationStackPaginatedData
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlin.math.ceil

class AircraftTypeFetcher(private val client: HttpClient) {
    companion object {
        private val apiKey = System.getenv("AVIATION_STACK_API_KEY") ?: ""
        const val API_URL = "http://api.aviationstack.com/v1/aircraft_types"
    }

    suspend fun fetchAll(): List<AircraftType> {
        val aircraftTypes = mutableListOf<AircraftType>()

        var dataPage = fetch() ?: return emptyList()
        aircraftTypes.addAll(dataPage.data)
        val pagination = dataPage.pagination
        val pagesLeft = ceil((pagination.total - aircraftTypes.size).toFloat() / pagination.limit).toInt()
        println("AircraftType: ${pagination.total} items to fetch, $pagesLeft pages left to fetch")

        for (i in 1..pagesLeft) {
            println("AircraftType: fetch ${i + 1} out of ${pagesLeft + 1}")
            dataPage = fetch(offset = pagination.limit * i + 1) ?: break
            aircraftTypes.addAll(dataPage.data)
        }

        return aircraftTypes.toList()
    }

    internal suspend fun fetch(offset: Int = 0): AviationStackPaginatedData<AircraftType>? {
        val response = client.get(API_URL) {
            url {
                parameters.append("access_key", apiKey)
                parameters.append("offset", offset.toString())
            }
        }
        return if (response.status != HttpStatusCode.OK) {
            System.err.println("Received ${response.status} from AviationStack API: ${response.bodyAsText()}")
            null
        } else response.body()
    }
}