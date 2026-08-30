package com.pashusetu.app.domain.model

enum class UserRole {
    FARMER, VET, OFFICER
}

enum class Language(val code: String, val displayName: String, val nativeName: String) {
    ENGLISH("en", "English", "English"),
    MARATHI("mr", "Marathi", "मराठी"),
    HINDI("hi", "Hindi", "हिंदी")
}

data class FarmerProfile(
    val name: String = "Arpit Kale",
    val farm: String = "Kale Farm",
    val village: String = "Wadgaon",
    val block: String = "Haveli",
    val district: String = "Pune",
    val phone: String = "+91 98••• ••412",
    val joined: String = "March 2026",
    val weekLitres: Double = 312.0,
    val litreDelta: Double = -18.0
)

data class VetProfile(
    val name: String = "Dr. R. Deshmukh",
    val role: String = "Livestock Development Officer",
    val posting: String = "Haveli block · 4 dispensaries · 11 villages",
    val visitsToday: Int = 5,
    val casesClosed: Int = 64,
    val drivingPerCaseKm: Double = 8.4,
    val falseAlarmRatePercent: Int = 17
)

data class OfficerProfile(
    val name: String = "Dr. Anjali Kulkarni",
    val role: String = "District Animal Husbandry Officer",
    val district: String = "Pune",
    val blocks: Int = 14,
    val activeCases: Int = 128,
    val coveragePercent: Int = 87
)

data class Animal(
    val id: String,
    val name: String,
    val tag: String,
    val species: String,
    val breed: String,
    val sex: String,
    val age: String,
    val imgUrl: String,
    val status: String, // "attention", "watch", "healthy", "due"
    val risk: String,   // "critical", "high", "moderate", "low", "unknown"
    val riskLabel: String,
    val yield: Double,
    val baseline: Double,
    val yieldDelta: Int,
    val vaccPercent: Int,
    val note: String,
    val caseId: String? = null
)

data class Symptom(
    val id: String,
    val enName: String,
    val mrName: String,
    val hiName: String
)

data class TriageEvidence(
    val text: String,
    val weight: String,
    val colorHex: String
)

data class CaseReport(
    val id: String,
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
    val severity: String, // "critical", "high", "moderate", "low"
    val signsSummary: String,
    val quote: String,
    val surroundingContext: String,
    val evidence: List<TriageEvidence>,
    val photos: List<String>,
    val filedDate: String,
    val vetEta: String = "Today, 4:00–6:00 PM",
    val isMine: Boolean = true
)

data class AlertItem(
    val id: String,
    val tier: String, // "critical", "important", "routine", "ambient"
    val isUnread: Boolean,
    val iconType: String,
    val tone: String,
    val title: String,
    val description: String,
    val timeAgo: String,
    val actionText: String?,
    val group: String // "Today", "Earlier"
)

data class DistrictCluster(
    val id: String,
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

data class PendingSyncItem(
    val id: String,
    val title: String,
    val subtitle: String,
    val status: String, // "ok", "wait", "fail"
    val label: String
)
