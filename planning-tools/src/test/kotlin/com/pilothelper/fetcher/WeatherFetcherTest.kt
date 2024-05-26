package com.pilothelper.fetcher

import io.ktor.client.*
import io.ktor.client.engine.apache.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.runBlocking
import kotlin.test.Test
import kotlin.test.assertNotNull

class WeatherFetcherTest {

    @Test
    fun fetchInfo() {
        val client = HttpClient(Apache) {
            install(ContentNegotiation) { json() }
        }
        val fetcher = WeatherFetcher(client)
        val weather = runBlocking {
            fetcher.fetchInfo("LFPG")
        }
        println(weather)
        assertNotNull(weather)
    }
}