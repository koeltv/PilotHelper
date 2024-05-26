package com.pilothelper.service

import com.pilothelper.fetcher.AircraftTypeFetcher
import com.pilothelper.model.AircraftType
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

class AircraftTypeService(
    database: Database,
    private val aircraftTypeFetcher: AircraftTypeFetcher,
) {
    object AircraftTypes : Table() {
        val id = integer("id")
        val iata_code = char("iata_code", 3)
        val aircraft_name = varchar("aircraft_name", 60)
        val plane_type_id = integer("plane_type_id")

        val lastUpdated = date("last_updated")

        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.create(AircraftTypes)
        }
        CoroutineScope(Dispatchers.IO).launch {
            dbQuery {
                if (AircraftTypes.selectAll().empty()) {
                    aircraftTypeFetcher.fetchAll().forEach { create(it) }
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
        val total = AircraftTypes.selectAll().count()
        val toUpdate = AircraftTypes.selectAll()
            .where { AircraftTypes.lastUpdated.lessEq(LocalDate.now().minusDays(30)) }
            .count()
        // We trigger an update if 40% or more of the data are more than a month old
        if (total > 0 && toUpdate >= total * 0.4) {
            aircraftTypeFetcher.fetchAll().forEach { createOrUpdate(it) }
        }
    }

    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }

    internal suspend fun create(airport: AircraftType): Unit = dbQuery {
        AircraftTypes.insert {
            it.setValuesFrom(airport)
        }
    }

    internal suspend fun createOrUpdate(airport: AircraftType): Unit = dbQuery {
        AircraftTypes.upsert {
            it.setValuesFrom(airport)
        }
    }

    suspend fun readAll(): List<AircraftType> = dbQuery {
        AircraftTypes.selectAll().map { it.toAircraftType() }
    }

    private fun UpdateBuilder<Int>.setValuesFrom(aircraftType: AircraftType) {
        this[AircraftTypes.id] = aircraftType.id.toInt()
        this[AircraftTypes.iata_code] = aircraftType.iata_code
        this[AircraftTypes.aircraft_name] = aircraftType.aircraft_name
        this[AircraftTypes.plane_type_id] = aircraftType.plane_type_id.toInt()
        this[AircraftTypes.lastUpdated] = LocalDate.now()
    }

    private fun ResultRow.toAircraftType(): AircraftType = AircraftType(
        id = this[AircraftTypes.id].toString(),
        iata_code = this[AircraftTypes.iata_code],
        aircraft_name = this[AircraftTypes.aircraft_name],
        plane_type_id = this[AircraftTypes.plane_type_id].toString(),
    )
}
