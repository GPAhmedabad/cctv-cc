import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  MapPin,
  Camera as CameraIcon,
  Video,
  X,
  FastForward,
} from 'lucide-react';
import { JourneyReconstruction, Camera } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface JourneyReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  plateNumber?: string;
  journey?: JourneyReconstruction;
  cameras?: Camera[];
}

export const JourneyReplayModal: React.FC<JourneyReplayModalProps> = ({
  isOpen,
  onClose,
  plateNumber = 'GJ01AB1234',
  journey: initialJourney,
  cameras = [],
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Fallback default Gujarat corridor trajectory if not provided
  const fallbackJourney: JourneyReconstruction = {
    plateNumber: plateNumber,
    vehicleDetails: {
      make: 'Toyota Fortuner',
      model: '2.8 4x4 MT',
      color: 'Midnight Black',
      category: 'SUV / Luxury 4WD',
      ownerName: 'Flagged Alias: Vikram S.',
      registrationDistrict: 'Ahmedabad RTO (GJ-01)',
    },
    totalDistanceKm: 28.4,
    averageSpeedKmh: 64.2,
    firstSeen: '2025-10-24 20:12:04 IST',
    lastSeen: '2025-10-24 20:48:55 IST',
    waypoints: [
      {
        sequenceOrder: 1,
        cameraId: 'CAM-AMD-001',
        cameraName: 'Pakwan Crossroad ANPR North Gantry',
        locationName: 'SG Highway, Bodakdev, Ahmedabad',
        lat: 23.0489,
        lng: 72.5186,
        timestamp: '20:12:04 IST',
        speedKmh: 74,
        heading: 'NNE (028°)',
        lane: 2,
        snapshotUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
        confidenceScore: 98.4,
      },
      {
        sequenceOrder: 2,
        cameraId: 'CAM-AMD-002',
        cameraName: 'Thaltej Flyover Northern Descent',
        locationName: 'SG Highway, Thaltej, Ahmedabad',
        lat: 23.0582,
        lng: 72.5245,
        timestamp: '20:18:22 IST',
        speedKmh: 68,
        heading: 'NNE (028°)',
        lane: 1,
        snapshotUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
        confidenceScore: 97.2,
      },
      {
        sequenceOrder: 3,
        cameraId: 'CAM-AMD-003',
        cameraName: 'Sola Bhagwat Vidyapith Junction',
        locationName: 'SG Highway, Sola, Ahmedabad',
        lat: 23.0765,
        lng: 72.5312,
        timestamp: '20:25:40 IST',
        speedKmh: 58,
        heading: 'North (012°)',
        lane: 3,
        snapshotUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
        confidenceScore: 99.1,
      },
      {
        sequenceOrder: 4,
        cameraId: 'CAM-GND-001',
        cameraName: 'Koba Circle Gandhinagar Bypass Entry',
        locationName: 'Koba Circle, Gandhinagar Highway',
        lat: 23.1422,
        lng: 72.6318,
        timestamp: '20:34:10 IST',
        speedKmh: 62,
        heading: 'ENE (065°)',
        lane: 2,
        snapshotUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80',
        confidenceScore: 96.8,
      },
      {
        sequenceOrder: 5,
        cameraId: 'CAM-GND-002',
        cameraName: 'Infocity Crossroad Gandhinagar',
        locationName: 'Infocity Sector 0, Gandhinagar',
        lat: 23.1895,
        lng: 72.6456,
        timestamp: '20:41:30 IST',
        speedKmh: 45,
        heading: 'North (005°)',
        lane: 1,
        snapshotUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80',
        confidenceScore: 95.4,
      },
      {
        sequenceOrder: 6,
        cameraId: 'CAM-GND-003',
        cameraName: 'GIFT City South Access Security Gate',
        locationName: 'GIFT City Perimeter Axis, Gandhinagar',
        lat: 23.1611,
        lng: 72.6842,
        timestamp: '20:48:55 IST',
        speedKmh: 32,
        heading: 'East (090°)',
        lane: 1,
        snapshotUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80',
        confidenceScore: 98.9,
      },
    ],
  };

  const journey = initialJourney || fallbackJourney;
  const waypoints = journey.waypoints || [];
  const activeWaypoint = waypoints[currentStep] || waypoints[0];

  useEffect(() => {
    if (!isOpen || !isPlaying || waypoints.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= waypoints.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2500 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, playbackSpeed, waypoints.length]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`SYNCHRONIZED JOURNEY REPLAY: ${journey.plateNumber}`}
      subtitle={`Chronological forensic playback across ${waypoints.length} consecutive surveillance corridors`}
      maxWidth="3xl"
    >
      <div className="space-y-4 font-mono text-xs">
        {/* Active Node Sighting Card */}
        {activeWaypoint && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            {/* Left: Snapshot Feed */}
            <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-black">
              <img
                src={activeWaypoint.snapshotUrl}
                alt="Camera Capture"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-cyan-300 font-bold border border-cyan-500/40">
                {activeWaypoint.cameraId} • LANE {activeWaypoint.lane}
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-emerald-400 font-bold">
                OCR CONF: {activeWaypoint.confidenceScore}%
              </div>
            </div>

            {/* Right: Sighting Metadata */}
            <div className="space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="cyan" size="sm">
                    NODE #{activeWaypoint.sequenceOrder} OF {waypoints.length}
                  </Badge>
                  <span className="text-slate-400">{activeWaypoint.timestamp}</span>
                </div>

                <div className="text-white font-bold text-sm">
                  {activeWaypoint.cameraName}
                </div>

                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{activeWaypoint.locationName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500">SPEED: </span>
                  <span className="text-cyan-300 font-bold">{activeWaypoint.speedKmh} km/h</span>
                </div>
                <div>
                  <span className="text-slate-500">HEADING: </span>
                  <span className="text-slate-200">{activeWaypoint.heading}</span>
                </div>
                <div>
                  <span className="text-slate-500">DISTANCE: </span>
                  <span className="text-slate-200">{journey.totalDistanceKm} km total</span>
                </div>
                <div>
                  <span className="text-slate-500">AVG SPEED: </span>
                  <span className="text-slate-200">{journey.averageSpeedKmh} km/h</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Progress Scrubber */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>CORRIDOR TIMELINE</span>
            <span className="text-cyan-400 font-bold">
              Waypoint {currentStep + 1} / {waypoints.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {waypoints.map((wp, idx) => (
              <button
                key={wp.sequenceOrder}
                onClick={() => {
                  setCurrentStep(idx);
                  setIsPlaying(false);
                }}
                className={`flex-1 h-2 rounded-full transition-all ${
                  currentStep === idx
                    ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                    : currentStep > idx
                    ? 'bg-emerald-500'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={`${wp.cameraName} (${wp.timestamp})`}
              />
            ))}
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded flex items-center gap-1.5 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause Replay' : 'Play Replay'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentStep(0);
                setIsPlaying(true);
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
              title="Rewind to start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Playback Speed */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 text-[10px]">
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded ${
                    playbackSpeed === spd ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
