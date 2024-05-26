package com.pilothelper.service

import com.pilothelper.fetcher.AirportFetcher
import com.pilothelper.model.Airport
import com.pilothelper.model.Coordinates
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction

class AirportService(
    database: Database,
    airportFetcher: AirportFetcher,
) {
    object Airports : Table() {
        val id = char("id", 24)
        val name = varchar("name", 50)
        val icaoCode = char("icao_code", 4).nullable()
        val iataCode = char("iata_code", 3).nullable()
        val altIdentifier = varchar("alt_identifier", 30).nullable()
        val type = integer("type")
        val country = char("country", 2)
        val latitude = float("latitude")
        val longitude = float("longitude")
        val altitude = integer("altitude")
        val private = bool("private")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Airports)
        }
        CoroutineScope(Dispatchers.IO).launch {
            airportFetcher.fetch().items.forEach { create(it) }
        }
    }

    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }

    suspend fun create(airport: Airport): String = dbQuery {
        Airports.insert {
            it[id] = airport._id
            it[name] = airport.name
            it[icaoCode] = airport.icaoCode
            it[iataCode] = airport.iataCode
            it[altIdentifier] = airport.altIdentifier
            it[type] = airport.type
            it[country] = airport.country
            it[latitude] = airport.geometry.coordinates[1]
            it[longitude] = airport.geometry.coordinates[0]
            it[altitude] = airport.elevation.value // TODO
            it[private] = airport.private
        }[Airports.id]
    }

    suspend fun readAll(): List<Airport> {
        return dbQuery {
            Airports.selectAll().map { it.toAirport() }
        }
    }

    suspend fun findAllNearby(point: Coordinates, radius: Int): List<Airport> {
        return dbQuery {
            Airports.selectAll().where {
                Airports.latitude.between(
                    point.latitude - radius,
                    point.latitude + radius
                ) and Airports.longitude.between(
                    point.longitude - radius,
                    point.longitude + radius
                )
            }.map { it.toAirport() }
        }
    }

    private fun ResultRow.toAirport(): Airport {
        return Airport(
            _id = this[Airports.id],
            name = this[Airports.name],
            icaoCode = this[Airports.icaoCode],
            iataCode = this[Airports.iataCode],
            altIdentifier = this[Airports.altIdentifier],
            type = this[Airports.type],
            country = this[Airports.country],
            geometry = Airport.Geometry(
                type = "Point",
                coordinates = listOf(this[Airports.longitude], this[Airports.latitude])
            ),
            elevation = Airport.Elevation(
                value = this[Airports.altitude],
                unit = 0,
                referenceDatum = 0,
            ),
            private = this[Airports.private],
        )
    }
}
