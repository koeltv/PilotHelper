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
import java.util.*

object FlightPlanPdfConverter {
    private const val PDF_FORM_NAME = "form/cerfa_14806-01.pdf"

    fun fillFrom(flightPlan: FlightPlan): File? {
        return try {
            PdfReader(PDF_FORM_NAME).use { reader ->
                val outputFile = File.createTempFile("flight-plan-${UUID.randomUUID()}", ".pdf")
                println("PDF file: ${outputFile.absolutePath}")

                PdfStamper(reader, FileOutputStream(outputFile)).use { stamper ->
                    val content = stamper.getOverContent(1)

                    // We use courier because it is a Monospace font
                    val baseFont = BaseFont.createFont(BaseFont.COURIER, BaseFont.CP1252, BaseFont.NOT_EMBEDDED)
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
 * Fill the PDF form based on the [FlightPlan].
 * Text is placed based on coordinates. (0, 0) is the bottom-left of the page.
 *
 * @param flightPlan the data to fill the form with
 */
private fun PdfContentByte.fillWithData(flightPlan: FlightPlan) {
    // Case 7
    printSpacedText(flightPlan.aircraftData.aircraftId.uppercase(), 249f, 599f)
    // Case 8
    printSpacedText(flightPlan.flightRules.uppercase(), 452f, 599f)
    printSpacedText(flightPlan.flightType.uppercase(), 509f, 599f)
    // Case 9
    printSpacedText(flightPlan.aircraftCount.toString().padStart(2, '0'), 66f, 559f)
    printSpacedText(flightPlan.aircraftData.aircraftType, 136f, 559f)
    printSpacedText(flightPlan.aircraftData.turbulenceType.uppercase(), 303f, 559f)
    // Case 10
    printText(flightPlan.aircraftData.equipment, 405f, 546f)
    printText(flightPlan.aircraftData.transponder, 405f, 516f)
    // Case 13
    printSpacedText(flightPlan.startingAirport, 64f, 518f)
    printSpacedText(flightPlan.startingTime, 243f, 518f)
    // Case 15
    printSpacedText(flightPlan.cruisingSpeed, 63f, 481f)
    printSpacedText(flightPlan.cruisingAltitude, 180f, 481f)
    printParagraph(
        flightPlan.path, listOf(
            Line(294f, 480f, 26),
            Line(30f, 461f, 55),
            Line(30f, 443f, 55),
            Line(30f, 425f, 51),
        )
    )
    // Case 16
    printSpacedText(flightPlan.destinationAirport, 65f, 380f)
    printSpacedText(flightPlan.estimatedTime, 186f, 380f)
    if (flightPlan.alternativeAirport.isNotEmpty()) {
        printSpacedText(flightPlan.alternativeAirport[0], 328f, 382f)
    }
    if (flightPlan.alternativeAirport.size > 1) {
        printSpacedText(flightPlan.alternativeAirport[1], 436f, 382f)
    }
    // Case 18
    printParagraph(
        flightPlan.otherInformations.joinToString(" "), listOf(
            Line(176f, 355f, 39),
            Line(30f, 338f, 55),
            Line(30f, 319f, 55),
            Line(30f, 300f, 51),
        )
    )
    // Case 19
    printSpacedText(flightPlan.autonomy, 92f, 240f)
    printSpacedText(flightPlan.occupantCount.toString().padStart(3, '0'), 241f, 241f)

    fillEquipment(flightPlan.equipment)

    printText(flightPlan.aircraftData.colorAndMarkings, 96f, 109f)

    if (flightPlan.remarks.isBlank()) drawMark(63f, 81f)
    else printText(flightPlan.remarks, 96f, 82f)

    printText(flightPlan.pilot, 96f, 55f)
    printText(flightPlan.pilot, 35f, 25f)
}

/**
 * Print all information related to the [FlightPlan.Equipment]
 */
private fun PdfContentByte.fillEquipment(equipment: FlightPlan.Equipment) {
    if (!equipment.uhfPost) drawMark(427f, 235f)
    if (!equipment.vhfPost) drawMark(471f, 235f)
    if (!equipment.rdbaBeacon) drawMark(527f, 235f)

    if (!equipment.survivalEquipmentPolar) drawMark(113f, 185f)
    if (!equipment.survivalEquipmentDesert) drawMark(160f, 185f)
    if (!equipment.survivalEquipmentMaritime) drawMark(207f, 185f)
    if (!equipment.survivalEquipmentJungle) drawMark(252f, 185f)

    if (!equipment.safetyJacketWithLight) drawMark(387f, 184f)
    if (!equipment.safetyJacketWithFluorescein) drawMark(434f, 184f)
    if (!equipment.safetyJacketWithUHF) drawMark(484f, 184f)
    if (!equipment.safetyJacketWithVHF) drawMark(524f, 184f)

    if (equipment.raftCount == 0) {
        drawMark(65f, 140f)
    } else {
        printSpacedText(equipment.raftCount.toString().padStart(2, '0'), 99f, 142f)
        printSpacedText(equipment.raftCapacity.toString().padStart(3, '0'), 165f, 142f)
    }

    if (equipment.raftCoverageColor.isBlank()) drawMark(245f, 140f)
    else printText(equipment.raftCoverageColor, 302f, 142f)
}

/**
 * Prints a [String] as a paragraph spread between the lines in the given order.
 * Text is cut by spaces, that is to say a word won't be cut into parts.
 */
private fun PdfContentByte.printParagraph(paragraph: String, lines: List<Line>) {
    val words = paragraph.split(" ")
    val wordsPerLine = List(lines.size) { mutableListOf<String>() }
    var currentLineIndex = 0
    for (word in words) {
        val currentLineLength =
            wordsPerLine[currentLineIndex].sumOf { it.length } + wordsPerLine[currentLineIndex].size - 1
        if (word.length + 1 + currentLineLength > lines[currentLineIndex].maxLength) {
            currentLineIndex++
            if (currentLineIndex > wordsPerLine.lastIndex) break
        }
        wordsPerLine[currentLineIndex] += word
    }

    for ((index, line) in lines.withIndex()) {
        printText(wordsPerLine[index].joinToString(" "), line.x, line.y)
    }
}

/**
 * Represents a line on the form
 */
private data class Line(val x: Float, val y: Float, val maxLength: Int)

/**
 * Print text at given coordinates
 */
private fun PdfContentByte.printText(text: String, x: Float, y: Float) {
    showTextAligned(ALIGN_LEFT, text, x, y, 0f)
}

/**
 * Print text at given coordinates with spacing in between to fit in the form
 */
private fun PdfContentByte.printSpacedText(text: String, x: Float, y: Float) {
    val originalSpacing = characterSpacing
    characterSpacing = 7.0f
    printText(text, x, y)
    characterSpacing = originalSpacing
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
    lineTo(x + 17, y + 17)
    stroke()
}
