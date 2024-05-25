package com.pilothelper.fetcher

import com.pilothelper.model.IPInfo
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*

class IPInfoFetcher(private val client: HttpClient) {
    companion object {
        const val API_URL = "https://api.ip2location.io/"
    }

    suspend fun fetchInfo(ip: String): IPInfo {
        val response = client.get(API_URL) {
            url {
                parameters.append("ip", ip)
            }
        }
        val routes: IPInfo = response.body()
        return routes
    }
}