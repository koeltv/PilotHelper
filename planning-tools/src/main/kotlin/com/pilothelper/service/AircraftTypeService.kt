package com.pilothelper.service

import com.pilothelper.fetcher.AircraftTypeFetcher
import com.pilothelper.model.AircraftType
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.CurrentDate
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
    object AircraftTypes : IntIdTable() {
        val name = varchar("name", 40)
        val designator = varchar("designator", 4)
        val engineManufacturer = varchar("engine_manufacturer", 40)

        val lastUpdated = date("last_updated").defaultExpression(CurrentDate)
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
            .where { AircraftTypes.lastUpdated lessEq LocalDate.now().minusDays(30) }
            .count()
        // We trigger an update if 40% or more of the data are more than a month old
        if (total > 0 && toUpdate >= total * 0.4) {
            aircraftTypeFetcher.fetchAll().forEach { createOrUpdate(it) }
        }
    }

    private suspend fun <T> dbQuery(block: suspend () -> T): T =
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

    suspend fun readAllWithNameLike(name: String): List<AircraftType> = dbQuery {
        AircraftTypes.selectAll()
            .where { AircraftTypes.name like "%$name%" }
            .map { it.toAircraftType() }
    }

    suspend fun readAllWithDesignatorLike(designation: String): List<AircraftType> = dbQuery {
        AircraftTypes.selectAll()
            .where { AircraftTypes.designator like "%$designation%" }
            .map { it.toAircraftType() }
    }

    private fun UpdateBuilder<Int>.setValuesFrom(aircraftType: AircraftType) {
        this[AircraftTypes.name] = aircraftType.name
        this[AircraftTypes.designator] = aircraftType.designator
        this[AircraftTypes.engineManufacturer] = aircraftType.engineManufacturer
        this[AircraftTypes.lastUpdated] = LocalDate.now()
    }

    private fun ResultRow.toAircraftType(): AircraftType = AircraftType(
        name = this[AircraftTypes.name],
        designator = this[AircraftTypes.designator],
        engineManufacturer = this[AircraftTypes.engineManufacturer],
    )
}
