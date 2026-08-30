package com.pashusetu.app.presentation.ui.screens.farmer

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pashusetu.app.domain.model.Animal
import com.pashusetu.app.presentation.theme.*

data class SymptomInfo(val id: String, val icon: String, val label: String)

val ALL_SYMPTOMS = listOf(
    SymptomInfo("fever", "🌡️", "Fever"),
    SymptomInfo("cough", "🗣️", "Coughing"),
    SymptomInfo("nasal", "💧", "Runny nose"),
    SymptomInfo("appetite", "🍽️", "Not eating"),
    SymptomInfo("diarr", "💩", "Loose motion"),
    SymptomInfo("breath", "😮‍💨", "Hard breathing"),
    SymptomInfo("lame", "🦶", "Limping"),
    SymptomInfo("mouth", "👄", "Sores in mouth"),
    SymptomInfo("udder", "🥛", "Swollen udder"),
    SymptomInfo("milk", "📉", "Less milk"),
    SymptomInfo("weak", "🛋️", "Looks weak"),
    SymptomInfo("other", "➕", "Something else")
)

@Composable
fun ReportStep1SymptomsScreen(
    selectedSymptoms: Set<String>,
    onToggleSymptom: (String) -> Unit,
    onContinue: () -> Unit
) {
    var isListeningVoice by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text(
                text = "What did you notice?",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Text(
                text = "Pick everything that looks different. There is no wrong answer here.",
                fontSize = 13.5.sp,
                color = TextSecondary,
                modifier = Modifier.padding(top = 4.dp)
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Voice input card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { isListeningVoice = !isListeningVoice },
                colors = CardDefaults.cardColors(
                    containerColor = if (isListeningVoice) RiskHighBg else BrandLight
                ),
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(if (isListeningVoice) RiskHigh else BrandPrimary),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Mic,
                            contentDescription = "Voice Input",
                            tint = Color.White
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = if (isListeningVoice) "Listening… Speak in your language" else "Say it instead",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = "“तिला ताप आहे आणि ती खात नाही”",
                            fontSize = 12.5.sp,
                            color = TextSecondary
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            LazyVerticalGrid(
                columns = GridCells.Fixed(3),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.height(360.dp)
            ) {
                items(ALL_SYMPTOMS) { symptom ->
                    val isSelected = selectedSymptoms.contains(symptom.id)
                    Card(
                        modifier = Modifier
                            .height(96.dp)
                            .clickable { onToggleSymptom(symptom.id) },
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (isSelected) BrandLight else Color.White
                        ),
                        border = if (isSelected) CardDefaults.outlinedCardBorder(enabled = true) else null
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(8.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text(text = symptom.icon, fontSize = 28.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = symptom.label,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) BrandPrimary else TextPrimary,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }
        }

        Button(
            onClick = onContinue,
            enabled = selectedSymptoms.isNotEmpty(),
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary),
            shape = RoundedCornerShape(14.dp)
        ) {
            Text(
                text = "Continue · ${selectedSymptoms.size} picked",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun ReportStep2AnimalScreen(
    animals: List<Animal>,
    selectedAnimalId: String,
    onSelectAnimal: (String) -> Unit,
    deathCount: Int,
    onUpdateDeaths: (Int) -> Unit,
    othersCount: Int,
    onUpdateOthers: (Int) -> Unit,
    onContinue: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text(
                text = "Which animal?",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Text(
                text = "Tap the one you noticed this in.",
                fontSize = 13.5.sp,
                color = TextSecondary,
                modifier = Modifier.padding(top = 4.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                animals.forEach { animal ->
                    val isSelected = selectedAnimalId == animal.id
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onSelectAnimal(animal.id) },
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (isSelected) BrandLight else Color.White
                        ),
                        border = if (isSelected) CardDefaults.outlinedCardBorder(enabled = true) else null
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = isSelected,
                                onClick = { onSelectAnimal(animal.id) },
                                colors = RadioButtonDefaults.colors(selectedColor = BrandPrimary)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = animal.name,
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "${animal.breed} · ${animal.age}",
                                fontSize = 13.sp,
                                color = TextMuted
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Is anything else affected?",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "Others with same signs", fontSize = 14.sp, color = TextPrimary)
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = { if (othersCount > 0) onUpdateOthers(othersCount - 1) }) {
                        Text("-", fontSize = 22.sp, fontWeight = FontWeight.Bold)
                    }
                    Text(
                        text = "$othersCount",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp)
                    )
                    IconButton(onClick = { onUpdateOthers(othersCount + 1) }) {
                        Text("+", fontSize = 22.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Deaths in last 7 days",
                    fontSize = 14.sp,
                    color = if (deathCount > 0) RiskCritical else TextPrimary,
                    fontWeight = if (deathCount > 0) FontWeight.Bold else FontWeight.Normal
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = { if (deathCount > 0) onUpdateDeaths(deathCount - 1) }) {
                        Text("-", fontSize = 22.sp, fontWeight = FontWeight.Bold)
                    }
                    Text(
                        text = "$deathCount",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (deathCount > 0) RiskCritical else TextPrimary,
                        modifier = Modifier.padding(horizontal = 8.dp)
                    )
                    IconButton(onClick = { onUpdateDeaths(deathCount + 1) }) {
                        Text("+", fontSize = 22.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        Button(
            onClick = onContinue,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = if (deathCount > 0) RiskCritical else BrandPrimary
            ),
            shape = RoundedCornerShape(14.dp)
        ) {
            Text(
                text = if (deathCount > 0) "Get help now (Emergency)" else "Continue",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun ReportStep3CameraScreen(
    capturedPhotos: List<String>,
    onAddPhoto: () -> Unit,
    onContinue: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text(
                text = "Show us what you can see",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Text(
                text = "A photo does more than any answer you could type. The veterinarian sees exactly what you are seeing.",
                fontSize = 13.5.sp,
                color = TextSecondary,
                modifier = Modifier.padding(top = 4.dp),
                lineHeight = 18.sp
            )

            Spacer(modifier = Modifier.height(24.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(160.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(BrandLight)
                        .clickable { onAddPhoto() },
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.CameraAlt,
                            contentDescription = "Capture",
                            tint = BrandPrimary,
                            modifier = Modifier.size(36.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Whole Animal",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = BrandPrimary
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(160.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(BrandLight)
                        .clickable { onAddPhoto() },
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.CameraAlt,
                            contentDescription = "Capture Close-up",
                            tint = BrandPrimary,
                            modifier = Modifier.size(36.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Close-up Photo",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = BrandPrimary
                        )
                    }
                }
            }
        }

        Column {
            Button(
                onClick = onContinue,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text(text = "Continue", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(8.dp))

            TextButton(
                onClick = onContinue,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(text = "I cannot take a photo now", color = TextMuted)
            }
        }
    }
}
