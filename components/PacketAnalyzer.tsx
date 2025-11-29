import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Pause, Play, Download, Network } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { LogEntry, PacketData } from '../types';

interface PacketAnalyzerProps {
  onLog: (entry: LogEntry) => void;
}

export const PacketAnalyzer: React.FC<PacketAnalyzerProps> = ({ onLog }) => {
  const [capturing, setCapturing] = useState(false);
  const [packets, setPackets] = useState<PacketData[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (capturing) {
        interval = setInterval(() => {
            const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'TLSv1.2'];
            const ips = ['192.168.1.10', '192.168.1.55', '10.0.0.1', '172.16.0.5'];
            
            const newPacket: PacketData = {
                id: Date.now(),
                time: new Date().toLocaleTimeString(),
                source: ips[Math.floor(Math.random() * ips.length)],
                destination: ips[Math.floor(Math.random() * ips.length)],
                protocol: protocols[Math.floor(Math.random() * protocols.length)],
                length: Math.floor(Math.random() * 1500),
                info: `Seq=${Math.floor(Math.random()*1000)} Ack=${Math.floor(Math.random()*1000)} Win=512 Len=${Math.floor(Math.random()*100)}`
            };

            setPackets(prev => {
                const updated = [...prev, newPacket];
                if (updated.length > 100) updated.shift(); // Keep buffer small
                return updated;
            });

            // Auto-scroll
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }

        }, 400);
    }
    return () => clearInterval(interval);
  }, [capturing]);

  const toggleCapture = () => {
      if (capturing) {
          setCapturing(false);
          onLog({
              timestamp: new Date().toISOString(),
              module: 'Packet Analyzer',
              action: 'Capture Stopped',
              details: `Captured ${packets.length} packets.`,
              user: '22I-2285'
          });
      } else {
          setCapturing(true);
          setPackets([]);
          onLog({
              timestamp: new Date().toISOString(),
              module: 'Packet Analyzer',
              action: 'Capture Started',
              details: 'Started promiscuous mode on eth0',
              user: '22I-2285'
          });
      }
  };

  const downloadPcap = () => {
    const report = {
      interface: "eth0",
      capture_time: new Date().toISOString(),
      tool: "PyShark Wrapper",
      packets: packets
    };
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `capture_22I-2285_AliAbbas.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    onLog({
        timestamp: new Date().toISOString(),
        module: 'Packet Analyzer',
        action: 'PCAP Exported',
        details: exportFileDefaultName,
        user: '22I-2285'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card title="Interface Control" className="md:col-span-1 h-fit">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-emerald-400 bg-emerald-900/20 p-3 rounded border border-emerald-900/50">
                        <Network />
                        <div>
                            <div className="text-sm font-bold">eth0</div>
                            <div className="text-xs text-emerald-200/60">Promiscuous Mode</div>
                        </div>
                    </div>
                    <Button 
                        onClick={toggleCapture} 
                        variant={capturing ? "danger" : "primary"}
                        className="w-full"
                        icon={capturing ? <Pause size={16}/> : <Play size={16}/>}
                    >
                        {capturing ? 'Stop Capture' : 'Start Capture'}
                    </Button>
                </div>
            </Card>

            <Card title="Live Traffic Feed" className="md:col-span-3">
                <div 
                    ref={scrollRef}
                    className="h-[400px] overflow-y-auto bg-black rounded border border-slate-700 font-mono text-xs"
                >
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-800 text-slate-300 sticky top-0">
                            <tr>
                                <th className="p-2 border-b border-slate-700">Time</th>
                                <th className="p-2 border-b border-slate-700">Source</th>
                                <th className="p-2 border-b border-slate-700">Destination</th>
                                <th className="p-2 border-b border-slate-700">Protocol</th>
                                <th className="p-2 border-b border-slate-700">Info</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-400">
                            {packets.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-600">
                                        Interface idle. Start capture to view traffic.
                                    </td>
                                </tr>
                            ) : (
                                packets.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-900">
                                        <td className="p-2 whitespace-nowrap">{p.time}</td>
                                        <td className="p-2 text-blue-400">{p.source}</td>
                                        <td className="p-2 text-indigo-400">{p.destination}</td>
                                        <td className="p-2">
                                            <span className={`px-1 rounded ${p.protocol === 'HTTP' ? 'bg-green-900 text-green-300' : p.protocol === 'TCP' ? 'bg-slate-800 text-slate-300' : 'bg-orange-900 text-orange-300'}`}>
                                                {p.protocol}
                                            </span>
                                        </td>
                                        <td className="p-2 truncate max-w-[200px]">{p.info}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {packets.length > 0 && !capturing && (
                    <div className="mt-4 flex justify-end">
                        <Button variant="outline" onClick={downloadPcap} icon={<Download size={16} />}>
                            Save Evidence (JSON)
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    </div>
  );
};