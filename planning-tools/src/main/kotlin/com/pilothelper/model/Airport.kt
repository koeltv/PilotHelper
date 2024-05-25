package com.pilothelper.model

import kotlinx.serialization.Serializable

/**
 * Data returned by OpenAIP API: https://docs.openaip.net/#/Airports/get_airports
 *
 * Could be exchanged for https://airlabs.co/docs/airports (limit of 1000 requests/month)
 */
@Serializable
data class Airport(
    val _id: String,
    val name: String,
    val icaoCode: String?,
    val iataCode: String?,
    val altIdentifier: String?,
    val type: Int,
    val country: String,
    val geometry: Geometry,
    val elevation: Elevation,
//    val elevationGeoid: ElevationGeoid,
    val trafficType: List<Int>,
    val magneticDeclination: Float,
    val ppr: Boolean,
    val private: Boolean,
    val skydiveActivity: Boolean,
    val winchOnly: Boolean,
//    val services: Services,
//    val frequencies: List<Frequency>,
//    val runways: List<Runway>,
//    val hoursOfOperation: HoursOfOperation,
    val contact: String?,
    val remarks: String?,
//    val images: List<Image>,
    val createdBy: String,
    val updatedBy: String,
    val createdAt: String, // Datetime
    val updatedAt: String, // Datetime
) {
    @Serializable
    data class Geometry(
        val type: String,
        val coordinates: List<Float>
    )

    @Serializable
    data class Elevation(
        val value: Int,
        val unit: Int,
        val referenceDatum: Int,
    )
}
