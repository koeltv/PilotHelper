package com.pilothelper.plugins

import com.pilothelper.fetcher.*
import com.pilothelper.service.AircraftTypeService
import com.pilothelper.service.AirportService
import io.ktor.client.*
import io.ktor.client.engine.apache.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.Database
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

@OptIn(ExperimentalSerializationApi::class)
val appModule = module {
    single<Database> { database }
    singleOf(::AirportService)
    factory<HttpClient> {
        HttpClient(Apache) {
            install(ContentNegotiation) {
                json(Json {
                    ignoreUnknownKeys = true
                    explicitNulls = false
                })
            }
        }
    }
    singleOf(::AirportFetcher)
    singleOf(::IPInfoFetcher)
    singleOf(::WeatherFetcher)
    singleOf(::RouteFetcher)
    singleOf(::AircraftTypeFetcher)
    singleOf(::AircraftTypeService)
}

fun Application.configureDP() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}