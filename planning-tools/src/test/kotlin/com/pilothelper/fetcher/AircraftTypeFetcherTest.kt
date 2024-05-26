package com.pilothelper.fetcher

import com.pilothelper.ApplicationTest
import com.pilothelper.setupClientWithResponse
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import kotlin.test.Test

class AircraftTypeFetcherTest {

    @Test
    fun fetchAll() {
        val responseContent = ApplicationTest::class.java.getResource("examples/aviationstack.json")!!.readText()

        val testClient = setupClientWithResponse(
            status = HttpStatusCode.OK,
            headers = headersOf(HttpHeaders.ContentType, "application/json"),
            content = responseContent
        )

        val fetcher = AircraftTypeFetcher(testClient)

        val data = runBlocking {
            fetcher.fetch()
        }

        println(data.pagination)
        println(data.data)
    }
}