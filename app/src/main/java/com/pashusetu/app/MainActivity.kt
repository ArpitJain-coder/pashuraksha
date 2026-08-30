package com.pashusetu.app

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.SwapHoriz
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.*
import androidx.navigation.navArgument
import com.pashusetu.app.domain.model.*
import com.pashusetu.app.presentation.theme.*
import com.pashusetu.app.presentation.ui.components.*
import com.pashusetu.app.presentation.ui.screens.auth.*
import com.pashusetu.app.presentation.ui.screens.farmer.*
import com.pashusetu.app.presentation.ui.screens.officer.*
import com.pashusetu.app.presentation.ui.screens.vet.*
import com.pashusetu.app.presentation.viewmodel.MainViewModel

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            PashuSetuTheme {
                val app = application as PashuApplication
                val viewModel: MainViewModel = viewModel {
                    MainViewModel(app.repository)
                }
                PashuMainApp(viewModel = viewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PashuMainApp(viewModel: MainViewModel) {
    val navController = rememberNavController()
    val context = LocalContext.current

    val currentRole by viewModel.currentRole.collectAsState()
    val currentLanguage by viewModel.currentLanguage.collectAsState()
    val isOnline by viewModel.isOnline.collectAsState()

    val animals by viewModel.animals.collectAsState()
    val cases by viewModel.cases.collectAsState()
    val alerts by viewModel.alerts.collectAsState()
    val clusters by viewModel.clusters.collectAsState()
    val pendingSync by viewModel.pendingSync.collectAsState()

    val selectedSymptoms by viewModel.selectedSymptoms.collectAsState()
    val selectedAnimalId by viewModel.selectedAnimalId.collectAsState()
    val deathCount by viewModel.deathCount.collectAsState()
    val othersCount by viewModel.othersCount.collectAsState()
    val capturedPhotos by viewModel.capturedPhotos.collectAsState()
    val latestCase by viewModel.latestGeneratedCase.collectAsState()

    var showRoleSheet by remember { mutableStateOf(false) }

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: "splash"

    val isAuthFlow = currentRoute in listOf("splash", "language", "login")

    Scaffold(
        topBar = {
            if (!isAuthFlow) {
                Column {
                    OfflineStatusBar(
                        isOnline = isOnline,
                        pendingCount = pendingSync.count { it.status != "ok" },
                        onToggleSimulatedOffline = { viewModel.toggleOffline() }
                    )

                    PashuTopAppBar(
                        title = when (currentRole) {
                            UserRole.FARMER -> "PashuSetu"
                            UserRole.VET -> "Veterinary Portal"
                            UserRole.OFFICER -> "District Office"
                        },
                        onBackClick = if (currentRoute != "farmer_home" && currentRoute != "vet_queue" && currentRoute != "officer_overview") {
                            { navController.popBackStack() }
                        } else null,
                        actions = {
                            IconButton(onClick = { showRoleSheet = true }) {
                                Icon(
                                    imageVector = Icons.Default.SwapHoriz,
                                    contentDescription = "Switch Role",
                                    tint = Color.White
                                )
                            }
                        }
                    )
                }
            }
        },
        bottomBar = {
            if (!isAuthFlow && currentRoute in listOf(
                    "farmer_home", "farmer_herd", "farmer_alerts", "farmer_profile",
                    "vet_queue", "vet_route", "vet_drives", "vet_profile",
                    "officer_overview", "officer_map", "officer_resources", "officer_profile"
                )) {
                PashuBottomBar(
                    currentRoute = currentRoute,
                    role = currentRole,
                    onNavigate = { route -> navController.navigate(route) },
                    onFabClick = { navController.navigate("report_step1") }
                )
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            NavHost(
                navController = navController,
                startDestination = "splash"
            ) {
                // Auth Flow
                composable("splash") {
                    SplashScreen(
                        onGetStarted = { navController.navigate("language") }
                    )
                }
                composable("language") {
                    LanguageSelectionScreen(
                        currentLanguage = currentLanguage,
                        onSelectLanguage = { viewModel.setLanguage(it) },
                        onContinue = { navController.navigate("login") }
                    )
                }
                composable("login") {
                    LoginScreen(
                        onLoginSuccess = { navController.navigate("farmer_home") }
                    )
                }

                // Farmer Flow
                composable("farmer_home") {
                    FarmerHomeScreen(
                        farmer = FarmerProfile(),
                        animalsNeedingAttention = animals.filter { it.status == "attention" || it.status == "watch" },
                        onOpenReportWizard = { navController.navigate("report_step1") },
                        onViewHerd = { navController.navigate("farmer_herd") },
                        onViewAnimalDetail = { id -> navController.navigate("farmer_animal_detail/$id") },
                        onOpenCaseDetail = { caseId -> navController.navigate("vet_case_detail/$caseId") },
                        onCallVet = {
                            Toast.makeText(context, "Dialing 1962 (Toll-Free Helpline)...", Toast.LENGTH_SHORT).show()
                        }
                    )
                }
                composable("farmer_herd") {
                    HerdListScreen(
                        animals = animals,
                        onSelectAnimal = { id -> navController.navigate("farmer_animal_detail/$id") },
                        onAddAnimal = { navController.navigate("farmer_add_animal") }
                    )
                }
                composable("farmer_add_animal") {
                    AddAnimalScreen(
                        onSaveAnimal = { name, tag, species, breed, sex, age ->
                            viewModel.addAnimal(name, tag, species, breed, sex, age, "cow_lakshmi")
                            navController.popBackStack()
                        },
                        onCancel = { navController.popBackStack() }
                    )
                }
                composable(
                    route = "farmer_animal_detail/{animalId}",
                    arguments = listOf(navArgument("animalId") { type = NavType.StringType })
                ) { backStackEntry ->
                    val animalId = backStackEntry.arguments?.getString("animalId") ?: "a1"
                    val animal = animals.find { it.id == animalId } ?: animals.first()
                    AnimalDetailScreen(
                        animal = animal,
                        onReportIssue = { navController.navigate("report_step1") }
                    )
                }

                // 4-Step Report Wizard
                composable("report_step1") {
                    ReportStep1SymptomsScreen(
                        selectedSymptoms = selectedSymptoms,
                        onToggleSymptom = { viewModel.toggleSymptom(it) },
                        onContinue = { navController.navigate("report_step2") }
                    )
                }
                composable("report_step2") {
                    ReportStep2AnimalScreen(
                        animals = animals,
                        selectedAnimalId = selectedAnimalId,
                        onSelectAnimal = { viewModel.selectedAnimalId.value = it },
                        deathCount = deathCount,
                        onUpdateDeaths = { viewModel.deathCount.value = it },
                        othersCount = othersCount,
                        onUpdateOthers = { viewModel.othersCount.value = it },
                        onContinue = { navController.navigate("report_step3") }
                    )
                }
                composable("report_step3") {
                    ReportStep3CameraScreen(
                        capturedPhotos = capturedPhotos,
                        onAddPhoto = {
                            Toast.makeText(context, "Photo captured using CameraX!", Toast.LENGTH_SHORT).show()
                        },
                        onContinue = {
                            viewModel.submitReport {
                                navController.navigate("triage_result")
                            }
                        }
                    )
                }
                composable("triage_result") {
                    TriageResultScreen(
                        caseReport = latestCase,
                        onOpenActionPlan = { navController.navigate("action_plan") },
                        onAskForVet = {
                            Toast.makeText(context, "Veterinarian requested. ETA: 4:00 PM", Toast.LENGTH_LONG).show()
                            navController.navigate("farmer_home")
                        }
                    )
                }
                composable("action_plan") {
                    ActionPlanScreen(
                        onAskForVet = {
                            Toast.makeText(context, "Veterinarian requested. ETA: 4:00 PM", Toast.LENGTH_LONG).show()
                            navController.navigate("farmer_home")
                        }
                    )
                }

                composable("farmer_alerts") {
                    AlertsScreen(
                        alerts = alerts,
                        onMarkAllRead = { viewModel.markAllAlertsRead() }
                    )
                }
                composable("farmer_profile") {
                    ProfileSyncScreen(
                        pendingItems = pendingSync,
                        isOnline = isOnline,
                        onRetrySync = { viewModel.retrySync(it) }
                    )
                }

                // Vet Flow
                composable("vet_queue") {
                    VetQueueScreen(
                        cases = cases,
                        vetProfile = VetProfile(),
                        onSelectCase = { caseId -> navController.navigate("vet_case_detail/$caseId") }
                    )
                }
                composable(
                    route = "vet_case_detail/{caseId}",
                    arguments = listOf(navArgument("caseId") { type = NavType.StringType })
                ) { backStackEntry ->
                    val caseId = backStackEntry.arguments?.getString("caseId") ?: "PS-2841"
                    val c = cases.find { it.id == caseId } ?: cases.firstOrNull()
                    VetCaseDetailScreen(
                        caseReport = c,
                        onActionTaken = { actionMsg ->
                            Toast.makeText(context, actionMsg, Toast.LENGTH_SHORT).show()
                            navController.popBackStack()
                        }
                    )
                }
                composable("vet_route") {
                    VetQueueScreen(
                        cases = cases,
                        vetProfile = VetProfile(),
                        onSelectCase = { caseId -> navController.navigate("vet_case_detail/$caseId") }
                    )
                }
                composable("vet_drives") {
                    VetQueueScreen(
                        cases = cases,
                        vetProfile = VetProfile(),
                        onSelectCase = { caseId -> navController.navigate("vet_case_detail/$caseId") }
                    )
                }
                composable("vet_profile") {
                    ProfileSyncScreen(
                        pendingItems = pendingSync,
                        isOnline = isOnline,
                        onRetrySync = { viewModel.retrySync(it) }
                    )
                }

                // Officer Flow
                composable("officer_overview") {
                    OfficerOverviewScreen(
                        profile = OfficerProfile(),
                        clusters = clusters,
                        onSelectCluster = { navController.navigate("officer_map") }
                    )
                }
                composable("officer_map") {
                    OfficerMapScreen(
                        clusters = clusters,
                        onSelectCluster = {}
                    )
                }
                composable("officer_resources") {
                    OfficerOverviewScreen(
                        profile = OfficerProfile(),
                        clusters = clusters,
                        onSelectCluster = {}
                    )
                }
                composable("officer_profile") {
                    ProfileSyncScreen(
                        pendingItems = pendingSync,
                        isOnline = isOnline,
                        onRetrySync = { viewModel.retrySync(it) }
                    )
                }
            }
        }
    }

    // Role Switcher Modal Sheet
    if (showRoleSheet) {
        ModalBottomSheet(
            onDismissRequest = { showRoleSheet = false }
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp)
            ) {
                Text(
                    text = "Switch User View / Role",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(14.dp))

                RoleOptionCard(
                    roleName = "Farmer",
                    subtitle = "Arpit Kale · Wadgaon Farm",
                    selected = currentRole == UserRole.FARMER,
                    onSelect = {
                        viewModel.setRole(UserRole.FARMER)
                        showRoleSheet = false
                        navController.navigate("farmer_home")
                    }
                )

                Spacer(modifier = Modifier.height(8.dp))

                RoleOptionCard(
                    roleName = "Veterinarian",
                    subtitle = "Dr. R. Deshmukh · LDO Haveli Block",
                    selected = currentRole == UserRole.VET,
                    onSelect = {
                        viewModel.setRole(UserRole.VET)
                        showRoleSheet = false
                        navController.navigate("vet_queue")
                    }
                )

                Spacer(modifier = Modifier.height(8.dp))

                RoleOptionCard(
                    roleName = "District Officer",
                    subtitle = "Dr. Anjali Kulkarni · Pune District DAHO",
                    selected = currentRole == UserRole.OFFICER,
                    onSelect = {
                        viewModel.setRole(UserRole.OFFICER)
                        showRoleSheet = false
                        navController.navigate("officer_overview")
                    }
                )

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (!isOnline) RiskHighBg else BrandLight)
                        .clickable { viewModel.toggleOffline() }
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.WifiOff,
                        contentDescription = "Offline Mode",
                        tint = if (!isOnline) RiskHigh else BrandPrimary
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = if (!isOnline) "Simulating Offline Mode (Tap to go online)" else "Simulate Offline Mode (No Signal)",
                        fontSize = 13.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))
            }
        }
    }
}

@Composable
private fun RoleOptionCard(
    roleName: String,
    subtitle: String,
    selected: Boolean,
    onSelect: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onSelect),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (selected) BrandLight else Color(0xFFF3F4F6)
        )
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            RadioButton(
                selected = selected,
                onClick = onSelect,
                colors = RadioButtonDefaults.colors(selectedColor = BrandPrimary)
            )
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(
                    text = roleName,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = subtitle,
                    fontSize = 12.5.sp,
                    color = TextSecondary
                )
            }
        }
    }
}
