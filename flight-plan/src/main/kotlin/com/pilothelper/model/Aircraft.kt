package com.pilothelper.model

import kotlinx.serialization.Serializable

@Serializable
data class Aircraft(
    val aircraftId: String,
    val aircraftType: String,
    val turbulenceType: Char,
    val equipment: String,
    val transponder: String,
    val colorAndMarkings: String,
)