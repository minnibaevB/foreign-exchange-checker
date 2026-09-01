import { useEffect, useState } from 'react';
import starIcon from '../assets/images/icon-star.svg';
import starFilledIcon from '../assets/images/icon-star-filled.svg';
import exchangeIcon from '../assets/images/icon-exchange.svg';
import Picker from './Picker';
import { useCurrency, useRates } from '../context/RatesContext';
import { formatAmount, parseAmount } from '../helpers';

export default function Converter() {
  // UI presentation states
  const { currency, setCurrency } = useCurrency();
  const currencyRates = useRates();
  const [sendAmount, setSendAmount] = useState<string>('1000');
  const [reciveAmount, setReciveAmount] = useState<string>('0');
  const [currentRate, setcurrentRate] = useState<number | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currencyRates) {
      const { rate } = currencyRates[currencyRates.length - 1];
      setcurrentRate(rate);
      setReciveAmount(formatAmount(parseAmount(sendAmount) * rate));
    }
  }, [currencyRates]);

  const handleSendAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep numbers and commas only
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setSendAmount(val);
    setReciveAmount(formatAmount(parseAmount(val) * (currentRate ?? 1)));
  };

  const handleSendAmountBlur = () => {
    const parsed = parseAmount(sendAmount);
    setSendAmount(formatAmount(parsed));
  };

  const handleSwapCurrencies = () => {
    //change base and quotes
    const previousSendAmount = sendAmount;
    setSendAmount(formatAmount(parseAmount(reciveAmount), 0));
    setReciveAmount(previousSendAmount);
    setCurrency({ base: currency.quotes, quotes: currency.base });
    triggerToast(`Swapped send and receive currencies!`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogConversion = () => {
    triggerToast(
      `Logged conversion: ${sendAmount}  → ${formatAmount(parseAmount(reciveAmount))} at rate ${currentRate?.toFixed(4)}`,
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
                  name="amount"
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
              <Picker
                currency={currency.base}
                onChange={(currencyBase) =>
                  setCurrency({
                    ...currency,
                    base: currencyBase,
                  })
                }
              />
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
                  name="amount"
                  type="text"
                  className="amount-input receive-amount"
                  value={reciveAmount}
                  readOnly
                  aria-label="Receive amount"
                />
                <div className="amount-underline" />
              </div>

              {/* Currency selector receive */}
              <Picker
                currency={currency.quotes}
                onChange={(currencyQuotes) =>
                  setCurrency({
                    ...currency,
                    quotes: currencyQuotes,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Bottom info row */}
        <div className="converter-bottom" data-node-id="75:466">
          <p className="rate-info-text" data-node-id="75:471">
            1 {currency.base} = {formatAmount(currentRate, 4)} {currency.quotes}
          </p>

          <div className="converter-actions">
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
