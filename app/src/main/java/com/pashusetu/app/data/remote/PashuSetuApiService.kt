package com.pashusetu.app.data.remote

import com.pashusetu.app.data.local.entities.*
import retrofit2.Response
import retrofit2.http.*

interface PashuSetuApiService {

    @GET("api/animals")
    suspend fun getAnimals(): Response<List<AnimalEntity>>

    @POST("api/animals")
    suspend fun registerAnimal(@Body animal: AnimalEntity): Response<AnimalEntity>

    @GET("api/cases")
    suspend fun getCases(): Response<List<CaseReportEntity>>

    @POST("api/cases")
    suspend fun submitReport(@Body report: CaseReportEntity): Response<CaseReportEntity>

    @GET("api/alerts")
    suspend fun getAlerts(): Response<List<AlertEntity>>

    @GET("api/clusters")
    suspend fun getClusters(): Response<List<DistrictClusterEntity>>

    @POST("api/sync")
    suspend fun syncPendingPayload(@Body payload: PendingSyncEntity): Response<Map<String, String>>
}
