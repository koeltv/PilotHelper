package com.pilothelper.fetcher

import com.pilothelper.ApplicationTest
import com.pilothelper.setupClientWithResponse
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.json.Json
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class AirportFetcherTest {

    @OptIn(ExperimentalSerializationApi::class)
    @Test
    fun fetch() {
        val responseContent = ApplicationTest::class.java.getResource("examples/openaip.json")!!.readText()

        val client = setupClientWithResponse(
            status = HttpStatusCode.OK,
            headers = headersOf(HttpHeaders.ContentType, "application/json"),
            content = responseContent,
            json = Json {
                ignoreUnknownKeys = true
                explicitNulls = false
            }
        )
        val fetcher = AirportFetcher(client)
        val airports = runBlocking {
            fetcher.fetch()
        }

        assertNotNull(airports)
        assertEquals(1000, airports.items.size)
    }
}