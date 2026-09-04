import { useLog } from '../context/LogContext';
import { formatRelativeTime } from '../helpers';

export default function Log() {
  const { logs, removeLog } = useLog();

  return logs.length === 0 ? (
    <div className="empty-state">
      <p className="empty-state-title">NO CONVERSIONS YET</p>

      <p className="empty-state-description">
        Your conversion history will appear here.
      </p>
    </div>
  ) : (
    <div className="log-panel">
      <div className="panel-header">
        <h2 className="panel-title">CONVERSION LOG</h2>

        <div className="log-header-right">
          <span className="panel-count">{logs.length} LOGGED</span>

          {logs.length > 0 && (
            <button className="clear-log-button">CLEAR ALL</button>
          )}
        </div>
      </div>
      <div className="log-list">
        {logs.map((log) => (
          <div key={log.id} className="log-row">
            <span className="log-time">
              {formatRelativeTime(new Date(log.timestamp).getTime())}
            </span>

            <span className="log-pair">
              {log.pair.base}
              <span>→</span>
              {log.pair.quote}
            </span>

            <div className="log-amount">
              <span>{log.amount.sendAmount}</span>
              <span className="log-result">{log.amount.reciveAmount}</span>
            </div>

            <button
              className="log-remove"
              onClick={() => removeLog(log.id)}
              aria-label="Remove log"
            >
              ♧
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
