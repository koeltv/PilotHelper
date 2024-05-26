package com.pilothelper.plugins

import com.pilothelper.service.AircraftService.Aircrafts
import org.jetbrains.exposed.sql.Table

object AircraftsUsers : Table() {
    val userId = uuid("user_id")
    val aircraftId = reference("aircraft_id", Aircrafts.id)

    override val primaryKey = PrimaryKey(userId, aircraftId)
}