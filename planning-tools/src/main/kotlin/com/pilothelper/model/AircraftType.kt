package com.pilothelper.model

import kotlinx.serialization.Serializable

/**
 * Data returned by AviationStack API: https://aviationstack.com/documentation
 */
@Serializable
data class AircraftType(
    val id: String,
    val iata_code: String,
    val aircraft_name: String,
    val plane_type_id: String,
)
