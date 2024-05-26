package com.pilothelper.fetcher

import com.pilothelper.model.Weather
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*

class WeatherFetcher(private val client: HttpClient) {
    companion object {
        const val API_URL = "https://aviationweather.gov/api/data/metar"
    }

    suspend fun fetchInfo(airportId: String): Weather {
        val response = client.get(API_URL) {
            url {
                parameters.append("format", "json")
                parameters.append("ids", airportId)
            }
        }
        val weather: List<Weather> = response.body()
        return weather[0]
    }
}