package com.pilothelper.service

import com.pilothelper.fetcher.AirportFetcher
import com.pilothelper.model.Airport
import com.pilothelper.model.Coordinates
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate
import kotlin.time.DurationUnit
import kotlin.time.toDuration

class AirportService(
    database: Database,
    private val airportFetcher: AirportFetcher,
) {
    object Airports : Table() {
        val id = char("id", 24)
        val name = varchar("name", 100)
        val icaoCode = char("icao_code", 4).nullable()
        val iataCode = char("iata_code", 3).nullable()
        val altIdentifier = varchar("alt_identifier", 50).nullable()
        val type = integer("type")
        val country = char("country", 2)
        val latitude = float("latitude")
        val longitude = float("longitude")
        val altitude = integer("altitude")
        val private = bool("private")

        val lastUpdated = date("last_updated")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Airports)
        }
        CoroutineScope(Dispatchers.IO).launch {
            dbQuery {
                if (Airports.selectAll().empty()) {
                    airportFetcher.fetchAll().forEach { create(it) }
                }
            }
            // Update mechanism, update old entries every month
            while (true) {
                updateOldEntries()
                delay(30.toDuration(DurationUnit.DAYS))
            }
        }
    }

    private suspend fun updateOldEntries() = dbQuery {
        val total = Airports.selectAll().count()
        val toUpdate = Airports.selectAll()
            .where { Airports.lastUpdated.lessEq(LocalDate.now().minusDays(30)) }
            .count()
        // We trigger an update if 40% or more of the data are more than a month old
        if (total > 0 && toUpdate >= total * 0.4) {
            airportFetcher.fetchAll().forEach { createOrUpdate(it) }
        }
    }

    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }

    internal suspend fun create(airport: Airport): Unit = dbQuery {
        Airports.insert {
            it.setValuesFrom(airport)
        }
    }

    internal suspend fun createOrUpdate(airport: Airport): Unit = dbQuery {
        Airports.upsert {
            it.setValuesFrom(airport)
        }
    }

    suspend fun readAll(): List<Airport> = dbQuery {
        Airports.selectAll().map { it.toAirport() }
    }

    suspend fun readAllWithNameLike(name: String): List<Airport> = dbQuery {
        Airports.selectAll()
            .where { Airports.name like "%$name%" }
            .map { it.toAirport() }
    }

    suspend fun readAllWithICAOLike(icaoCode: String): List<Airport> = dbQuery {
        Airports.selectAll()
            .where { Airports.icaoCode like "%$icaoCode%" }
            .map { it.toAirport() }
    }

    suspend fun readAllWithIATALike(iataCode: String): List<Airport> = dbQuery {
        Airports.selectAll()
            .where { Airports.iataCode like "%$iataCode%" }
            .map { it.toAirport() }
    }

    suspend fun findAllNearby(point: Coordinates, radius: Int): List<Airport> = dbQuery {
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

    private fun UpdateBuilder<Int>.setValuesFrom(airport: Airport) {
        this[Airports.id] = airport._id
        this[Airports.name] = airport.name
        this[Airports.icaoCode] = airport.icaoCode
        this[Airports.iataCode] = airport.iataCode
        this[Airports.altIdentifier] = airport.altIdentifier
        this[Airports.type] = airport.type
        this[Airports.country] = airport.country
        this[Airports.latitude] = airport.geometry.coordinates[1]
        this[Airports.longitude] = airport.geometry.coordinates[0]
        this[Airports.altitude] = airport.elevation.value
        this[Airports.private] = airport.private
        this[Airports.lastUpdated] = LocalDate.now()
    }

    private fun ResultRow.toAirport(): Airport = Airport(
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
            referenceDatum = 1,
        ),
        private = this[Airports.private],
    )
}
