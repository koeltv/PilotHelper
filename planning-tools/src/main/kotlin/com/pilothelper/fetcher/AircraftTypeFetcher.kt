package com.pilothelper.fetcher

import com.pilothelper.model.AircraftType
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import org.jsoup.Jsoup
import org.jsoup.select.Elements

class AircraftTypeFetcher(private val client: HttpClient) {
    companion object {
        const val API_URL = "https://www.icaodesignators.com/"
    }

    suspend fun fetchAll(): List<AircraftType> {
        val response = client.get(API_URL)
        val htmlDocument = Jsoup.parse(response.bodyAsText())
        val table = htmlDocument.select("table").first()!!
        val rows = table.select("tr")

        return rows.mapNotNull { row ->
            val columns: Elements = row.select("td")
            if (columns.isNotEmpty()) {
                val name = columns[0].select("a").first()!!.text()
                val type = columns[1].text()
                val manufacturer = columns[2].text()
                AircraftType(name, type, manufacturer)
            } else {
                null
            }
        }
    }
}