package com.pashusetu.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "animals")
data class AnimalEntity(
    @PrimaryKey val id: String,
    val name: String,
    val tag: String,
    val species: String,
    val breed: String,
    val sex: String,
    val age: String,
    val imgUrl: String,
    val status: String,
    val risk: String,
    val riskLabel: String,
    val yield: Double,
    val baseline: Double,
    val yieldDelta: Int,
    val vaccPercent: Int,
    val note: String,
    val caseId: String? = null
)

@Entity(tableName = "case_reports")
data class CaseReportEntity(
    @PrimaryKey val id: String,
    val animalId: String,
    val animalName: String,
    val species: String,
    val ownerName: String,
    val village: String,
    val distanceKm: Double,
    val ageWaiting: String,
    val animalCount: Int,
    val deathCount: Int,
    val confidence: Int,
    val severity: String,
    val signsSummary: String,
    val quote: String,
    val surroundingContext: String,
    val filedDate: String,
    val vetEta: String,
    val isMine: Boolean,
    val photosJson: String,  // JSON String list
    val evidenceJson: String // JSON String list
)

@Entity(tableName = "alerts")
data class AlertEntity(
    @PrimaryKey val id: String,
    val tier: String,
    val isUnread: Boolean,
    val iconType: String,
    val tone: String,
    val title: String,
    val description: String,
    val timeAgo: String,
    val actionText: String?,
    val groupName: String
)

@Entity(tableName = "district_clusters")
data class DistrictClusterEntity(
    @PrimaryKey val id: String,
    val name: String,
    val severity: String,
    val villagesCount: Int,
    val animalsAffected: Int,
    val deathCount: Int,
    val timeWindow: String,
    val riskScore: Int,
    val leadDays: Int,
    val confidence: String,
    val isZoonotic: Boolean,
    val suspectedDisease: String,
    val mapX: Float,
    val mapY: Float,
    val radius: Float
)

@Entity(tableName = "pending_sync")
data class PendingSyncEntity(
    @PrimaryKey val id: String,
    val title: String,
    val subtitle: String,
    val status: String,
    val label: String,
    val payloadJson: String? = null
)
