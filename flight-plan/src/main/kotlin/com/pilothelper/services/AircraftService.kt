package com.pilothelper.services

import com.pilothelper.model.Aircraft
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction

class AircraftService(database: Database) {
    object Aircrafts : IntIdTable() {
        val aircraftId = varchar("aircraft_id", length = 7)
        val aircraftType = varchar("aircraft_type", length = 4)
        val turbulenceType = char("turbulence_type", length = 1)
        val equipment = varchar("equipment", length = 30)
        val transponder = varchar("transponder", length = 30)
        val colorAndMarkings = varchar("color_and_markings", length = 100)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Aircrafts)
        }
    }

    private suspend fun <T> dbQuery(block: suspend () -> T): T {
        return newSuspendedTransaction(Dispatchers.IO) { block() }
    }

    suspend fun create(aircraft: Aircraft): Int = dbQuery {
        Aircrafts.insert {
            it[aircraftId] = aircraft.aircraftId
            it[aircraftType] = aircraft.aircraftType
            it[turbulenceType] = aircraft.turbulenceType.toString()
            it[equipment] = aircraft.equipment
            it[transponder] = aircraft.transponder
            it[colorAndMarkings] = aircraft.colorAndMarkings
        }[Aircrafts.id].value
    }

    suspend fun read(id: Int): Aircraft? {
        return dbQuery {
            Aircrafts.select { Aircrafts.id eq id }
                .map { it.toAircraft() }
                .singleOrNull()
        }
    }

    suspend fun update(id: Int, aircraft: Aircraft): Int {
        return dbQuery {
            Aircrafts.update({ Aircrafts.id eq id }) {
                it[aircraftId] = aircraft.aircraftId
                it[aircraftType] = aircraft.aircraftType
                it[turbulenceType] = aircraft.turbulenceType.toString()
                it[equipment] = aircraft.equipment
                it[transponder] = aircraft.transponder
                it[colorAndMarkings] = aircraft.colorAndMarkings
            }
        }
    }

    suspend fun createOrUpdate(aircraft: Aircraft): Int {
        return dbQuery {
            Aircrafts.select { Aircrafts.aircraftId eq aircraft.aircraftId }
                .map { it[Aircrafts.id].value }
                .singleOrNull()
                ?.let { update(it, aircraft) }
                ?: create(aircraft)
        }
    }

    suspend fun delete(id: Int) {
        dbQuery {
            Aircrafts.deleteWhere { Aircrafts.id.eq(id) }
        }
    }

    private fun ResultRow.toAircraft(): Aircraft = Aircraft(
        aircraftId = this[Aircrafts.aircraftId],
        aircraftType = this[Aircrafts.aircraftType],
        turbulenceType = this[Aircrafts.turbulenceType][0],
        equipment = this[Aircrafts.equipment],
        transponder = this[Aircrafts.transponder],
        colorAndMarkings = this[Aircrafts.colorAndMarkings],
    )
}