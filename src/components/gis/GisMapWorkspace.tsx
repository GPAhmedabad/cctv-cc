import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import {
  Layers,
  Filter,
  Eye,
  Video,
  PlusCircle,
  Activity,
  AlertTriangle,
  Flame,
  Shield,
  Navigation,
  Compass,
  Maximize2,
  Minimize2,
  RefreshCw,
  Search,
} from 'lucide-react';
import {
  Camera,
  Department,
  ExplainableAlert,
  GeofenceZone,
  JourneyReconstruction,
} from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface GisMapWorkspaceProps {
  cameras: Camera[];
  alerts: ExplainableAlert[];
  geofences: GeofenceZone[];
  activeJourney?: JourneyReconstruction | null;
  onOpenLiveViewer?: (cameraId: string) => void;
  onAddToInvestigation?: (cameraId: string) => void;
}

export const GisMapWorkspace: React.FC<GisMapWorkspaceProps> = ({
  cameras,
  alerts,
  geofences,
  activeJourney,
  onOpenLiveViewer,
  onAddToInvestigation,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Filter States
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [showGeofences, setShowGeofences] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showCoverageRadius, setShowCoverageRadius] = useState(true);
  const [showJourney, setShowJourney] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Camera Popup State
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Department Color Mapping
  const deptColors: Record<Department, string> = {
    POLICE: '#3b82f6',
    SMART_CITY: '#06b6d4',
    MUNICIPAL: '#8b5cf6',
    TRANSPORT: '#f59e0b',
    HIGHWAY: '#10b981',
    PORTS_AIRPORTS: '#ec4899',
  };

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors, CARTO',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [72.5358, 23.0784], // Ahmedabad / Gandhinagar corridor
      zoom: 11.5,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');
    mapInstance.current = map;

    map.on('load', () => {
      renderMapLayers();
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update Markers & Geofences on filter / data changes
  useEffect(() => {
    if (!mapInstance.current) return;
    renderMapLayers();
  }, [cameras, alerts, geofences, selectedDept, selectedStatus, showGeofences, showCoverageRadius, showJourney, activeJourney, searchQuery]);

  const renderMapLayers = () => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear existing DOM markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Filter cameras
    let filteredCameras = cameras.filter((c) => {
      if (selectedDept !== 'ALL' && c.department !== selectedDept) return false;
      if (selectedStatus !== 'ALL' && c.status !== selectedStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !c.name.toLowerCase().includes(q) &&
          !c.id.toLowerCase().includes(q) &&
          !c.locationName.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });

    // Add Camera Markers
    filteredCameras.forEach((cam) => {
      const el = document.createElement('div');
      el.className = 'cursor-pointer group';

      const color = deptColors[cam.department] || '#06b6d4';
      const isDegraded = cam.status === 'DEGRADED';
      const isOffline = cam.status === 'OFFLINE';

      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          ${
            cam.status === 'ONLINE'
              ? `<div class="absolute w-7 h-7 rounded-full opacity-40 animate-ping" style="background-color: ${color};"></div>`
              : ''
          }
          <div class="w-6 h-6 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125" style="background-color: ${
            isOffline ? '#64748b' : isDegraded ? '#f59e0b' : color
          };">
            <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m22 8-6 4 6 4V8Z"/>
              <rect width="14" height="12" x="2" y="6" rx="2"/>
            </svg>
          </div>
          <div class="absolute -bottom-5 px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[9px] font-mono text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            ${cam.id}
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedCamera(cam);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([cam.lng, cam.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Add Geofence GeoJSON Layer if map style is loaded
    if (map.isStyleLoaded()) {
      // Remove previous geofence layers
      if (map.getLayer('geofence-fills')) map.removeLayer('geofence-fills');
      if (map.getLayer('geofence-lines')) map.removeLayer('geofence-lines');
      if (map.getSource('geofences-src')) map.removeSource('geofences-src');

      if (showGeofences && geofences.length > 0) {
        const geojsonFeatures = geofences.map((g) => ({
          type: 'Feature' as const,
          properties: {
            name: g.name,
            category: g.category,
            color: g.color,
          },
          geometry: {
            type: 'Polygon' as const,
            coordinates: [g.coordinates],
          },
        }));

        map.addSource('geofences-src', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: geojsonFeatures,
          },
        });

        map.addLayer({
          id: 'geofence-fills',
          type: 'fill',
          source: 'geofences-src',
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': 0.15,
          },
        });

        map.addLayer({
          id: 'geofence-lines',
          type: 'line',
          source: 'geofences-src',
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 2,
            'line-dasharray': [2, 2],
          },
        });
      }

      // Reconstructed Journey Polyline Layer
      if (map.getLayer('journey-line')) map.removeLayer('journey-line');
      if (map.getLayer('journey-points')) map.removeLayer('journey-points');
      if (map.getSource('journey-src')) map.removeSource('journey-src');

      if (showJourney && activeJourney && activeJourney.waypoints.length > 0) {
        const coords = activeJourney.waypoints.map((w) => [w.lng, w.lat]);

        map.addSource('journey-src', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { plate: activeJourney.plateNumber },
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          },
        });

        map.addLayer({
          id: 'journey-line',
          type: 'line',
          source: 'journey-src',
          paint: {
            'line-color': '#06b6d4',
            'line-width': 4,
            'line-dasharray': [1, 0],
          },
        });
      }
    }
  };

  const focusDistrict = (lng: number, lat: number, zoom: number) => {
    mapInstance.current?.flyTo({
      center: [lng, lat],
      zoom,
      essential: true,
      speed: 1.2,
    });
  };

  return (
    <div id="gis-workspace" className="p-4 space-y-4 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Filter Bar & Quick Jumps */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        {/* District Quick Jumps */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            JUMP:
          </span>
          <button
            id="jump-sg-highway"
            onClick={() => focusDistrict(72.5186, 23.0511, 13)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 transition-colors"
          >
            SG Highway Corridor
          </button>
          <button
            id="jump-gandhinagar"
            onClick={() => focusDistrict(72.6582, 23.2185, 13)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            Gandhinagar Secretariat
          </button>
          <button
            id="jump-gift-city"
            onClick={() => focusDistrict(72.6842, 23.1588, 14)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            GIFT City
          </button>
          <button
            id="jump-surat"
            onClick={() => focusDistrict(72.7689, 21.1245, 12)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            Surat DREAM City
          </button>
          <button
            id="jump-vadodara"
            onClick={() => focusDistrict(73.1945, 22.3512, 12)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            Vadodara NE-1
          </button>
        </div>

        {/* Layer Toggles & Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search camera/location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48"
            />
          </div>

          <button
            id="toggle-geofences-btn"
            onClick={() => setShowGeofences(!showGeofences)}
            className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
              showGeofences
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            GEOFENCES ({geofences.length})
          </button>
          <button
            id="toggle-journey-btn"
            onClick={() => setShowJourney(!showJourney)}
            className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
              showJourney
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            TARGET ROUTE
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl h-[72vh]">
        <div ref={mapContainer} className="w-full h-full" />

        {/* Top-Left Tactical Overlay: Department Filters */}
        <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl space-y-2 w-60">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              DEPARTMENT FILTER
            </span>
            <span className="text-cyan-400">{cameras.length} NODES</span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setSelectedDept('ALL')}
              className={`w-full flex items-center justify-between px-2 py-1 rounded text-xs font-mono transition-colors ${
                selectedDept === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>All Departments</span>
              <span>{cameras.length}</span>
            </button>
            {(['POLICE', 'SMART_CITY', 'MUNICIPAL', 'HIGHWAY', 'TRANSPORT', 'PORTS_AIRPORTS'] as Department[]).map(
              (dept) => {
                const count = cameras.filter((c) => c.department === dept).length;
                return (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`w-full flex items-center justify-between px-2 py-1 rounded text-xs font-mono transition-colors ${
                      selectedDept === dept
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: deptColors[dept] }}
                      ></span>
                      <span>{dept.replace('_', ' ')}</span>
                    </span>
                    <span className="text-[11px] text-slate-500">{count}</span>
                  </button>
                );
              }
            )}
          </div>

          {/* Status Filter */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-1">
            {(['ALL', 'ONLINE', 'DEGRADED', 'OFFLINE'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  selectedStatus === st
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom-Left Legend Banner */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-2 text-[11px] font-mono text-slate-400 flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Online
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Degraded Telemetry
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span> Offline Node
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-4 h-0.5 bg-cyan-400"></span> Reconstructed Journey
          </span>
        </div>

        {/* Active Journey Overlay Indicator */}
        {activeJourney && (
          <div className="absolute top-4 right-14 z-10 bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3 shadow-xl max-w-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <Badge variant="danger" size="sm">
                TARGET VEHICLE
              </Badge>
              <span className="font-mono text-xs font-bold text-cyan-400">
                {activeJourney.plateNumber}
              </span>
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Reconstructed: {activeJourney.waypoints.length} Sightings ({activeJourney.distanceKm} km)
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Avg Speed: {activeJourney.averageSpeedKmph} km/h • SG Highway
            </div>
          </div>
        )}
      </div>

      {/* Camera Inspection Popup Modal */}
      {selectedCamera && (
        <Modal
          isOpen={!!selectedCamera}
          onClose={() => setSelectedCamera(null)}
          title={`CAMERA METADATA: ${selectedCamera.id}`}
          subtitle={`${selectedCamera.name} • ${selectedCamera.locationName}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            {/* Live Feed Simulated Preview Container */}
            <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
              {/* Simulated camera video stream HUD */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded">
                ● LIVE REC • {selectedCamera.fps} FPS • {selectedCamera.resolution}
              </div>
              <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan-400 bg-black/60 px-1.5 py-0.5 rounded">
                {selectedCamera.vendor}
              </div>
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300 bg-black/60 px-1.5 py-0.5 rounded">
                GPS: {selectedCamera.lat.toFixed(4)}, {selectedCamera.lng.toFixed(4)}
              </div>

              <div className="text-center space-y-1 z-10">
                <Video className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
                <div className="text-xs font-mono text-slate-300 font-semibold">
                  SIMULATED VMS RTSP STREAM
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Instance: {selectedCamera.vmsInstance}
                </div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px]">DEPARTMENT</div>
                <div className="text-slate-200 font-bold mt-0.5">
                  {selectedCamera.department}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px]">STATUS</div>
                <div className="text-emerald-400 font-bold mt-0.5">
                  {selectedCamera.status}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px]">HEALTH SCORE</div>
                <div className="text-cyan-400 font-bold mt-0.5">
                  {selectedCamera.healthScore} / 100
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px]">LATENCY / LOSS</div>
                <div className="text-slate-200 font-bold mt-0.5">
                  {selectedCamera.latencyMs} ms ({selectedCamera.packetLoss}%)
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px]">CAMERA TYPE</div>
                <div className="text-slate-200 font-bold mt-0.5">
                  {selectedCamera.cameraType}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <div className="text-slate-500 text-[10px]">LAST HEARTBEAT</div>
                <div className="text-slate-200 font-bold mt-0.5">
                  {selectedCamera.lastHeartbeat}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                id="camera-popup-add-investigation-btn"
                onClick={() => {
                  if (onAddToInvestigation) onAddToInvestigation(selectedCamera.id);
                  setSelectedCamera(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add to Investigation
              </button>
              <button
                id="camera-popup-open-viewer-btn"
                onClick={() => {
                  if (onOpenLiveViewer) onOpenLiveViewer(selectedCamera.id);
                  setSelectedCamera(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                Open in CCTV Viewer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
