/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Pillars } from './components/Pillars';
import { LineMonitor } from './components/LineMonitor';
import { CommunitySection } from './components/CommunitySection';
import { EnterpriseSection } from './components/EnterpriseSection';
import { PricingSection } from './components/PricingSection';
import { ChannelsSection } from './components/ChannelsSection';
import { Footer } from './components/Footer';

import { StationDetailModal } from './components/StationDetailModal';
import { LineDetailModal } from './components/LineDetailModal';
import { EnterpriseModal } from './components/EnterpriseModal';
import { ProPassModal } from './components/ProPassModal';
import { WeeklyDigestModal } from './components/WeeklyDigestModal';
import { StoreModal } from './components/StoreModal';
import { FeedbackModal } from './components/FeedbackModal';
import { HealthMonitorModal } from './components/HealthMonitorModal';
import { ToastContainer, ToastMessage } from './components/Toast';

import { MRT_LINES, STATIONS_DATABASE, INITIAL_TELEGRAM_MESSAGES } from './data/mrtData';
import { MRTLine, StationData, TelegramMessage } from './types/transit';

export default function App() {
  // State
  const [currentStationId, setCurrentStationId] = useState<string>('jurong-east');
  const [selectedStationForModal, setSelectedStationForModal] = useState<StationData | null>(null);
  const [selectedLineForModal, setSelectedLineForModal] = useState<MRTLine | null>(null);
  
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isDigestModalOpen, setIsDigestModalOpen] = useState(false);
  const [storeModalPlatform, setStoreModalPlatform] = useState<'apple' | 'google' | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  const [isProUser, setIsProUser] = useState(false);
  const [communityFeed, setCommunityFeed] = useState<TelegramMessage[]>(INITIAL_TELEGRAM_MESSAGES);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [liveStationOverrides, setLiveStationOverrides] = useState<Record<string, Partial<StationData>>>({});

  const addToast = (type: 'success' | 'alert' | 'info', title: string, description: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      description,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchLiveCrowd = async (stationId: string, showNotification: boolean = false) => {
    const baseStation = STATIONS_DATABASE[stationId] || STATIONS_DATABASE['jurong-east'];
    try {
      const res = await fetch(`/api/crowd?station=${stationId}`);
      if (res.ok) {
        const data = await res.json();
        const p = data.crowdPercentage || baseStation.crowdPercentage;

        // Dynamically adjust car fullness to match live crowd percentage
        const newCarFullness = baseStation.carFullness.map((car, idx) => {
          const modifier = (idx === 2 || idx === 3) ? 10 : (idx === 0 || idx === 5) ? -10 : 0;
          const carPercent = Math.min(98, Math.max(15, p + modifier));
          const level: 'Low' | 'Moderate' | 'Packed' = carPercent > 75 ? 'Packed' : carPercent > 45 ? 'Moderate' : 'Low';
          const seatsEstimate = level === 'Packed' ? 0 : level === 'Moderate' ? Math.max(2, Math.round((75 - carPercent) / 6)) : Math.round((95 - carPercent) / 4);
          return {
            ...car,
            percentage: carPercent,
            level,
            seatsEstimate,
          };
        });

        const updated: Partial<StationData> = {
          crowdPercentage: p,
          crowdLevel: data.crowdLevel || baseStation.crowdLevel,
          source: data.source,
          latencyMs: data.latencyMs,
          isLive: true,
          ltaConnected: data._diagnostic?.ltaConfigured === true,
          lastUpdated: new Date().toLocaleTimeString('en-SG', {
            timeZone: 'Asia/Singapore',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          carFullness: newCarFullness,
        };

        setLiveStationOverrides((prev) => ({
          ...prev,
          [stationId]: updated,
        }));

        if (showNotification) {
          addToast(
            'success',
            `Live API Telemetry Verified (${data.stationCode || baseStation.code})`,
            `Platform crowd: ${p}% (${data.crowdLevel || baseStation.crowdLevel}). Latency: ${data.latencyMs ? data.latencyMs + 'ms' : 'fast'}. ${data._diagnostic?.ltaConfigured ? 'Official LTA DataMall connected.' : 'Simulation mode (awaiting LTA key in Vercel).'}`
          );
        }
      }
    } catch (err: any) {
      if (showNotification) {
        addToast('alert', 'Telemetry Fetch Failed', `Could not reach /api/crowd: ${err.message}`);
      }
    }
  };

  // Poll live telemetry on mount and when station changes
  React.useEffect(() => {
    fetchLiveCrowd(currentStationId, false);
    const interval = setInterval(() => {
      fetchLiveCrowd(currentStationId, false);
    }, 25000);
    return () => clearInterval(interval);
  }, [currentStationId]);

  const baseStation = STATIONS_DATABASE[currentStationId] || STATIONS_DATABASE['jurong-east'];
  const currentStation: StationData = {
    ...baseStation,
    ...(liveStationOverrides[currentStationId] || {}),
  };

  const handleSelectStation = (stationId: string) => {
    setCurrentStationId(stationId);
    fetchLiveCrowd(stationId, true);
  };

  const handleCheckLiveCrowd = async () => {
    const widget = document.getElementById('crowd-widget');
    widget?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await fetchLiveCrowd(currentStationId, true);
  };

  const handleTriggerAlarmSimulation = () => {
    addToast(
      'alert',
      '⏰ 18:00 Commute Alert Triggered',
      `High crowding detected at ${currentStation.name}. Best leave time is ${currentStation.recommendedDeparture} to save ${currentStation.minutesSaved} mins.`
    );
  };

  const handleAddCommunityReport = (msg: TelegramMessage) => {
    setCommunityFeed((prev) => [msg, ...prev]);
    addToast(
      'success',
      'Report Broadcasted to SGRider Live Feed',
      'Thank you! Your crowdsource verification was pushed to 14,820 commuters.'
    );
  };

  const handleActivatePro = () => {
    setIsProUser(true);
    addToast(
      'success',
      'Commuter Pro Pass Active',
      'All advertisements removed. VIP departure alarms and car fullness guides enabled.'
    );
  };

  const handleGetFreeAccess = () => {
    addToast(
      'success',
      'Free Daily Commuter Access Enabled',
      'Enjoy real-time MRT heatmaps and crowdsourced alerts with zero subscription fees.'
    );
    handleCheckLiveCrowd();
  };

  const handleEnterpriseSuccess = (orgName: string) => {
    addToast(
      'success',
      'Enterprise Sandbox Provisioned',
      `API key issued for ${orgName}. Check your sandbox terminal for integration endpoint.`
    );
  };

  const handleLaunchWebApp = () => {
    addToast(
      'info',
      'Web App Mode Ready',
      'CommuteWise SG MRT is running in instant-access progressive web app mode.'
    );
    handleCheckLiveCrowd();
  };

  return (
    <div className="min-h-screen bg-[#080D1A] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Ticker and Header */}
      <Header
        lines={MRT_LINES}
        onSelectLine={(line) => setSelectedLineForModal(line)}
        onOpenDownload={() => setStoreModalPlatform('apple')}
        onOpenHealthMonitor={() => setIsHealthModalOpen(true)}
        onCheckLiveCrowd={handleCheckLiveCrowd}
      />

      <main className="flex-1">
        {/* Hero Section with Interactive Live MRT Crowd Preview Widget */}
        <Hero
          currentStation={currentStation}
          allStations={STATIONS_DATABASE}
          onSelectStation={handleSelectStation}
          onOpenStationDetail={(st) => setSelectedStationForModal(st)}
          onTriggerAlarmSimulation={handleTriggerAlarmSimulation}
          onCheckLiveCrowd={handleCheckLiveCrowd}
        />

        {/* 4 Pillars of Value Proposition */}
        <Pillars
          onOpenDigest={() => setIsDigestModalOpen(true)}
          onExploreLines={() => {
            const el = document.getElementById('line-monitor');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreCommunity={() => {
            const el = document.getElementById('community');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Interactive Line Density Monitor */}
        <LineMonitor
          lines={MRT_LINES}
          onSelectLine={(line) => setSelectedLineForModal(line)}
        />

        {/* Customer Relationship Model & SGRider Live Community Feed */}
        <CommunitySection
          messages={communityFeed}
          onAddMessage={handleAddCommunityReport}
          onOpenDigest={() => setIsDigestModalOpen(true)}
        />

        {/* Enterprise Corridor Intelligence & LTA Analytics */}
        <EnterpriseSection onRequestApiAccess={() => setIsEnterpriseModalOpen(true)} />

        {/* Pricing & Revenue Section */}
        <PricingSection
          onStartProTrial={() => setIsProModalOpen(true)}
          onGetFreeAccess={handleGetFreeAccess}
          isProUser={isProUser}
        />

        {/* Daily Channels & Download CTA */}
        <ChannelsSection
          onOpenStoreModal={(platform) => setStoreModalPlatform(platform)}
          onLaunchWebApp={handleLaunchWebApp}
        />
      </main>

      {/* Main Footer */}
      <Footer
        lines={MRT_LINES}
        onSelectLine={(line) => setSelectedLineForModal(line)}
        onOpenDigest={() => setIsDigestModalOpen(true)}
        onRequestApiAccess={() => setIsEnterpriseModalOpen(true)}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        onOpenHealthMonitor={() => setIsHealthModalOpen(true)}
        onCheckLiveCrowd={handleCheckLiveCrowd}
      />

      {/* Interactive Modals */}
      <StationDetailModal
        station={selectedStationForModal}
        onClose={() => setSelectedStationForModal(null)}
        onSelectStation={handleSelectStation}
      />

      <LineDetailModal
        line={selectedLineForModal}
        onClose={() => setSelectedLineForModal(null)}
      />

      <EnterpriseModal
        isOpen={isEnterpriseModalOpen}
        onClose={() => setIsEnterpriseModalOpen(false)}
        onSuccess={handleEnterpriseSuccess}
      />

      <ProPassModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onActivatePro={handleActivatePro}
        isProUser={isProUser}
      />

      <WeeklyDigestModal
        isOpen={isDigestModalOpen}
        onClose={() => setIsDigestModalOpen(false)}
      />

      <StoreModal
        platform={storeModalPlatform}
        onClose={() => setStoreModalPlatform(null)}
        onInstallWebApp={() => {
          setStoreModalPlatform(null);
          handleLaunchWebApp();
        }}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmitFeedback={() => {
          addToast(
            'success',
            'Feedback Received',
            'Thank you for contributing to Singapore commuter transit intelligence.'
          );
        }}
      />

      <HealthMonitorModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
      />

      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
