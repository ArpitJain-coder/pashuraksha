package com.pashusetu.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.pashusetu.app.data.repository.PashuRepository
import com.pashusetu.app.domain.model.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class MainViewModel(
    val repository: PashuRepository
) : ViewModel() {

    // Global App State
    private val _currentRole = MutableStateFlow(UserRole.FARMER)
    val currentRole: StateFlow<UserRole> = _currentRole.asStateFlow()

    private val _currentLanguage = MutableStateFlow(Language.ENGLISH)
    val currentLanguage: StateFlow<Language> = _currentLanguage.asStateFlow()

    private val _simulatedOffline = MutableStateFlow(false)
    val simulatedOffline: StateFlow<Boolean> = _simulatedOffline.asStateFlow()

    val isOnline: StateFlow<Boolean> = repository.isOnline.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = true
    )

    // Data Flows
    val animals: StateFlow<List<Animal>> = repository.animalsFlow.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    val cases: StateFlow<List<CaseReport>> = repository.casesFlow.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    val alerts: StateFlow<List<AlertItem>> = repository.alertsFlow.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    val clusters: StateFlow<List<DistrictCluster>> = repository.clustersFlow.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    val pendingSync: StateFlow<List<PendingSyncItem>> = repository.pendingSyncFlow.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    // Active Selection States for Report Wizard
    val selectedSymptoms = MutableStateFlow<Set<String>>(setOf("fever", "appetite"))
    val selectedAnimalId = MutableStateFlow("a1")
    val deathCount = MutableStateFlow(0)
    val othersCount = MutableStateFlow(0)
    val capturedPhotos = MutableStateFlow<List<String>>(listOf("cow_lakshmi"))
    val sinceDuration = MutableStateFlow("2–3 days")
    val vaccineStatus = MutableStateFlow("Some of them")
    val isHumanUnwell = MutableStateFlow(false)

    val latestGeneratedCase = MutableStateFlow<CaseReport?>(null)

    fun setRole(role: UserRole) {
        _currentRole.value = role
    }

    fun setLanguage(lang: Language) {
        _currentLanguage.value = lang
    }

    fun toggleOffline() {
        val next = !_simulatedOffline.value
        _simulatedOffline.value = next
        repository.networkMonitor.setSimulatedOffline(next)
    }

    fun toggleSymptom(symptomId: String) {
        val current = selectedSymptoms.value.toMutableSet()
        if (current.contains(symptomId)) {
            current.remove(symptomId)
        } else {
            current.add(symptomId)
        }
        selectedSymptoms.value = current
    }

    fun addAnimal(name: String, tag: String, species: String, breed: String, sex: String, age: String, imgUrl: String) {
        viewModelScope.launch {
            repository.addAnimal(name, tag, species, breed, sex, age, imgUrl)
        }
    }

    fun submitReport(onSuccess: (CaseReport) -> Unit) {
        viewModelScope.launch {
            val report = repository.submitCaseReport(
                animalId = selectedAnimalId.value,
                symptoms = selectedSymptoms.value.toList(),
                photos = capturedPhotos.value,
                deathCount = deathCount.value,
                othersCount = othersCount.value,
                since = sinceDuration.value,
                vaccStatus = vaccineStatus.value,
                isHumanUnwell = isHumanUnwell.value
            )
            latestGeneratedCase.value = report
            onSuccess(report)
        }
    }

    fun markAllAlertsRead() {
        viewModelScope.launch {
            repository.markAllAlertsRead()
        }
    }

    fun retrySync(id: String) {
        viewModelScope.launch {
            repository.retryPendingSync(id)
        }
    }
}
