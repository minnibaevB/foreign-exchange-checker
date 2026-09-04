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
import { Compare } from './components/Compare';
import Favorites from './components/Favorites';
import Log from './components/Log';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>(TAB_VALUES.HISTORY);

  return (
    <div className="app-container" data-node-id="75:175">
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
      <LiveMarketsBar />
      <main className="content-wrapper" data-node-id="75:418">
        <Converter />
        <div className="details-container">
          <Tabs activeValue={activeTab} onChange={setActiveTab}>
            <Tab value={TAB_VALUES.HISTORY} title="HISTORY">
              <ChartComponent />
            </Tab>
            <Tab value={TAB_VALUES.COMPARE} title="COMPARE">
              <Compare />
            </Tab>
            <Tab value={TAB_VALUES.FAVORITES} title="FAVORITES">
              <Favorites />
            </Tab>
            <Tab value={TAB_VALUES.LOG} title="LOG">
              <Log />
            </Tab>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
