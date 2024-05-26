package com.pilothelper.fetcher

import io.ktor.client.*
import io.ktor.client.engine.apache.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import kotlin.test.Test
import kotlin.test.assertNotNull

class IPInfoFetcherTest {

    @Test
    fun fetchInfo() {
        val client = HttpClient(Apache) {
            install(ContentNegotiation) {
                json(Json {
                    ignoreUnknownKeys = true
                })
            }
        }
        val fetcher = IPInfoFetcher(client)
        val ipInfo = runBlocking {
            fetcher.fetchInfo("8.8.8.8")
        }
        println(ipInfo)
        assertNotNull(ipInfo)
    }
}