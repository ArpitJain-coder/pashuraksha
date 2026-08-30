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
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pashusetu.app.domain.model.Animal
import com.pashusetu.app.domain.model.FarmerProfile
import com.pashusetu.app.presentation.theme.*
import com.pashusetu.app.presentation.ui.components.MilkYieldChart
import com.pashusetu.app.presentation.ui.components.RiskBadge

@Composable
fun FarmerHomeScreen(
    farmer: FarmerProfile,
    animalsNeedingAttention: List<Animal>,
    onOpenReportWizard: () -> Unit,
    onViewHerd: () -> Unit,
    onViewAnimalDetail: (String) -> Unit,
    onOpenCaseDetail: (String) -> Unit,
    onCallVet: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground),
        contentPadding = PaddingValues(16.dp)
    ) {
        // Greeting Header
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(text = "Good morning,", fontSize = 14.sp, color = TextSecondary)
                    Text(
                        text = farmer.farm,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(top = 2.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.LocationOn,
                            contentDescription = "Location",
                            tint = BrandSecondary,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "${farmer.village}, ${farmer.block} · ${farmer.district}",
                            fontSize = 12.5.sp,
                            color = TextMuted
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(BrandLight),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "👨‍🌾", fontSize = 26.sp)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
        }

        // Section: Needs You Today
        item {
            Text(
                text = "Needs you today (${animalsNeedingAttention.size} of 6)",
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary,
                modifier = Modifier.padding(bottom = 10.dp)
            )
        }

        items(animalsNeedingAttention) { animal ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp)
                    .clickable { onViewAnimalDetail(animal.id) },
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(BrandLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (animal.species == "Buffalo") "🦬" else "🐄",
                                fontSize = 24.sp
                            )
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = animal.name,
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                RiskBadge(risk = animal.risk, label = animal.riskLabel)
                            }
                            Text(
                                text = animal.note,
                                fontSize = 13.5.sp,
                                color = TextSecondary,
                                modifier = Modifier.padding(top = 2.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        if (animal.caseId != null) {
                            Button(
                                onClick = { onOpenCaseDetail(animal.caseId) },
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text(text = "Open the case", fontSize = 13.sp)
                            }
                        } else {
                            Button(
                                onClick = { onViewAnimalDetail(animal.id) },
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text(text = "Look at ${animal.name}", fontSize = 13.sp)
                            }
                        }

                        OutlinedButton(
                            onClick = { onViewAnimalDetail(animal.id) },
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text(text = "Details", fontSize = 13.sp, color = TextPrimary)
                        }
                    }
                }
            }
        }

        // Quick Actions Grid
        item {
            Spacer(modifier = Modifier.height(20.dp))
            Text(
                text = "Quick actions",
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                QuickActionButton(
                    icon = Icons.Default.Add,
                    label = "Report",
                    modifier = Modifier.weight(1f),
                    onClick = onOpenReportWizard
                )
                QuickActionButton(
                    icon = Icons.Default.Pets,
                    label = "My Herd",
                    modifier = Modifier.weight(1f),
                    onClick = onViewHerd
                )
                QuickActionButton(
                    icon = Icons.Default.Medication,
                    label = "Vaccines",
                    modifier = Modifier.weight(1f),
                    onClick = onViewHerd
                )
                QuickActionButton(
                    icon = Icons.Default.Phone,
                    label = "Call Vet",
                    modifier = Modifier.weight(1f),
                    onClick = onCallVet
                )
            }
        }

        // Near You Alert Banner
        item {
            Spacer(modifier = Modifier.height(20.dp))
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF3C7)),
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Icon(
                        imageVector = Icons.Default.Warning,
                        contentDescription = "Alert",
                        tint = AccentGold,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Three farms near Wadgaon reported the same signs",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = "Fever and a runny nose, within about 4 km, over the last 11 days. Farm names are never shown.",
                            fontSize = 13.sp,
                            color = TextSecondary,
                            modifier = Modifier.padding(top = 4.dp),
                            lineHeight = 18.sp
                        )
                    }
                }
            }
        }

        // Weekly Milk Trend
        item {
            Spacer(modifier = Modifier.height(20.dp))
            Text(
                text = "This week",
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary,
                modifier = Modifier.padding(bottom = 10.dp)
            )

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "Milk collected", fontSize = 12.sp, color = TextMuted)
                    Row(
                        verticalAlignment = Alignment.Bottom,
                        modifier = Modifier.padding(vertical = 4.dp)
                    ) {
                        Text(
                            text = "${farmer.weekLitres.toInt()}",
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "litres",
                            fontSize = 14.sp,
                            color = TextSecondary,
                            modifier = Modifier.padding(bottom = 4.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = "▼ ${farmer.litreDelta.toInt()} L",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = RiskHigh,
                            modifier = Modifier.padding(bottom = 4.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    MilkYieldChart(currentYield = 6.2, baseline = 9.1)

                    Text(
                        text = "Below your usual week. Almost all of the gap is Lakshmi — she is 32% under her own average.",
                        fontSize = 12.5.sp,
                        color = TextMuted,
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}

@Composable
private fun QuickActionButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .height(84.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = BrandPrimary,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = label,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
        }
    }
}
