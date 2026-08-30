package com.pashusetu.app.presentation.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pashusetu.app.domain.model.UserRole
import com.pashusetu.app.presentation.theme.*

@Composable
fun RiskBadge(
    risk: String,
    label: String? = null,
    modifier: Modifier = Modifier
) {
    val (bgColor, textColor, defaultLabel) = when (risk.lowercase()) {
        "critical" -> Triple(RiskCriticalBg, RiskCritical, "Serious")
        "high" -> Triple(RiskHighBg, RiskHigh, "High")
        "moderate" -> Triple(RiskModerateBg, RiskModerate, "Watch")
        "low" -> Triple(RiskLowBg, RiskLow, "Fine")
        else -> Triple(Color(0xFFF3F4F6), RiskUnknown, "Not sure")
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(bgColor)
            .padding(horizontal = 10.dp, vertical = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(6.dp)
                    .clip(CircleShape)
                    .background(textColor)
            )
            Spacer(modifier = Modifier.width(5.dp))
            Text(
                text = label ?: defaultLabel,
                color = textColor,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun OfflineStatusBar(
    isOnline: Boolean,
    pendingCount: Int = 0,
    onToggleSimulatedOffline: () -> Unit = {}
) {
    if (!isOnline) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF7C2D12))
                .clickable { onToggleSimulatedOffline() }
                .padding(horizontal = 16.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.WifiOff,
                    contentDescription = "No Signal",
                    tint = Color.White,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "No signal — everything still works",
                    color = Color.White,
                    fontSize = 12.5.sp,
                    fontWeight = FontWeight.Medium
                )
            }
            if (pendingCount > 0) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color.White.copy(alpha = 0.2f))
                        .padding(horizontal = 8.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "$pendingCount to send",
                        color = Color.White,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
fun PashuTopAppBar(
    title: String,
    onBackClick: (() -> Unit)? = null,
    onCloseClick: (() -> Unit)? = null,
    actions: @Composable RowScope.() -> Unit = {}
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(BrandPrimary)
            .statusBarsPadding()
            .padding(horizontal = 12.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (onBackClick != null) {
            IconButton(onClick = onBackClick) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = Color.White
                )
            }
        } else if (onCloseClick != null) {
            IconButton(onClick = onCloseClick) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Close",
                    tint = Color.White
                )
            }
        }

        Text(
            text = title,
            color = Color.White,
            fontSize = 19.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 8.dp)
        )

        actions()
    }
}

@Composable
fun PashuBottomBar(
    currentRoute: String,
    role: UserRole,
    onNavigate: (String) -> Unit,
    onFabClick: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shadowElevation = 12.dp,
        color = Color.White
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(vertical = 6.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            when (role) {
                UserRole.FARMER -> {
                    NavItem(
                        icon = Icons.Default.Home,
                        label = "Home",
                        selected = currentRoute == "farmer_home",
                        onClick = { onNavigate("farmer_home") }
                    )
                    NavItem(
                        icon = Icons.Default.Pets,
                        label = "Herd",
                        selected = currentRoute == "farmer_herd",
                        onClick = { onNavigate("farmer_herd") }
                    )
                    FloatingActionButton(
                        onClick = onFabClick,
                        containerColor = BrandPrimary,
                        contentColor = Color.White,
                        modifier = Modifier.size(52.dp),
                        shape = CircleShape
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Report")
                    }
                    NavItem(
                        icon = Icons.Default.Notifications,
                        label = "Alerts",
                        selected = currentRoute == "farmer_alerts",
                        onClick = { onNavigate("farmer_alerts") }
                    )
                    NavItem(
                        icon = Icons.Default.Person,
                        label = "You",
                        selected = currentRoute == "farmer_profile",
                        onClick = { onNavigate("farmer_profile") }
                    )
                }
                UserRole.VET -> {
                    NavItem(
                        icon = Icons.Default.FormatListBulleted,
                        label = "Queue",
                        selected = currentRoute == "vet_queue",
                        onClick = { onNavigate("vet_queue") }
                    )
                    NavItem(
                        icon = Icons.Default.Map,
                        label = "Route",
                        selected = currentRoute == "vet_route",
                        onClick = { onNavigate("vet_route") }
                    )
                    NavItem(
                        icon = Icons.Default.Medication,
                        label = "Rounds",
                        selected = currentRoute == "vet_drives",
                        onClick = { onNavigate("vet_drives") }
                    )
                    NavItem(
                        icon = Icons.Default.Person,
                        label = "You",
                        selected = currentRoute == "vet_profile",
                        onClick = { onNavigate("vet_profile") }
                    )
                }
                UserRole.OFFICER -> {
                    NavItem(
                        icon = Icons.Default.BarChart,
                        label = "Overview",
                        selected = currentRoute == "officer_overview",
                        onClick = { onNavigate("officer_overview") }
                    )
                    NavItem(
                        icon = Icons.Default.Map,
                        label = "Map",
                        selected = currentRoute == "officer_map",
                        onClick = { onNavigate("officer_map") }
                    )
                    NavItem(
                        icon = Icons.Default.LocalShipping,
                        label = "Resources",
                        selected = currentRoute == "officer_resources",
                        onClick = { onNavigate("officer_resources") }
                    )
                    NavItem(
                        icon = Icons.Default.Person,
                        label = "You",
                        selected = currentRoute == "officer_profile",
                        onClick = { onNavigate("officer_profile") }
                    )
                }
            }
        }
    }
}

@Composable
private fun NavItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    selected: Boolean,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 4.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = if (selected) BrandPrimary else TextMuted,
            modifier = Modifier.size(24.dp)
        )
        Text(
            text = label,
            color = if (selected) BrandPrimary else TextMuted,
            fontSize = 11.sp,
            fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium
        )
    }
}

@Composable
fun GaugeArcChart(
    score: Int,
    sevColor: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier.size(160.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val strokeWidth = 14.dp.toPx()
            val diameter = size.minDimension - strokeWidth
            val topLeft = Offset(strokeWidth / 2, strokeWidth / 2)
            val arcSize = Size(diameter, diameter)

            // Background Track Arc
            drawArc(
                color = Color(0xFFE2E8F0),
                startAngle = 135f,
                sweepAngle = 270f,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )

            // Value Progress Arc
            val sweep = (score / 100f) * 270f
            drawArc(
                color = sevColor,
                startAngle = 135f,
                sweepAngle = sweep,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )
        }

        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "$score",
                fontSize = 38.sp,
                fontWeight = FontWeight.Bold,
                color = sevColor
            )
            Text(
                text = "urgency",
                fontSize = 12.sp,
                color = TextSecondary,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

@Composable
fun MilkYieldChart(
    currentYield: Double,
    baseline: Double,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier.fillMaxWidth()) {
        Canvas(
            modifier = Modifier
                .fillMaxWidth()
                .height(80.dp)
        ) {
            val width = size.width
            val height = size.height

            // Baseline Dashed Line
            val baselineY = height * 0.3f
            drawLine(
                color = BrandSecondary.copy(alpha = 0.4f),
                start = Offset(0f, baselineY),
                end = Offset(width, baselineY),
                strokeWidth = 2.dp.toPx()
            )

            // Polyline points
            val points = listOf(
                Offset(0f, height * 0.32f),
                Offset(width * 0.2f, height * 0.28f),
                Offset(width * 0.4f, height * 0.35f),
                Offset(width * 0.6f, height * 0.55f),
                Offset(width * 0.8f, height * 0.7f),
                Offset(width, height * 0.82f)
            )

            val path = Path().apply {
                moveTo(points.first().x, points.first().y)
                for (i in 1 until points.size) {
                    lineTo(points[i].x, points[i].y)
                }
            }

            drawPath(
                path = path,
                color = RiskHigh,
                style = Stroke(width = 3.dp.toPx(), cap = StrokeCap.Round)
            )

            // Draw current value circle
            drawCircle(
                color = RiskHigh,
                radius = 5.dp.toPx(),
                center = points.last()
            )
        }
    }
}
