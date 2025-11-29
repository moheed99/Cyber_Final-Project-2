import React, { useState, useEffect, useRef } from 'react';
import { Globe, Search, Download, Folder, Layout, AlertCircle } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { LogEntry, DiscoveryResult } from '../types';
import { WORDLIST } from '../constants';

interface WebDiscoveryProps {
  onLog: (entry: LogEntry) => void;
}

export const WebDiscovery: React.FC<WebDiscoveryProps> = ({ onLog }) => {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [currentProbe, setCurrentProbe] = useState('');
  const [progress, setProgress] = useState(0);
  const scanInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScan = () => {
    setScanning(true);
    setResults([]);
    setProgress(0);
    onLog({
      timestamp: new Date().toISOString(),
      module: 'Web Discovery',
      action: 'Scan Started',
      details: 'Started directory and subdomain enumeration',
      user: '22I-7451'
    });

    let index = 0;
    const totalChecks = WORDLIST.length * 2; // Directory and Subdomain for each

    scanInterval.current = setInterval(() => {
      if (index >= WORDLIST.length) {
        if (scanInterval.current) clearInterval(scanInterval.current);
        setScanning(false);
        setCurrentProbe('Complete');
        onLog({
            timestamp: new Date().toISOString(),
            module: 'Web Discovery',
            action: 'Scan Completed',
            details: `Found ${results.length} exposed assets.`,
            user: '22I-7451'
        });
        return;
      }

      const word = WORDLIST[index];
      setCurrentProbe(word);
      setProgress(Math.floor(((index + 1) / WORDLIST.length) * 100));

      // Simulate logic
      const isDir = Math.random() > 0.6;
      const isSub = Math.random() > 0.8;

      if (isDir) {
        const status = Math.random() > 0.7 ? 200 : 403;
        setResults(prev => [...prev, { type: 'Directory', path: `/${word}`, status }]);
      }
      if (isSub) {
         setResults(prev => [...prev, { type: 'Subdomain', path: `${word}.paybuddy.io`, status: 200 }]);
      }

      index++;
    }, 200);
  };

  const downloadReport = () => {
    const report = {
      target: "paybuddy.io",
      tool: "WebDiscovery.py (Simulated)",
      findings: results
    };
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `footprint_22I-7451_Moheed.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    onLog({
        timestamp: new Date().toISOString(),
        module: 'Web Discovery',
        action: 'Report Downloaded',
        details: exportFileDefaultName,
        user: '22I-7451'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Discovery Config" className="md:col-span-1 h-fit">
            <div className="space-y-4">
                <div className="bg-slate-900 p-3 rounded border border-slate-700 font-mono text-xs text-slate-400">
                    <p>Wordlist loaded: common.txt ({WORDLIST.length} entries)</p>
                    <p>Threads: 10</p>
                    <p>Timeout: 5s</p>
                </div>
                <Button 
                    onClick={startScan} 
                    disabled={scanning} 
                    className="w-full"
                    icon={scanning ? <Search className="animate-spin" size={16}/> : <Globe size={16}/>}
                >
                    {scanning ? 'Enumerating...' : 'Start Discovery'}
                </Button>
                {scanning && (
                    <div className="text-center font-mono text-xs text-emerald-400">
                        Probing: {currentProbe}
                    </div>
                )}
            </div>
        </Card>

        <Card title="Discovered Assets" className="md:col-span-2">
            {scanning && (
                <div className="w-full bg-slate-700 rounded-full h-1 mb-4">
                  <div className="bg-emerald-500 h-1 rounded-full transition-all" style={{width: `${progress}%`}}></div>
                </div>
            )}
            <div className="space-y-2 h-[300px] overflow-y-auto pr-2">
                {results.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-700 hover:bg-slate-700/50 transition-colors animate-in slide-in-from-left-2">
                        <div className="flex items-center gap-3">
                            {r.type === 'Directory' ? <Folder size={16} className="text-yellow-400"/> : <Layout size={16} className="text-blue-400"/>}
                            <span className="font-mono text-sm text-slate-200">{r.path}</span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${r.status === 200 ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
                            HTTP {r.status}
                        </span>
                    </div>
                ))}
                {results.length === 0 && !scanning && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                        <AlertCircle size={32} opacity={0.5} />
                        <p>No assets found. Start a scan.</p>
                    </div>
                )}
            </div>
            {results.length > 0 && !scanning && (
             <div className="mt-4 flex justify-end">
               <Button variant="outline" onClick={downloadReport} icon={<Download size={16} />}>
                 Download JSON
               </Button>
             </div>
            )}
        </Card>
      </div>
    </div>
  );
};