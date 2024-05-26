package com.pilothelper.model

import kotlinx.serialization.Serializable

@Serializable
data class IPInfo(
    val status: String,
    val continent: String,
    val country: String,
    val countryCode: String,
    val regionName: String,
    val city: String,
    val zip: String,
    val lat: Float,
    val lon: Float,
    val timezone: String,
    val currency: String,
    val isp: String,
    val org: String,
    val `as`: String,
    val reverse: String,
    val mobile: Boolean,
    val proxy: Boolean,
    val hosting: Boolean,
    val ip: String,
    val cached: Boolean,
    val cacheTimestamp: Int,
)
