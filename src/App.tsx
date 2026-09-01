import { useState } from 'react';
import './App.css';

// Import Icons
import logoIcon from './assets/images/logo.svg';

// Import Flags
import { Tab, Tabs, TAB_VALUES } from './components/Tabs';
import LiveMarketsBar from './components/LiveMarketsBar';
import Converter from './components/Converter';
import ChartComponent from './components/ChartComponent';
import { currencies, popularCurrencies } from './mock';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>(TAB_VALUES.HISTORY);

  return (
    <div className="app-container" data-node-id="75:175">
      {/* Header component */}
      <header className="header" data-node-id="105:414">
        <div className="logo-container" data-node-id="100:52">
          <img
            src={logoIcon}
            className="logo-icon"
            alt="FX Checker"
            data-node-id="100:49"
          />
          <span className="logo-text">FX_CHECKER</span>
        </div>
        <div className="header-info" data-node-id="75:183">
          {currencies.length + popularCurrencies.length} CURRENCIES · EOD · ECB
          DATA
        </div>
      </header>

      {/* Live markets ticker bar */}
      <LiveMarketsBar />

      {/* Main Content Area */}
      <main className="content-wrapper" data-node-id="75:418">
        <Converter />
        {/* Details and Tabs Container */}
        <div className="details-container">
          {/* Tabs header bar */}
          <Tabs activeValue={activeTab} onChange={setActiveTab}>
            <Tab value={TAB_VALUES.HISTORY} title="HISTORY">
              <ChartComponent />
            </Tab>
            <Tab value={TAB_VALUES.COMPARE} title="COMPARE">
              <div
                style={{ padding: '40px 0', textAlign: 'center', opacity: 0.7 }}
              >
                <p style={{ fontSize: '18px', marginBottom: '8px' }}>
                  Compare Markets
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-neutral-200)',
                  }}
                >
                  Select multiple target currencies to compare exchange rates
                  simultaneously.
                </p>
              </div>
            </Tab>
            <Tab value={TAB_VALUES.FAVORITES} title="FAVORITES">
              <div
                style={{ padding: '40px 0', textAlign: 'center', opacity: 0.7 }}
              >
                <p style={{ fontSize: '18px', marginBottom: '8px' }}>
                  Favorites
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-neutral-200)',
                  }}
                >
                  You currently have 10 favorited rates saved in your user
                  account.
                </p>
              </div>
            </Tab>
            <Tab value={TAB_VALUES.LOG} title="LOG">
              <div
                style={{ padding: '40px 0', textAlign: 'center', opacity: 0.7 }}
              >
                <p style={{ fontSize: '18px', marginBottom: '8px' }}>
                  Conversion Log
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-neutral-200)',
                  }}
                >
                  Review your conversion history logs, tracking the last 8
                  entries.
                </p>
              </div>
            </Tab>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
