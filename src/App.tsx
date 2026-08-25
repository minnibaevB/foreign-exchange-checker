import { useState, useEffect, useRef } from 'react';
import './App.css';

// Import Icons
import logoIcon from './assets/images/logo.svg';
import chartLine from './assets/images/chart-line.svg';
import chartGrid from './assets/images/chart-grid.svg';

// Import Flags
import { Tab, Tabs, TAB_VALUES } from './components/Tabs';
import LiveMarketsBar from './components/LiveMarketsBar';
import Converter from './components/Converter';
import Chart from './components/Chart';

export default function App() {
  // UI presentation states
  const [activeTab, setActiveTab] = useState<string>(TAB_VALUES.HISTORY);
  const [activeTimeframe, setActiveTimeframe] = useState<string>('1M');

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
          55 CURRENCIES · EOD · ECB DATA
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
              <>
                {/* Stats and timeframes card below tabs */}
                <div className="stats-and-timeframe-row" data-node-id="75:483">
                  <div className="stats-grid" data-node-id="75:484">
                    <div className="stat-card" data-node-id="75:485">
                      <p className="stat-label">OPEN</p>
                      <p className="stat-value">0.8516</p>
                    </div>
                    <div className="stat-card" data-node-id="75:488">
                      <p className="stat-label">LAST</p>
                      <p className="stat-value">0.8530</p>
                    </div>
                    <div className="stat-card" data-node-id="75:491">
                      <p className="stat-label">CHANGE</p>
                      <p className="stat-value up">+0.0014</p>
                    </div>
                    <div className="stat-card" data-node-id="75:494">
                      <p className="stat-label">% CHANGE</p>
                      <p className="stat-value up">▲ +0.16%</p>
                    </div>
                  </div>

                  <div className="timeframe-bar" data-node-id="75:497">
                    {['1D', '1W', '1M', '3M', '1Y', '5Y'].map((tf) => (
                      <button
                        key={tf}
                        className={`timeframe-button ${activeTimeframe === tf ? 'active' : ''}`}
                        onClick={() => setActiveTimeframe(tf)}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rate graph Card */}
                <div className="chart-card" data-node-id="75:510">
                  <div className="chart-header">
                    <h2 className="chart-title">
                      {/* {sendCurrency.code}/{receiveCurrency.code} */}
                    </h2>
                    <p className="chart-meta">
                      <span>0.8612</span> · MAY 14 16:00 CET
                    </p>
                  </div>

                  <div className="chart-body" data-node-id="94:1737">
                    <div className="chart-row" data-node-id="75:512">
                      <div className="y-axis" data-node-id="75:520">
                        <span>0.8612</span>
                        <span>0.8516</span>
                        <span>0.0000</span>
                      </div>
                      <div className="chart-canvas-area" data-node-id="75:517">
                        <img
                          src={chartGrid}
                          className="chart-grid-svg"
                          alt=""
                        />
                        <img
                          src={chartLine}
                          className="chart-line-svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="x-axis" data-node-id="75:524">
                      <span>Apr 14</span>
                      <span>Apr 21</span>
                      <span>Apr 28</span>
                      <span>May 06</span>
                      <span>May 14</span>
                    </div>
                  </div>
                </div>

                <Chart />
              </>
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
