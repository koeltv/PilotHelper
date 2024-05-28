package com.pilothelper.fetcher

import com.pilothelper.ApplicationTest
import com.pilothelper.setupClientWithResponse
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class RouteFetcherTest {

    @Test
    fun fetchBetween() {
        val responseContent = ApplicationTest::class.java.getResource("examples/aviationapi.json")!!.readText()

        val client = setupClientWithResponse(
            status = HttpStatusCode.OK,
            headers = headersOf(HttpHeaders.ContentType, "application/json"),
            content = responseContent
        )

        val fetcher = RouteFetcher(client)
        val routes = runBlocking {
            fetcher.fetchBetween("ABQ", "IAH")
        }

        assertTrue(routes.isNotEmpty())
        for (route in routes) {
            assertEquals("ABQ", route.origin)
            assertEquals("IAH", route.destination)
        }
    }
}