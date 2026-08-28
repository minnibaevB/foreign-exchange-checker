import { useRef, useEffect, useState } from 'react';
import { flagMap, currencies } from '../mock';
import chevronDownIcon from '../assets/images/icon-chevron-down.svg';

interface PickerProps {
  currency: string;
  onChange: (currency: string) => void;
}

export default function Picker({ currency, onChange }: PickerProps) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);
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

  return (
    <div className="currency-picker" ref={pickerRef}>
      <button
        className="currency-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <img src={flagMap[currency]} className="flag-icon" alt="" />
        <img src={chevronDownIcon} className="chevron-down" alt="" />
      </button>
      {showDropdown && (
        <div className="dropdown-overlay" role="listbox">
          {currencies.map((cur: any, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => {
                onChange(cur);
                setShowDropdown(false);
              }}
              role="option"
            >
              <img src={flagMap[cur]} className="flag-icon" alt="" />
              <span>{cur.code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
