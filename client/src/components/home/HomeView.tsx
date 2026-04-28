import { useCallback, useEffect } from 'react';
import { HomeDashboardUI } from './HomeDashboardUI';
import { useAIPlanner } from '../../hooks/useAIPlanner';
import { REAL_LOCATIONS } from '../../data/locations';
import type { Combo, Activity } from '../../types';

interface Props {
  weatherData: any;
  showToast: (msg: string) => void;
  setSelectedCombo: (c: Combo) => void;
  setShowPaymentModal: (v: boolean) => void;
  setRideModalLoc: (v: { name: string; lat: number; lng: number } | null) => void;
  setRealImageLoc: (v: { name: string; mapsUri: string; desc?: string; imageUrl?: string } | null) => void;
  combos: Combo[];
  setCombos: (c: Combo[]) => void;
  openChat: () => void;
  onAvatarClick: () => void;
  onWeatherClick: () => void;
  formatVND: (n: number) => string;
  location: string;
  preferences: string[];
  setPreferences: (p: string[]) => void;
}

export function HomeView({ 
  weatherData, showToast, setSelectedCombo, setShowPaymentModal, 
  setRideModalLoc, setRealImageLoc, combos, setCombos, 
  openChat, onAvatarClick, onWeatherClick, formatVND, location, preferences, setPreferences 
}: Props) {
  
  const { formState, dataState, actions } = useAIPlanner({
    location,
    showToast,
    initialCombos: combos,
    externalPreferences: preferences,
    setExternalPreferences: setPreferences
  });

  // Sync generated combos back to App state so they survive tab switches
  useEffect(() => {
    if (dataState.combos.length > 0) {
      setCombos(dataState.combos);
    }
  }, [dataState.combos, setCombos]);

  const categories = Array.from(new Set(REAL_LOCATIONS.map(loc => loc.category).filter(Boolean))) as string[];

  const handleSelectCombo = useCallback((combo: Combo) => {
    setSelectedCombo(combo);
    setShowPaymentModal(true);
  }, [setSelectedCombo, setShowPaymentModal]);

  const handleSelectVenue = useCallback((venue: Activity) => {
    const mapsUri = venue.websiteUri 
      || (venue.lat && venue.lng 
        ? `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}` 
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + ' ' + (venue.address || ''))}`);
    setRealImageLoc({
      name: venue.name,
      mapsUri,
      desc: venue.address,
      imageUrl: venue.imageUrl
    });
  }, [setRealImageLoc]);

  return (
    <HomeDashboardUI
      userName="Hưng"
      userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuD5fQvzhgWAnCEj7ACr7c_XPwX5u48krOmZuXxBChh911zOWYQRJcnaNtoQqplogf2AXUFicP9kn3TIbu-AI1FrobzW7zy73oO1v4ehbZKCtmSt1KXQJvIubhuBTzIGi1c0kzLLvt_Ykxn2ypNtz5YplxUHttU4mqRkMU9L82XDuoouQij2ZUUSpiP13o49_TSgYHOa0ZNTSCx4Am6e1gxZ83r7nQQ9uQpArgF6iu6SjN34NGisxjWTJ-xiImchPKYVctLQsyydIUBS"
      dateMiles={1500}
      openChat={openChat}
      onAvatarClick={onAvatarClick}
      onWeatherClick={onWeatherClick}
      weatherData={weatherData}
      budget={formState.budget}
      onBudgetChange={formState.setBudget}
      companion={formState.companion}
      onCompanionChange={formState.setCompanion}
      startTime={formState.startTime}
      endTime={formState.endTime}
      onTimeChange={(start, end) => {
          formState.setStartTime(start);
          formState.setEndTime(end);
      }}
      preferences={formState.preferences}
      categories={categories}
      onPreferenceToggle={(cat) => {
          const isSelected = formState.preferences.includes(cat);
          if (isSelected) formState.setPreferences(formState.preferences.filter(p => p !== cat));
          else formState.setPreferences([...formState.preferences, cat]);
      }}
      isGenerating={dataState.isLoading}
      onGenerate={actions.generate}
      combos={dataState.combos}
      error={dataState.error}
      onSelectCombo={handleSelectCombo}
      onSelectVenue={handleSelectVenue}
      formatVND={formatVND}
    />
  );
}
