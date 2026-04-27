import { useCallback } from 'react';
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
  formatVND: (n: number) => string;
  location: string;
  preferences: string[];
  setPreferences: (p: string[]) => void;
}

export function HomeView({ 
  weatherData, showToast, setSelectedCombo, setShowPaymentModal, 
  setRideModalLoc, setRealImageLoc, combos, setCombos, 
  openChat, formatVND, location, preferences, setPreferences 
}: Props) {
  
  const { formState, dataState, actions } = useAIPlanner({
    location,
    showToast,
    initialCombos: combos,
    externalPreferences: preferences,
    setExternalPreferences: setPreferences
  });

  const categories = Array.from(new Set(REAL_LOCATIONS.map(loc => loc.category).filter(Boolean))) as string[];

  const handleSelectCombo = useCallback((combo: Combo) => {
    setSelectedCombo(combo);
    setShowPaymentModal(true);
  }, [setSelectedCombo, setShowPaymentModal]);

  const handleSelectVenue = useCallback((venue: Activity) => {
    if (venue.imageUrl) {
      setRealImageLoc({
        name: venue.name,
        mapsUri: venue.websiteUri || '',
        desc: venue.address,
        imageUrl: venue.imageUrl
      });
    } else if (venue.lat && venue.lng) {
       setRideModalLoc({
           name: venue.name,
           lat: venue.lat,
           lng: venue.lng
       });
    }
  }, [setRealImageLoc, setRideModalLoc]);

  return (
    <HomeDashboardUI
      userName="Hưng"
      userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuD5fQvzhgWAnCEj7ACr7c_XPwX5u48krOmZuXxBChh911zOWYQRJcnaNtoQqplogf2AXUFicP9kn3TIbu-AI1FrobzW7zy73oO1v4ehbZKCtmSt1KXQJvIubhuBTzIGi1c0kzLLvt_Ykxn2ypNtz5YplxUHttU4mqRkMU9L82XDuoouQij2ZUUSpiP13o49_TSgYHOa0ZNTSCx4Am6e1gxZ83r7nQQ9uQpArgF6iu6SjN34NGisxjWTJ-xiImchPKYVctLQsyydIUBS"
      dateMiles={1500}
      openChat={openChat}
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
