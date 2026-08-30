package com.pashusetu.app.presentation.ui.screens.farmer

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pashusetu.app.domain.model.AlertItem
import com.pashusetu.app.domain.model.CaseReport
import com.pashusetu.app.domain.model.PendingSyncItem
import com.pashusetu.app.presentation.theme.*
import com.pashusetu.app.presentation.ui.components.GaugeArcChart
import com.pashusetu.app.presentation.ui.components.RiskBadge

@Composable
fun TriageResultScreen(
    caseReport: CaseReport?,
    onOpenActionPlan: () -> Unit,
    onAskForVet: () -> Unit
) {
    val report = caseReport ?: CaseReport(
        id = "PS-2841", animalId = "a1", animalName = "Lakshmi", species = "Cattle · 4 yr",
        ownerName = "Arpit Kale", village = "Wadgaon", distanceKm = 6.2, ageWaiting = "Just now",
        animalCount = 1, deathCount = 0, confidence = 82, severity = "high",
        signsSummary = "Fever, runny nose, not eating", quote = "She has fever.",
        surroundingContext = "Three similar reports nearby.",
        evidence = emptyList(), photos = emptyList(), filedDate = "Today"
    )

    val sevColor = when (report.severity) {
        "critical" -> RiskCritical
        "high" -> RiskHigh
        "moderate" -> RiskModerate
        else -> RiskLow
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(20.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "${report.animalName} · just now",
                        fontSize = 12.sp,
                        color = TextMuted
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    GaugeArcChart(score = report.confidence, sevColor = sevColor)

                    Spacer(modifier = Modifier.height(14.dp))

                    RiskBadge(
                        risk = report.severity,
                        label = "She should see a veterinarian today"
                    )
                }
            }
        }

        // Section: Do this first
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = BrandLight),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "DO THIS FIRST",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = BrandPrimary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Move ${report.animalName} away from the other five.",
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = "Any corner or shed will do. Give her a separate bucket for feed and water, and wash your hands after handling her.",
                        fontSize = 13.5.sp,
                        color = TextSecondary,
                        modifier = Modifier.padding(top = 4.dp),
                        lineHeight = 18.sp
                    )
                }
            }
        }

        // Reasons
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Why we are saying this",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    report.evidence.forEach { ev ->
                        Row(
                            modifier = Modifier.padding(vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(RiskHigh)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(text = ev.text, fontSize = 13.5.sp, color = TextPrimary)
                        }
                    }
                }
            }
        }

        // CTAs
        item {
            Button(
                onClick = onAskForVet,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text(text = "Ask for a veterinarian", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedButton(
                onClick = onOpenActionPlan,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text(text = "Show me the four steps", fontSize = 15.sp, color = TextPrimary)
            }
        }
    }
}

@Composable
fun ActionPlanScreen(
    onAskForVet: () -> Unit
) {
    var step1Done by remember { mutableStateOf(true) }
    var step2Done by remember { mutableStateOf(false) }
    var step3Done by remember { mutableStateOf(false) }
    var step4Done by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text(
                text = "What to do now",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(16.dp))

            PlanStepCard(
                stepNum = 1,
                title = "Separate her from the others",
                desc = "Any shed or corner away from the rest. Her own bucket for feed and water.",
                isDone = step1Done,
                onToggle = { step1Done = !step1Done }
            )

            Spacer(modifier = Modifier.height(10.dp))

            PlanStepCard(
                stepNum = 2,
                title = "Write down her temperature",
                desc = "Morning and evening, if you have a thermometer. Even 'ate half' helps.",
                isDone = step2Done,
                onToggle = { step2Done = !step2Done }
            )

            Spacer(modifier = Modifier.height(10.dp))

            PlanStepCard(
                stepNum = 3,
                title = "Keep her milk apart",
                desc = "Do not mix it with the rest or drink it raw until vet checks her.",
                isDone = step3Done,
                onToggle = { step3Done = !step3Done }
            )

            Spacer(modifier = Modifier.height(10.dp))

            PlanStepCard(
                stepNum = 4,
                title = "Keep her tag number ready",
                desc = "Tag 274 8891 0034. It is the first thing the vet asks for.",
                isDone = step4Done,
                onToggle = { step4Done = !step4Done }
            )
        }

        Button(
            onClick = onAskForVet,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary),
            shape = RoundedCornerShape(14.dp)
        ) {
            Text(text = "Ask for a veterinarian", fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun PlanStepCard(
    stepNum: Int,
    title: String,
    desc: String,
    isDone: Boolean,
    onToggle: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onToggle() },
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isDone) BrandLight else Color.White
        )
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(if (isDone) BrandPrimary else Color(0xFFE2E8F0)),
                contentAlignment = Alignment.Center
            ) {
                if (isDone) {
                    Icon(Icons.Default.Check, contentDescription = "Done", tint = Color.White)
                } else {
                    Text(text = "$stepNum", color = TextPrimary, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = desc,
                    fontSize = 12.5.sp,
                    color = TextSecondary,
                    modifier = Modifier.padding(top = 2.dp)
                )
            }
        }
    }
}

@Composable
fun AlertsScreen(
    alerts: List<AlertItem>,
    onMarkAllRead: () -> Unit
) {
    var selectedFilter by remember { mutableStateOf("All") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Alerts & Notifications",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )

            TextButton(onClick = onMarkAllRead) {
                Text("Mark all read", color = BrandPrimary)
            }
        }

        Row(
            modifier = Modifier.padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("All", "Important", "Vaccines").forEach { filter ->
                FilterChip(
                    selected = selectedFilter == filter,
                    onClick = { selectedFilter = filter },
                    label = { Text(filter) }
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(alerts) { alert ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.Top
                    ) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(if (alert.tier == "critical") RiskCriticalBg else BrandLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (alert.tier == "critical") Icons.Default.Warning else Icons.Default.Notifications,
                                contentDescription = "Alert",
                                tint = if (alert.tier == "critical") RiskCritical else BrandPrimary
                            )
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = alert.title,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Text(
                                text = alert.description,
                                fontSize = 13.sp,
                                color = TextSecondary,
                                modifier = Modifier.padding(top = 2.dp),
                                lineHeight = 18.sp
                            )
                            Text(
                                text = alert.timeAgo,
                                fontSize = 11.5.sp,
                                color = TextMuted,
                                modifier = Modifier.padding(top = 6.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ProfileSyncScreen(
    pendingItems: List<PendingSyncItem>,
    isOnline: Boolean,
    onRetrySync: (String) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(54.dp)
                            .clip(CircleShape)
                            .background(BrandLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "👨‍🌾", fontSize = 32.sp)
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column {
                        Text(
                            text = "Arpit Kale",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = "Kale Farm · Wadgaon",
                            fontSize = 13.5.sp,
                            color = TextSecondary
                        )
                        Text(
                            text = "+91 98••• ••412 · with us since March 2026",
                            fontSize = 12.sp,
                            color = TextMuted,
                            modifier = Modifier.padding(top = 2.dp)
                        )
                    }
                }
            }
        }

        // Sync Queue Section
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (!isOnline) "${pendingItems.count { it.status != "ok" }} things waiting" else "Everything is sent",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )

                        RiskBadge(
                            risk = if (!isOnline) "moderate" else "low",
                            label = if (!isOnline) "No signal" else "Up to date"
                        )
                    }

                    Text(
                        text = if (!isOnline) "They will go on their own as soon as you have signal. There is nothing for you to do." else "Last sent a moment ago.",
                        fontSize = 12.5.sp,
                        color = TextMuted,
                        modifier = Modifier.padding(top = 4.dp)
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    pendingItems.forEach { item ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 6.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = item.title,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )
                                Text(
                                    text = item.subtitle,
                                    fontSize = 12.sp,
                                    color = TextMuted
                                )
                            }

                            Text(
                                text = item.label,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (item.status == "ok") RiskLow else RiskHigh
                            )
                        }
                    }
                }
            }
        }
    }
}
