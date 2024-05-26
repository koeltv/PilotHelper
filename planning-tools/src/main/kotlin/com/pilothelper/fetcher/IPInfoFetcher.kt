package com.pilothelper.fetcher

import com.pilothelper.model.IPInfo
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.serialization.*

class IPInfoFetcher(private val client: HttpClient) {
    companion object {
        const val API_URL = "https://api.techniknews.net/ipgeo"
    }

    suspend fun fetchInfo(ip: String): IPInfo? {
        val response = client.get("$API_URL/$ip")

        return runCatching {
            response.body<IPInfo>()
        }.getOrElse {
            if (it is JsonConvertException) null
            else throw it
        }
    }
}