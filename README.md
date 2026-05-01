# 🏃 Ocean Runner (Lens Studio)

<p align="center">
  <img src="Media/gameplay.gif" width="600"/>
</p>

---

## 🎯 Overview

Endless runner game built in **Snap Lens Studio** using **Bitmoji 3D**, modular architecture, and optimized runtime systems.

---

## 🎮 Gameplay

- Player runs forward automatically
- Swipe left/right to change lanes
- Swipe up to jump
- Avoid obstacles
- Collect coins to increase score
- 3 lives system → Game Over on depletion

---

## 🧱 Architecture

Project follows a **modular and scalable architecture**:

### Core Systems

GameController  
- Game States (Ready / Running / GameOver)  
- Flow control  

RunnerSpawner  
- Object Pooling (Coins / Obstacles)  
- Lane-based spawning  
- Runtime object movement  

Player Systems  
- PlayerLaneMovement (lane switching)  
- PlayerJump (jump logic)  
- PlayerOverlapHandler (collision via physics)  

Services  
- ScoreService  
- LivesService  
- DifficultyService (speed scaling)  

Audio  
- Background music  
- Coin pickup SFX  
- Hit SFX  

---

## ⚙️ Key Features

### ✅ Object Pooling
- No runtime instantiation/destruction  
- Reuses coins and obstacles  
- Optimized for mobile performance  

### ✅ Physics-based Collision
- Uses Overlap Colliders  
- Reliable detection independent of speed  
- Separate logic for obstacles and coins  

### ✅ Lane System
- 3-lane runner system  
- Smooth lane switching  
- Safe path guaranteed in spawn logic  

### ✅ Game State System
READY → RUNNING → GAME OVER  

---

## 🎯 Controls

- Tap anywhere → Start Game  
- Swipe Left → Move Left  
- Swipe Right → Move Right  
- Swipe Up → Jump  

---

## 🔊 Audio

- Background music starts on game start  
- Coin pickup sound  
- Hit sound on collision  

---

## 📱 Performance Optimization

- Object pooling instead of instantiation  
- Reduced active object count  
- Lightweight colliders (Box/Sphere only)  
- Removed debug logs from runtime  
- Optimized textures  
- Disabled unnecessary rendering effects  

---

## 🧪 Tech Stack

- Snap Lens Studio  
- JavaScript (Lens scripting)  
- Bitmoji 3D + Mixamo animations  

---

## 📂 Project Structure

Assets/  
├── Scripts/  
│   ├── Core/  
│   ├── Player/  
│   ├── Spawning/  
│   ├── Services/  
│   └── Audio/  
├── Prefabs/  
│   ├── Coin  
│   └── Obstacle  
├── Audio/  
├── UI/  

---

## 🚀 Improvements

- Replaced static objects with pooled prefab system  
- Refactored collision to physics-based overlap  
- Separated systems (Spawner / Collision / Audio / Services)  
- Implemented mobile performance optimizations  

---

## 📌 Notes

This project was built as a test task with focus on:
- Clean architecture  
- Scalability  
- Mobile performance  
- Maintainability  

---

## ⚠️ This project uses Git LFS for large assets.
Please install Git LFS before cloning:
https://git-lfs.com/

Then run:
git lfs pull

---

## 👤 Author

Daniil Pavlenko  
Unity / Lens Studio Developer
