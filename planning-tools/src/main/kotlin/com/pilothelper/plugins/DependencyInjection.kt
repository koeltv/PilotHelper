package com.pilothelper.plugins

import com.pilothelper.service.UserService
import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

val appModule = module {
    single<Database> { database }
    singleOf(::UserService)
}

fun Application.configureDP() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}