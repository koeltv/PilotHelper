package com.pilothelper.fetcher

import com.pilothelper.ApplicationTest
import com.pilothelper.setupClientWithResponse
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import kotlin.test.Test
import kotlin.test.assertEquals

class WeatherFetcherTest {

    @Test
    fun fetchInfo() {
        val responseContent = ApplicationTest::class.java.getResource("examples/aviationweather.json")!!.readText()

        val client = setupClientWithResponse(
            status = HttpStatusCode.OK,
            headers = headersOf(HttpHeaders.ContentType, "application/json"),
            content = responseContent
        )

        val fetcher = WeatherFetcher(client)
        val weather = runBlocking {
            fetcher.fetchInfo("LFPG")
        }

        assertEquals("LFPG", weather.icaoId)
    }
}