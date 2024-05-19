package com.pilothelper

import com.pilothelper.model.Aircraft
import com.pilothelper.model.FlightPlan
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class FlightPlanPdfConverterTest {
    @Test
    fun fillFromShouldWorkForRealisticData() {
        val outputFile = FlightPlanPdfConverter.fillFrom(
            FlightPlan(
                flightRules = 'V',
                flightType = 'G',
                aircraftData = Aircraft(
                    aircraftId = "FGKAO",
                    aircraftType = "PA28",
                    turbulenceType = 'L',
                    equipment = "S",
                    transponder = "S",
                    colorAndMarkings = "BLANC"
                ),
                aircraftCount = 1,
                startingAirport = "LFEB",
                startingTime = "0900",
                cruisingSpeed = "N0110",
                cruisingAltitude = "F055",
                path = "EEE FGD LEP MRP GDH GDF MZO DGC CKE QAJ OSJ KLZ SGC JEL",
                destinationAirport = "LFRS",
                estimatedTime = "0045",
                alternativeAirport = listOf("LFRZ", "LFRI"),
                otherInformations = listOf("DOF/220514 DOF/220514 DOF/220514 DOF/220514"),
                autonomy = "0400",
                occupantCount = 4,
                pilot = "DUPONT",
                remarks = "+33 06 XX XX XX XX",
                equipment = FlightPlan.Equipment(
                    uhfPost = false,
                    vhfPost = false,
                    rdbaBeacon = true,
                    survivalEquipmentDesert = true,
                    survivalEquipmentJungle = true,
                    survivalEquipmentMaritime = true,
                    survivalEquipmentPolar = true,
                    safetyJacketWithLight = true,
                    safetyJacketWithFluorescein = false,
                    safetyJacketWithUHF = false,
                    safetyJacketWithVHF = false,
                    raftCount = 0,
                    raftCapacity = 2,
                    raftCoverageColor = ""
                )
            )
        )
        assertNotNull(outputFile)
        assertEquals("pdf", outputFile.extension)
    }

    @Test
    fun fillFromShouldWorkForValidData() {
        val outputFile = FlightPlanPdfConverter.fillFrom(
            FlightPlan(
                flightRules = 'V',
                flightType = 'G',
                aircraftData = Aircraft(
                    aircraftId = "FGKAO",
                    aircraftType = "PA28",
                    turbulenceType = 'L',
                    equipment = "S",
                    transponder = "S",
                    colorAndMarkings = "BLANC"
                ),
                aircraftCount = 1,
                startingAirport = "LFEB",
                startingTime = "0900",
                cruisingSpeed = "N0110",
                cruisingAltitude = "F055",
                path = "EEE FGD LEP MRP GDH GDF MZO DGC CKE QAJ OSJ KLZ SGC JEL",
                destinationAirport = "LFRS",
                estimatedTime = "0045",
                alternativeAirport = listOf("LFRZ", "LFRI"),
                otherInformations = listOf("DOF/220514 DOF/220514 DOF/220514 DOF/220514"),
                autonomy = "0400",
                occupantCount = 4,
                pilot = "DUPONT",
                remarks = "",
                equipment = FlightPlan.Equipment(
                    uhfPost = false,
                    vhfPost = false,
                    rdbaBeacon = false,
                    survivalEquipmentDesert = false,
                    survivalEquipmentJungle = false,
                    survivalEquipmentMaritime = false,
                    survivalEquipmentPolar = false,
                    safetyJacketWithLight = false,
                    safetyJacketWithFluorescein = false,
                    safetyJacketWithUHF = false,
                    safetyJacketWithVHF = false,
                    raftCount = 1,
                    raftCapacity = 2,
                    raftCoverageColor = "BLEU"
                )
            )
        )
        assertNotNull(outputFile)
        assertEquals("pdf", outputFile.extension)
    }
}