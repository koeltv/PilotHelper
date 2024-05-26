package com.pilothelper.model

import kotlinx.serialization.Serializable

/**
 * AviationAPI route model: https://docs.aviationapi.com/#tag/preferred-routes%2Fpaths%2F~1preferred-routes~1search%2Fget
 */
@Serializable
data class Route(
    val origin: String,
    val route: String,
    val destination: String,
    val hours1: String?,
    val hours2: String?,
    val hours3: String?,
    val type: Char,
    val area: String?,
    val altitude: String?,
    val aircraft: String?,
    val flow: String,
    val seq: Int,
    val d_artcc: String,
    val a_artcc: String,
)
