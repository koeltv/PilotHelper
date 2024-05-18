package com.pilothelper.plugins

import org.jetbrains.exposed.sql.Database

val dbUser = System.getenv("DB_USERNAME") ?: "root"
val dbPassword = System.getenv("DB_PASSWORD") ?: ""
val dbUrl = System.getenv("DB_URL") ?: "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1"
val dbDriver = System.getenv("DB_DRIVER") ?: "org.h2.Driver"

const val INVALID_ID_FEEDBACK = "Invalid ID"

val database = Database.connect(
    url = dbUrl,
    user = dbUser,
    driver = dbDriver,
    password = dbPassword
)
