package com.pashusetu.app.presentation.ui.screens.farmer

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pashusetu.app.domain.model.Animal
import com.pashusetu.app.presentation.theme.*
import com.pashusetu.app.presentation.ui.components.MilkYieldChart
import com.pashusetu.app.presentation.ui.components.RiskBadge

@Composable
fun HerdListScreen(
    animals: List<Animal>,
    onSelectAnimal: (String) -> Unit,
    onAddAnimal: () -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf("All") }

    val filteredList = animals.filter { animal ->
        val matchesSearch = animal.name.contains(searchQuery, ignoreCase = true) ||
                animal.tag.contains(searchQuery, ignoreCase = true) ||
                animal.breed.contains(searchQuery, ignoreCase = true)
        val matchesFilter = when (selectedFilter) {
            "Needs you" -> animal.status == "attention" || animal.status == "watch"
            "Vaccines due" -> animal.status == "due"
            "Fine" -> animal.status == "healthy"
            else -> true
        }
        matchesSearch && matchesFilter
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
    ) {
        // Search bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search by name or tag number") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search") },
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            shape = RoundedCornerShape(14.dp),
            singleLine = true
        )

        // Filter chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("All", "Needs you", "Vaccines due", "Fine").forEach { filter ->
                FilterChip(
                    selected = selectedFilter == filter,
                    onClick = { selectedFilter = filter },
                    label = { Text(filter + if (filter == "All") " · ${animals.size}" else "") }
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        if (filteredList.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = "🔍", fontSize = 48.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Nothing here",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = "No animal matches your query.",
                        fontSize = 14.sp,
                        color = TextMuted,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = onAddAnimal,
                        colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Add")
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Add an Animal")
                    }
                }
            }
        } else {
            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(filteredList) { animal ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onSelectAnimal(animal.id) },
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White)
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(50.dp)
                                    .clip(CircleShape)
                                    .background(BrandLight),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = if (animal.species == "Buffalo") "🦬" else "🐄",
                                    fontSize = 28.sp
                                )
                            }

                            Spacer(modifier = Modifier.width(14.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = animal.name,
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TextPrimary
                                    )
                                    if (animal.risk != "low") {
                                        Spacer(modifier = Modifier.width(8.dp))
                                        RiskBadge(risk = animal.risk, label = animal.riskLabel)
                                    }
                                }
                                Text(
                                    text = "${animal.species} · ${animal.breed} · ${animal.sex} · ${animal.age}",
                                    fontSize = 13.sp,
                                    color = TextSecondary,
                                    modifier = Modifier.padding(top = 2.dp)
                                )
                                Text(
                                    text = "Tag ${animal.tag}",
                                    fontSize = 12.sp,
                                    color = TextMuted,
                                    modifier = Modifier.padding(top = 2.dp)
                                )
                            }

                            Icon(
                                imageVector = Icons.Default.ChevronRight,
                                contentDescription = "Open",
                                tint = TextMuted
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AddAnimalScreen(
    onSaveAnimal: (name: String, tag: String, species: String, breed: String, sex: String, age: String) -> Unit,
    onCancel: () -> Unit
) {
    var name by remember { mutableStateOf("Gauri") }
    var tag by remember { mutableStateOf("274 8891 0040") }
    var selectedSpecies by remember { mutableStateOf("Cattle") }
    var selectedBreed by remember { mutableStateOf("HF Cross") }
    var sex by remember { mutableStateOf("Female") }
    var age by remember { mutableStateOf("3 yr") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
            .padding(20.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text(
                text = "Register a new animal",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Text(
                text = "Bharat Pashudhan & PashuSetu integration",
                fontSize = 13.sp,
                color = TextMuted
            )

            Spacer(modifier = Modifier.height(20.dp))

            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Animal name") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(14.dp))

            OutlinedTextField(
                value = tag,
                onValueChange = { tag = it },
                label = { Text("12-digit Ear Tag Number") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(text = "Species", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("Cattle", "Buffalo", "Goat").forEach { species ->
                    FilterChip(
                        selected = selectedSpecies == species,
                        onClick = { selectedSpecies = species },
                        label = { Text(species) },
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(text = "Breed", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                listOf("HF Cross", "Gir", "Murrah", "Pandharpuri").forEach { breed ->
                    FilterChip(
                        selected = selectedBreed == breed,
                        onClick = { selectedBreed = breed },
                        label = { Text(breed, fontSize = 12.sp) }
                    )
                }
            }
        }

        Button(
            onClick = { onSaveAnimal(name, tag, selectedSpecies, selectedBreed, sex, age) },
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary),
            shape = RoundedCornerShape(14.dp)
        ) {
            Text(text = "Save to Herd", fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun AnimalDetailScreen(
    animal: Animal,
    onReportIssue: () -> Unit
) {
    var selectedTab by remember { mutableStateOf(0) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
    ) {
        // Hero Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
                .background(BrandPrimary)
                .padding(20.dp)
        ) {
            Column(modifier = Modifier.align(Alignment.BottomStart)) {
                Text(
                    text = animal.name,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = "${animal.species} · ${animal.breed} · ${animal.sex} · ${animal.age}",
                    fontSize = 14.sp,
                    color = Color.White.copy(alpha = 0.85f)
                )
                Text(
                    text = "Bharat Pashudhan Tag: ${animal.tag}",
                    fontSize = 12.sp,
                    color = Color.White.copy(alpha = 0.65f),
                    modifier = Modifier.padding(top = 2.dp)
                )
            }

            Box(modifier = Modifier.align(Alignment.BottomEnd)) {
                RiskBadge(risk = animal.risk, label = animal.riskLabel)
            }
        }

        // Tabs
        TabRow(selectedTabIndex = selectedTab, containerColor = Color.White) {
            Tab(
                selected = selectedTab == 0,
                onClick = { selectedTab = 0 },
                text = { Text("History") }
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text("Records") }
            )
            Tab(
                selected = selectedTab == 2,
                onClick = { selectedTab = 2 },
                text = { Text("Milk Yield") }
            )
        }

        Box(
            modifier = Modifier
                .weight(1f)
                .padding(16.dp)
        ) {
            when (selectedTab) {
                0 -> {
                    Column {
                        Text(
                            text = "Recent Events Timeline",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            shape = RoundedCornerShape(14.dp)
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Text(text = "26 August 2026", fontSize = 12.sp, color = TextMuted)
                                Text(
                                    text = "Reported fever, runny nose and loss of appetite",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )
                                Text(
                                    text = "Sorted as High urgency by triage system.",
                                    fontSize = 13.sp,
                                    color = TextSecondary,
                                    modifier = Modifier.padding(top = 2.dp)
                                )
                            }
                        }
                    }
                }
                1 -> {
                    Column {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            shape = RoundedCornerShape(14.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = "FMD Vaccine status",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )
                                Text(
                                    text = "2 of 3 doses complete (78%). Batch FMD-2026-114.",
                                    fontSize = 13.sp,
                                    color = TextSecondary,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                                Spacer(modifier = Modifier.height(10.dp))
                                LinearProgressIndicator(
                                    progress = { 0.78f },
                                    modifier = Modifier.fillMaxWidth(),
                                    color = BrandSecondary,
                                )
                            }
                        }
                    }
                }
                2 -> {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "Daily yield vs baseline",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Spacer(modifier = Modifier.height(10.dp))
                            MilkYieldChart(currentYield = animal.yield, baseline = animal.baseline)
                        }
                    }
                }
            }
        }

        // Bottom CTA
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shadowElevation = 8.dp,
            color = Color.White
        ) {
            Box(modifier = Modifier.padding(16.dp)) {
                Button(
                    onClick = onReportIssue,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BrandPrimary),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text(text = "Report something about ${animal.name}", fontSize = 15.sp)
                }
            }
        }
    }
}
