// Frontend API Service Layer for Sentinel-X

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
  JourneyReconstruction,
  ScaleSimulationMetrics,
  DataMode,
} from '../types';

export const api = {
  async getAuthMe(): Promise<{ user: User; availableUsers: User[]; dataMode: DataMode }> {
    const res = await fetch('/api/auth/me');
    return res.json();
  },

  async switchRole(userId: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },

  async getDataMode(): Promise<{ dataMode: DataMode; stats: any }> {
    const res = await fetch('/api/data-mode');
    return res.json();
  },

  async toggleDataMode(mode: DataMode): Promise<{ success: boolean; dataMode: DataMode }> {
    const res = await fetch('/api/data-mode/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    });
    return res.json();
  },

  async resetDemo(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/data-mode/reset-demo', { method: 'POST' });
    return res.json();
  },

  async ingestData(type: 'CAMERAS' | 'DETECTIONS' | 'WATCHLIST', records: any[]): Promise<{ success: boolean; count: number; dataMode: DataMode }> {
    const res = await fetch('/api/data-mode/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, records }),
    });
    return res.json();
  },

  async getCameras(params?: Record<string, string>): Promise<{ cameras: Camera[]; total: number; summary: any }> {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`/api/cameras${q}`);
    return res.json();
  },

  async addCamera(camData: Partial<Camera>): Promise<{ success: boolean; camera: Camera }> {
    const res = await fetch('/api/cameras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(camData),
    });
    return res.json();
  },

  async updateCamera(id: string, camData: Partial<Camera>): Promise<{ success: boolean; camera: Camera }> {
    const res = await fetch(`/api/cameras/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(camData),
    });
    return res.json();
  },

  async deleteCamera(id: string): Promise<{ success: boolean; deletedId: string }> {
    const res = await fetch(`/api/cameras/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async getVmsIntegrations(): Promise<{ integrations: VMSIntegration[]; totalCamerasFederated: number; adapterHealth: string }> {
    const res = await fetch('/api/vms');
    return res.json();
  },

  async syncVmsIntegration(id: string): Promise<{ success: boolean; integration: VMSIntegration }> {
    const res = await fetch(`/api/vms/${id}/sync`, { method: 'POST' });
    return res.json();
  },

  async searchVehicles(params?: Record<string, string>): Promise<{ results: VehicleDetection[]; count: number; totalIndexedDetections: number }> {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`/api/vehicles/search${q}`);
    return res.json();
  },

  async trackVehicle(plate: string): Promise<{ journey: JourneyReconstruction }> {
    const res = await fetch(`/api/vehicles/track/${encodeURIComponent(plate)}`);
    return res.json();
  },

  async reviewDetection(detectionId: string, decision: 'CONFIRMED' | 'REJECTED', correctedPlate?: string): Promise<{ success: boolean; detection: VehicleDetection }> {
    const res = await fetch('/api/vehicles/review-detection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ detectionId, decision, correctedPlate }),
    });
    return res.json();
  },

  async getWatchlists(): Promise<{ watchlists: WatchlistEntry[]; total: number }> {
    const res = await fetch('/api/watchlists');
    return res.json();
  },

  async addWatchlist(entry: Partial<WatchlistEntry>): Promise<{ success: boolean; watchlist: WatchlistEntry }> {
    const res = await fetch('/api/watchlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    return res.json();
  },

  async toggleWatchlist(id: string): Promise<{ success: boolean; watchlist: WatchlistEntry }> {
    const res = await fetch(`/api/watchlists/${id}/toggle`, { method: 'PUT' });
    return res.json();
  },

  async deleteWatchlist(id: string): Promise<{ success: boolean; deletedId: string }> {
    const res = await fetch(`/api/watchlists/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async getAlerts(params?: Record<string, string>): Promise<{ alerts: ExplainableAlert[]; total: number; activeCount: number; criticalCount: number }> {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`/api/alerts${q}`);
    return res.json();
  },

  async acknowledgeAlert(id: string): Promise<{ success: boolean; alert: ExplainableAlert }> {
    const res = await fetch(`/api/alerts/${id}/acknowledge`, { method: 'POST' });
    return res.json();
  },

  async escalateAlert(id: string): Promise<{ success: boolean; alert: ExplainableAlert; incident: Incident }> {
    const res = await fetch(`/api/alerts/${id}/escalate`, { method: 'POST' });
    return res.json();
  },

  async getIncidents(): Promise<{ incidents: Incident[]; total: number }> {
    const res = await fetch('/api/incidents');
    return res.json();
  },

  async createIncident(data: Partial<Incident>): Promise<{ success: boolean; incident: Incident }> {
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getInvestigations(): Promise<{ investigations: Investigation[]; total: number }> {
    const res = await fetch('/api/investigations');
    return res.json();
  },

  async getInvestigationById(id: string): Promise<{ investigation: Investigation }> {
    const res = await fetch(`/api/investigations/${id}`);
    return res.json();
  },

  async createInvestigation(data: Partial<Investigation>): Promise<{ success: boolean; investigation: Investigation }> {
    const res = await fetch('/api/investigations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async addEvidence(investigationId: string, data: any): Promise<{ success: boolean; evidence: any; investigation: Investigation }> {
    const res = await fetch(`/api/investigations/${investigationId}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async addInvestigationNote(investigationId: string, text: string): Promise<{ success: boolean; note: any; investigation: Investigation }> {
    const res = await fetch(`/api/investigations/${investigationId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return res.json();
  },

  async getInvestigationGraph(id: string): Promise<{ nodes: any[]; links: any[] }> {
    const res = await fetch(`/api/investigations/${id}/graph`);
    return res.json();
  },

  async getGeofences(): Promise<{ geofences: GeofenceZone[]; total: number }> {
    const res = await fetch('/api/geofences');
    return res.json();
  },

  async addGeofence(data: Partial<GeofenceZone>): Promise<{ success: boolean; geofence: GeofenceZone }> {
    const res = await fetch('/api/geofences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getCoverageGaps(): Promise<{ gaps: CoverageGapItem[]; totalGaps: number; statewideCoverageDensityScore: number; unmonitoredKilometers: number; decisionSupportDisclaimer: string }> {
    const res = await fetch('/api/coverage');
    return res.json();
  },

  async getScaleSimulation(count: number): Promise<{ metrics: ScaleSimulationMetrics; disclaimer: string }> {
    const res = await fetch(`/api/scale-simulator?count=${count}`);
    return res.json();
  },

  async getAuditLogs(params?: Record<string, string>): Promise<{ logs: AuditLogEntry[]; total: number }> {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`/api/audit${q}`);
    return res.json();
  },

  async getAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics');
    return res.json();
  },

  async parseNaturalLanguage(prompt: string): Promise<any> {
    const res = await fetch('/api/search/nl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    return res.json();
  },

  async runDemoScenario(): Promise<any> {
    const res = await fetch('/api/demo/run-scenario', { method: 'POST' });
    return res.json();
  },
};
