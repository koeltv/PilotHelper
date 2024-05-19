package com.pilothelper.plugins

import com.pilothelper.plugins.UserService.Users
import kotlinx.coroutines.Dispatchers
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction

@Serializable
data class Aircraft(
    val aircraftId: String,
    val aircraftType: String,
    val turbulenceType: String,
    val equipment: String,
    val transponder: String,
)

class AircraftService( database: Database) {
    object Aircrafts : IntIdTable() {
        val aircraftId = varchar("aircraftId", 7)
        val aircraftType = varchar("aircraftType", 4)
        val turbulenceType = varchar("turbulenceType", 1)
        val equipment = varchar("equipment", 30)
        val transponder = varchar("transponder", 30)
    }

    init {
        transaction(database) {
            SchemaUtils.create(Aircrafts)
            SchemaUtils.create(LinksUsersAircrafts)
        }
    }

    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }

    suspend fun create(aircraft: Aircraft, users: List<ExposedUser>) = dbQuery {
        val aircraftIdforLink = Aircrafts.insert {
            it[aircraftId] = aircraft.aircraftId
            it[aircraftType] = aircraft.aircraftType
            it[turbulenceType] = aircraft.turbulenceType
            it[equipment] = aircraft.equipment
            it[transponder] = aircraft.transponder
        }[Aircrafts.id].value
        for(user in users) {
            val userIdforLink = Users.insertIgnore {
                it[name] = user.name
            } [Users.id]
            LinksUsersAircrafts.insert{
                it[userId] = userIdforLink
                it[aircraftId] = aircraftIdforLink
            }
        }
    }
    suspend fun read(id: Int): Aircraft? {
        return dbQuery {
            Aircrafts.select { Aircrafts.id eq id }
                .map {
                    Aircraft(it[Aircrafts.aircraftId],
                    it[Aircrafts.aircraftType],
                    it[Aircrafts.turbulenceType],
                    it[Aircrafts.equipment],
                    it[Aircrafts.transponder])
                }
                .singleOrNull()
        }
    }
    suspend fun update(id: Int, aircraft: Aircraft) {
        dbQuery {
            Aircrafts.update({ Aircrafts.id eq id }) {
                it[aircraftId] = aircraft.aircraftId
                it[aircraftType] = aircraft.aircraftType
                it[turbulenceType] = aircraft.turbulenceType
                it[equipment] = aircraft.equipment
                it[transponder] = aircraft.transponder
            }
        }
    }

    suspend fun delete(id: Int) :Boolean {
        return  dbQuery {
            Aircrafts.deleteWhere { Aircrafts.id.eq(id) }
        }>0
    }
}