package com.pilothelper.services

import com.pilothelper.model.Aircraft
import com.pilothelper.model.FlightPlan
import com.pilothelper.model.FlightPlanWithId
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.*

class FlightPlanService(
    database: Database,
    private val aircraftService: AircraftService
) {
    internal object FlightPlans : IntIdTable() {
        // Case 8
        val flightRules = char("flight_rules", length = 1)
        val flightType = char("flight_type", length = 1)

        // Case 7, 9
        val aircraft = reference("aircraft", AircraftService.Aircrafts)

        // Case 9
        val aircraftCount = integer("aircraft_count")

        // Case 13
        val startingAirport = varchar("starting_airport", length = 10)
        val startingTime = char("starting_time", length = 4)

        // Case 15
        val cruisingSpeed = char("cruising_speed", length = 5)
        val cruisingAltitude = char("cruising_altitude", length = 4)
        val path = varchar("path", 250)

        // Case 16
        val destinationAirport = char("destination_airport", length = 4)
        val estimatedTime = char("estimated_time", length = 4)
        val alternativeAirports = varchar("alternative_airports", length = 50)

        // Case 18
        val otherInformations = varchar("other_informations", length = 200)

        // Case 19
        val autonomy = char("autonomy", length = 4)
        val occupantCount = integer("occupant_count")
        val pilot = varchar("pilot", length = 30)
        val remarks = varchar("remarks", length = 200)

        val equipment = reference("equipment", FlightEquipments)
    }

    object FlightEquipments : IntIdTable() {
        val uhfPost = bool("uhf_post")
        val vhfPost = bool("vhf_post")
        val rdbaBeacon = bool("rdba_beacon")
        val survivalEquipmentPolar = bool("survival_equipment_polar")
        val survivalEquipmentDesert = bool("survival_equipment_desert")
        val survivalEquipmentMaritime = bool("survival_equipment_maritime")
        val survivalEquipmentJungle = bool("survival_equipment_jungle")
        val safetyJacketWithLight = bool("safety_jacket_with_light")
        val safetyJacketWithFluorescein = bool("safety_jacket_with_fluorescein")
        val safetyJacketWithUHF = bool("safety_jacket_with_uhf")
        val safetyJacketWithVHF = bool("safety_jacket_with_vhf")
        val raftCount = integer("raft_count")
        val raftCapacity = integer("raft_capacity")
        val raftCoverageColor = varchar("raft_coverage_color", 255)
    }

    internal object FlightPlansUsers : Table() {
        val userId = uuid("user_id")
        val flightPlanId = reference("flight_plan_id", FlightPlans.id)

        override val primaryKey = PrimaryKey(userId, flightPlanId)
    }

    init {
        transaction(database) {
            SchemaUtils.create(FlightEquipments, FlightPlans, FlightPlansUsers)
        }
    }

    private suspend fun <T> dbQuery(block: suspend () -> T): T {
        return newSuspendedTransaction(Dispatchers.IO) { block() }
    }

    suspend fun create(flightPlan: FlightPlan, userId: UUID): Int = dbQuery {
        val equipmentId = FlightEquipments.insertAndGetId {
            it.prepareFrom(flightPlan.equipment)
        }.value

        val aircraftId = aircraftService.createOrUpdate(flightPlan.aircraftData)

        val flightPlanId = FlightPlans.insertAndGetId {
            it.prepareFrom(flightPlan, aircraftId, equipmentId)
        }.value

        FlightPlansUsers.insert {
            it[this.userId] = userId
            it[this.flightPlanId] = flightPlanId
        }

        flightPlanId
    }

    suspend fun read(id: Int): FlightPlan? = dbQuery {
        FlightPlans.innerJoin(FlightEquipments).innerJoin(AircraftService.Aircrafts)
            .select { FlightPlans.id eq id }
            .map { it.toFlightPlan() }
            .singleOrNull()
    }

    suspend fun readAllFromUser(id: UUID): List<FlightPlanWithId> = dbQuery {
        FlightPlans.innerJoin(FlightEquipments).innerJoin(AircraftService.Aircrafts).innerJoin(FlightPlansUsers)
            .select { FlightPlansUsers.userId eq id }
            .map { FlightPlanWithId(it[FlightPlans.id].value, it.toFlightPlan()) }
    }

    suspend fun update(id: Int, flightPlan: FlightPlan) {
        dbQuery {
            val aircraftId = aircraftService.createOrUpdate(flightPlan.aircraftData)

            FlightPlans.update({ FlightPlans.id eq id }) {
                it.prepareFrom(flightPlan, aircraftId)
            }

            val equipmentId = FlightPlans
                .slice(FlightPlans.equipment)
                .select { FlightPlans.id eq id }
                .single()[FlightPlans.equipment]

            FlightEquipments.update({ FlightEquipments.id eq equipmentId }) {
                it.prepareFrom(flightPlan.equipment)
            }
        }
    }

    suspend fun delete(id: Int): Unit = dbQuery {
        val equipmentId = FlightPlans
            .slice(FlightPlans.equipment)
            .select { FlightPlans.id eq id }
            .map { it[FlightPlans.equipment] }
            .single()

        FlightPlansUsers.deleteWhere { flightPlanId eq id }
        FlightPlans.deleteWhere { FlightPlans.id eq id }
        FlightEquipments.deleteWhere { FlightEquipments.id eq equipmentId }
    }

    private fun UpdateBuilder<Int>.prepareFrom(equipment: FlightPlan.Equipment) {
        this[FlightEquipments.uhfPost] = equipment.uhfPost
        this[FlightEquipments.vhfPost] = equipment.vhfPost
        this[FlightEquipments.rdbaBeacon] = equipment.rdbaBeacon
        this[FlightEquipments.survivalEquipmentDesert] = equipment.survivalEquipmentDesert
        this[FlightEquipments.survivalEquipmentJungle] = equipment.survivalEquipmentJungle
        this[FlightEquipments.survivalEquipmentPolar] = equipment.survivalEquipmentPolar
        this[FlightEquipments.survivalEquipmentMaritime] = equipment.survivalEquipmentMaritime
        this[FlightEquipments.safetyJacketWithLight] = equipment.safetyJacketWithLight
        this[FlightEquipments.safetyJacketWithFluorescein] = equipment.safetyJacketWithFluorescein
        this[FlightEquipments.safetyJacketWithUHF] = equipment.safetyJacketWithUHF
        this[FlightEquipments.safetyJacketWithVHF] = equipment.safetyJacketWithVHF
        this[FlightEquipments.raftCount] = equipment.raftCount
        this[FlightEquipments.raftCapacity] = equipment.raftCapacity
        this[FlightEquipments.raftCoverageColor] = equipment.raftCoverageColor
    }

    private fun UpdateBuilder<Int>.prepareFrom(
        flightPlan: FlightPlan,
        aircraftId: Int,
        equipmentId: Int? = null
    ) {
        this[FlightPlans.flightRules] = flightPlan.flightRules.toString()
        this[FlightPlans.flightType] = flightPlan.flightType.toString()
        this[FlightPlans.aircraft] = aircraftId
        this[FlightPlans.aircraftCount] = flightPlan.aircraftCount
        this[FlightPlans.startingAirport] = flightPlan.startingAirport
        this[FlightPlans.startingTime] = flightPlan.startingTime
        this[FlightPlans.cruisingSpeed] = flightPlan.cruisingSpeed
        this[FlightPlans.cruisingAltitude] = flightPlan.cruisingAltitude
        this[FlightPlans.path] = flightPlan.path
        this[FlightPlans.destinationAirport] = flightPlan.destinationAirport
        this[FlightPlans.estimatedTime] = flightPlan.estimatedTime
        this[FlightPlans.alternativeAirports] = flightPlan.alternativeAirport.joinToString(",")
        this[FlightPlans.otherInformations] = flightPlan.otherInformations.joinToString(",")
        this[FlightPlans.autonomy] = flightPlan.autonomy
        this[FlightPlans.occupantCount] = flightPlan.occupantCount
        this[FlightPlans.pilot] = flightPlan.pilot
        this[FlightPlans.remarks] = flightPlan.remarks

        if (equipmentId != null) this[FlightPlans.equipment] = equipmentId
    }

    private fun ResultRow.toFlightPlan() = FlightPlan(
        flightRules = this[FlightPlans.flightRules][0],
        flightType = this[FlightPlans.flightType][0],
        aircraftData = Aircraft(
            aircraftId = this[AircraftService.Aircrafts.aircraftId],
            aircraftType = this[AircraftService.Aircrafts.aircraftType],
            turbulenceType = this[AircraftService.Aircrafts.turbulenceType][0],
            equipment = this[AircraftService.Aircrafts.equipment],
            transponder = this[AircraftService.Aircrafts.transponder],
            colorAndMarkings = this[AircraftService.Aircrafts.colorAndMarkings],
        ),
        aircraftCount = this[FlightPlans.aircraftCount],
        startingAirport = this[FlightPlans.startingAirport],
        startingTime = this[FlightPlans.startingTime],
        cruisingSpeed = this[FlightPlans.cruisingSpeed],
        cruisingAltitude = this[FlightPlans.cruisingAltitude],
        path = this[FlightPlans.path],
        destinationAirport = this[FlightPlans.destinationAirport],
        estimatedTime = this[FlightPlans.estimatedTime],
        alternativeAirport = this[FlightPlans.alternativeAirports].split(","),
        otherInformations = this[FlightPlans.otherInformations].split(","),
        autonomy = this[FlightPlans.autonomy],
        occupantCount = this[FlightPlans.occupantCount],
        pilot = this[FlightPlans.pilot],
        remarks = this[FlightPlans.remarks],
        equipment = FlightPlan.Equipment(
            uhfPost = this[FlightEquipments.uhfPost],
            vhfPost = this[FlightEquipments.vhfPost],
            rdbaBeacon = this[FlightEquipments.rdbaBeacon],
            survivalEquipmentPolar = this[FlightEquipments.survivalEquipmentPolar],
            survivalEquipmentDesert = this[FlightEquipments.survivalEquipmentDesert],
            survivalEquipmentJungle = this[FlightEquipments.survivalEquipmentJungle],
            survivalEquipmentMaritime = this[FlightEquipments.survivalEquipmentMaritime],
            safetyJacketWithLight = this[FlightEquipments.safetyJacketWithLight],
            safetyJacketWithFluorescein = this[FlightEquipments.safetyJacketWithFluorescein],
            safetyJacketWithUHF = this[FlightEquipments.safetyJacketWithUHF],
            safetyJacketWithVHF = this[FlightEquipments.safetyJacketWithVHF],
            raftCount = this[FlightEquipments.raftCount],
            raftCapacity = this[FlightEquipments.raftCapacity],
            raftCoverageColor = this[FlightEquipments.raftCoverageColor]
        )
    )

}