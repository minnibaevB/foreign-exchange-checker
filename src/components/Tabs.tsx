import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type ReactNode,
} from 'react';

export const TAB_VALUES = {
  HISTORY: 'history',
  COMPARE: 'compare',
  FAVORITES: 'favorites',
  LOG: 'log',
} as const;

type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];

type TabProps = {
  value: TabValue;
  children: ReactNode;
  active?: boolean;
  title: string;
};

type TabsProps = {
  activeValue: string;
  children: ReactNode;
  onChange: (value: string) => void;
};

export function Tabs({ activeValue, onChange, children }: TabsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = Children.toArray(children).filter((child) =>
    isValidElement<TabProps>(child),
  );

  const activeTab = tabs.find(
    (tab) => isValidElement<TabProps>(tab) && tab.props.value === activeValue,
  );

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="tabs-container">
      {/* Desktop */}
      <div className="tabs-row">
        {Children.map(children, (child) => {
          if (!isValidElement<TabProps>(child)) {
            return child;
          }

          return (
            <button
              type="button"
              role="tab"
              className={`tab-button ${
                child.props.value === activeValue ? 'active' : ''
              }`}
              onClick={() => onChange(child.props.value)}
            >
              {child.props.title}

              {child.props.value === activeValue && (
                <div className="tab-underline" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="tabs-mobile">
        <button
          type="button"
          className={`tabs-mobile-trigger ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          <span>{activeTab?.props.title}</span>

          <span className={`tabs-mobile-chevron ${isOpen ? 'open' : ''}`}>
            ⌄
          </span>
        </button>

        {isOpen && (
          <div className="tabs-mobile-menu">
            {tabs.map((tab) => {
              if (!isValidElement<TabProps>(tab)) {
                return null;
              }

              const isActive = tab.props.value === activeValue;

              return (
                <button
                  key={tab.props.value}
                  type="button"
                  className={`tabs-mobile-option ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelect(tab.props.value)}
                >
                  {tab.props.title}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Active tab content */}
      {Children.map(children, (child) => {
        if (!isValidElement<TabProps>(child)) {
          return child;
        }

        return cloneElement(child, {
          active: child.props.value === activeValue,
        });
      })}
    </div>
  );
}

export function Tab({ children, active = false }: TabProps) {
  if (active) {
    return children;
  }

  return null;
}
