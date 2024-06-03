package com.pilothelper.fetcher

import com.pilothelper.ApplicationTest
import com.pilothelper.setupClientWithResponse
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class AircraftTypeFetcherTest {

    @Test
    fun fetchAll() {
        val responseContent = ApplicationTest::class.java.getResource("examples/icaodesignators.html")!!.readText()

        val testClient = setupClientWithResponse(
            status = HttpStatusCode.OK,
            headers = headersOf(HttpHeaders.ContentType, "text/html"),
            content = responseContent
        )

        val fetcher = AircraftTypeFetcher(testClient)

        val data = runBlocking { fetcher.fetchAll() }

        assertNotNull(data)
        assertEquals(7330, data.size)
    }
}