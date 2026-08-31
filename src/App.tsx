import React, { useState, useEffect } from 'react';
import {
  ActiveView,
  Camera,
  ExplainableAlert,
  WatchlistEntry,
  Investigation,
  VehicleDetection,
  Incident,
  VMSIntegration,
  AuditLogEntry,
  User,
  UserRole,
  EvidenceItem,
} from './types';
import { api } from './services/api';

// Layout Components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

// View Components
import { CommandCentreDashboard } from './components/dashboard/CommandCentreDashboard';
import { GisMapWorkspace } from './components/gis/GisMapWorkspace';
import { UnifiedCctvViewer } from './components/cctv/UnifiedCctvViewer';
import { CctvRegistryView } from './components/cctv/CctvRegistryView';
import { IntegrationHubView } from './components/integrations/IntegrationHubView';
import { VehicleIntelligenceView } from './components/vehicles/VehicleIntelligenceView';
import { CrossCameraTrackingView } from './components/vehicles/CrossCameraTrackingView';
import { JourneyReplayModal } from './components/vehicles/JourneyReplayModal';
import { WatchlistManagementView } from './components/watchlists/WatchlistManagementView';
import { ExplainableAlertsView } from './components/alerts/ExplainableAlertsView';
import { IncidentCorrelationView } from './components/incidents/IncidentCorrelationView';
import { InvestigationWorkspaceView } from './components/investigations/InvestigationWorkspaceView';
import { InvestigationGraphView } from './components/investigations/InvestigationGraphView';
import { EventTimelineView } from './components/timeline/EventTimelineView';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { CameraHealthView } from './components/health/CameraHealthView';
import { CoverageGapView } from './components/coverage/CoverageGapView';
import { ArchitectureAndScaleView } from './components/architecture/ArchitectureAndScaleView';
import { RbacAndPrivacyView } from './components/security/RbacAndPrivacyView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { UsersManagementView } from './components/users/UsersManagementView';
import { SystemSettingsView } from './components/settings/SystemSettingsView';

// Modals
import { DemoScenarioRunner } from './components/demo/DemoScenarioRunner';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { AutomatedReportsModal } from './components/reports/AutomatedReportsModal';
import { DataIngestionModal } from './components/data/DataIngestionModal';

export default function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // User Profile
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-001',
    name: 'Dr. D. G. Vaghela, IPS',
    badgeNumber: 'GJ-IPS-1092',
    department: 'POLICE',
    role: UserRole.STATE_ADMIN,
    jurisdiction: 'State of Gujarat (All 33 Districts)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  });

  // Domain State
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [alerts, setAlerts] = useState<ExplainableAlert[]>([]);
  const [watchlists, setWatchlists] = useState<WatchlistEntry[]>([]);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [detections, setDetections] = useState<VehicleDetection[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [integrations, setIntegrations] = useState<VMSIntegration[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedPlateForReplay, setSelectedPlateForReplay] = useState<string | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isIngestionModalOpen, setIsIngestionModalOpen] = useState(false);

  // Initial Data Fetching
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [
        camsRes,
        alertsRes,
        watchRes,
        invsRes,
        detsRes,
        incRes,
        integRes,
        auditRes,
      ] = await Promise.all([
        api.getCameras().catch(() => ({ cameras: [] })),
        api.getAlerts().catch(() => ({ alerts: [] })),
        api.getWatchlists().catch(() => ({ watchlists: [] })),
        api.getInvestigations().catch(() => ({ investigations: [] })),
        api.searchVehicles().catch(() => ({ results: [] })),
        api.getIncidents().catch(() => ({ incidents: [] })),
        api.getVmsIntegrations().catch(() => ({ integrations: [] })),
        api.getAuditLogs().catch(() => ({ logs: [] })),
      ]);

      if (camsRes && 'cameras' in camsRes) setCameras(camsRes.cameras || []);
      if (alertsRes && 'alerts' in alertsRes) setAlerts(alertsRes.alerts || []);
      if (watchRes && 'watchlists' in watchRes) setWatchlists(watchRes.watchlists || []);
      if (invsRes && 'investigations' in invsRes) setInvestigations(invsRes.investigations || []);
      if (detsRes && 'results' in detsRes) setDetections(detsRes.results || []);
      if (incRes && 'incidents' in incRes) setIncidents(incRes.incidents || []);
      if (integRes && 'integrations' in integRes) setIntegrations(integRes.integrations || []);
      if (auditRes && 'logs' in auditRes) setAuditLogs(auditRes.logs || []);
    } catch (err) {
      console.error('Error fetching data from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Keyboard shortcut for Command-K / Ctrl-K search
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Handlers
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const res = await api.acknowledgeAlert(alertId);
      if (res && res.alert) {
        setAlerts((prev) => prev.map((a) => (a.id === alertId ? res.alert : a)));
      }
    } catch {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? { ...a, status: 'ACKNOWLEDGED' as const, assignedTo: currentUser.name }
            : a
        )
      );
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'RESOLVED' as const } : a))
    );
  };

  const handleAddWatchlist = async (entry: Partial<WatchlistEntry>) => {
    try {
      const res = await api.addWatchlist(entry);
      if (res && res.watchlist) {
        setWatchlists((prev) => [res.watchlist, ...prev]);
        return;
      }
    } catch {
      // Fallback optimistic
    }
    const mockCreated: WatchlistEntry = {
      id: `wt-${Date.now()}`,
      identifier: entry.identifier || (entry as any).plateNumber || 'GJ01XX0000',
      entityType: 'VEHICLE',
      category: (entry.category as any) || 'WARRANT',
      priority: entry.priority || 'HIGH',
      reason: entry.reason || 'Flagged in State Police Hotlist',
      associatedCaseNumber: entry.associatedCaseNumber,
      createdBy: currentUser.name,
      department: (entry.department as any) || currentUser.department,
      isActive: true,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      expiresAt: '2026-12-31',
      notes: entry.notes || 'Statewide surveillance trigger active',
    };
    setWatchlists((prev) => [mockCreated, ...prev]);
  };

  const handleToggleWatchlistStatus = async (id: string) => {
    try {
      const res = await api.toggleWatchlist(id);
      if (res && res.watchlist) {
        setWatchlists((prev) => prev.map((w) => (w.id === id ? res.watchlist : w)));
        return;
      }
    } catch {
      // Fallback
    }
    setWatchlists((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w))
    );
  };

  const handleDeleteWatchlist = async (id: string) => {
    try {
      await api.deleteWatchlist(id);
    } catch {
      // ignore
    }
    setWatchlists((prev) => prev.filter((w) => w.id !== id));
  };

  const handleCreateInvestigation = async (inv: Partial<Investigation>) => {
    try {
      const res = await api.createInvestigation(inv);
      if (res && res.investigation) {
        setInvestigations((prev) => [res.investigation, ...prev]);
        return;
      }
    } catch {
      // fallback
    }
    const mockInv: Investigation = {
      id: `inv-${Date.now()}`,
      caseNumber: inv.caseNumber || `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: inv.title || 'State Intelligence Dossier',
      leadInvestigator: inv.leadInvestigator || currentUser.name,
      department: (inv.department as any) || currentUser.department,
      status: 'ACTIVE',
      priority: inv.priority || 'HIGH',
      description: inv.description || 'Under investigation by State Police CID.',
      targetVehiclePlate: inv.targetVehiclePlate || '',
      linkedCameraIds: inv.linkedCameraIds || [],
      linkedAlertIds: inv.linkedAlertIds || [],
      evidence: [],
      events: [],
      notes: [],
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setInvestigations((prev) => [mockInv, ...prev]);
  };

  const handleAddEvidence = async (investigationId: string, evidence: any) => {
    try {
      const res = await api.addEvidence(investigationId, evidence);
      if (res && res.investigation) {
        setInvestigations((prev) =>
          prev.map((inv) => (inv.id === investigationId ? res.investigation : inv))
        );
        return;
      }
    } catch {
      // fallback
    }
    const newEvidence: EvidenceItem = {
      id: `ev-${Date.now()}`,
      investigationId,
      title: evidence.title || 'Forensic Sighting Frame',
      type: evidence.type || 'CCTV_SNAPSHOT',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      sourceCameraId: evidence.sourceCameraId || 'CAM-AMD-001',
      cameraName: evidence.cameraName || 'Iscon Junction ANPR',
      addedBy: currentUser.name,
      addedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      sha256Hash: evidence.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      fileSizeKb: 340,
      integrityVerified: true,
      metadata: {},
      url: evidence.url,
    };

    setInvestigations((prev) =>
      prev.map((inv) => {
        if (inv.id === investigationId) {
          const items = inv.evidence || [];
          return {
            ...inv,
            evidence: [newEvidence, ...items],
          };
        }
        return inv;
      })
    );
  };

  const handleAddCamera = async (cameraData: Partial<Camera>) => {
    try {
      const res = await api.addCamera(cameraData);
      if (res && res.camera) {
        setCameras((prev) => [res.camera, ...prev]);
        return;
      }
    } catch {
      // fallback
    }
    const mockCam: Camera = {
      id: cameraData.id || `CAM-GJ-${Math.floor(100 + Math.random() * 900)}`,
      name: cameraData.name || 'New Surveillance Junction',
      department: (cameraData.department as any) || 'POLICE',
      vmsInstance: cameraData.vmsInstance || 'Milestone XProtect',
      vendor: (cameraData.vendor as any) || 'Milestone XProtect',
      status: 'ONLINE',
      cameraType: cameraData.cameraType || 'ANPR_BULLET',
      resolution: cameraData.resolution || '1080p',
      fps: 25,
      lat: cameraData.lat || 23.05,
      lng: cameraData.lng || 72.53,
      locationName: cameraData.locationName || 'State Transit Corridor',
      district: cameraData.district || 'Ahmedabad',
      healthScore: 98,
      latencyMs: 18,
      packetLoss: 0,
      lastHeartbeat: 'Just now',
      installationDate: '2025-01-10',
      maintenanceStatus: 'GOOD',
      coverageRadiusMeters: 150,
      directionBearing: 90,
      zone: 'North Corridor',
    };
    setCameras((prev) => [mockCam, ...prev]);
  };

  const handleUpdateIncidentStatus = (id: string, status: any) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status } : inc))
    );
  };

  const handleTrackPlate = (plate: string) => {
    setSelectedPlateForReplay(plate);
    setActiveView('cross_camera');
  };

  const handleIngestDataset = () => {
    loadInitialData();
  };

  const activeAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        alertsCount={activeAlertsCount}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Global Tactical Header */}
        <Header
          user={currentUser}
          activeAlertCount={activeAlertsCount}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenDemo={() => setIsDemoModalOpen(true)}
          onOpenReports={() => setIsReportModalOpen(true)}
          onOpenIngestion={() => setIsIngestionModalOpen(true)}
          onNavigate={setActiveView}
        />

        {/* View Content Port */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-950/60 relative">
          {activeView === 'dashboard' && (
            <CommandCentreDashboard
              cameras={cameras}
              alerts={alerts}
              detections={detections}
              incidents={incidents}
              watchlists={watchlists}
              onNavigate={setActiveView}
              onTrackPlate={handleTrackPlate}
            />
          )}

          {activeView === 'gis' && (
            <GisMapWorkspace
              cameras={cameras}
              detections={detections}
              alerts={alerts}
              onTrackPlate={handleTrackPlate}
            />
          )}

          {activeView === 'cctv_live' && (
            <UnifiedCctvViewer
              cameras={cameras}
              onTrackPlate={handleTrackPlate}
            />
          )}

          {activeView === 'cctv_registry' && (
            <CctvRegistryView
              cameras={cameras}
              onAddCamera={handleAddCamera}
              onIngestModalOpen={() => setIsIngestionModalOpen(true)}
            />
          )}

          {activeView === 'integrations' && (
            <IntegrationHubView integrations={integrations} />
          )}

          {activeView === 'vehicles' && (
            <VehicleIntelligenceView
              detections={detections}
              onTrackPlate={handleTrackPlate}
            />
          )}

          {activeView === 'cross_camera' && (
            <CrossCameraTrackingView
              initialPlate={selectedPlateForReplay || 'GJ01AB1234'}
              onOpenJourneyReplay={(plate) => setSelectedPlateForReplay(plate)}
              onSearchPlate={(plate) => setSelectedPlateForReplay(plate)}
            />
          )}

          {activeView === 'watchlists' && (
            <WatchlistManagementView
              watchlists={watchlists}
              onAddEntry={handleAddWatchlist}
              onUpdateEntry={(id, entry) => {
                setWatchlists((prev) =>
                  prev.map((w) => (w.id === id ? { ...w, ...entry } : w))
                );
              }}
              onDeleteEntry={handleDeleteWatchlist}
            />
          )}

          {activeView === 'alerts' && (
            <ExplainableAlertsView
              alerts={alerts}
              onAcknowledge={handleAcknowledgeAlert}
              onResolve={handleResolveAlert}
              onTrackPlate={handleTrackPlate}
            />
          )}

          {activeView === 'incidents' && (
            <IncidentCorrelationView
              incidents={incidents}
              onUpdateStatus={handleUpdateIncidentStatus}
              onTrackPlate={handleTrackPlate}
            />
          )}

          {activeView === 'investigations' && (
            <InvestigationWorkspaceView
              investigations={investigations}
              onCreateInvestigation={handleCreateInvestigation}
              onUpdateInvestigation={() => {}}
              onAddEvidence={handleAddEvidence}
              onOpenGraphView={() => setActiveView('investigation_graph')}
            />
          )}

          {activeView === 'investigation_graph' && (
            <InvestigationGraphView />
          )}

          {activeView === 'timeline' && (
            <EventTimelineView
              alerts={alerts}
              detections={detections}
              cameras={cameras}
              onTrackPlate={handleTrackPlate}
            />
          )}

          {activeView === 'analytics' && <AnalyticsDashboard />}

          {activeView === 'health' && <CameraHealthView cameras={cameras} />}

          {activeView === 'coverage_gap' && <CoverageGapView />}

          {activeView === 'scale_simulator' && <ArchitectureAndScaleView />}

          {activeView === 'rbac' && <RbacAndPrivacyView />}

          {activeView === 'audit' && <AuditLogsView logs={auditLogs} />}

          {activeView === 'users' && (
            <UsersManagementView
              currentUser={currentUser}
              onSwitchRole={(role) => setCurrentUser({ ...currentUser, role })}
            />
          )}

          {activeView === 'settings' && <SystemSettingsView />}
        </main>
      </div>

      {/* Journey Replay Modal */}
      {selectedPlateForReplay && (
        <JourneyReplayModal
          isOpen={!!selectedPlateForReplay}
          onClose={() => setSelectedPlateForReplay(null)}
          plateNumber={selectedPlateForReplay}
        />
      )}

      {/* Demo Scenario Runner Modal */}
      <DemoScenarioRunner
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onNavigate={setActiveView}
      />

      {/* Global Command-K Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        cameras={cameras}
        alerts={alerts}
        investigations={investigations}
        detections={detections}
        onNavigate={setActiveView}
        onTrackPlate={handleTrackPlate}
      />

      {/* Automated Reports & Court Dossier Modal */}
      <AutomatedReportsModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Data Ingestion Suite Modal */}
      <DataIngestionModal
        isOpen={isIngestionModalOpen}
        onClose={() => setIsIngestionModalOpen(false)}
        onIngestDataset={handleIngestDataset}
      />
    </div>
  );
}
