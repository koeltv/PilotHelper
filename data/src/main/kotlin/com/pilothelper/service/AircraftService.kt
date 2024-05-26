package com.pilothelper.service

import com.pilothelper.model.Aircraft
import com.pilothelper.plugins.AircraftsUsers
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.*

class AircraftService(database: Database) {
    object Aircrafts : IntIdTable() {
        val aircraftId = varchar("aircraft_id", 7)
        val aircraftType = varchar("aircraft_type", 4)
        val turbulenceType = char("turbulence_type", 1)
        val equipment = varchar("equipment", 30)
        val transponder = varchar("transponder", 30)
        val colorAndMarkings = varchar("color_and_markings", 100)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Aircrafts, AircraftsUsers)
        }
    }

    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }

    suspend fun create(aircraft: Aircraft, userIds: List<UUID>): Unit = dbQuery {
        val aircraftIdforLink = Aircrafts.insert {
            it[aircraftId] = aircraft.aircraftId
            it[aircraftType] = aircraft.aircraftType
            it[turbulenceType] = aircraft.turbulenceType
            it[equipment] = aircraft.equipment
            it[transponder] = aircraft.transponder
            it[colorAndMarkings] = aircraft.colorAndMarkings
        }[Aircrafts.id].value

        for (id in userIds) {
            AircraftsUsers.insert {
                it[userId] = id
                it[aircraftId] = aircraftIdforLink
            }
        }
    }

    suspend fun read(id: Int): Aircraft? = dbQuery {
        Aircrafts.select { Aircrafts.id eq id }
            .map { it.toAircraft() }
            .singleOrNull()
    }

    suspend fun update(id: Int, aircraft: Aircraft): Unit = dbQuery {
        Aircrafts.update({ Aircrafts.id eq id }) {
            it.setValuesFrom(aircraft)
        }
    }

    suspend fun delete(id: Int): Boolean = dbQuery {
        Aircrafts.deleteWhere { Aircrafts.id eq id }
    } > 0

    suspend fun readUserAircrafts(id: UUID): List<Aircraft> = dbQuery {
        AircraftsUsers.innerJoin(Aircrafts)
            .select(AircraftsUsers.userId eq id)
            .map { it.toAircraft() }
    }

    private fun UpdateBuilder<Int>.setValuesFrom(aircraft: Aircraft) {
        this[Aircrafts.aircraftId] = aircraft.aircraftId
        this[Aircrafts.aircraftType] = aircraft.aircraftType
        this[Aircrafts.turbulenceType] = aircraft.turbulenceType
        this[Aircrafts.equipment] = aircraft.equipment
        this[Aircrafts.transponder] = aircraft.transponder
        this[Aircrafts.colorAndMarkings] = aircraft.colorAndMarkings
    }

    private fun ResultRow.toAircraft() = Aircraft(
        this[Aircrafts.aircraftId],
        this[Aircrafts.aircraftType],
        this[Aircrafts.turbulenceType],
        this[Aircrafts.equipment],
        this[Aircrafts.transponder],
        this[Aircrafts.colorAndMarkings],
    )
}