package com.pilothelper.fetcher

import io.ktor.client.*
import io.ktor.client.engine.apache.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.runBlocking
import kotlin.test.Test
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class RouteFetcherTest {

    @Test
    fun fetchBetween() {
        val client = HttpClient(Apache) {
            install(ContentNegotiation) { json() }
        }
        val fetcher = RouteFetcher(client)
        val routes = runBlocking {
            fetcher.fetchBetween("ABQ", "IAH")
        }
        println(routes)
        assertNotNull(routes)
        assertTrue(routes.isNotEmpty())
    }
}