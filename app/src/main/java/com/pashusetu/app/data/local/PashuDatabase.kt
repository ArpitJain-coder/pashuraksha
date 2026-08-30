package com.pashusetu.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.pashusetu.app.data.local.dao.*
import com.pashusetu.app.data.local.entities.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        AnimalEntity::class,
        CaseReportEntity::class,
        AlertEntity::class,
        DistrictClusterEntity::class,
        PendingSyncEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class PashuDatabase : RoomDatabase() {

    abstract fun animalDao(): AnimalDao
    abstract fun caseReportDao(): CaseReportDao
    abstract fun alertDao(): AlertDao
    abstract fun districtClusterDao(): DistrictClusterDao
    abstract fun pendingSyncDao(): PendingSyncDao

    companion object {
        @Volatile
        private var INSTANCE: PashuDatabase? = null

        fun getDatabase(context: Context): PashuDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    PashuDatabase::class.java,
                    "pashusetu_database"
                )
                    .addCallback(DatabaseCallback(context))
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val context: Context
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    CoroutineScope(Dispatchers.IO).launch {
                        populateSeedData(database)
                    }
                }
            }
        }

        private suspend fun populateSeedData(db: PashuDatabase) {
            // Populate Animals
            db.animalDao().insertAll(
                listOf(
                    AnimalEntity(
                        id = "a1", name = "Lakshmi", tag = "274 8891 0034", species = "Cattle",
                        breed = "HF Cross", sex = "Female", age = "4 yr", imgUrl = "cow_lakshmi",
                        status = "attention", risk = "high", riskLabel = "See a vet today",
                        yield = 6.2, baseline = 9.1, yieldDelta = -32, vaccPercent = 78,
                        note = "Off feed for two days, with discharge from her nose.", caseId = "PS-2841"
                    ),
                    AnimalEntity(
                        id = "a2", name = "Ganga", tag = "274 8891 0035", species = "Buffalo",
                        breed = "Murrah", sex = "Female", age = "6 yr", imgUrl = "buffalo",
                        status = "watch", risk = "moderate", riskLabel = "Keep watching",
                        yield = 7.8, baseline = 8.2, yieldDelta = -5, vaccPercent = 100,
                        note = "Giving about half a litre less than she usually does.", caseId = null
                    ),
                    AnimalEntity(
                        id = "a3", name = "Radha", tag = "274 8891 0036", species = "Cattle",
                        breed = "Gir", sex = "Female", age = "3 yr", imgUrl = "cow_gir",
                        status = "healthy", risk = "low", riskLabel = "Fine",
                        yield = 8.4, baseline = 8.1, yieldDelta = 4, vaccPercent = 100,
                        note = "Steady.", caseId = null
                    ),
                    AnimalEntity(
                        id = "a4", name = "Nandi", tag = "274 8891 0037", species = "Cattle",
                        breed = "Deoni", sex = "Male", age = "5 yr", imgUrl = "cow_lakshmi",
                        status = "healthy", risk = "low", riskLabel = "Fine",
                        yield = 0.0, baseline = 0.0, yieldDelta = 0, vaccPercent = 100,
                        note = "Working animal. Nothing to report.", caseId = null
                    ),
                    AnimalEntity(
                        id = "a5", name = "Tulsi", tag = "274 8891 0038", species = "Buffalo",
                        breed = "Pandharpuri", sex = "Female", age = "7 yr", imgUrl = "buffalo",
                        status = "due", risk = "unknown", riskLabel = "Vaccine overdue",
                        yield = 5.9, baseline = 6.0, yieldDelta = -2, vaccPercent = 40,
                        note = "Her FMD booster was due 23 days ago.", caseId = null
                    ),
                    AnimalEntity(
                        id = "a6", name = "Moti", tag = "274 8891 0039", species = "Cattle",
                        breed = "HF Cross", sex = "Female", age = "11 mo", imgUrl = "calf",
                        status = "healthy", risk = "low", riskLabel = "Fine",
                        yield = 0.0, baseline = 0.0, yieldDelta = 0, vaccPercent = 100,
                        note = "Calf. Growing well.", caseId = null
                    )
                )
            )

            // Populate Case Reports
            db.caseReportDao().insertAll(
                listOf(
                    CaseReportEntity(
                        id = "PS-2841", animalId = "a1", animalName = "Lakshmi", species = "Cattle · Female · 4 yr",
                        ownerName = "A. Kale", village = "Wadgaon", distanceKm = 6.2, ageWaiting = "2 days waiting",
                        animalCount = 1, deathCount = 0, confidence = 82, severity = "critical",
                        signsSummary = "Fever, runny nose, off feed",
                        quote = "She has fever and she is not eating. There is discharge from her nose since two days.",
                        surroundingContext = "Three similar reports within 4 km in the last 11 days.",
                        filedDate = "26 August, 7:12 AM", vetEta = "Today, 4:00–6:00 PM", isMine = true,
                        photosJson = "[\"cow_lakshmi\", \"mouth\"]",
                        evidenceJson = "[{\"text\":\"Fever, nasal discharge and going off feed, together\",\"weight\":\"Points strongly\",\"colorHex\":\"#D9381E\"},{\"text\":\"Milk down 32% against her own average\",\"weight\":\"Points strongly\",\"colorHex\":\"#D9381E\"},{\"text\":\"Vaccination schedule only 78% complete\",\"weight\":\"Adds to it\",\"colorHex\":\"#E66100\"}]"
                    ),
                    CaseReportEntity(
                        id = "PS-2839", animalId = "a2", animalName = "Ganga", species = "Buffalo · Female · 5 yr",
                        ownerName = "S. Jadhav", village = "Village X", distanceKm = 11.4, ageWaiting = "6 hours waiting",
                        animalCount = 6, deathCount = 3, confidence = 74, severity = "critical",
                        signsSummary = "Three sudden deaths, swelling, high fever",
                        quote = "Three died since yesterday. The others have swelling under the jaw and high fever.",
                        surroundingContext = "Deaths reported. Sent to the district office automatically.",
                        filedDate = "28 August, 10:00 AM", vetEta = "Today, 9:30 AM", isMine = true,
                        photosJson = "[\"buffalo\"]",
                        evidenceJson = "[{\"text\":\"Three deaths in 48 hours\",\"weight\":\"Decisive\",\"colorHex\":\"#D9381E\"}]"
                    )
                )
            )

            // Populate Alerts
            db.alertDao().insertAll(
                listOf(
                    AlertEntity(
                        id = "n1", tier = "critical", isUnread = true, iconType = "vet", tone = "critical",
                        title = "Dr. Deshmukh is coming today",
                        description = "Between 4 and 6 PM, for Lakshmi. Keep her separated, and have her tag number ready.",
                        timeAgo = "2 hours ago", actionText = "Open the case", groupName = "Today"
                    ),
                    AlertEntity(
                        id = "n2", tier = "important", isUnread = true, iconType = "pin", tone = "high",
                        title = "The same signs near Wadgaon",
                        description = "Three farms within 4 km reported fever and a runny nose in the last 11 days. Worth watching your herd closely this week.",
                        timeAgo = "5 hours ago", actionText = "What to watch for", groupName = "Today"
                    ),
                    AlertEntity(
                        id = "n3", tier = "routine", isUnread = false, iconType = "vial", tone = "accent",
                        title = "Tulsi is 23 days past her booster",
                        description = "A vaccination round reaches Wadgaon on 3 September. One tap puts her on the list.",
                        timeAgo = "Yesterday", actionText = "Add her", groupName = "Earlier"
                    )
                )
            )

            // Populate District Clusters
            db.districtClusterDao().insertAll(
                listOf(
                    DistrictClusterEntity(
                        id = "c1", name = "Ahmednagar road belt", severity = "critical",
                        villagesCount = 12, animalsAffected = 38, deathCount = 3, timeWindow = "11 days",
                        riskScore = 91, leadDays = 6, confidence = "Medium", isZoonotic = false,
                        suspectedDisease = "Looks like haemorrhagic septicaemia", mapX = 150f, mapY = 120f, radius = 52f
                    ),
                    DistrictClusterEntity(
                        id = "c2", name = "Wadgaon–Kondhapuri", severity = "high",
                        villagesCount = 7, animalsAffected = 19, deathCount = 0, timeWindow = "14 days",
                        riskScore = 72, leadDays = 4, confidence = "Medium", isZoonotic = false,
                        suspectedDisease = "Blister-type signs. FMD to be ruled out", mapX = 250f, mapY = 230f, radius = 42f
                    ),
                    DistrictClusterEntity(
                        id = "c4", name = "Junnar north", severity = "critical",
                        villagesCount = 3, animalsAffected = 6, deathCount = 1, timeWindow = "5 days",
                        riskScore = 88, leadDays = 5, confidence = "Medium", isZoonotic = true,
                        suspectedDisease = "Brucellosis indicators. People are at risk here", mapX = 296f, mapY = 96f, radius = 34f
                    )
                )
            )

            // Populate Pending Sync
            db.pendingSyncDao().insertPendingItem(
                PendingSyncEntity(
                    id = "p1", title = "Report · Lakshmi", subtitle = "26 August, 7:12 AM",
                    status = "ok", label = "Sent"
                )
            )
            db.pendingSyncDao().insertPendingItem(
                PendingSyncEntity(
                    id = "p2", title = "Photos · Lakshmi", subtitle = "2 photos · 1.4 MB",
                    status = "wait", label = "Waiting"
                )
            )
        }
    }
}
