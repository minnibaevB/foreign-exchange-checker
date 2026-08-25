import { useState, useEffect, useRef } from 'react';
import starIcon from '../assets/images/icon-star.svg';
import starFilledIcon from '../assets/images/icon-star-filled.svg';
import chevronDownIcon from '../assets/images/icon-chevron-down.svg';
import exchangeIcon from '../assets/images/icon-exchange.svg';

interface Currency {
  code: string;
  name: string;
  flag: string;
  rateToUsd: number; // For clean presentation conversion math
}

import { flagMap } from '../mock';

export default function Converter() {
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
  // UI presentation states
  const [sendAmount, setSendAmount] = useState<string>('1,000');
  const [sendCurrency, setSendCurrency] = useState<Currency>(CURRENCIES[0]); // USD
  const [receiveCurrency, setReceiveCurrency] = useState<Currency>(
    CURRENCIES[1],
  ); // EUR
  const [isFavorited, setIsFavorited] = useState<boolean>(true);
  const [showSendDropdown, setShowSendDropdown] = useState<boolean>(false);
  const [showReceiveDropdown, setShowReceiveDropdown] =
    useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sendDropdownRef = useRef<HTMLDivElement>(null);
  const receiveDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sendDropdownRef.current &&
        !sendDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSendDropdown(false);
      }
      if (
        receiveDropdownRef.current &&
        !receiveDropdownRef.current.contains(event.target as Node)
      ) {
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
      maximumFractionDigits: 2,
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
    const newSendAmount =
      parsedSend * (receiveCurrency.rateToUsd / sendCurrency.rateToUsd);
    setSendAmount(formatAmount(newSendAmount));
    triggerToast(`Swapped send and receive currencies!`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogConversion = () => {
    triggerToast(
      `Logged conversion: ${sendAmount} ${sendCurrency.code} → ${receiveAmountFormatted} ${receiveCurrency.code} at rate ${currentRate.toFixed(4)}`,
    );
  };

  return (
    <div className="converter-section">
      <h1 className="section-heading" data-node-id="75:420">
        CHECK THE RATE
      </h1>

      <div className="converter-card" data-node-id="75:423">
        <div className="converter-top" data-node-id="75:424">
          {/* Send amount box */}
          <div className="converter-box" data-node-id="75:425">
            <p className="converter-label" data-node-id="75:427">
              SEND
            </p>
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
                  <img
                    src={flagMap[sendCurrency.flag]}
                    className="flag-icon"
                    alt=""
                  />
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
                        <img
                          src={flagMap[cur.flag]}
                          className="flag-icon"
                          alt=""
                        />
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
            <p className="converter-label" data-node-id="75:443">
              RECEIVE
            </p>
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
                  <img
                    src={flagMap[receiveCurrency.flag]}
                    className="flag-icon"
                    alt=""
                  />
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
                        <img
                          src={flagMap[cur.flag]}
                          className="flag-icon"
                          alt=""
                        />
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
            1 {sendCurrency.code} = {currentRate.toFixed(4)}{' '}
            {receiveCurrency.code}
          </p>

          <div className="converter-actions">
            {/* FAVORITED togglable button */}
            <button
              className={`action-button ${isFavorited ? 'primary' : 'secondary'}`}
              onClick={() => {
                setIsFavorited(!isFavorited);
                triggerToast(
                  isFavorited
                    ? 'Removed from favorites!'
                    : 'Added to favorites!',
                );
              }}
              data-node-id="171:742"
            >
              <img
                src={isFavorited ? starFilledIcon : starIcon}
                className="star-icon"
                alt=""
              />
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
      {/* Dynamic presentation notification toast */}
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}
    </div>
  );
}
