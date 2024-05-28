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

@OptIn(ExperimentalSerializationApi::class)
class IPInfoFetcherTest {

    @Test
    fun fetchInfo() {
        val responseContent = ApplicationTest::class.java.getResource("examples/techniknews-ipgeo.json")!!.readText()

        val client = setupClientWithResponse(
            status = HttpStatusCode.OK,
            headers = headersOf(HttpHeaders.ContentType, "application/json"),
            content = responseContent,
            json = Json { explicitNulls = false }
        )

        val fetcher = IPInfoFetcher(client)
        val ipInfo = runBlocking {
            fetcher.fetchInfo("8.8.8.8")
        }

        assertNotNull(ipInfo)
        assertEquals("8.8.8.8", ipInfo.ip)
    }
}