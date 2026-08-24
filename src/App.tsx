import { useState, useEffect, useRef } from 'react'
import './App.css'

// Import Icons
import logoIcon from './assets/images/logo.svg'
import starIcon from './assets/images/icon-star.svg'
import starFilledIcon from './assets/images/icon-star-filled.svg'
import chevronDownIcon from './assets/images/icon-chevron-down.svg'
import exchangeIcon from './assets/images/icon-exchange.svg'
import chartLine from './assets/images/chart-line.svg'
import chartGrid from './assets/images/chart-grid.svg'

// Import Flags
import aeFlag from './assets/images/flags/ae.webp'
import arFlag from './assets/images/flags/ar.webp'
import auFlag from './assets/images/flags/au.webp'
import bgFlag from './assets/images/flags/bg.webp'
import brFlag from './assets/images/flags/br.webp'
import caFlag from './assets/images/flags/ca.webp'
import chFlag from './assets/images/flags/ch.webp'
import cnFlag from './assets/images/flags/cn.webp'
import czFlag from './assets/images/flags/cz.webp'
import dkFlag from './assets/images/flags/dk.webp'
import egFlag from './assets/images/flags/eg.webp'
import euFlag from './assets/images/flags/eu.webp'
import gbFlag from './assets/images/flags/gb.webp'
import hkFlag from './assets/images/flags/hk.webp'
import huFlag from './assets/images/flags/hu.webp'
import idFlag from './assets/images/flags/id.webp'
import inFlag from './assets/images/flags/in.webp'
import isFlag from './assets/images/flags/is.webp'
import jpFlag from './assets/images/flags/jp.webp'
import krFlag from './assets/images/flags/kr.webp'
import mxFlag from './assets/images/flags/mx.webp'
import myFlag from './assets/images/flags/my.webp'
import noFlag from './assets/images/flags/no.webp'
import nzFlag from './assets/images/flags/nz.webp'
import phFlag from './assets/images/flags/ph.webp'
import plFlag from './assets/images/flags/pl.webp'
import roFlag from './assets/images/flags/ro.webp'
import ruFlag from './assets/images/flags/ru.webp'
import saFlag from './assets/images/flags/sa.webp'
import seFlag from './assets/images/flags/se.webp'
import sgFlag from './assets/images/flags/sg.webp'
import thFlag from './assets/images/flags/th.webp'
import trFlag from './assets/images/flags/tr.webp'
import twFlag from './assets/images/flags/tw.webp'
import uaFlag from './assets/images/flags/ua.webp'
import usFlag from './assets/images/flags/us.webp'
import zaFlag from './assets/images/flags/za.webp'

// Define Flag Map for Dynamic Flag Rendering
const flagMap: Record<string, string> = {
  ae: aeFlag, ar: arFlag, au: auFlag, bg: bgFlag, br: brFlag, ca: caFlag,
  ch: chFlag, cn: cnFlag, cz: czFlag, dk: dkFlag, eg: egFlag, eu: euFlag,
  gb: gbFlag, hk: hkFlag, hu: huFlag, id: idFlag, in: inFlag, is: isFlag,
  jp: jpFlag, kr: krFlag, mx: mxFlag, my: myFlag, no: noFlag, nz: nzFlag,
  ph: phFlag, pl: plFlag, ro: roFlag, ru: ruFlag, sa: saFlag, se: seFlag,
  sg: sgFlag, th: thFlag, tr: trFlag, tw: twFlag, ua: uaFlag, us: usFlag,
  za: zaFlag
};

interface Currency {
  code: string;
  name: string;
  flag: string;
  rateToUsd: number; // For clean presentation conversion math
}

const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', flag: 'us', rateToUsd: 1.0 },
  { code: 'EUR', name: 'Euro', flag: 'eu', rateToUsd: 1.1723 },
  { code: 'GBP', name: 'British Pound', flag: 'gb', rateToUsd: 1.3575 },
  { code: 'JPY', name: 'Japanese Yen', flag: 'jp', rateToUsd: 0.0063 },
  { code: 'AUD', name: 'Australian Dollar', flag: 'au', rateToUsd: 0.7208 },
  { code: 'CAD', name: 'Canadian Dollar', flag: 'ca', rateToUsd: 0.7238 },
  { code: 'CHF', name: 'Swiss Franc', flag: 'ch', rateToUsd: 1.0991 },
  { code: 'RUB', name: 'Russian Ruble', flag: 'ru', rateToUsd: 0.0105 },
  { code: 'TRY', name: 'Turkish Lira', flag: 'tr', rateToUsd: 0.0294 },
  { code: 'CNY', name: 'Chinese Yuan', flag: 'cn', rateToUsd: 0.1378 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', flag: 'ua', rateToUsd: 0.0242 },
];

export default function App() {
  // UI presentation states
  const [sendAmount, setSendAmount] = useState<string>('1,000');
  const [sendCurrency, setSendCurrency] = useState<Currency>(CURRENCIES[0]); // USD
  const [receiveCurrency, setReceiveCurrency] = useState<Currency>(CURRENCIES[1]); // EUR
  const [isFavorited, setIsFavorited] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('HISTORY');
  const [activeTimeframe, setActiveTimeframe] = useState<string>('1M');
  const [showSendDropdown, setShowSendDropdown] = useState<boolean>(false);
  const [showReceiveDropdown, setShowReceiveDropdown] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sendDropdownRef = useRef<HTMLDivElement>(null);
  const receiveDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sendDropdownRef.current && !sendDropdownRef.current.contains(event.target as Node)) {
        setShowSendDropdown(false);
      }
      if (receiveDropdownRef.current && !receiveDropdownRef.current.contains(event.target as Node)) {
        setShowReceiveDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format currency with thousands separators
  const parseAmount = (val: string): number => {
    const clean = val.replace(/,/g, '');
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatAmount = (num: number): string => {
    if (num === 0) return '0';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  // Convert send value to receive value based on rates (interactive UI mockup helper)
  const currentRate = sendCurrency.rateToUsd / receiveCurrency.rateToUsd;
  const receiveAmountVal = parseAmount(sendAmount) * currentRate;
  const receiveAmountFormatted = formatAmount(receiveAmountVal);

  const handleSendAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep numbers and commas only
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setSendAmount(val);
  };

  const handleSendAmountBlur = () => {
    const parsed = parseAmount(sendAmount);
    setSendAmount(formatAmount(parsed));
  };

  const handleSwapCurrencies = () => {
    const temp = sendCurrency;
    setSendCurrency(receiveCurrency);
    setReceiveCurrency(temp);
    // Swap values based on new rate
    const parsedSend = parseAmount(sendAmount);
    const newSendAmount = parsedSend * (receiveCurrency.rateToUsd / sendCurrency.rateToUsd);
    setSendAmount(formatAmount(newSendAmount));
    triggerToast(`Swapped send and receive currencies!`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogConversion = () => {
    triggerToast(
      `Logged conversion: ${sendAmount} ${sendCurrency.code} → ${receiveAmountFormatted} ${receiveCurrency.code} at rate ${currentRate.toFixed(4)}`
    );
  };

  return (
    <div className="app-container" data-node-id="75:175">
      {/* Header component */}
      <header className="header" data-node-id="105:414">
        <div className="logo-container" data-node-id="100:52">
          <img src={logoIcon} className="logo-icon" alt="FX Checker" data-node-id="100:49" />
          <span className="logo-text">FX_CHECKER</span>
        </div>
        <div className="header-info" data-node-id="75:183">
          55 CURRENCIES · EOD · ECB DATA
        </div>
      </header>

      {/* Live markets ticker bar */}
      <section className="live-markets-bar" data-node-id="105:413">
        <div className="live-badge" data-node-id="75:415">
          <div className="live-badge-dot" data-node-id="75:416" />
          <span className="live-badge-text">LIVE MARKETS</span>
        </div>
        
        <div className="ticker-wrapper" data-node-id="75:407">
          <div className="ticker-item" data-node-id="75:408">
            <span className="ticker-pair">EUR/USD</span>
            <span className="ticker-value">1.1723</span>
            <span className="ticker-change down">▼ −0.14%</span>
          </div>
          <div className="ticker-item" data-node-id="75:410">
            <span className="ticker-pair">USD/JPY</span>
            <span className="ticker-value">157.91</span>
            <span className="ticker-change up">▲ +0.04%</span>
          </div>
          <div className="ticker-item" data-node-id="75:409">
            <span className="ticker-pair">GBP/USD</span>
            <span className="ticker-value">1.3575</span>
            <span className="ticker-change down">▼ −0.22%</span>
          </div>
          <div className="ticker-item" data-node-id="75:411">
            <span className="ticker-pair">USD/CHF</span>
            <span className="ticker-value">0.9098</span>
            <span className="ticker-change up">▲ +0.13%</span>
          </div>
          <div className="ticker-item" data-node-id="75:412">
            <span className="ticker-pair">EUR/GBP</span>
            <span className="ticker-value">0.8633</span>
            <span className="ticker-change up">▲ +0.11%</span>
          </div>
          <div className="ticker-item" data-node-id="75:413">
            <span className="ticker-pair">AUD/USD</span>
            <span className="ticker-value">0.7208</span>
            <span className="ticker-change up">▲ +0.08%</span>
          </div>
          <div className="ticker-item" data-node-id="75:414">
            <span className="ticker-pair">USD/CAD</span>
            <span className="ticker-value">1.3815</span>
            <span className="ticker-change up">▲ +0.04%</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="content-wrapper" data-node-id="75:418">
        <div className="converter-section">
          <h1 className="section-heading" data-node-id="75:420">CHECK THE RATE</h1>
          
          <div className="converter-card" data-node-id="75:423">
            <div className="converter-top" data-node-id="75:424">
              
              {/* Send amount box */}
              <div className="converter-box" data-node-id="75:425">
                <p className="converter-label" data-node-id="75:427">SEND</p>
                <div className="converter-row" data-node-id="75:429">
                  <div className="amount-input-wrapper">
                    <input
                      type="text"
                      className="amount-input"
                      value={sendAmount}
                      onChange={handleSendAmountChange}
                      onBlur={handleSendAmountBlur}
                      aria-label="Send amount"
                    />
                    <div className="amount-underline" />
                  </div>
                  
                  {/* Currency selector send */}
                  <div style={{ position: 'relative' }} ref={sendDropdownRef}>
                    <button
                      className="currency-button"
                      onClick={() => setShowSendDropdown(!showSendDropdown)}
                      aria-haspopup="listbox"
                      aria-expanded={showSendDropdown}
                      data-node-id="184:1939"
                    >
                      <img src={flagMap[sendCurrency.flag]} className="flag-icon" alt="" />
                      <span className="currency-text">{sendCurrency.code}</span>
                      <img src={chevronDownIcon} className="chevron-down" alt="" />
                    </button>
                    {showSendDropdown && (
                      <div className="dropdown-overlay" role="listbox">
                        {CURRENCIES.map((cur) => (
                          <div
                            key={`send-${cur.code}`}
                            className="dropdown-item"
                            onClick={() => {
                              setSendCurrency(cur);
                              setShowSendDropdown(false);
                            }}
                            role="option"
                            aria-selected={sendCurrency.code === cur.code}
                          >
                            <img src={flagMap[cur.flag]} className="flag-icon" alt="" />
                            <span>{cur.code}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="swap-button-container">
                <button
                  className="swap-button"
                  onClick={handleSwapCurrencies}
                  aria-label="Swap currencies"
                  data-node-id="184:2022"
                >
                  <img src={exchangeIcon} className="swap-icon" alt="" />
                </button>
              </div>

              {/* Receive amount box */}
              <div className="converter-box" data-node-id="75:441">
                <p className="converter-label" data-node-id="75:443">RECEIVE</p>
                <div className="converter-row" data-node-id="75:445">
                  <div className="amount-input-wrapper">
                    <input
                      type="text"
                      className="amount-input receive-amount"
                      value={receiveAmountFormatted}
                      readOnly
                      aria-label="Receive amount"
                    />
                    <div className="amount-underline" />
                  </div>

                  {/* Currency selector receive */}
                  <div style={{ position: 'relative' }} ref={receiveDropdownRef}>
                    <button
                      className="currency-button"
                      onClick={() => setShowReceiveDropdown(!showReceiveDropdown)}
                      aria-haspopup="listbox"
                      aria-expanded={showReceiveDropdown}
                      data-node-id="184:1973"
                    >
                      <img src={flagMap[receiveCurrency.flag]} className="flag-icon" alt="" />
                      <span className="currency-text">{receiveCurrency.code}</span>
                      <img src={chevronDownIcon} className="chevron-down" alt="" />
                    </button>
                    {showReceiveDropdown && (
                      <div className="dropdown-overlay" role="listbox">
                        {CURRENCIES.map((cur) => (
                          <div
                            key={`receive-${cur.code}`}
                            className="dropdown-item"
                            onClick={() => {
                              setReceiveCurrency(cur);
                              setShowReceiveDropdown(false);
                            }}
                            role="option"
                            aria-selected={receiveCurrency.code === cur.code}
                          >
                            <img src={flagMap[cur.flag]} className="flag-icon" alt="" />
                            <span>{cur.code}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom info row */}
            <div className="converter-bottom" data-node-id="75:466">
              <p className="rate-info-text" data-node-id="75:471">
                1 {sendCurrency.code} = {currentRate.toFixed(4)} {receiveCurrency.code}
              </p>
              
              <div className="converter-actions">
                {/* FAVORITED togglable button */}
                <button
                  className={`action-button ${isFavorited ? 'primary' : 'secondary'}`}
                  onClick={() => {
                    setIsFavorited(!isFavorited);
                    triggerToast(isFavorited ? 'Removed from favorites!' : 'Added to favorites!');
                  }}
                  data-node-id="171:742"
                >
                  <img src={isFavorited ? starFilledIcon : starIcon} className="star-icon" alt="" />
                  <span>{isFavorited ? 'FAVORITED' : 'FAVORITE'}</span>
                </button>
                
                {/* LOG CONVERSION button */}
                <button
                  className="action-button outline"
                  onClick={handleLogConversion}
                  data-node-id="178:1345"
                >
                  LOG CONVERSION
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Details and Tabs Container */}
        <div className="details-container" data-node-id="75:477">
          
          {/* Tabs header bar */}
          <div className="tabs-row" data-node-id="151:2466">
            <button
              className={`tab-button ${activeTab === 'HISTORY' ? 'active' : ''}`}
              onClick={() => setActiveTab('HISTORY')}
            >
              HISTORY
              {activeTab === 'HISTORY' && <div className="tab-underline" />}
            </button>
            <button
              className={`tab-button ${activeTab === 'COMPARE' ? 'active' : ''}`}
              onClick={() => setActiveTab('COMPARE')}
            >
              COMPARE
              {activeTab === 'COMPARE' && <div className="tab-underline" />}
            </button>
            <button
              className={`tab-button ${activeTab === 'FAVORITES' ? 'active' : ''}`}
              onClick={() => setActiveTab('FAVORITES')}
            >
              FAVORITES
              <div className="tab-badge">10</div>
              {activeTab === 'FAVORITES' && <div className="tab-underline" />}
            </button>
            <button
              className={`tab-button ${activeTab === 'LOG' ? 'active' : ''}`}
              onClick={() => setActiveTab('LOG')}
            >
              LOG
              <div className="tab-badge">8</div>
              {activeTab === 'LOG' && <div className="tab-underline" />}
            </button>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'HISTORY' && (
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
                    {sendCurrency.code}/{receiveCurrency.code}
                  </h2>
                  <p className="chart-meta">
                    {currentRate.toFixed(4)} · MAY 14 16:00 CET
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
                      <img src={chartGrid} className="chart-grid-svg" alt="" />
                      <img src={chartLine} className="chart-line-svg" alt="" />
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
            </>
          )}

          {activeTab === 'COMPARE' && (
            <div style={{ padding: '40px 0', textAlign: 'center', opacity: 0.7 }}>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>Compare Markets</p>
              <p style={{ fontSize: '14px', color: 'var(--color-neutral-200)' }}>Select multiple target currencies to compare exchange rates simultaneously.</p>
            </div>
          )}

          {activeTab === 'FAVORITES' && (
            <div style={{ padding: '40px 0', textAlign: 'center', opacity: 0.7 }}>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>Favorites</p>
              <p style={{ fontSize: '14px', color: 'var(--color-neutral-200)' }}>You currently have 10 favorited rates saved in your user account.</p>
            </div>
          )}

          {activeTab === 'LOG' && (
            <div style={{ padding: '40px 0', textAlign: 'center', opacity: 0.7 }}>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>Conversion Log</p>
              <p style={{ fontSize: '14px', color: 'var(--color-neutral-200)' }}>Review your conversion history logs, tracking the last 8 entries.</p>
            </div>
          )}

        </div>

      </main>

      {/* Dynamic presentation notification toast */}
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
