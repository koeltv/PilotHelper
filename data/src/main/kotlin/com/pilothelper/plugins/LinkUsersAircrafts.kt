package com.pilothelper.plugins

import com.pilothelper.plugins.AircraftService.Aircrafts
import com.pilothelper.plugins.UserService.Users
import org.jetbrains.exposed.sql.Table

object LinksUsersAircrafts : Table() {
    val userId = reference("userId", Users.id)
    val aircraftId = reference("aircraftID", Aircrafts.id)

    override val primaryKey = PrimaryKey(userId, aircraftId)
}