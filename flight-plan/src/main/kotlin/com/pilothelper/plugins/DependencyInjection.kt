package com.pilothelper.plugins

import com.pilothelper.services.AircraftService
import com.pilothelper.services.FlightPlanService
import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

val appModule = module {
    single<Database> { database }
    singleOf(::AircraftService)
    singleOf(::FlightPlanService)
}

fun Application.configureDP() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}