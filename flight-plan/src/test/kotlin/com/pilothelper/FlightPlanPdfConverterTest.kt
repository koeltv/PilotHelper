package com.pilothelper

import com.pilothelper.model.Aircraft
import com.pilothelper.model.FlightPlan
import kotlin.test.Test
import kotlin.test.assertNotNull

class FlightPlanPdfConverterTest {
    @Test
    fun fillFromShouldWorkForValidData() {
        val outputFile = FlightPlanPdfConverter.fillFrom(
            FlightPlan(
                flightRules = 'C',
                flightType = 'C',
                aircraftData = Aircraft(
                    aircraftId = "ZZZZ",
                    aircraftType = "D",
                    turbulenceType = 'C',
                    equipment = "F",
                    transponder = "C",
                    colorAndMarkings = "YELLOW"
                ),
                aircraftCount = 2,
                startingAirport = "ZZZZ",
                startingTime = "0123",
                cruisingSpeed = "Z123",
                cruisingAltitude = "D1245",
                path = "This is a path",
                destinationAirport = "ZZZZ",
                estimatedTime = "0254",
                alternativeAirport = listOf("ZZZZ"),
                otherInformations = listOf(""),
                autonomy = "0425",
                occupantCount = 1,
                pilot = "ME",
                equipment = FlightPlan.Equipment(
                    uhfPost = false,
                    vhfPost = false,
                    rdbaBeacon = false,
                    safetyJacketWithLight = false,
                    safetyJacketWithFluorescein = false,
                    safetyJacketWithUHF = false,
                    safetyJacketWithVHF = false,
                    raftCount = 2,
                    raftCapacity = 2,
                    raftCoverageColor = "BLUE"
                )
            )
        )
        assertNotNull(outputFile)
    }
}