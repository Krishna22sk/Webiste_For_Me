import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, X, Cpu, Code, Layers, Info } from 'lucide-react'

export default function Projects({ soundEnabled, incrementScore }) {
  const [selectedProject, setSelectedProject] = useState(null)
  const [tiltStyles, setTiltStyles] = useState({})
  
  const playPing = () => {
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1000, ctx.currentTime)
      gain.gain.setValueAtTime(0.015, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.1)
    } catch (e) {}
  }

  const projectsData = [
    {
      id: 'iot-kit',
      title: 'IoT Learning Kit',
      category: 'FIRMWARE & DEV KIT',
      description: 'Developed firmware for ESP32 and Arduino boards supporting IoT communication protocols and sensor integration.',
      longDescription: 'Created a comprehensive modular educational platform that allows engineering students to build and test hardware nodes. Piped multi-channel sensor telemetry (temperature, humidity, light, distance) over SPI and I2C buses, packaging them into JSON payloads delivered to local brokers.',
      tags: ['ESP32', 'Arduino', 'I2C', 'SPI', 'UART', 'MQTT'],
      github: 'https://github.com',
      diagram: `
+------------------+         I2C Bus        +--------------------+
|  ESP32 MCU Core  |<======================>|  BME280 Sensor Pod |
|  (FreeRTOS Tasks)|                        +--------------------+
+------------------+
         ||
         || SPI Bus
         \\/
+------------------+
|  SSD1306 Display |
+------------------+
      `,
      code: `
#include <Wire.h>
#include <SPI.h>
#include <PubSubClient.h>

#define I2C_SDA 21
#define I2C_SCL 22

void setup() {
  Wire.begin(I2C_SDA, I2C_SCL, 400000); // 400kHz I2C Bus Fast-mode
  initSensors();
  connectWiFi();
  mqttClient.setServer(mqtt_broker, 1883);
}

void loop() {
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();
  
  // FreeRTOS style scheduler loop
  float temp = readTemperature();
  publishSensorTelemetry(temp);
  delay(1000);
}
      `
    },
    {
      id: 'gym-auto',
      title: 'Gym Automation System',
      category: 'HARDWARE INTEGRATION',
      description: 'RFID-based locker assignment system with MQTT dashboard monitoring.',
      longDescription: 'Engineered an intelligent access routing infrastructure for facility locker grids. Integrates MFRC522 RFID scanners with ESP32 controllers. Handled asynchronous card reads, verified tokens via local SQLite database routing, triggered solenoid locks via high-voltage transistors, and logged active logs to an MQTT terminal dashboard.',
      tags: ['RFID', 'ESP32', 'PIC', 'MQTT', 'Solenoid Controller'],
      github: 'https://github.com',
      diagram: `
+-------------+      SPI Bus      +--------------+      3.3v GPIO      +------------------+
|  RFID Card  |===============>  | MFRC522 Node |====================>  | Solenoid Trigger |
+-------------+                   +--------------+                      +------------------+
                                         ||
                                         || MQTT Broker
                                         \\/
                                  +--------------+
                                  | Node-RED Hub |
                                  +--------------+
      `,
      code: `
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 5
#define RST_PIN 22
#define SOLENOID_PIN 15

MFRC522 mfrc522(SS_PIN, RST_PIN);

void checkLockerAccess() {
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    return;
  }
  
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uid += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uid += String(mfrc522.uid.uidByte[i], HEX);
  }
  
  if (validateCardToken(uid)) {
    digitalWrite(SOLENOID_PIN, HIGH); // Pulse relay open
    publishMQTTLog("LOCKER_OPENED", uid);
    delay(2000);
    digitalWrite(SOLENOID_PIN, LOW);
  } else {
    publishMQTTLog("ACCESS_DENIED", uid);
  }
}
      `
    },
    {
      id: 'stem-one-wire',
      title: 'STEM Project: One-Wire Comms',
      category: 'COMMUNICATION SYSTEMS',
      description: 'One-Wire communication protocol implementation between Arduino and STC15 microcontrollers.',
      longDescription: 'Implemented a custom, bit-banged One-Wire bus communication layer from scratch to transfer small byte arrays between an Arduino Uno master and STC15 slave microcontroller. Developed accurate pulse timing logic in assemblies to match standard 1-wire timing constraints (reset, presence pulse, write 0/1 timeslots).',
      tags: ['One-Wire', 'Arduino', 'STC15', 'Assembly', 'Bit-Banging'],
      github: 'https://github.com',
      diagram: `
+--------------+                                           +---------------+
| Master (MCU) |<=========================================>|  Slave (MCU)  |
| Arduino Uno  |         Single Data Line (4.7k Pull-up)   |     STC15     |
+--------------+                                           +---------------+
      `,
      code: `
// Custom Bit-Banged One-Wire Master Implementation
#define ONEWIRE_PIN 7

bool writeBit(bool bit) {
  noInterrupts();
  pinMode(ONEWIRE_PIN, OUTPUT);
  digitalWrite(ONEWIRE_PIN, LOW);
  
  if (bit) {
    delayMicroseconds(6); // Write 1 Slot
    pinMode(ONEWIRE_PIN, INPUT);
    delayMicroseconds(64);
  } else {
    delayMicroseconds(60); // Write 0 Slot
    pinMode(ONEWIRE_PIN, INPUT);
    delayMicroseconds(10);
  }
  interrupts();
}

bool readBit() {
  bool result;
  noInterrupts();
  pinMode(ONEWIRE_PIN, OUTPUT);
  digitalWrite(ONEWIRE_PIN, LOW);
  delayMicroseconds(6);
  pinMode(ONEWIRE_PIN, INPUT);
  delayMicroseconds(9);
  result = digitalRead(ONEWIRE_PIN);
  delayMicroseconds(55);
  interrupts();
  return result;
}
      `
    },
    {
      id: 'water-mon',
      title: 'Water Quality Monitor',
      category: 'ENVIRONMENTAL IOT',
      description: 'Biofloc aquaculture monitoring using Arduino, ESP01, pH Sensor, DS18B20 and Blynk.',
      longDescription: 'Engineered a telemetry sensor node for monitoring Biofloc fish tanks. Interfaced analog pH glass electrodes and DS18B20 digital temperature sensors on a single-bus chain. Used ESP01 WiFi co-processor with AT-commands routing to report metrics to a Blynk Cloud node, triggering automated alarms when water conditions fall out of thresholds.',
      tags: ['Arduino', 'ESP01', 'pH Sensor', 'DS18B20', 'Blynk', 'IoT Node'],
      github: 'https://github.com',
      diagram: `
+--------------+         One-Wire         +---------------------+
|              |<-------------------------|  DS18B20 Temp Probe |
|  Arduino Uno |       Analog Input       +---------------------+
|              |<-------------------------|  pH Electrode Module|
+--------------+                          +---------------------+
       ||
       || AT-Commands (Serial)
       \\/
+--------------+           WiFi           +---------------------+
| ESP-01 module|=========================>|  Blynk IoT Cloud    |
+--------------+                          +---------------------+
      `,
      code: `
#include <OneWire.h>
#include <DallasTemperature.h>
#include <SoftwareSerial.h>

#define ONE_WIRE_BUS 2
#define PH_PIN A0

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  sensors.begin();
  Serial.begin(115200); // ESP01 Link
  connectBlynk();
}

void checkWaterQuality() {
  sensors.requestTemperatures();
  float temp = sensors.getTempCByIndex(0);
  
  int rawPH = analogRead(PH_PIN);
  float voltage = rawPH * 5.0 / 1024.0;
  float phValue = 3.5 * voltage + PH_OFFSET; // pH calibration curve
  
  sendDataToBlynk(temp, phValue);
}
      `
    }
  ]

  // 3D Perspective Hover Tilt Effect
  const handleMouseMove = (e, index) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left 
    const y = e.clientY - rect.top  
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6
    
    setTiltStyles({
      [index]: {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
      }
    })
  }

  const handleMouseLeave = () => {
    setTiltStyles({})
  }

  const openProjectDetails = (proj) => {
    playPing()
    setSelectedProject(proj)
    incrementScore(`project_detail_${proj.id}`, 5, `Reviewed detailed schematics for ${proj.title}!`)
  }

  return (
    <section id="projects" className="py-24 md:py-32 relative bg-cyber-dark border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="section-label block mb-4">04 — Portfolio</span>
          <h2 className="heading-serif text-4xl md:text-6xl mb-4">
            Featured<br />
            <span className="heading-display text-3xl md:text-5xl">Projects</span>
          </h2>
          <div className="section-divider" />
        </div>
 
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 font-mono">
          {projectsData.map((project, idx) => (
            <div
              key={project.id}
              className="relative rounded-2xl border border-primary/8 bg-cyber-gray shadow-glass hover:border-primary/22 hover:shadow-card-hover transition-all duration-400 group overflow-hidden"
            >
              <div
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={handleMouseLeave}
                style={tiltStyles[idx] || { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' }}
                className="relative p-6 md:p-8 flex flex-col justify-between h-full transition-transform duration-300 ease-out"
              >
                <div>
                  {/* Category & Icon */}
                  <div className="flex justify-between items-center mb-5">
                    <span className="tag-pill">
                      {project.category}
                    </span>
                    <Cpu className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors duration-300" />
                  </div>

                  {/* Title — serif heading */}
                  <h3
                    className="font-serif font-bold text-xl text-white mb-3 hover:text-primary transition-colors leading-tight"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 font-sans text-sm font-light leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-xs font-mono"
                      data-hover
                    >
                      <Github className="w-3.5 h-3.5" />
                      Source Code
                    </a>

                    <button
                      onClick={() => openProjectDetails(project)}
                      className="text-xs font-sans font-medium text-primary border border-primary/20 px-4 py-2 rounded-full bg-primary/6 hover:bg-primary hover:text-cyber-dark transition-all duration-300"
                      data-hover
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Modal Dialog */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-cyber-darker/80 backdrop-blur-sm"
            />
 
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-cyber-gray border border-white/5 rounded-2xl p-6 md:p-8 z-10 font-mono shadow-glass scroll-smooth text-slate-300"
            >
              {/* Close */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-1.5 border border-white/5 hover:border-primary rounded-full text-slate-500 hover:text-primary transition-all"
              >
                <X className="w-4 h-4" />
              </button>
 
              {/* Modal Header */}
              <div className="mb-6 pb-4 border-b border-white/5">
                <span className="text-[9px] font-bold text-primary tracking-widest uppercase">
                  PROJECT SPECIFICATION // SYSTEM LOGS
                </span>
                <h3 className="font-orbitron font-extrabold text-2xl md:text-3xl text-white mt-1">
                  {selectedProject.title}
                </h3>
              </div>
 
              {/* Contents */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] text-primary font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <Layers className="w-3.5 h-3.5" />
                    System Overview
                  </h4>
                  <p className="text-slate-400 font-sans text-sm font-light leading-relaxed">
                    {selectedProject.longDescription}
                  </p>
                </div>
 
                {/* ASCII Diagram */}
                <div>
                  <h4 className="text-[10px] text-primary font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <Info className="w-3.5 h-3.5" />
                    Hardware Pinout / Block Diagram
                  </h4>
                  <pre className="p-4 bg-cyber-darker border border-white/5 rounded-xl text-[10px] md:text-xs text-primary overflow-x-auto leading-tight font-mono">
                    {selectedProject.diagram}
                  </pre>
                </div>
 
                {/* Code Block */}
                <div>
                  <h4 className="text-[10px] text-primary font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <Code className="w-3.5 h-3.5" />
                    Low-level Firmware Implementation
                  </h4>
                  <div className="relative rounded-xl overflow-hidden border border-white/5 bg-cyber-darker text-[10px] md:text-xs text-slate-300 p-4 max-h-64 overflow-y-auto">
                    <pre className="font-mono text-left leading-relaxed">
                      {selectedProject.code}
                    </pre>
                  </div>
                </div>
              </div>
 
              {/* Modal Footer */}
              <div className="mt-8 pt-4 border-t border-white/5 flex justify-end gap-4 text-[10px] font-bold">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 border border-white/5 rounded-full hover:border-primary text-slate-400 hover:text-primary transition-colors"
                >
                  CLOSE_LOGGER
                </button>
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary text-cyber-dark rounded-full hover:bg-white hover:text-black transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  PULL_SOURCE
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
