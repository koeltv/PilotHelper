package com.pilothelper.model

import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder

/**
 * Data received from AviationWeatherGov API: https://aviationweather.gov/data/api/#/Data/dataMetars
 */
@Serializable
data class Weather(
    val metar_id: Int,
    val icaoId: String,
    val receiptTime: String,
    val obsTime: Int,
    val reportTime: String,
    val temp: Int,
    val dewp: Int,
    val wdir: Int,
    val wspd: Int,
    val wgst: Int?,
    @Serializable(with = FloatOrStringAsStringSerializer::class)
    val visib: String,
    val altim: Int,
    val slp: String?,
    val qcField: Int,
    val wxString: String?,
    val presTend: String?,
    val maxT: String?,
    val minT: String?,
    val maxT24: String?,
    val minT24: String?,
    val precip: String?,
    val pcp3hr: String?,
    val pcp6hr: String?,
    val pcp24hr: String?,
    val snow: String?,
    val vertVis: String?,
    val metarType: String,
    val rawOb: String,
    val mostRecent: Int,
    val lat: Float,
    val lon: Float,
    val elev: Int,
    val prior: Int,
    val name: String,
    val clouds: List<Cloud>,
    // ...
) {
    @Serializable
    data class Cloud(
        val cover: String,
        val base: Int?
    )
}


object FloatOrStringAsStringSerializer : KSerializer<String> {
    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("FloatOrString", PrimitiveKind.STRING)

    override fun serialize(encoder: Encoder, value: String) {
        encoder.encodeString(value)
    }

    override fun deserialize(decoder: Decoder): String {
        return try {
            decoder.decodeString()
        } catch (e: Exception) {
            decoder.decodeFloat().toString()
        }
    }
}
