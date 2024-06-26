package com.pilothelper

import com.pilothelper.plugins.*
import io.ktor.server.application.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureDP()
    configureHTTP()
    configureMonitoring()
    configureSerialization()
    configureCors()
    configureRouting()
}
