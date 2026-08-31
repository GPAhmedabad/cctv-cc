import React, { useState } from 'react';
import {
  Camera as CameraIcon,
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  Trash2,
  Edit,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Layers,
  MapPin,
} from 'lucide-react';
import { Camera, Department, CameraStatus, VMSVendor, CameraType } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { StatusDot } from '../common/StatusDot';

interface CctvRegistryViewProps {
  cameras: Camera[];
  onAddCamera: (camera: Partial<Camera>) => void;
  onUpdateCamera: (id: string, camera: Partial<Camera>) => void;
  onDeleteCamera: (id: string) => void;
  onBulkImport: (records: any[]) => void;
  onOpenLiveViewer: (cameraId: string) => void;
}

export const CctvRegistryView: React.FC<CctvRegistryViewProps> = ({
  cameras,
  onAddCamera,
  onUpdateCamera,
  onDeleteCamera,
  onBulkImport,
  onOpenLiveViewer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedVendor, setSelectedVendor] = useState<string>('ALL');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);

  // New Camera Form
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: 'POLICE' as Department,
    locationName: '',
    district: 'Ahmedabad',
    lat: 23.0225,
    lng: 72.5714,
    vendor: 'Milestone XProtect' as VMSVendor,
    vmsInstance: 'Netram-Central-01',
    cameraType: 'ANPR_BULLET' as CameraType,
    resolution: '4K (3840x2160)',
    zone: 'Gujarat Statewide Sector',
  });

  const [csvText, setCsvText] = useState('');

  const filteredCameras = cameras.filter((c) => {
    if (selectedDept !== 'ALL' && c.department !== selectedDept) return false;
    if (selectedStatus !== 'ALL' && c.status !== selectedStatus) return false;
    if (selectedVendor !== 'ALL' && c.vendor !== selectedVendor) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.locationName.toLowerCase().includes(q) ||
        c.zone.toLowerCase().includes(q) ||
        c.vmsInstance.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCamera(formData);
    setIsAddModalOpen(false);
    setFormData({
      id: '',
      name: '',
      department: 'POLICE',
      locationName: '',
      district: 'Ahmedabad',
      lat: 23.0225,
      lng: 72.5714,
      vendor: 'Milestone XProtect',
      vmsInstance: 'Netram-Central-01',
      cameraType: 'ANPR_BULLET',
      resolution: '4K (3840x2160)',
      zone: 'Gujarat Statewide Sector',
    });
  };

  const handleCsvImportSubmit = () => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length <= 1) return;

      const records: any[] = [];
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        if (values.length >= 3) {
          const rec: any = {};
          headers.forEach((h, idx) => {
            rec[h] = values[idx];
          });
          records.push(rec);
        }
      }

      if (records.length > 0) {
        onBulkImport(records);
        setIsCsvModalOpen(false);
        setCsvText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sampleCsv = `name,department,locationName,district,lat,lng,vendor,cameraType
SG Highway Thaltej Crossroad,POLICE,Thaltej Underpass,Ahmedabad,23.0511,72.5186,Milestone XProtect,ANPR_BULLET
GIFT City Boulevard South,SMART_CITY,GIFT Gate 2,Gandhinagar,23.1610,72.6820,Genetec Security Center,PTZ_DOME
Surat DREAM City East,POLICE,Khajod DREAM City,Surat,21.1245,72.7689,HikCentral,ANPR_BULLET`;

  return (
    <div id="cctv-registry-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CameraIcon className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              STATEWIDE CCTV REGISTRY & INVENTORY
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Master database of all federated cameras, telemetry health status, and VMS bindings
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            id="open-csv-import-modal-btn"
            onClick={() => {
              setCsvText(sampleCsv);
              setIsCsvModalOpen(true);
            }}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>CSV Bulk Import</span>
          </button>
          <button
            id="open-add-camera-modal-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-900/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Camera</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">TOTAL REGISTERED</div>
          <div className="text-xl font-bold text-white mt-1">{cameras.length} nodes</div>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">ONLINE & HEALTHY</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {cameras.filter((c) => c.status === 'ONLINE').length} nodes
          </div>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">DEGRADED TELEMETRY</div>
          <div className="text-xl font-bold text-amber-400 mt-1">
            {cameras.filter((c) => c.status === 'DEGRADED').length} nodes
          </div>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400">OFFLINE / UNREACHABLE</div>
          <div className="text-xl font-bold text-rose-400 mt-1">
            {cameras.filter((c) => c.status === 'OFFLINE').length} nodes
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Camera ID, Name, Junction, VMS instance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Departments</option>
            <option value="POLICE">Police Grid</option>
            <option value="SMART_CITY">Smart City ICCC</option>
            <option value="MUNICIPAL">Municipal</option>
            <option value="HIGHWAY">Highway / NHAI</option>
            <option value="TRANSPORT">Transport / GSRTC</option>
            <option value="PORTS_AIRPORTS">Ports & Airports</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ONLINE">Online</option>
            <option value="DEGRADED">Degraded</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>
      </div>

      {/* Cameras Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Camera ID & Name</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Location & District</th>
                <th className="p-3.5">VMS & Vendor</th>
                <th className="p-3.5">Type & Spec</th>
                <th className="p-3.5">Health</th>
                <th className="p-3.5">Heartbeat</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredCameras.map((cam) => {
                const isOnline = cam.status === 'ONLINE';
                const isDegraded = cam.status === 'DEGRADED';
                const isOffline = cam.status === 'OFFLINE';

                return (
                  <tr
                    key={cam.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <StatusDot
                          status={cam.status}
                          size="sm"
                          pulse={cam.status === 'ONLINE'}
                        />
                        <span>{cam.id}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                        {cam.name}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <Badge variant="info" size="sm">
                        {cam.department}
                      </Badge>
                    </td>

                    <td className="p-3.5">
                      <div className="text-slate-200 font-medium">{cam.locationName}</div>
                      <div className="text-[10px] text-slate-500">
                        {cam.district} • {cam.lat.toFixed(4)}, {cam.lng.toFixed(4)}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-slate-300">{cam.vendor}</div>
                      <div className="text-[10px] text-slate-500">{cam.vmsInstance}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-slate-300">{cam.cameraType}</div>
                      <div className="text-[10px] text-slate-500">{cam.resolution}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            isOnline
                              ? 'text-emerald-400'
                              : isDegraded
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {cam.healthScore}%
                        </span>
                        <div className="w-14 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isOnline
                                ? 'bg-emerald-500'
                                : isDegraded
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${cam.healthScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {cam.latencyMs}ms latency
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-400 text-[11px]">
                      {cam.lastHeartbeat}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          title="Open Live CCTV Feed"
                          onClick={() => onOpenLiveViewer(cam.id)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete / Decommission"
                          onClick={() => onDeleteCamera(cam.id)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register New Camera */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="REGISTER NEW CCTV NODE"
        subtitle="Onboard new camera endpoint into Sentinel-X Adapter Layer"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">CAMERA ID</label>
              <input
                type="text"
                required
                placeholder="e.g. CAM-AMD-901"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">NODE NAME</label>
              <input
                type="text"
                required
                placeholder="e.g. SG Highway - Shilaj Crossroad"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">DEPARTMENT</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="POLICE">Police Grid</option>
                <option value="SMART_CITY">Smart City ICCC</option>
                <option value="MUNICIPAL">Municipal</option>
                <option value="HIGHWAY">Highway / NHAI</option>
                <option value="TRANSPORT">Transport</option>
                <option value="PORTS_AIRPORTS">Ports & Airports</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">VMS VENDOR</label>
              <select
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value as VMSVendor })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Milestone XProtect">Milestone XProtect</option>
                <option value="Genetec Security Center">Genetec Security Center</option>
                <option value="HikCentral">HikCentral</option>
                <option value="Dahua DSS">Dahua DSS</option>
                <option value="Uniview EZStation">Uniview EZStation</option>
                <option value="Honeywell MAXPRO">Honeywell MAXPRO</option>
                <option value="Generic RTSP/ONVIF">Generic RTSP/ONVIF</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">LOCATION NAME</label>
              <input
                type="text"
                required
                placeholder="e.g. Shilaj Underpass"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">LATITUDE</label>
              <input
                type="number"
                step="0.0001"
                required
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">LONGITUDE</label>
              <input
                type="number"
                step="0.0001"
                required
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold transition-colors"
            >
              Confirm Registration
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Bulk CSV Import */}
      <Modal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        title="BULK CSV CCTV INGESTION"
        subtitle="Paste CSV camera rows or custom Government Hackathon dataset"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs font-mono">
          <p className="text-slate-400">
            Columns: <code className="text-cyan-300">name, department, locationName, district, lat, lng, vendor, cameraType</code>
          </p>
          <textarea
            rows={7}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
          />
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => setCsvText(sampleCsv)}
              className="text-cyan-400 hover:underline"
            >
              Load Sample Gujarat Template
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCsvImportSubmit}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded"
              >
                Ingest Dataset
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
