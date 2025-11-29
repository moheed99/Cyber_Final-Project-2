import React, { useState, useEffect } from 'react';
import { Play, Download, Activity } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { PortResult, LogEntry } from '../types';
import { COMMON_PORTS } from '../constants';

interface ScannerProps {
  onLog: (entry: LogEntry) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onLog }) => {
  const [target, setTarget] = useState('192.168.1.10');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<PortResult[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (scanning) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setScanning(false);
            onLog({
              timestamp: new Date().toISOString(),
              module: 'Port Scanner',
              action: 'Scan Completed',
              details: `Scanned ${target}. Found ${results.length} open ports.`,
              user: '22I-7451'
            });
            return 100;
          }
          // Simulate finding a port occasionally
          if (Math.random() > 0.85) {
            const randomPort = COMMON_PORTS[Math.floor(Math.random() * COMMON_PORTS.length)];
            setResults(current => {
              if (current.find(p => p.port === randomPort.port)) return current;
              return [...current, {
                port: randomPort.port,
                service: randomPort.service,
                status: 'OPEN',
                banner: `PayBuddy Service v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 9)}`
              }];
            });
          }
          return prev + 1;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [scanning, target, results, onLog]);

  const startScan = () => {
    setScanning(true);
    setProgress(0);
    setResults([]);
    onLog({
      timestamp: new Date().toISOString(),
      module: 'Port Scanner',
      action: 'Scan Started',
      details: `Target: ${target}`,
      user: '22I-7451'
    });
  };

  const downloadReport = () => {
    const reportData = {
      target: target,
      scan_date: new Date().toISOString(),
      tool: "PayBuddy Port Scanner v1.0",
      open_ports: results
    };
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `scan_22I-7451_Moheed.json`; // Using reg format as requested
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    onLog({
      timestamp: new Date().toISOString(),
      module: 'Port Scanner',
      action: 'Report Downloaded',
      details: exportFileDefaultName,
      user: '22I-7451'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Scan Configuration" className="md:col-span-1 h-fit">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Target IP / Host</label>
              <input 
                type="text" 
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={startScan} 
                disabled={scanning} 
                className="flex-1"
                icon={scanning ? <Activity className="animate-spin" size={16}/> : <Play size={16}/>}
              >
                {scanning ? 'Scanning...' : 'Start Scan'}
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Live Scan Results" className="md:col-span-2">
          {scanning && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Scanning {target}...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="uppercase tracking-wider border-b border-slate-700 bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Port</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Banner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 font-mono">
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      {scanning ? 'Probing ports...' : 'No results. Start a scan.'}
                    </td>
                  </tr>
                ) : (
                  results.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-700/50 transition-colors animate-in fade-in slide-in-from-left-2">
                      <td className="px-4 py-3 text-emerald-400">{r.port}</td>
                      <td className="px-4 py-3 text-slate-200">{r.service}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/50 text-green-300 border border-green-800">
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 truncate max-w-xs">{r.banner}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {results.length > 0 && !scanning && (
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={downloadReport} icon={<Download size={16} />}>
                Download JSON Report
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};