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
import { TelegramModal } from './components/TelegramModal';
import { FeedbackModal } from './components/FeedbackModal';
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
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const [isProUser, setIsProUser] = useState(false);
  const [telegramFeed, setTelegramFeed] = useState<TelegramMessage[]>(INITIAL_TELEGRAM_MESSAGES);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  const currentStation = STATIONS_DATABASE[currentStationId] || STATIONS_DATABASE['jurong-east'];

  const handleSelectStation = (stationId: string) => {
    setCurrentStationId(stationId);
    const station = STATIONS_DATABASE[stationId];
    if (station) {
      addToast(
        'info',
        `Viewing ${station.name}`,
        `Platform density: ${station.crowdPercentage}%. Recommended departure: ${station.recommendedDeparture}.`
      );
    }
  };

  const handleTriggerAlarmSimulation = () => {
    addToast(
      'alert',
      '⏰ 18:00 Commute Alert Triggered',
      `High crowding detected at ${currentStation.name}. Best leave time is ${currentStation.recommendedDeparture} to save ${currentStation.minutesSaved} mins.`
    );
  };

  const handleAddTelegramReport = (msg: TelegramMessage) => {
    setTelegramFeed((prev) => [msg, ...prev]);
    addToast(
      'success',
      'Report Broadcasted to SGRider Pulse',
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
      'Enjoy real-time MRT heatmaps and Telegram alerts with zero subscription fees.'
    );
    const widget = document.getElementById('crowd-widget');
    widget?.scrollIntoView({ behavior: 'smooth' });
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
    const widget = document.getElementById('crowd-widget');
    widget?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080D1A] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Ticker and Header */}
      <Header
        lines={MRT_LINES}
        onSelectLine={(line) => setSelectedLineForModal(line)}
        onOpenTelegram={() => setIsTelegramModalOpen(true)}
        onOpenDownload={() => setStoreModalPlatform('apple')}
      />

      <main className="flex-1">
        {/* Hero Section with Interactive Live MRT Crowd Preview Widget */}
        <Hero
          currentStation={currentStation}
          allStations={STATIONS_DATABASE}
          onSelectStation={handleSelectStation}
          onOpenStationDetail={(st) => setSelectedStationForModal(st)}
          onTriggerAlarmSimulation={handleTriggerAlarmSimulation}
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

        {/* Customer Relationship Model & SGRider Pulse Community */}
        <CommunitySection
          messages={telegramFeed}
          onAddMessage={handleAddTelegramReport}
          onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
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
        onOpenTelegram={() => setIsTelegramModalOpen(true)}
        onOpenDigest={() => setIsDigestModalOpen(true)}
        onRequestApiAccess={() => setIsEnterpriseModalOpen(true)}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
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

      <TelegramModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        onSimulateJoin={() => {
          setIsTelegramModalOpen(false);
          addToast(
            'success',
            'Joined SGRider Pulse Telegram',
            'Welcome! You are now subscribed to automated NSL, EWL, and CCL crowd alerts.'
          );
        }}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmitFeedback={(text) => {
          addToast(
            'success',
            'Feedback Received',
            'Thank you for contributing to Singapore commuter transit intelligence.'
          );
        }}
      />

      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
