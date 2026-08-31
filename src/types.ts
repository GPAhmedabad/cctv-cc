// SENTINEL-X TypeScript Type Definitions

export type Department =
  | 'POLICE'
  | 'MUNICIPAL'
  | 'TRANSPORT'
  | 'SMART_CITY'
  | 'HIGHWAY'
  | 'PORTS_AIRPORTS';

export type CameraStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'MAINTENANCE';

export type CameraType =
  | 'ANPR_BULLET'
  | 'PTZ_DOME'
  | 'FIXED_BOX'
  | 'PANORAMIC_360'
  | 'THERMAL'
  | 'SPEED_CAMERA';

export type VMSVendor =
  | 'Milestone XProtect'
  | 'Genetec Security Center'
  | 'HikCentral'
  | 'Dahua DSS'
  | 'Uniview EZStation'
  | 'Honeywell MAXPRO'
  | 'Generic RTSP/ONVIF';

export type StreamProtocol = 'RTSP' | 'ONVIF' | 'WEBRTC' | 'HLS' | 'VENDOR_SDK';

export interface Camera {
  id: string;
  name: string;
  department: Department;
  locationName: string;
  district: string;
  lat: number;
  lng: number;
  vendor: VMSVendor;
  vmsInstance: string;
  cameraType: CameraType;
  resolution: string;
  fps: number;
  status: CameraStatus;
  healthScore: number; // 0 - 100
  latencyMs: number;
  packetLoss: number; // percentage
  lastHeartbeat: string;
  installationDate: string;
  maintenanceStatus: 'GOOD' | 'NEEDS_CLEANING' | 'FIRMWARE_OUTDATED' | 'SIGNAL_DEGRADED' | 'CRITICAL';
  streamUrl?: string;
  coverageRadiusMeters: number;
  directionBearing: number; // 0 - 360 degrees
  zone: string;
}

export type VehicleType = 'SEDAN' | 'SUV' | 'HATCHBACK' | 'TRUCK' | 'BUS' | 'TWO_WHEELER' | 'COMMERCIAL';

export type Direction = 'NORTHBOUND' | 'SOUTHBOUND' | 'EASTBOUND' | 'WESTBOUND' | 'INBOUND' | 'OUTBOUND';

export interface VehicleDetection {
  id: string;
  plateNumber: string;
  normalizedPlate: string;
  vehicleType: VehicleType;
  makeModel: string;
  color: string;
  confidence: number; // 0 - 100
  ocrConfidence: number; // 0 - 100
  speedKmph?: number;
  timestamp: string;
  cameraId: string;
  cameraName: string;
  locationName: string;
  district: string;
  lat: number;
  lng: number;
  direction: Direction;
  lane: number;
  snapshotUrl: string;
  plateCropUrl: string;
  requiresReview: boolean;
  reviewedBy?: string;
  reviewStatus?: 'CONFIRMED' | 'REJECTED' | 'PENDING';
  watchlistMatch?: boolean;
  watchlistId?: string;
}

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'ESCALATED_TO_INCIDENT' | 'RESOLVED' | 'DISMISSED';

export interface ExplainableFactor {
  factor: string;
  weight: number;
  score: number;
  description: string;
  matched: boolean;
}

export interface ExplainableAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
  locationName: string;
  district: string;
  lat: number;
  lng: number;
  cameraId: string;
  cameraName: string;
  department: Department;
  plateNumber?: string;
  detectionId?: string;
  watchlistId?: string;
  incidentId?: string;
  overallScore: number; // 0 - 100
  factors: ExplainableFactor[];
  assignedTo?: string;
  acknowledgedAt?: string;
  notes?: string[];
}

export interface WatchlistEntry {
  id: string;
  identifier: string; // e.g. "GJ01AB1234"
  entityType: 'VEHICLE' | 'SUSPECT_PROFILE' | 'OPERATION_TAG' | 'INTER_AGENCY_BEACON';
  reason: string;
  category: 'STOLEN_VEHICLE' | 'WARRANT' | 'HIGH_RISK_CONVOY' | 'TRAFFIC_OFFENDER' | 'INTELLIGENCE_LEAD' | 'BORDER_CHECK';
  priority: AlertSeverity;
  department: Department;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  notes: string;
  associatedCaseNumber?: string;
}

export interface Incident {
  id: string;
  incidentNumber: string; // e.g. "INC-2026-0419"
  title: string;
  summary: string;
  severity: AlertSeverity;
  status: 'OPEN' | 'IN_PROGRESS' | 'DISPATCHED' | 'CONTAINED' | 'RESOLVED';
  district: string;
  primaryLocation: string;
  lat: number;
  lng: number;
  timestamp: string;
  relatedVehiclePlates: string[];
  relatedCameraIds: string[];
  relatedAlertIds: string[];
  investigationId?: string;
  leadOfficer: string;
  department: Department | string;
  geofenceViolated?: string;
}

export type InvestigationStatus = 'DRAFT' | 'ACTIVE' | 'EVIDENCE_COLLECTION' | 'UNDER_REVIEW' | 'CLOSED' | 'ARCHIVED';

export interface EvidenceItem {
  id: string;
  investigationId: string;
  type: 'CCTV_SNAPSHOT' | 'VIDEO_CLIP' | 'ANPR_LOG' | 'ROUTE_MAP' | 'OPERATOR_NOTE' | 'FORENSIC_EXPORT';
  title: string;
  sourceCameraId?: string;
  cameraName?: string;
  timestamp: string;
  addedBy: string;
  addedAt: string;
  sha256Hash: string;
  fileSizeKb: number;
  integrityVerified: boolean;
  metadata: Record<string, any>;
  url?: string;
}

export interface InvestigationEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'DETECTION' | 'ALERT' | 'OFFICER_NOTE' | 'EVIDENCE_ATTACHED' | 'STATUS_CHANGE' | 'GEOFENCE_CROSSING';
  actor: string;
  cameraId?: string;
  lat?: number;
  lng?: number;
}

export interface Investigation {
  id: string;
  caseNumber: string; // e.g. "INV-2026-0842"
  title: string;
  description: string;
  priority: AlertSeverity;
  status: InvestigationStatus;
  leadInvestigator: string;
  department: Department | string;
  targetVehiclePlate?: string;
  createdAt: string;
  updatedAt: string;
  incidentId?: string;
  linkedCameraIds: string[];
  linkedAlertIds: string[];
  evidence: EvidenceItem[];
  events: InvestigationEvent[];
  notes: Array<{ id: string; author: string; text: string; timestamp: string }>;
  routePoints?: Array<{ lat: number; lng: number; name: string; timestamp: string; cameraId: string }>;
}

export interface GeofenceZone {
  id: string;
  name: string;
  category: 'CRITICAL_INFRASTRUCTURE' | 'AIRPORT_SURROUND' | 'HIGHWAY_TOLL' | 'GOVERNMENT_SECRETARIAT' | 'INDUSTRIAL_HUB';
  district: string;
  coordinates: Array<[number, number]>; // [lng, lat] polygon
  center: [number, number]; // [lng, lat]
  color: string;
  triggerOn: Array<'ENTRY' | 'EXIT' | 'DWELL'>;
  activeWatchlistAlertsOnly: boolean;
  status: 'ACTIVE' | 'MONITORING_ONLY' | 'MUTED';
}

export interface VMSIntegration {
  id: string;
  name: string;
  vendor: VMSVendor;
  department: Department;
  district: string;
  endpointUrl: string;
  protocol: StreamProtocol;
  cameraCount: number;
  status: 'CONNECTED' | 'DEGRADED' | 'OFFLINE';
  lastSync: string;
  latencyMs: number;
  packetLossPercent: number;
  eventsPerMinute: number;
  authMethod: 'OAUTH2' | 'API_KEY' | 'MTLS' | 'DIGEST_AUTH';
  version: string;
  uptimePercent: number;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STATE_ADMIN = 'STATE_ADMIN',
  OPERATOR = 'OPERATOR',
  INVESTIGATOR = 'INVESTIGATOR',
  DEPARTMENT_USER = 'DEPARTMENT_USER',
  AUDITOR = 'AUDITOR',
}

export interface User {
  id: string;
  name: string;
  badgeNumber: string;
  email?: string;
  role: UserRole | string;
  department: Department | string;
  avatarUrl?: string;
  avatar?: string;
  jurisdiction?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole | string;
  department: Department | string;
  action:
    | 'LOGIN'
    | 'LOGOUT'
    | 'CAMERA_LIVE_VIEW'
    | 'CAMERA_PTZ_CONTROL'
    | 'VEHICLE_SEARCH'
    | 'JOURNEY_RECONSTRUCT'
    | 'ALERT_ACKNOWLEDGE'
    | 'ALERT_ESCALATE'
    | 'INVESTIGATION_CREATE'
    | 'INVESTIGATION_UPDATE'
    | 'EVIDENCE_EXPORT'
    | 'WATCHLIST_MODIFY'
    | 'GEOFENCE_MODIFY'
    | 'AI_REVIEW_DECISION'
    | 'DATA_INGESTION'
    | 'ROLE_SWITCH';
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  justification?: string;
  details?: Record<string, any>;
}

export interface PredictiveHandoffOption {
  cameraId: string;
  cameraName: string;
  locationName: string;
  lat: number;
  lng: number;
  probability: number; // 0 - 100
  estimatedEtaSeconds: number;
  roadName: string;
  rationale: string;
}

export interface JourneyReconstruction {
  plateNumber: string;
  totalSightings?: number;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  averageSpeedKmph?: number;
  distanceKm?: number;
  vehicleDetails?: {
    make: string;
    model: string;
    color: string;
    category: string;
    ownerName: string;
    registrationDistrict: string;
  };
  totalDistanceKm?: number;
  averageSpeedKmh?: number;
  firstSeen?: string;
  lastSeen?: string;
  waypoints: Array<{
    sequenceOrder?: number;
    cameraId: string;
    cameraName: string;
    locationName: string;
    district?: string;
    lat: number;
    lng: number;
    timestamp: string;
    direction?: Direction | string;
    heading?: string;
    lane?: number;
    speedKmh?: number;
    confidence?: number;
    confidenceScore?: number;
    snapshotUrl: string;
    timeGapMinutes?: number;
  }>;
  predictiveHandoffs?: PredictiveHandoffOption[];
}

export interface CoverageGapItem {
  id: string;
  roadName: string;
  district: string;
  gapLengthKm: number;
  riskScore: number; // 0 - 100
  incidentCountPast90Days: number;
  nearestCameraId: string;
  suggestedPlacements: Array<{
    name: string;
    lat: number;
    lng: number;
    recommendedType: CameraType;
    estimatedCoverageBoostPercent: number;
    rationale: string;
  }>;
}

export interface ScaleSimulationMetrics {
  cameraCount: number;
  eventsPerSecond: number;
  edgeBandwidthGbps: number;
  cloudIngressGbps: number;
  gpuInstancesRequired: number;
  storagePerYearPetabytes: number;
  estimatedCostReductionWithSelectiveAiPercent: number;
  regionalNodes: number;
}

export type DataMode = 'DEMO_DATA' | 'GOVERNMENT_DATA';

// Navigation & Global Types
export type ActiveView =
  | 'dashboard'
  | 'gis'
  | 'cctv_live'
  | 'cctv_registry'
  | 'vehicles'
  | 'cross_camera'
  | 'watchlists'
  | 'alerts'
  | 'incidents'
  | 'investigations'
  | 'investigation_graph'
  | 'timeline'
  | 'analytics'
  | 'health'
  | 'integrations'
  | 'coverage_gap'
  | 'scale_simulator'
  | 'architecture'
  | 'users'
  | 'rbac'
  | 'audit'
  | 'settings';

export type WatchlistTarget = any;
export type WatchlistCategory = any;
export type IntegrationStatus = any;
export type AuditLog = any;
export type Waypoint = any;

