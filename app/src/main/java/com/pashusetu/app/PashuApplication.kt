package com.pashusetu.app

import android.app.Application
import com.pashusetu.app.data.local.PashuDatabase
import com.pashusetu.app.data.remote.NetworkMonitor
import com.pashusetu.app.data.repository.PashuRepository

class PashuApplication : Application() {

    lateinit var database: PashuDatabase
        private set

    lateinit var repository: PashuRepository
        private set

    lateinit var networkMonitor: NetworkMonitor
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this
        database = PashuDatabase.getDatabase(this)
        networkMonitor = NetworkMonitor(this)
        repository = PashuRepository(database, networkMonitor)
    }

    companion object {
        lateinit var instance: PashuApplication
            private set
    }
}
