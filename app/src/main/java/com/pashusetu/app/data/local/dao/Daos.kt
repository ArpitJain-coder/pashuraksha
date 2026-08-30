package com.pashusetu.app.data.local.dao

import androidx.room.*
import com.pashusetu.app.data.local.entities.*
import kotlinx.coroutines.flow.Flow

@Dao
interface AnimalDao {
    @Query("SELECT * FROM animals")
    fun getAllAnimals(): Flow<List<AnimalEntity>>

    @Query("SELECT * FROM animals WHERE id = :id")
    suspend fun getAnimalById(id: String): AnimalEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAnimal(animal: AnimalEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(animals: List<AnimalEntity>)

    @Update
    suspend fun updateAnimal(animal: AnimalEntity)
}

@Dao
interface CaseReportDao {
    @Query("SELECT * FROM case_reports")
    fun getAllCases(): Flow<List<CaseReportEntity>>

    @Query("SELECT * FROM case_reports WHERE id = :id")
    suspend fun getCaseById(id: String): CaseReportEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCase(caseReport: CaseReportEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(cases: List<CaseReportEntity>)
}

@Dao
interface AlertDao {
    @Query("SELECT * FROM alerts")
    fun getAllAlerts(): Flow<List<AlertEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(alerts: List<AlertEntity>)

    @Query("UPDATE alerts SET isUnread = 0 WHERE id = :id")
    suspend fun markAsRead(id: String)

    @Query("UPDATE alerts SET isUnread = 0")
    suspend fun markAllAsRead()
}

@Dao
interface DistrictClusterDao {
    @Query("SELECT * FROM district_clusters")
    fun getAllClusters(): Flow<List<DistrictClusterEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(clusters: List<DistrictClusterEntity>)
}

@Dao
interface PendingSyncDao {
    @Query("SELECT * FROM pending_sync")
    fun getAllPendingItems(): Flow<List<PendingSyncEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPendingItem(item: PendingSyncEntity)

    @Delete
    suspend fun deletePendingItem(item: PendingSyncEntity)

    @Query("DELETE FROM pending_sync WHERE id = :id")
    suspend fun deletePendingById(id: String)
}
