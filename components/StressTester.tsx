import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Hand, Download, ServerCrash, Activity } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { LogEntry } from '../types';

interface StressTesterProps {
  onLog: (entry: LogEntry) => void;
}

export const StressTester: React.FC<StressTesterProps> = ({ onLog }) => {
  const [active, setActive] = useState(false);
  const [clients, setClients] = useState(200);
  const [data, setData] = useState<{ time: string; latency: number; requests: number }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleAttack = () => {
    if (active) {
      setActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      onLog({
        timestamp: new Date().toISOString(),
        module: 'Stress Test',
        action: 'Attack Stopped',
        details: `Stopped DOS simulation on target with ${clients} clients.`,
        user: '22I-2285'
      });
    } else {
      setActive(true);
      setData([]);
      onLog({
        timestamp: new Date().toISOString(),
        module: 'Stress Test',
        action: 'Attack Started',
        details: `Started DOS simulation. Clients: ${clients}`,
        user: '22I-2285'
      });
    }
  };

  useEffect(() => {
    if (active) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        
        // Simulate latency spike as time goes on and load increases
        const baseLatency = 50;
        const randomSpike = Math.random() * (clients / 1.5);
        const drift = data.length * 3; 
        const newLatency = baseLatency + randomSpike + drift;

        setData(prev => {
          const newData = [...prev, { 
            time: timeStr, 
            latency: Math.floor(newLatency), 
            requests: Math.floor(clients + (Math.random() * 50)) 
          }];
          if (newData.length > 30) newData.shift();
          return newData;
        });
      }, 800);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, clients, data.length]);

  const downloadReport = () => {
    const report = {
      test_type: "DOS / Stress Test",
      target_clients: clients,
      duration_seconds: data.length,
      metrics: data
    };
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `stress_023_AliRaza.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    onLog({
      timestamp: new Date().toISOString(),
      module: 'Stress Test',
      action: 'Report Downloaded',
      details: exportFileDefaultName,
      user: '22I-2285'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="LOIC Control Panel" className="md:col-span-1 h-fit">
          <div className="space-y-4">
            <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-md animate-pulse">
                <div className="flex items-center gap-2 text-red-500 mb-2 font-bold uppercase tracking-wider text-xs">
                    <ServerCrash size={16} />
                    High Impact Warning
                </div>
                <p className="text-[10px] text-red-300/80 font-mono">
                    Authorized stress testing only. This module simulates Layer 7 HTTP floods.
                </p>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Threads</label>
              <div className="relative">
                <input 
                    type="number" 
                    min="200"
                    value={clients}
                    onChange={(e) => setClients(Number(e.target.value))}
                    className="w-full bg-black/50 border border-slate-700 rounded-md px-4 py-3 text-emerald-400 font-mono text-lg focus:ring-red-500 focus:border-red-500"
                />
                <span className="absolute right-3 top-4 text-xs text-slate-600 font-mono">THREADS</span>
              </div>
            </div>
            
            <Button 
              onClick={toggleAttack} 
              variant={active ? "danger" : "primary"}
              className={`w-full py-4 font-bold tracking-widest ${active ? 'animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'shadow-lg'}`}
              icon={active ? <Hand size={18}/> : <Zap size={18}/>}
            >
              {active ? 'TERMINATE ATTACK' : 'INITIATE FLOOD'}
            </Button>
          </div>
        </Card>

        <Card title="Server Latency Telemetry (ms)" className="md:col-span-3 h-[450px]">
          <div className="h-full w-full p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                    dataKey="time" 
                    stroke="#475569" 
                    fontSize={10} 
                    tick={{fill: '#64748b'}} 
                    tickMargin={10}
                />
                <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    tick={{fill: '#64748b'}} 
                    domain={[0, 'auto']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#ef4444', color: '#f1f5f9', borderRadius: '4px' }}
                  itemStyle={{ color: '#fca5a5', fontFamily: 'monospace' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#f43f5e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorLatency)" 
                  animationDuration={300}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {data.length > 0 && !active && (
             <div className="absolute top-6 right-6">
               <Button variant="outline" onClick={downloadReport} icon={<Download size={14} />} className="text-xs h-8">
                 Export Logs
               </Button>
             </div>
          )}
        </Card>
      </div>
    </div>
  );
};