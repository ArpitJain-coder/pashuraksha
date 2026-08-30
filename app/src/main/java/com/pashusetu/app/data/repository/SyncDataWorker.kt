package com.pashusetu.app.data.repository

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.pashusetu.app.PashuApplication
import kotlinx.coroutines.flow.first

class SyncDataWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val app = applicationContext as? PashuApplication ?: return Result.failure()
        val repository = app.repository

        return try {
            val pendingItems = repository.pendingSyncFlow.first()
            for (item in pendingItems) {
                if (item.status != "ok") {
                    // Simulate sync execution to backend
                    repository.retryPendingSync(item.id)
                }
            }
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }
}
