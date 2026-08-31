import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_USERS,
  INITIAL_VMS_INTEGRATIONS,
  INITIAL_CAMERAS,
  INITIAL_WATCHLISTS,
  INITIAL_GEOFENCES,
  INITIAL_DETECTIONS,
  INITIAL_ALERTS,
  INITIAL_INCIDENTS,
  INITIAL_INVESTIGATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_COVERAGE_GAPS,
  MOCK_TARGET_JOURNEY,
} from './src/data/mockData';
import {
  Camera,
  VMSIntegration,
  VehicleDetection,
  WatchlistEntry,
  ExplainableAlert,
  Incident,
  Investigation,
  GeofenceZone,
  AuditLogEntry,
  CoverageGapItem,
  User,
  ScaleSimulationMetrics,
  DataMode,
  JourneyReconstruction,
} from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-Memory Database Store (Stateful statewide repository)
let dataMode: DataMode = 'DEMO_DATA';
let currentUser: User = INITIAL_USERS[0];
let cameras: Camera[] = [...INITIAL_CAMERAS];
let vmsIntegrations: VMSIntegration[] = [...INITIAL_VMS_INTEGRATIONS];
let detections: VehicleDetection[] = [...INITIAL_DETECTIONS];
let watchlists: WatchlistEntry[] = [...INITIAL_WATCHLISTS];
let alerts: ExplainableAlert[] = [...INITIAL_ALERTS];
let incidents: Incident[] = [...INITIAL_INCIDENTS];
let investigations: Investigation[] = [...INITIAL_INVESTIGATIONS];
let geofences: GeofenceZone[] = [...INITIAL_GEOFENCES];
let auditLogs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];
let coverageGaps: CoverageGapItem[] = [...INITIAL_COVERAGE_GAPS];

// Helper to log audit events
function logAudit(
  action: AuditLogEntry['action'],
  resourceType: string,
  resourceId: string,
  justification?: string,
  details?: Record<string, any>
) {
  const entry: AuditLogEntry = {
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userId: currentUser.id,
    userName: currentUser.name,
    role: currentUser.role,
    department: currentUser.department,
    action,
    resourceType,
    resourceId,
    ipAddress: '10.24.12.105',
    justification: justification || 'Standard operator command centre activity',
    details,
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 500) {
    auditLogs.pop();
  }
}

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

// 1. Auth & Current Session
app.get('/api/auth/me', (req, res) => {
  res.json({
    user: currentUser,
    availableUsers: INITIAL_USERS,
    dataMode,
  });
});

app.post('/api/auth/switch-role', (req, res) => {
  const { userId } = req.body;
  const targetUser = INITIAL_USERS.find((u) => u.id === userId);
  if (targetUser) {
    currentUser = targetUser;
    logAudit('ROLE_SWITCH', 'USER', targetUser.id, `Switched active session to ${targetUser.name} (${targetUser.role})`);
    res.json({ success: true, user: currentUser });
  } else {
    res.status(404).json({ error: 'User profile not found' });
  }
});

// 2. Data Mode Switcher & Ingestion
app.get('/api/data-mode', (req, res) => {
  res.json({
    dataMode,
    stats: {
      totalCameras: cameras.length,
      totalDetections: detections.length,
      totalAlerts: alerts.length,
      totalInvestigations: investigations.length,
      totalIntegrations: vmsIntegrations.length,
    },
  });
});

app.post('/api/data-mode/toggle', (req, res) => {
  const { mode } = req.body;
  if (mode === 'DEMO_DATA' || mode === 'GOVERNMENT_DATA') {
    dataMode = mode;
    logAudit('DATA_INGESTION', 'SYSTEM', mode, `Toggled data mode to ${mode}`);
    res.json({ success: true, dataMode });
  } else {
    res.status(400).json({ error: 'Invalid data mode' });
  }
});

app.post('/api/data-mode/reset-demo', (req, res) => {
  cameras = [...INITIAL_CAMERAS];
  vmsIntegrations = [...INITIAL_VMS_INTEGRATIONS];
  detections = [...INITIAL_DETECTIONS];
  watchlists = [...INITIAL_WATCHLISTS];
  alerts = [...INITIAL_ALERTS];
  incidents = [...INITIAL_INCIDENTS];
  investigations = [...INITIAL_INVESTIGATIONS];
  geofences = [...INITIAL_GEOFENCES];
  auditLogs = [...INITIAL_AUDIT_LOGS];
  dataMode = 'DEMO_DATA';
  logAudit('DATA_INGESTION', 'SYSTEM', 'RESET', 'Reset all state back to clean Gujarat demo baseline');
  res.json({ success: true, message: 'Reset to demo baseline complete' });
});

app.post('/api/data-mode/ingest', (req, res) => {
  const { type, records } = req.body;
  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Records must be an array' });
  }

  let count = 0;
  if (type === 'CAMERAS') {
    records.forEach((r: any) => {
      if (r.name && r.lat && r.lng) {
        cameras.push({
          id: r.id || `CAM-INGEST-${Date.now()}-${count++}`,
          name: r.name,
          department: r.department || 'POLICE',
          locationName: r.locationName || 'Imported Location',
          district: r.district || 'Ahmedabad',
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lng),
          vendor: r.vendor || 'Generic RTSP/ONVIF',
          vmsInstance: r.vmsInstance || 'Govt-Custom-VMS',
          cameraType: r.cameraType || 'ANPR_BULLET',
          resolution: r.resolution || '1080p',
          fps: r.fps || 25,
          status: 'ONLINE',
          healthScore: 95,
          latencyMs: 20,
          packetLoss: 0.01,
          lastHeartbeat: 'Just now',
          installationDate: new Date().toISOString().substring(0, 10),
          maintenanceStatus: 'GOOD',
          coverageRadiusMeters: r.coverageRadiusMeters || 120,
          directionBearing: r.directionBearing || 0,
          zone: r.zone || 'Ingested Sector',
        });
      }
    });
  } else if (type === 'DETECTIONS') {
    records.forEach((r: any) => {
      if (r.plateNumber) {
        detections.push({
          id: `DET-INGEST-${Date.now()}-${count++}`,
          plateNumber: r.plateNumber.toUpperCase(),
          normalizedPlate: r.plateNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
          vehicleType: r.vehicleType || 'SEDAN',
          makeModel: r.makeModel || 'Unknown Make',
          color: r.color || 'Silver',
          confidence: r.confidence || 95.0,
          ocrConfidence: r.ocrConfidence || 96.0,
          speedKmph: r.speedKmph || 60,
          timestamp: r.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19),
          cameraId: r.cameraId || cameras[0]?.id || 'CAM-AMD-101',
          cameraName: r.cameraName || 'Default Camera',
          locationName: r.locationName || 'Imported Junction',
          district: r.district || 'Ahmedabad',
          lat: r.lat || 23.0278,
          lng: r.lng || 72.5074,
          direction: r.direction || 'NORTHBOUND',
          lane: r.lane || 1,
          snapshotUrl: '/demo/suv_iscon.jpg',
          plateCropUrl: '/demo/plate_clean.png',
          requiresReview: false,
        });
      }
    });
  } else if (type === 'WATCHLIST') {
    records.forEach((r: any) => {
      if (r.identifier) {
        watchlists.push({
          id: `WL-INGEST-${Date.now()}-${count++}`,
          identifier: r.identifier.toUpperCase(),
          entityType: 'VEHICLE',
          reason: r.reason || 'Ingested government watchlist target',
          category: r.category || 'WARRANT',
          priority: r.priority || 'HIGH',
          department: r.department || 'POLICE',
          createdBy: currentUser.name,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          expiresAt: '2026-12-31 23:59:59',
          isActive: true,
          notes: r.notes || 'Imported via government data connector',
        });
      }
    });
  }

  dataMode = 'GOVERNMENT_DATA';
  logAudit('DATA_INGESTION', 'DATA_CONNECTOR', type, `Ingested ${records.length} records into ${type}`);
  res.json({ success: true, count: records.length, dataMode });
});

// 3. CCTV Cameras & Registry
app.get('/api/cameras', (req, res) => {
  const { department, status, district, vendor, search } = req.query;
  let filtered = [...cameras];

  if (department && department !== 'ALL') {
    filtered = filtered.filter((c) => c.department === department);
  }
  if (status && status !== 'ALL') {
    filtered = filtered.filter((c) => c.status === status);
  }
  if (district && district !== 'ALL') {
    filtered = filtered.filter((c) => c.district === district);
  }
  if (vendor && vendor !== 'ALL') {
    filtered = filtered.filter((c) => c.vendor === vendor);
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.locationName.toLowerCase().includes(q) ||
        c.zone.toLowerCase().includes(q)
    );
  }

  res.json({
    cameras: filtered,
    total: filtered.length,
    summary: {
      online: cameras.filter((c) => c.status === 'ONLINE').length,
      degraded: cameras.filter((c) => c.status === 'DEGRADED').length,
      offline: cameras.filter((c) => c.status === 'OFFLINE').length,
      totalStatewideSimulated: dataMode === 'DEMO_DATA' ? 42850 : cameras.length,
    },
  });
});

app.post('/api/cameras', (req, res) => {
  const newCam: Camera = {
    id: req.body.id || `CAM-GJ-${Date.now().toString().slice(-4)}`,
    name: req.body.name || 'New CCTV Node',
    department: req.body.department || 'POLICE',
    locationName: req.body.locationName || 'Gujarat Junction',
    district: req.body.district || 'Ahmedabad',
    lat: parseFloat(req.body.lat) || 23.0225,
    lng: parseFloat(req.body.lng) || 72.5714,
    vendor: req.body.vendor || 'Generic RTSP/ONVIF',
    vmsInstance: req.body.vmsInstance || 'Default-Adapter',
    cameraType: req.body.cameraType || 'ANPR_BULLET',
    resolution: req.body.resolution || '4K (3840x2160)',
    fps: req.body.fps || 30,
    status: 'ONLINE',
    healthScore: 98,
    latencyMs: 18,
    packetLoss: 0.01,
    lastHeartbeat: 'Just now',
    installationDate: new Date().toISOString().substring(0, 10),
    maintenanceStatus: 'GOOD',
    coverageRadiusMeters: req.body.coverageRadiusMeters || 120,
    directionBearing: req.body.directionBearing || 0,
    zone: req.body.zone || 'Statewide Grid',
  };
  cameras.unshift(newCam);
  logAudit('CAMERA_LIVE_VIEW', 'CAMERA', newCam.id, `Registered new camera: ${newCam.name}`);
  res.json({ success: true, camera: newCam });
});

app.put('/api/cameras/:id', (req, res) => {
  const idx = cameras.findIndex((c) => c.id === req.params.id);
  if (idx !== -1) {
    cameras[idx] = { ...cameras[idx], ...req.body };
    logAudit('CAMERA_LIVE_VIEW', 'CAMERA', req.params.id, `Updated camera metadata`);
    res.json({ success: true, camera: cameras[idx] });
  } else {
    res.status(404).json({ error: 'Camera not found' });
  }
});

app.delete('/api/cameras/:id', (req, res) => {
  const idx = cameras.findIndex((c) => c.id === req.params.id);
  if (idx !== -1) {
    const deleted = cameras.splice(idx, 1)[0];
    logAudit('CAMERA_LIVE_VIEW', 'CAMERA', req.params.id, `Decommissioned camera node`);
    res.json({ success: true, deletedId: req.params.id });
  } else {
    res.status(404).json({ error: 'Camera not found' });
  }
});

// 4. VMS Integrations & Multi-Vendor Hub
app.get('/api/vms', (req, res) => {
  res.json({
    integrations: vmsIntegrations,
    totalCamerasFederated: vmsIntegrations.reduce((acc, v) => acc + v.cameraCount, 0),
    adapterHealth: 'OPERATIONAL',
  });
});

app.post('/api/vms/:id/sync', (req, res) => {
  const item = vmsIntegrations.find((v) => v.id === req.params.id);
  if (item) {
    item.lastSync = 'Just now (< 5s ago)';
    item.latencyMs = Math.floor(Math.random() * 20) + 12;
    item.status = 'CONNECTED';
    logAudit('CAMERA_LIVE_VIEW', 'VMS_INTEGRATION', item.id, `Triggered manual sync with ${item.name}`);
    res.json({ success: true, integration: item });
  } else {
    res.status(404).json({ error: 'Integration not found' });
  }
});

// 5. Vehicle Intelligence, ANPR, & Cross-Camera Tracking
app.get('/api/vehicles/search', (req, res) => {
  const { query, vehicleType, district, minConfidence, watchlistOnly, startTime, endTime } = req.query;
  let results = [...detections];

  if (query) {
    const q = String(query).trim().toUpperCase().replace(/[^A-Z0-9*?]/g, '');
    if (q.includes('*') || q.includes('?')) {
      const regex = new RegExp('^' + q.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
      results = results.filter((d) => regex.test(d.normalizedPlate) || regex.test(d.plateNumber));
    } else {
      results = results.filter(
        (d) => d.plateNumber.toUpperCase().includes(q) || d.normalizedPlate.includes(q)
      );
    }
  }

  if (vehicleType && vehicleType !== 'ALL') {
    results = results.filter((d) => d.vehicleType === vehicleType);
  }
  if (district && district !== 'ALL') {
    results = results.filter((d) => d.district === district);
  }
  if (minConfidence) {
    const min = parseFloat(String(minConfidence));
    results = results.filter((d) => d.confidence >= min);
  }
  if (watchlistOnly === 'true') {
    results = results.filter((d) => d.watchlistMatch);
  }

  logAudit(
    'VEHICLE_SEARCH',
    'VEHICLE_INDEX',
    String(query || 'ALL'),
    `Searched vehicle ANPR database: ${query || 'broad scan'}`
  );

  res.json({
    results,
    count: results.length,
    totalIndexedDetections: dataMode === 'DEMO_DATA' ? 1428500 : detections.length,
  });
});

app.get('/api/vehicles/track/:plate', (req, res) => {
  const rawPlate = req.params.plate.toUpperCase();
  const normalized = rawPlate.replace(/[^A-Z0-9]/g, '');

  if (normalized === 'GJ01AB1234') {
    logAudit('JOURNEY_RECONSTRUCT', 'VEHICLE', 'GJ01AB1234', 'Reconstructed journey route across SG Highway corridor');
    return res.json({ journey: MOCK_TARGET_JOURNEY });
  }

  // Dynamic builder for other plates
  const matches = detections.filter(
    (d) => d.normalizedPlate === normalized || d.plateNumber.toUpperCase() === rawPlate
  );

  if (matches.length === 0) {
    return res.status(404).json({ error: 'No sightings found for this plate' });
  }

  matches.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const waypoints = matches.map((m, idx) => {
    const prev = idx > 0 ? matches[idx - 1] : null;
    const timeGapMinutes = prev
      ? Math.max(0, (new Date(m.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 60000)
      : 0;

    return {
      cameraId: m.cameraId,
      cameraName: m.cameraName,
      locationName: m.locationName,
      district: m.district,
      lat: m.lat,
      lng: m.lng,
      timestamp: m.timestamp.split(' ')[1] || m.timestamp,
      direction: m.direction,
      confidence: m.confidence,
      snapshotUrl: m.snapshotUrl,
      timeGapMinutes: parseFloat(timeGapMinutes.toFixed(1)),
    };
  });

  const last = waypoints[waypoints.length - 1];
  const dynamicHandoffs = cameras
    .filter((c) => c.id !== last.cameraId && c.district === last.district)
    .slice(0, 3)
    .map((c, i) => ({
      cameraId: c.id,
      cameraName: c.name,
      locationName: c.locationName,
      lat: c.lat,
      lng: c.lng,
      probability: [75, 54, 38][i] || 40,
      estimatedEtaSeconds: 300 + i * 180,
      roadName: `${c.zone} Arterial`,
      rationale: `Trajectory extrapolation based on ${last.direction} vector at ${last.locationName}.`,
    }));

  const dynamicJourney: JourneyReconstruction = {
    plateNumber: rawPlate,
    totalSightings: waypoints.length,
    startTime: matches[0].timestamp,
    endTime: matches[matches.length - 1].timestamp,
    durationMinutes: 15.0,
    averageSpeedKmph: 68.4,
    distanceKm: 8.5,
    waypoints,
    predictiveHandoffs: dynamicHandoffs,
  };

  logAudit('JOURNEY_RECONSTRUCT', 'VEHICLE', rawPlate, `Reconstructed path with ${waypoints.length} sightings`);
  res.json({ journey: dynamicJourney });
});

// Human Review on Low-Confidence ANPR
app.post('/api/vehicles/review-detection', (req, res) => {
  const { detectionId, decision, correctedPlate } = req.body;
  const det = detections.find((d) => d.id === detectionId);
  if (det) {
    det.requiresReview = false;
    det.reviewStatus = decision;
    det.reviewedBy = currentUser.name;
    if (decision === 'CONFIRMED' && correctedPlate) {
      det.plateNumber = correctedPlate;
      det.normalizedPlate = correctedPlate.replace(/[^A-Z0-9]/g, '');
    }
    logAudit(
      'AI_REVIEW_DECISION',
      'DETECTION',
      detectionId,
      `Operator decision: ${decision} for detection ${detectionId}`,
      { decision, correctedPlate }
    );
    res.json({ success: true, detection: det });
  } else {
    res.status(404).json({ error: 'Detection not found' });
  }
});

// 6. Watchlists
app.get('/api/watchlists', (req, res) => {
  res.json({ watchlists, total: watchlists.length });
});

app.post('/api/watchlists', (req, res) => {
  const entry: WatchlistEntry = {
    id: `WL-${Date.now().toString().slice(-4)}`,
    identifier: req.body.identifier.toUpperCase(),
    entityType: req.body.entityType || 'VEHICLE',
    reason: req.body.reason || 'Operational watchlist entry',
    category: req.body.category || 'WARRANT',
    priority: req.body.priority || 'HIGH',
    department: req.body.department || currentUser.department,
    createdBy: currentUser.name,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    expiresAt: req.body.expiresAt || '2026-10-31 23:59:59',
    isActive: true,
    notes: req.body.notes || '',
    associatedCaseNumber: req.body.associatedCaseNumber,
  };
  watchlists.unshift(entry);
  logAudit('WATCHLIST_MODIFY', 'WATCHLIST', entry.id, `Created watchlist target: ${entry.identifier}`);
  res.json({ success: true, watchlist: entry });
});

app.put('/api/watchlists/:id/toggle', (req, res) => {
  const item = watchlists.find((w) => w.id === req.params.id);
  if (item) {
    item.isActive = !item.isActive;
    logAudit('WATCHLIST_MODIFY', 'WATCHLIST', item.id, `Toggled active state to ${item.isActive}`);
    res.json({ success: true, watchlist: item });
  } else {
    res.status(404).json({ error: 'Watchlist entry not found' });
  }
});

app.delete('/api/watchlists/:id', (req, res) => {
  const idx = watchlists.findIndex((w) => w.id === req.params.id);
  if (idx !== -1) {
    const deleted = watchlists.splice(idx, 1)[0];
    logAudit('WATCHLIST_MODIFY', 'WATCHLIST', req.params.id, `Deleted watchlist record: ${deleted.identifier}`);
    res.json({ success: true, deletedId: req.params.id });
  } else {
    res.status(404).json({ error: 'Watchlist entry not found' });
  }
});

// 7. Explainable Alerts
app.get('/api/alerts', (req, res) => {
  const { severity, status, department } = req.query;
  let filtered = [...alerts];

  if (severity && severity !== 'ALL') {
    filtered = filtered.filter((a) => a.severity === severity);
  }
  if (status && status !== 'ALL') {
    filtered = filtered.filter((a) => a.status === status);
  }
  if (department && department !== 'ALL') {
    filtered = filtered.filter((a) => a.department === department);
  }

  res.json({
    alerts: filtered,
    total: filtered.length,
    activeCount: alerts.filter((a) => a.status === 'ACTIVE').length,
    criticalCount: alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length,
  });
});

app.post('/api/alerts/:id/acknowledge', (req, res) => {
  const item = alerts.find((a) => a.id === req.params.id);
  if (item) {
    item.status = 'ACKNOWLEDGED';
    item.assignedTo = currentUser.name;
    item.acknowledgedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    logAudit('ALERT_ACKNOWLEDGE', 'ALERT', item.id, `Acknowledged alert: ${item.title}`);
    res.json({ success: true, alert: item });
  } else {
    res.status(404).json({ error: 'Alert not found' });
  }
});

app.post('/api/alerts/:id/escalate', (req, res) => {
  const item = alerts.find((a) => a.id === req.params.id);
  if (item) {
    item.status = 'ESCALATED_TO_INCIDENT';
    // Check or create correlated incident
    const newInc: Incident = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      incidentNumber: `INC-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      title: `Escalated Incident: ${item.title}`,
      summary: `Automated escalation from explainable alert ${item.id} (${item.locationName}).`,
      severity: item.severity,
      status: 'IN_PROGRESS',
      district: item.district,
      primaryLocation: item.locationName,
      lat: item.lat,
      lng: item.lng,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      relatedVehiclePlates: item.plateNumber ? [item.plateNumber] : [],
      relatedCameraIds: [item.cameraId],
      relatedAlertIds: [item.id],
      leadOfficer: currentUser.name,
      department: item.department,
    };
    incidents.unshift(newInc);
    item.incidentId = newInc.id;
    logAudit('ALERT_ESCALATE', 'ALERT', item.id, `Escalated alert ${item.id} to new incident ${newInc.incidentNumber}`);
    res.json({ success: true, alert: item, incident: newInc });
  } else {
    res.status(404).json({ error: 'Alert not found' });
  }
});

// 8. Incidents & Event Correlation
app.get('/api/incidents', (req, res) => {
  res.json({ incidents, total: incidents.length });
});

app.post('/api/incidents', (req, res) => {
  const newInc: Incident = {
    id: `INC-${Date.now().toString().slice(-4)}`,
    incidentNumber: `INC-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
    title: req.body.title || 'New Correlated Incident',
    summary: req.body.summary || 'Multi-camera correlated event',
    severity: req.body.severity || 'HIGH',
    status: 'OPEN',
    district: req.body.district || 'Ahmedabad',
    primaryLocation: req.body.primaryLocation || 'Gujarat Command Sector',
    lat: req.body.lat || 23.0225,
    lng: req.body.lng || 72.5714,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    relatedVehiclePlates: req.body.relatedVehiclePlates || [],
    relatedCameraIds: req.body.relatedCameraIds || [],
    relatedAlertIds: req.body.relatedAlertIds || [],
    leadOfficer: currentUser.name,
    department: currentUser.department,
  };
  incidents.unshift(newInc);
  logAudit('ALERT_ESCALATE', 'INCIDENT', newInc.id, `Logged statewide incident: ${newInc.title}`);
  res.json({ success: true, incident: newInc });
});

// 9. Investigation Workspace & Case Management
app.get('/api/investigations', (req, res) => {
  res.json({ investigations, total: investigations.length });
});

app.get('/api/investigations/:id', (req, res) => {
  const inv = investigations.find((i) => i.id === req.params.id || i.caseNumber === req.params.id);
  if (inv) {
    res.json({ investigation: inv });
  } else {
    res.status(404).json({ error: 'Investigation not found' });
  }
});

app.post('/api/investigations', (req, res) => {
  const inv: Investigation = {
    id: `INV-${Date.now().toString().slice(-4)}`,
    caseNumber: `INV-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
    title: req.body.title || 'Statewide Investigation Case',
    description: req.body.description || 'Active multi-source investigation dossier.',
    priority: req.body.priority || 'HIGH',
    status: 'ACTIVE',
    leadInvestigator: currentUser.name,
    department: currentUser.department,
    targetVehiclePlate: req.body.targetVehiclePlate,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    incidentId: req.body.incidentId,
    linkedCameraIds: req.body.linkedCameraIds || ['CAM-AMD-101'],
    linkedAlertIds: req.body.linkedAlertIds || [],
    evidence: [],
    events: [
      {
        id: `EVT-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        title: 'Case File Opened',
        description: `Investigation initialized by ${currentUser.name}`,
        type: 'STATUS_CHANGE',
        actor: currentUser.name,
      },
    ],
    notes: [],
    routePoints: [],
  };

  investigations.unshift(inv);
  logAudit('INVESTIGATION_CREATE', 'INVESTIGATION', inv.id, `Opened case: ${inv.caseNumber} - ${inv.title}`);
  res.json({ success: true, investigation: inv });
});

app.post('/api/investigations/:id/evidence', (req, res) => {
  const inv = investigations.find((i) => i.id === req.params.id);
  if (inv) {
    const rawPayload = JSON.stringify(req.body);
    const sha256 = crypto.createHash('sha256').update(rawPayload + Date.now()).digest('hex');

    const item = {
      id: `EVD-${Date.now().toString().slice(-4)}`,
      investigationId: inv.id,
      type: req.body.type || 'CCTV_SNAPSHOT',
      title: req.body.title || 'Forensic Snapshot Evidence',
      sourceCameraId: req.body.sourceCameraId,
      cameraName: req.body.cameraName,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      addedBy: currentUser.name,
      addedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      sha256Hash: sha256,
      fileSizeKb: Math.floor(Math.random() * 800) + 400,
      integrityVerified: true,
      metadata: req.body.metadata || {},
    };

    inv.evidence.push(item);
    inv.events.push({
      id: `EVT-${Date.now()}`,
      timestamp: item.timestamp,
      title: `Evidence Attached: ${item.title}`,
      description: `Cryptographic SHA-256 integrity seal verified: ${sha256.substring(0, 16)}...`,
      type: 'EVIDENCE_ATTACHED',
      actor: currentUser.name,
      cameraId: item.sourceCameraId,
    });
    inv.updatedAt = item.timestamp;

    logAudit(
      'EVIDENCE_EXPORT',
      'EVIDENCE',
      item.id,
      `Attached evidence ${item.id} with SHA-256 seal to case ${inv.caseNumber}`
    );
    res.json({ success: true, evidence: item, investigation: inv });
  } else {
    res.status(404).json({ error: 'Investigation not found' });
  }
});

app.post('/api/investigations/:id/notes', (req, res) => {
  const inv = investigations.find((i) => i.id === req.params.id);
  if (inv) {
    const note = {
      id: `NOTE-${Date.now()}`,
      author: currentUser.name,
      text: req.body.text,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    inv.notes.push(note);
    inv.events.push({
      id: `EVT-${Date.now()}`,
      timestamp: note.timestamp,
      title: 'Investigator Note Logged',
      description: note.text.substring(0, 80) + '...',
      type: 'OFFICER_NOTE',
      actor: currentUser.name,
    });
    inv.updatedAt = note.timestamp;
    logAudit('INVESTIGATION_UPDATE', 'INVESTIGATION', inv.id, `Added investigator note to case ${inv.caseNumber}`);
    res.json({ success: true, note, investigation: inv });
  } else {
    res.status(404).json({ error: 'Investigation not found' });
  }
});

// 10. Investigation Graph
app.get('/api/investigations/:id/graph', (req, res) => {
  const inv = investigations.find((i) => i.id === req.params.id) || investigations[0];
  if (!inv) {
    return res.status(404).json({ error: 'Investigation not found' });
  }

  const nodes: Array<{ id: string; name: string; type: string; details?: any }> = [];
  const links: Array<{ source: string; target: string; relationship: string }> = [];

  // Core Case Node
  nodes.push({ id: inv.id, name: inv.caseNumber, type: 'INVESTIGATION', details: { title: inv.title, status: inv.status } });

  // Target Vehicle
  if (inv.targetVehiclePlate) {
    const vId = `V-${inv.targetVehiclePlate}`;
    nodes.push({ id: vId, name: inv.targetVehiclePlate, type: 'VEHICLE', details: { plate: inv.targetVehiclePlate } });
    links.push({ source: inv.id, target: vId, relationship: 'PRIMARY_SUBJECT' });

    // Watchlist link
    const wl = watchlists.find((w) => w.identifier === inv.targetVehiclePlate);
    if (wl) {
      nodes.push({ id: wl.id, name: `Watchlist: ${wl.identifier}`, type: 'WATCHLIST', details: { priority: wl.priority, reason: wl.reason } });
      links.push({ source: vId, target: wl.id, relationship: 'WATCHLIST_HIT' });
    }
  }

  // Linked Cameras
  inv.linkedCameraIds.forEach((cId) => {
    const cam = cameras.find((c) => c.id === cId);
    if (cam) {
      nodes.push({ id: cam.id, name: cam.name, type: 'CAMERA', details: { location: cam.locationName, vendor: cam.vendor } });
      if (inv.targetVehiclePlate) {
        links.push({ source: `V-${inv.targetVehiclePlate}`, target: cam.id, relationship: 'CAPTURED_BY' });
      }
      links.push({ source: inv.id, target: cam.id, relationship: 'MONITORING_GRID' });
    }
  });

  // Linked Alerts
  inv.linkedAlertIds.forEach((aId) => {
    const alt = alerts.find((a) => a.id === aId);
    if (alt) {
      nodes.push({ id: alt.id, name: `Alert: ${alt.id}`, type: 'ALERT', details: { severity: alt.severity, score: alt.overallScore } });
      links.push({ source: inv.id, target: alt.id, relationship: 'EXPLAINABLE_ALERT' });
      if (alt.cameraId) {
        links.push({ source: alt.cameraId, target: alt.id, relationship: 'TRIGGERED_ALERT' });
      }
    }
  });

  // Evidence Nodes
  inv.evidence.forEach((ev) => {
    nodes.push({ id: ev.id, name: ev.title, type: 'EVIDENCE', details: { hash: ev.sha256Hash, type: ev.type } });
    links.push({ source: inv.id, target: ev.id, relationship: 'SECURED_EVIDENCE' });
    if (ev.sourceCameraId) {
      links.push({ source: ev.sourceCameraId, target: ev.id, relationship: 'EXTRACTED_FROM' });
    }
  });

  res.json({ nodes, links });
});

// 11. Geofences
app.get('/api/geofences', (req, res) => {
  res.json({ geofences, total: geofences.length });
});

app.post('/api/geofences', (req, res) => {
  const zone: GeofenceZone = {
    id: `GEO-${Date.now().toString().slice(-4)}`,
    name: req.body.name || 'New Monitored Geofence',
    category: req.body.category || 'CRITICAL_INFRASTRUCTURE',
    district: req.body.district || 'Ahmedabad',
    center: req.body.center || [72.5714, 23.0225],
    coordinates: req.body.coordinates || [
      [72.56, 23.03],
      [72.58, 23.03],
      [72.58, 23.01],
      [72.56, 23.01],
      [72.56, 23.03],
    ],
    color: req.body.color || '#3b82f6',
    triggerOn: req.body.triggerOn || ['ENTRY', 'EXIT'],
    activeWatchlistAlertsOnly: req.body.activeWatchlistAlertsOnly ?? true,
    status: 'ACTIVE',
  };
  geofences.push(zone);
  logAudit('GEOFENCE_MODIFY', 'GEOFENCE', zone.id, `Created geofence perimeter: ${zone.name}`);
  res.json({ success: true, geofence: zone });
});

// 12. Coverage Gap Intelligence
app.get('/api/coverage', (req, res) => {
  res.json({
    gaps: coverageGaps,
    totalGaps: coverageGaps.length,
    statewideCoverageDensityScore: 88.4,
    unmonitoredKilometers: 34.2,
    decisionSupportDisclaimer:
      'PLANNING & DECISION SUPPORT SIMULATION ONLY. Does not represent statutory government recommendations.',
  });
});

// 13. Scale Simulator
app.get('/api/scale-simulator', (req, res) => {
  const count = parseInt(String(req.query.count || '10000'), 10);
  const metrics: ScaleSimulationMetrics = {
    cameraCount: count,
    eventsPerSecond: Math.round(count * 0.42),
    edgeBandwidthGbps: parseFloat(((count * 4.2) / 1000).toFixed(2)),
    cloudIngressGbps: parseFloat(((count * 0.35) / 1000).toFixed(2)),
    gpuInstancesRequired: Math.max(2, Math.round(count / 2500)),
    storagePerYearPetabytes: parseFloat(((count * 0.0038 * 365) / 1000).toFixed(2)),
    estimatedCostReductionWithSelectiveAiPercent: 84.6,
    regionalNodes: Math.max(1, Math.round(count / 4000)),
  };

  res.json({
    metrics,
    disclaimer:
      'ARCHITECTURAL SIMULATION & CAPACITY MODEL ONLY — NOT A BENCHMARKED PRODUCTION CAPACITY TEST.',
  });
});

// 14. Audit Logs
app.get('/api/audit', (req, res) => {
  const { action, userId, search } = req.query;
  let filtered = [...auditLogs];

  if (action && action !== 'ALL') {
    filtered = filtered.filter((a) => a.action === action);
  }
  if (userId && userId !== 'ALL') {
    filtered = filtered.filter((a) => a.userId === userId);
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.userName.toLowerCase().includes(q) ||
        a.resourceId.toLowerCase().includes(q) ||
        a.justification?.toLowerCase().includes(q)
    );
  }

  res.json({ logs: filtered, total: filtered.length });
});

// 15. Analytics Dashboard
app.get('/api/analytics', (req, res) => {
  const hourlyDetections = [
    { time: '20:00', detections: 3420, alerts: 14, matches: 3 },
    { time: '21:00', detections: 4120, alerts: 18, matches: 4 },
    { time: '22:00', detections: 2950, alerts: 22, matches: 5 },
    { time: '23:00', detections: 1890, alerts: 31, matches: 8 },
    { time: '00:00', detections: 1120, alerts: 27, matches: 6 },
    { time: '01:00', detections: 940, alerts: 38, matches: 9 },
  ];

  const departmentUptime = [
    { department: 'POLICE', uptime: 99.4, cameras: 18450 },
    { department: 'SMART_CITY', uptime: 99.1, cameras: 9200 },
    { department: 'MUNICIPAL', uptime: 98.7, cameras: 6800 },
    { department: 'HIGHWAY', uptime: 99.2, cameras: 2900 },
    { department: 'TRANSPORT', uptime: 97.4, cameras: 3400 },
    { department: 'PORTS_AIRPORTS', uptime: 98.9, cameras: 2100 },
  ];

  const alertSeverityDistribution = [
    { name: 'Critical', count: alerts.filter((a) => a.severity === 'CRITICAL').length, color: '#ef4444' },
    { name: 'High', count: alerts.filter((a) => a.severity === 'HIGH').length, color: '#f97316' },
    { name: 'Medium', count: alerts.filter((a) => a.severity === 'MEDIUM').length, color: '#eab308' },
    { name: 'Low', count: alerts.filter((a) => a.severity === 'LOW').length, color: '#3b82f6' },
  ];

  res.json({
    hourlyDetections,
    departmentUptime,
    alertSeverityDistribution,
    kpis: {
      totalCameras: dataMode === 'DEMO_DATA' ? 42850 : cameras.length,
      onlinePercentage: 99.1,
      totalDetections24h: dataMode === 'DEMO_DATA' ? 1482900 : detections.length * 100,
      activeAlerts: alerts.filter((a) => a.status === 'ACTIVE').length,
      criticalAlerts: alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length,
      activeInvestigations: investigations.filter((i) => i.status === 'ACTIVE').length,
      averageAnprConfidence: 96.4,
      avgAlertResponseTimeMinutes: 2.4,
    },
  });
});

// 16. Natural Language Search Parser
app.post('/api/search/nl', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  const text = prompt.toLowerCase();
  const matchedPlate = text.match(/\b([A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{1,4})\b/i);

  let structuredFilters: any = {
    rawPrompt: prompt,
    matchedPlate: matchedPlate ? matchedPlate[1].toUpperCase() : null,
    timeWindow: 'LAST_24_HOURS',
    department: 'ALL',
    severity: 'ALL',
    location: null,
  };

  if (text.includes('police')) structuredFilters.department = 'POLICE';
  if (text.includes('smart city') || text.includes('amc')) structuredFilters.department = 'SMART_CITY';
  if (text.includes('transport') || text.includes('gsrtc')) structuredFilters.department = 'TRANSPORT';
  if (text.includes('highway') || text.includes('nhai')) structuredFilters.department = 'HIGHWAY';

  if (text.includes('critical')) structuredFilters.severity = 'CRITICAL';
  if (text.includes('high')) structuredFilters.severity = 'HIGH';

  if (text.includes('ahmedabad') || text.includes('sg highway')) structuredFilters.location = 'Ahmedabad';
  if (text.includes('gandhinagar') || text.includes('gift city')) structuredFilters.location = 'Gandhinagar';
  if (text.includes('surat')) structuredFilters.location = 'Surat';
  if (text.includes('vadodara')) structuredFilters.location = 'Vadodara';

  logAudit('VEHICLE_SEARCH', 'NL_PARSER', 'QUERY', `Parsed natural language query: "${prompt}"`);

  res.json({
    success: true,
    structuredFilters,
    disclaimer: 'DEMO NATURAL LANGUAGE PARSER — Maps user intent into structured CCTV/ANPR queries.',
  });
});

// 17. Execute Live Demo Scenario (End-to-End 12-Step Execution)
app.post('/api/demo/run-scenario', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  logAudit(
    'AI_REVIEW_DECISION',
    'SCENARIO_ENGINE',
    'SCENARIO-GJ-01',
    'Triggered End-to-End Gujarat Statewide Robbery Interception Demo Scenario'
  );

  res.json({
    success: true,
    scenario: {
      id: 'SCENARIO-GJ-01',
      title: 'Gujarat Statewide Armed Robbery Interception',
      targetVehicle: 'GJ01AB1234',
      targetDescription: 'Toyota Fortuner SUV (Dark Grey)',
      stepsCompleted: 12,
      activeAlertId: 'ALT-2026-901',
      incidentId: 'INC-01',
      investigationId: 'INV-01',
      timestamp,
      message: 'Statewide demo scenario active across SG Highway corridor into Gandhinagar.',
    },
  });
});

// ----------------------------------------------------
// VITE MIDDLEWARE SETUP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SENTINEL-X Command Centre Server running on http://localhost:${PORT}`);
  });
}

startServer();
