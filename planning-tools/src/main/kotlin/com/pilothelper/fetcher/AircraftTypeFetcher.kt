package com.pilothelper.fetcher

import com.pilothelper.model.AircraftType
import com.pilothelper.model.AviationStackPaginatedData
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*

class AircraftTypeFetcher(private val client: HttpClient) {
    companion object {
        private val apiKey = System.getenv("AVIATION_STACK_API_KEY") ?: ""
        const val API_URL = "http://api.aviationstack.com/v1/aircraft_types"
    }

    suspend fun fetchAll(): List<AircraftType> {
        val aircraftTypes = mutableListOf<AircraftType>()

        var partialData = fetch()
        aircraftTypes.addAll(partialData.data)
        val total = partialData.pagination.total

        while (total - aircraftTypes.size > 0) {
            partialData = fetch(offset = aircraftTypes.size + 1)
            aircraftTypes.addAll(partialData.data)
        }

        return aircraftTypes.toList()
    }

    internal suspend fun fetch(offset: Int = 0): AviationStackPaginatedData<AircraftType> {
        val response = client.get(API_URL) {
            url {
                parameters.append("access_key", apiKey)
                parameters.append("offset", offset.toString())
            }
        }
        val paginatedTypes: AviationStackPaginatedData<AircraftType> = response.body()
        return paginatedTypes
    }
}