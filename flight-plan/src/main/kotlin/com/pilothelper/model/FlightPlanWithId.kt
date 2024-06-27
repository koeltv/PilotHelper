package com.pilothelper.model

import kotlinx.serialization.Serializable

@Serializable
data class FlightPlanWithId(
    val id: Int,
    val flightPlan: FlightPlan,
)
