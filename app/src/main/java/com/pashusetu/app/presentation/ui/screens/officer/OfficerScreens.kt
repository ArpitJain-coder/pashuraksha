package com.pashusetu.app.presentation.ui.screens.officer

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pashusetu.app.domain.model.DistrictCluster
import com.pashusetu.app.domain.model.OfficerProfile
import com.pashusetu.app.presentation.theme.*
import com.pashusetu.app.presentation.ui.components.RiskBadge

@Composable
fun OfficerOverviewScreen(
    profile: OfficerProfile,
    clusters: List<DistrictCluster>,
    onSelectCluster: (String) -> Unit
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
                colors = CardDefaults.cardColors(containerColor = BrandDark),
                shape = RoundedCornerShape(20.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(text = "District Surveillance", fontSize = 12.sp, color = Color(0xFF8CE0B0))
                    Text(
                        text = "${profile.district} District",
                        fontSize = 26.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "${profile.name} · ${profile.blocks} blocks",
                        fontSize = 13.sp,
                        color = Color.White.copy(alpha = 0.75f),
                        modifier = Modifier.padding(top = 2.dp)
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        StatPill(number = "${profile.activeCases}", label = "Open cases")
                        StatPill(number = "${clusters.size}", label = "Clusters", isWarn = true)
                        StatPill(number = "${profile.coveragePercent}%", label = "Vaccine cover")
                    }
                }
            }
        }

        // Section: Clusters
        item {
            Text(
                text = "Forming Outbreak Clusters",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Text(
                text = "Flagged automatically before lab confirmation",
                fontSize = 12.5.sp,
                color = TextMuted
            )
        }

        items(clusters) { cluster ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onSelectCluster(cluster.id) },
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = cluster.name,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        RiskBadge(risk = cluster.severity)
                    }

                    Text(
                        text = cluster.suspectedDisease,
                        fontSize = 14.sp,
                        color = TextSecondary,
                        modifier = Modifier.padding(top = 4.dp)
                    )

                    if (cluster.isZoonotic) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Warning,
                                contentDescription = "Zoonotic",
                                tint = RiskCritical,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "People are at risk here — health department notified",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = RiskCritical
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        ClusterStat(number = "${cluster.villagesCount}", label = "villages")
                        ClusterStat(number = "${cluster.animalsAffected}", label = "animals")
                        ClusterStat(number = "${cluster.deathCount}", label = "dead", isWarn = cluster.deathCount > 0)
                        ClusterStat(number = "${cluster.leadDays}d", label = "lead time")
                    }
                }
            }
        }
    }
}

@Composable
private fun StatPill(number: String, label: String, isWarn: Boolean = false) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = number,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = if (isWarn) Color(0xFFFFB4A2) else Color.White
        )
        Text(
            text = label,
            fontSize = 11.sp,
            color = Color.White.copy(alpha = 0.75f)
        )
    }
}

@Composable
private fun ClusterStat(number: String, label: String, isWarn: Boolean = false) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = number,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = if (isWarn) RiskCritical else TextPrimary
        )
        Text(text = label, fontSize = 11.sp, color = TextMuted)
    }
}

@Composable
fun OfficerMapScreen(
    clusters: List<DistrictCluster>,
    onSelectCluster: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
            .padding(16.dp)
    ) {
        Text(
            text = "District Outbreak Heatmap",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )
        Text(
            text = "Aggregated to village level for privacy safeguards",
            fontSize = 13.sp,
            color = TextMuted,
            modifier = Modifier.padding(top = 2.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Heatmap Canvas simulation
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .height(300.dp),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFE9E5DA))
        ) {
            Box(modifier = Modifier.fillMaxSize()) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    // Draw cluster risk circles
                    clusters.forEach { c ->
                        val color = if (c.severity == "critical") RiskCritical else RiskHigh
                        drawCircle(
                            color = color.copy(alpha = 0.25f),
                            radius = c.radius * 2.2f,
                            center = Offset(c.mapX * 1.1f, c.mapY * 1.1f)
                        )
                        drawCircle(
                            color = color,
                            radius = 12.dp.toPx(),
                            center = Offset(c.mapX * 1.1f, c.mapY * 1.1f)
                        )
                    }
                }

                Text(
                    text = "Updated 9 minutes ago · village level",
                    fontSize = 11.sp,
                    color = TextMuted,
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(12.dp)
                )
            }
        }
    }
}
