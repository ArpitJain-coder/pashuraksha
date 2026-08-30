# PashuSetu Android Mobile Application

Native Android implementation of **PashuSetu** — Livestock Health Early-Warning & Veterinary Triage System (SIH 2026 / PS 26128).

Developed for the **Department of Animal Husbandry, Government of Maharashtra**.

---

## 📱 Application Architecture & Tech Stack

* **Language**: Kotlin 2.0.0
* **UI Framework**: Jetpack Compose with Material 3 Design System
* **Architecture**: Clean Architecture (Domain, Data, Presentation) + MVVM
* **Local Storage (Offline-First)**: Room SQLite Database with initial pre-seeded data from web prototype
* **Networking**: Retrofit 2 + OkHttp 4 REST API client + Network Connectivity Monitor
* **Background Synchronization**: Android WorkManager (`SyncDataWorker`)
* **Camera Capture**: Android CameraX API / Image Picker with automatic payload compression
* **Voice Symptom Reporting**: Native `SpeechRecognizer` integration for local languages (Marathi, Hindi, English)

---

## 👥 Supported Roles & Workflows

1. **Farmer Portal (`Arpit Kale - Wadgaon Farm`)**:
   - **Dashboard**: Attention cards, quick action tiles, weekly milk yield trend chart (vs baseline drop), village cluster alert notifications.
   - **Herd Catalog**: Search by ear tag/name, filter chips (*Needs you, Vaccines due, Fine*), new animal registration with 12-digit tag.
   - **4-Step AI Symptom Report Wizard**:
     - *Step 1*: Symptom selection pictograms + native voice input trigger.
     - *Step 2*: Affected animal picker + death and secondary symptom counters.
     - *Step 3*: Native CameraX photo capture preview (whole animal + close-up).
     - *Step 4*: Onset duration, vaccine status, and household human illness risk questions.
   - **AI Triage & Triage Gauge**: Urgency score arc gauge, severity badge, immediate action recommendation, rule-based evidence breakdown.
   - **Action Plan**: Interactive 4-step checklist.
   - **Case Tracking & Helpline**: Real-time tracking of opened cases and direct dialing to 1962 helpline.
   - **Offline Sync Queue**: Visual banner status bar, pending upload queue manager, manual retry.

2. **Veterinarian Portal (`Dr. R. Deshmukh - LDO Haveli`)**:
   - **Priority Triage Queue**: Urgency-sorted queue (critical, high, distance, wait time).
   - **Case Detail**: Transcribed farmer quote, photo close-ups, algorithmic evidence breakdown, quick clinical action triggers (*Add to route, Advise, Lab sample*).
   - **Route Planner & Vaccination Rounds**: Geographically optimized route planner and village round logger.

3. **District Officer Portal (`Dr. Anjali Kulkarni - DAHO Pune`)**:
   - **District Overview**: High-level KPIs, district risk sparklines, early outbreak cluster alerts.
   - **Village Heatmap**: Aggregate village-level epidemiological map preserving farmer privacy.
   - **Cluster Deep-Dive**: Outbreak lead-time analysis (e.g. 6 days ahead of lab reporting) and emergency response deployment.

---

## 🚀 How to Build & Run in Android Studio

1. Open **Android Studio** (Jellyfish / Koala or newer).
2. Select **Open** and select this directory (`c:\Users\arpit\OneDrive\Desktop\app`).
3. Allow Gradle to sync dependencies (`Jetpack Compose`, `Room`, `Retrofit`, `WorkManager`, `CameraX`).
4. Select an Android Emulator (API 24+) or connect a physical Android device.
5. Click **Run 'app'** (`Shift + F10`).

---

## 🛠️ Testing Offline Mode & Role Switching

* **Role Switcher**: Tap the **Swap Role** icon in the top app bar on any screen to switch instantly between **Farmer**, **Veterinarian**, and **District Officer** views.
* **Simulate Offline**: Tap **Simulate Offline Mode** in the role switcher or toggle airplane mode. Watch the top status bar change to **"No signal — everything still works"** and observe all actions staging into Room DB's sync queue!
