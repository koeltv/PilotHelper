package com.pilothelper.model

import kotlinx.serialization.Serializable

@Serializable
data class UserProfile(
    val sub: String, // Unique user uuid
    val email_verified: Boolean,
    val name: String,
    val preferred_username: String,
    val given_name: String,
    val family_name: String,
    val email: String
)
