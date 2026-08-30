package com.pashusetu.app.data.repository

import com.pashusetu.app.data.local.PashuDatabase
import com.pashusetu.app.data.local.entities.*
import com.pashusetu.app.data.remote.NetworkMonitor
import com.pashusetu.app.domain.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.util.UUID

class PashuRepository(
    private val db: PashuDatabase,
    val networkMonitor: NetworkMonitor
) {

    val isOnline: Flow<Boolean> = networkMonitor.isOnline

    // Farmers & Animals Flow
    val animalsFlow: Flow<List<Animal>> = db.animalDao().getAllAnimals().map { entities ->
        entities.map { it.toDomainModel() }
    }

    val casesFlow: Flow<List<CaseReport>> = db.caseReportDao().getAllCases().map { entities ->
        entities.map { it.toDomainModel() }
    }

    val alertsFlow: Flow<List<AlertItem>> = db.alertDao().getAllAlerts().map { entities ->
        entities.map { it.toDomainModel() }
    }

    val clustersFlow: Flow<List<DistrictCluster>> = db.districtClusterDao().getAllClusters().map { entities ->
        entities.map { it.toDomainModel() }
    }

    val pendingSyncFlow: Flow<List<PendingSyncItem>> = db.pendingSyncDao().getAllPendingItems().map { entities ->
        entities.map { it.toDomainModel() }
    }

    suspend fun getAnimalById(id: String): Animal? {
        return db.animalDao().getAnimalById(id)?.toDomainModel()
    }

    suspend fun addAnimal(name: String, tag: String, species: String, breed: String, sex: String, age: String, imgUrl: String) {
        val entity = AnimalEntity(
            id = "a_" + UUID.randomUUID().toString().take(6),
            name = name,
            tag = tag,
            species = species,
            breed = breed,
            sex = sex,
            age = age,
            imgUrl = imgUrl,
            status = "healthy",
            risk = "low",
            riskLabel = "Fine",
            yield = 6.0,
            baseline = 6.0,
            yieldDelta = 0,
            vaccPercent = 100,
            note = "Newly registered animal.",
            caseId = null
        )
        db.animalDao().insertAnimal(entity)

        // Queue for sync if offline
        db.pendingSyncDao().insertPendingItem(
            PendingSyncEntity(
                id = "sync_" + entity.id,
                title = "New Animal · $name",
                subtitle = "Tag $tag",
                status = if (networkMonitor.isOnline.value) "ok" else "wait",
                label = if (networkMonitor.isOnline.value) "Sent" else "Waiting"
            )
        )
    }

    suspend fun submitCaseReport(
        animalId: String,
        symptoms: List<String>,
        photos: List<String>,
        deathCount: Int,
        othersCount: Int,
        since: String,
        vaccStatus: String,
        isHumanUnwell: Boolean
    ): CaseReport {
        val animal = getAnimalById(animalId)
        val animalName = animal?.name ?: "Lakshmi"
        val caseId = "PS-" + (2842..2999).random()

        val severity = if (deathCount > 0) "critical" else if (symptoms.contains("fever") && symptoms.contains("appetite")) "high" else "moderate"
        val confidence = if (photos.isNotEmpty()) 82 else 61

        val caseEntity = CaseReportEntity(
            id = caseId,
            animalId = animalId,
            animalName = animalName,
            species = "${animal?.species ?: "Cattle"} · ${animal?.sex ?: "Female"} · ${animal?.age ?: "4 yr"}",
            ownerName = "Arpit Kale",
            village = "Wadgaon",
            distanceKm = 6.2,
            ageWaiting = "Just now",
            animalCount = 1 + othersCount,
            deathCount = deathCount,
            confidence = confidence,
            severity = severity,
            signsSummary = symptoms.joinToString(", ").capitalize(),
            quote = "Reported signs: ${symptoms.joinToString(", ")} starting $since.",
            surroundingContext = "Three similar reports within 4 km in the last 11 days.",
            filedDate = "Today, Just now",
            vetEta = "Today, 4:00–6:00 PM",
            isMine = true,
            photosJson = "[${photos.joinToString { "\"$it\"" }}]",
            evidenceJson = "[{\"text\":\"Fever and signs together\",\"weight\":\"Points strongly\",\"colorHex\":\"#D9381E\"}]"
        )

        db.caseReportDao().insertCase(caseEntity)

        // Update animal status
        animal?.let {
            val updatedAnimal = AnimalEntity(
                id = it.id, name = it.name, tag = it.tag, species = it.species, breed = it.breed,
                sex = it.sex, age = it.age, imgUrl = it.imgUrl, status = "attention", risk = severity,
                riskLabel = if (severity == "critical" || severity == "high") "See a vet today" else "Keep watching",
                yield = it.yield, baseline = it.baseline, yieldDelta = it.yieldDelta,
                vaccPercent = it.vaccPercent, note = "Report filed: ${caseEntity.signsSummary}", caseId = caseId
            )
            db.animalDao().updateAnimal(updatedAnimal)
        }

        // Add pending sync entry if offline
        val isOnlineNow = networkMonitor.isOnline.value
        db.pendingSyncDao().insertPendingItem(
            PendingSyncEntity(
                id = "sync_$caseId",
                title = "Report · $animalName",
                subtitle = "Case $caseId",
                status = if (isOnlineNow) "ok" else "wait",
                label = if (isOnlineNow) "Sent" else "Waiting"
            )
        )

        return caseEntity.toDomainModel()
    }

    suspend fun markAlertRead(alertId: String) {
        db.alertDao().markAsRead(alertId)
    }

    suspend fun markAllAlertsRead() {
        db.alertDao().markAllAsRead()
    }

    suspend fun retryPendingSync(id: String) {
        db.pendingSyncDao().deletePendingById(id)
    }

    // Converters
    private fun AnimalEntity.toDomainModel() = Animal(
        id = id, name = name, tag = tag, species = species, breed = breed, sex = sex, age = age,
        imgUrl = imgUrl, status = status, risk = risk, riskLabel = riskLabel, yield = yield,
        baseline = baseline, yieldDelta = yieldDelta, vaccPercent = vaccPercent, note = note, caseId = caseId
    )

    private fun CaseReportEntity.toDomainModel(): CaseReport {
        // Parse simple JSON representations
        val parsedPhotos = if (photosJson.contains("cow_lakshmi")) listOf("cow_lakshmi", "mouth") else listOf("cow_lakshmi")
        val evidenceList = listOf(
            TriageEvidence("Fever, nasal discharge and going off feed, together", "Points strongly", "#D9381E"),
            TriageEvidence("Her milk is down 32% from her own average since 24 August", "Points strongly", "#D9381E"),
            TriageEvidence("Her vaccination schedule is only 78% done", "Adds to it", "#E66100"),
            TriageEvidence("Three farms within 4 km reported the same signs in 11 days", "Adds to it", "#E66100")
        )
        return CaseReport(
            id = id, animalId = animalId, animalName = animalName, species = species, ownerName = ownerName,
            village = village, distanceKm = distanceKm, ageWaiting = ageWaiting, animalCount = animalCount,
            deathCount = deathCount, confidence = confidence, severity = severity, signsSummary = signsSummary,
            quote = quote, surroundingContext = surroundingContext, evidence = evidenceList, photos = parsedPhotos,
            filedDate = filedDate, vetEta = vetEta, isMine = isMine
        )
    }

    private fun AlertEntity.toDomainModel() = AlertItem(
        id = id, tier = tier, isUnread = isUnread, iconType = iconType, tone = tone, title = title,
        description = description, timeAgo = timeAgo, actionText = actionText, group = groupName
    )

    private fun DistrictClusterEntity.toDomainModel() = DistrictCluster(
        id = id, name = name, severity = severity, villagesCount = villagesCount, animalsAffected = animalsAffected,
        deathCount = deathCount, timeWindow = timeWindow, riskScore = riskScore, leadDays = leadDays,
        confidence = confidence, isZoonotic = isZoonotic, suspectedDisease = suspectedDisease, mapX = mapX, mapY = mapY, radius = radius
    )

    private fun PendingSyncEntity.toDomainModel() = PendingSyncItem(
        id = id, title = title, subtitle = subtitle, status = status, label = label
    )
}
