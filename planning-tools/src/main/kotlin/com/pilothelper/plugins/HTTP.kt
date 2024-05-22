package com.pilothelper.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.html.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.swagger.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.html.*
import java.io.*

fun Application.configureHTTP() {
    routing {
        swaggerUI(path = "openapi", swaggerFile = "openapi/documentation.yaml")
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Modified version of io.ktor:ktor-server-swagger, designed to handle reverse-proxies
// Copyright 2014-2022 JetBrains s.r.o and contributors. Use of this source code is governed by the Apache 2.0 license.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a `get` endpoint with [SwaggerUI] at [path] rendered from the OpenAPI file located at [swaggerFile].
 *
 * This method tries to lookup [swaggerFile] in the resources first, and if it's not found, it will try to read it from
 * the file system using [java.io.File].
 *
 */
fun Route.swaggerUI(
    path: String,
    swaggerFile: String = "openapi/documentation.yaml",
    block: SwaggerConfig.() -> Unit = {}
) {
    application.environment.classLoader.getResourceAsStream(swaggerFile)
        ?.bufferedReader()
        ?.let { resource ->
            swaggerUI(path, swaggerFile.takeLastWhile { it != '/' }, resource.readText(), block)
            return
        }

    throw FileNotFoundException("Swagger file not found: $swaggerFile")
}

private fun Route.swaggerUI(
    path: String,
    apiUrl: String,
    api: String,
    block: SwaggerConfig.() -> Unit = {}
) {
    val config = SwaggerConfig().apply(block)

    route(path) {
        get(apiUrl) {
            call.respondText(api, ContentType.fromFilePath(apiUrl).firstOrNull())
        }
        get {
            val fullPath = call.request.path().removePrefix("/")
            call.respondHtml {
                head {
                    title { +"Swagger UI" }
                    link(
                        href = "${config.packageLocation}@${config.version}/swagger-ui.css",
                        rel = "stylesheet"
                    )
                }
                body {
                    div { id = "swagger-ui" }
                    script(src = "${config.packageLocation}@${config.version}/swagger-ui-bundle.js") {
                        attributes["crossorigin"] = "anonymous"
                    }

                    val src = "${config.packageLocation}@${config.version}/swagger-ui-standalone-preset.js"
                    script(src = src) {
                        attributes["crossorigin"] = "anonymous"
                    }

                    script {
                        unsafe {
                            +"""
                            window.onload = function() {
                                window.ui = SwaggerUIBundle({
                                    url: '$fullPath/$apiUrl',
                                    dom_id: '#swagger-ui',
                                    presets: [
                                        SwaggerUIBundle.presets.apis,
                                        SwaggerUIStandalonePreset
                                    ],
                                    layout: 'StandaloneLayout'
                                });
                            }
                            """.trimIndent()
                        }
                    }
                }
            }
        }
    }
}