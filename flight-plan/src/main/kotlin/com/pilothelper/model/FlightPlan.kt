package com.pilothelper.model

import kotlinx.serialization.Serializable

@Serializable
data class FlightPlan(
    // Case 8
    val flightRules: Char,
    val flightType: Char,
    // Case 7, 9
    val aircraftData: Aircraft,
    // Case 9
    val aircraftCount: Int,
    // Case 13
    val startingAirport: String,
    val startingTime: String,
    // Case 15
    val cruisingSpeed: String,
    val cruisingAltitude: String,
    val path: String,
    // Case 16
    val destinationAirport: String,
    val estimatedTime: String,
    val alternativeAirport: List<String>,
    // Case 18
    val otherInformations: List<String>,
    // Case 19
    val autonomy: String,
    val occupantCount: Int,
    val pilot: String,
    val equipment: Equipment,
) {
    @Serializable
    data class Equipment(
        val uhfPost: Boolean,
        val vhfPost: Boolean,
        val rdbaBeacon: Boolean,

        val safetyJacketWithLight: Boolean,
        val safetyJacketWithFluorescein: Boolean,
        val safetyJacketWithUHF: Boolean,
        val safetyJacketWithVHF: Boolean,

        val raftCount: Int,
        val raftCapacity: Int,
        val raftCoverageColor: String,
    )
}