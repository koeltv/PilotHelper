package com.pilothelper.model

import kotlinx.serialization.Serializable

/**
 * Data returned by ICAODesignators website: https://www.icaodesignators.com/
 */
@Serializable
data class AircraftType(
    val name: String,
    val designator: String,
    val engineManufacturer: String,
)
