import { Children, cloneElement, isValidElement, type ReactNode } from 'react';

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
  return (
    <div className="tabs-container">
      <div className="tabs-row">
        {Children.map(children, (child) => {
          if (!isValidElement<TabProps>(child)) {
            return child;
          }
          return (
            <button
              type="button"
              role="tab"
              className={`tab-button ${child.props.value === activeValue ? 'active' : ''}`}
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
}
