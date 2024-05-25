package com.pilothelper.model

import kotlinx.serialization.Serializable

@Serializable
data class IPInfo(
    val ip: String,
    val country_code: String,
    val country_name: String,
    val region_name: String,
    val city_name: String,
    val latitude: Float,
    val longitude: Float,
    val zip_code: String,
    val time_zone: String,
    val asn: String,
    val `as`: String,
    // ...
    val is_proxy: Boolean,
)
