import { useRef, useEffect, useState } from 'react';
import { flagMap, currencies, popularCurrencies, type Currency } from '../mock';
import chevronDownIcon from '../assets/images/icon-chevron-down.svg';
import searchIcon from '../assets/images/icon-search.svg';

interface PickerProps {
  currency: string;
  onChange: (currency: string) => void;
}

export default function Picker({ currency, onChange }: PickerProps) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const dropdownItemRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const renderedCurrencies = (currencies: Currency[]) => {
    return currencies.map((cur: Currency, index) => (
      <div
        key={index}
        className="dropdown-item"
        onClick={() => {
          onChange(cur.code);
          setShowDropdown(false);
        }}
        role="option"
        ref={cur.code === currency ? dropdownItemRef : null}
      >
        <img src={flagMap[cur.code]} className="flag-icon" alt="" />
        <span>{cur.code}</span>
        <span className="currency-name">{cur.name}</span>
        {cur.code === currency && <span className="selected-indicator">✓</span>}
      </div>
    ));
  };
  const filteredCurrencies = [...currencies, ...popularCurrencies].filter(
    (cur) =>
      cur.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cur.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showDropdown && dropdownItemRef.current) {
      dropdownItemRef.current.scrollIntoView({ block: 'center' });
    }

    if (!showDropdown) {
      setSearchTerm('');
    }
  }, [showDropdown]);

  return (
    <div className="currency-picker" ref={pickerRef}>
      <button
        className="currency-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <img src={flagMap[currency]} className="flag-icon" alt="" />
        <span className="currency-code">{currency}</span>
        <img src={chevronDownIcon} className="chevron-down" alt="" />
      </button>
      {showDropdown && (
        <div className="dropdown-overlay" role="listbox">
          <div className="dropdown-serarch">
            <img src={searchIcon} alt="Search" />
            <input
              name="search"
              type="text"
              placeholder="Search currency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && filteredCurrencies.length > 0 && (
            <div className="dropdown-group">
              <div className="dropdown-header">
                <h3 className="dropdown-title">SEARCH RESULTS</h3>
                <span className="dropdown-count">
                  {filteredCurrencies.length}
                </span>
              </div>
              {renderedCurrencies(filteredCurrencies)}
            </div>
          )}
          {!searchTerm && (
            <>
              <div className="dropdown-group">
                <div className="dropdown-header">
                  <h3 className="dropdown-title">POPULAR</h3>
                  <span className="dropdown-count">
                    {popularCurrencies.length}
                  </span>
                </div>
                {renderedCurrencies(popularCurrencies)}
              </div>
              <div className="dropdown-group">
                <div className="dropdown-header">
                  <h3 className="dropdown-title">OTHER CURRENCIES</h3>
                  <span className="dropdown-count">{currencies.length}</span>
                </div>
                {renderedCurrencies(currencies)}
              </div>
            </>
          )}
          {searchTerm && filteredCurrencies.length === 0 && (
            <div className="empty-state">
              <p className="empty-state-description">
                No currencies found for "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
