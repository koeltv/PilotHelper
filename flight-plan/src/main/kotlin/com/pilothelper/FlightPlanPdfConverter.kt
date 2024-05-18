package com.pilothelper

import com.lowagie.text.DocumentException
import com.lowagie.text.pdf.BaseFont
import com.lowagie.text.pdf.PdfContentByte
import com.lowagie.text.pdf.PdfContentByte.ALIGN_LEFT
import com.lowagie.text.pdf.PdfReader
import com.lowagie.text.pdf.PdfStamper
import com.pilothelper.model.FlightPlan
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

object FlightPlanPdfConverter {
    private const val PDF_FORM_NAME = "form/cerfa_14806-01.pdf"

    fun fillFrom(flightPlan: FlightPlan): File? {
        return try {
            PdfReader(PDF_FORM_NAME).use { reader ->
//                val outputFile = File.createTempFile("flight-plan-${UUID.randomUUID()}", ".pdf")
                val outputFile = File("output.pdf")
                println("PDF file: ${outputFile.absolutePath}")

                PdfStamper(reader, FileOutputStream(outputFile)).use { stamper ->
                    val content = stamper.getOverContent(1)

                    val baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED)
                    content.beginText()
                    content.setFontAndSize(baseFont, 18f)

                    content.fillWithData(flightPlan)

                    content.endText()
                }

                outputFile
            }
        } catch (e: IOException) {
            e.printStackTrace()
            null
        } catch (e: DocumentException) {
            e.printStackTrace()
            null
        }
    }
}

/**
 * Fill the PDF form based on the [FlightPlan]
 *
 * @param flightPlan the data to fill the form with
 */
private fun PdfContentByte.fillWithData(flightPlan: FlightPlan) {
    characterSpacing = 7.0f

    // 0, 0 is bottom left

    // Expeditor
    showTextAligned(ALIGN_LEFT, "Batman".uppercase(), 183f, 677f, 0f)
    // Case 7
    showTextAligned(ALIGN_LEFT, flightPlan.aircraftData.aircraftId.uppercase(), 250f, 598f, 0f)
    // Case 8
    showTextAligned(ALIGN_LEFT, flightPlan.flightRules.uppercase(), 451f, 598f, 0f)
    showTextAligned(ALIGN_LEFT, flightPlan.flightType.uppercase(), 508f, 598f, 0f)
    // Case 9
    showTextAligned(ALIGN_LEFT, flightPlan.aircraftCount.toString().padStart(2, '0'), 65f, 558f, 0f)
    showTextAligned(ALIGN_LEFT, flightPlan.aircraftData.aircraftType, 135f, 558f, 0f)
    showTextAligned(ALIGN_LEFT, flightPlan.aircraftData.turbulenceType.uppercase(), 302f, 558f, 0f)
    // Case 10
    showTextAligned(ALIGN_LEFT, flightPlan.aircraftData.equipment, 405f, 545f, 0f)
    showTextAligned(ALIGN_LEFT, flightPlan.aircraftData.transponder, 405f, 515f, 0f)
    // Case 13
    showTextAligned(ALIGN_LEFT, flightPlan.startingAirport, 64f, 518f, 0f)
    showTextAligned(ALIGN_LEFT, flightPlan.startingTime, 243f, 518f, 0f)
    // Case 15
    showTextAligned(ALIGN_LEFT, flightPlan.cruisingSpeed, 64f, 480f, 0f)
    showTextAligned(ALIGN_LEFT, flightPlan.cruisingAltitude, 179f, 480f, 0f)
    // TODO Add path/route
    // Case 16
    showTextAligned(ALIGN_LEFT, flightPlan.destinationAirport, 64f, 380f, 0f)
    showTextAligned(ALIGN_LEFT, flightPlan.estimatedTime, 187f, 380f, 0f)
    if (flightPlan.alternativeAirport.isNotEmpty()) {
        showTextAligned(ALIGN_LEFT, flightPlan.alternativeAirport[0], 325f, 380f, 0f)
    }
    if (flightPlan.alternativeAirport.size > 1) { // TODO
        showTextAligned(ALIGN_LEFT, flightPlan.alternativeAirport[1], 420f, 380f, 0f)
    }
    // Case 19
    showTextAligned(ALIGN_LEFT, flightPlan.autonomy, 92f, 240f, 0f)
    showTextAligned(ALIGN_LEFT, flightPlan.occupantCount.toString().padStart(3, '0'), 241f, 240f, 0f)
    // TODO Other infos

    if (!flightPlan.equipment.uhfPost)
        drawMark(427f, 235f)
    if (!flightPlan.equipment.vhfPost)
        drawMark(471f, 235f)
    if (!flightPlan.equipment.rdbaBeacon)
        drawMark(527f, 235f)

    if (!flightPlan.equipment.safetyJacketWithLight)
        drawMark(387f, 183f)
    if (!flightPlan.equipment.safetyJacketWithFluorescein)
        drawMark(434f, 183f)
    if (!flightPlan.equipment.safetyJacketWithUHF)
        drawMark(484f, 183f)
    if (!flightPlan.equipment.safetyJacketWithVHF)
        drawMark(524f, 183f)
}

/**
 * Draw a checkmark at a given position
 *
 * @param x horizontal left of the mark
 * @param y vertical bottom of the mark
 */
private fun PdfContentByte.drawMark(x: Float, y: Float) {
    setLineWidth(1.5f)
    moveTo(x, y)
    lineTo(x+17, y+17)
    stroke()
}
