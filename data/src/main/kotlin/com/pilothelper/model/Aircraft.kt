package com.pilothelper.model

import kotlinx.serialization.Serializable

@Serializable
data class Aircraft(
    val aircraftId: String,
    val aircraftType: String,
    val turbulenceType: String,
    val equipment: String,
    val transponder: String,
    val colorAndMarkings: String,
)