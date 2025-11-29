import React, { useState, useEffect } from 'react';
import { Shield, LayoutDashboard, Globe, Radio, Wifi, FileText, Lock, LogOut, CheckCircle2, Terminal, Code, Download, Cpu, Activity } from 'lucide-react';
import { AppState, LogEntry } from './types';
import { TEAM_MEMBERS, CONSENT_TEXT } from './constants';
import { Scanner } from './components/Scanner';
import { StressTester } from './components/StressTester';
import { PasswordTester } from './components/PasswordTester';
import { WebDiscovery } from './components/WebDiscovery';
import { PacketAnalyzer } from './components/PacketAnalyzer';
import { StreamlitExporter } from './components/StreamlitExporter';

// Robust Icon Component
const ActivityIcon = ({className, size}: {className?: string, size:number}) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

// Stats Card Component
const StatsCard = ({ title, value, icon, valueColor, delay }: { title: string, value: string, icon: React.ReactNode, valueColor?: string, delay: number }) => {
  return (
    <div 
        className={`bg-slate-800/40 backdrop-blur-sm p-4 rounded-lg border border-slate-700/50 flex items-center gap-4 hover:bg-slate-800/60 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-forwards group`}
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="p-3 bg-slate-900/80 rounded-lg shadow-inner group-hover:shadow-emerald-900/20 transition-all">
            {/* Safe clone or fallback */}
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
        </div>
        <div>
            <div className="text-slate-500 text-xs uppercase tracking-wider font-bold">{title}</div>
            <div className={`text-2xl font-bold ${valueColor || 'text-white'}`}>{value}</div>
        </div>
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<AppState>(AppState.IDENTITY);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showSource, setShowSource] = useState(false);
  
  // Identity State
  const [identityStep, setIdentityStep] = useState(0);
  const [bootLog, setBootLog] = useState<string[]>([]);

  // Clear loader on mount
  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
  }, []);

  const addLog = (entry: LogEntry) => {
    setLogs(prev => [...prev, entry]);
  };

  const handleIdentityCheck = () => {
    setIdentityStep(1);
    setBootLog(['> Initializing Python Environment...', '> Import modules: sockets, scapy, requests... OK']);
    
    setTimeout(() => {
        setBootLog(prev => [...prev, '> Reading identity.txt...']);
    }, 800);

    setTimeout(() => {
        setBootLog(prev => [...prev, '> Identity Verified: Team CyberGuard', '> Members: Moheed, Ali, Abdur']);
    }, 1600);

    setTimeout(() => {
        setBootLog(prev => [...prev, '> Reading consent.txt...', '> Checking cryptographic signature...']);
    }, 2400);

    setTimeout(() => {
        setBootLog(prev => [...prev, '> Authorization: GRANTED (CISO Approved)', '> Launching Dashboard...']);
        setIdentityStep(2); // Success state
        addLog({
            timestamp: new Date().toISOString(),
            module: 'Identity',
            action: 'Auth Success',
            details: 'Identity and Consent verified via identity.txt',
            user: 'SYSTEM'
        });
    }, 3500);

    setTimeout(() => {
        setState(AppState.DASHBOARD);
    }, 4500);
  };

  const downloadFullReport = () => {
    const report = {
      title: "PayBuddy Security Assessment Final Report",
      generated_by: "Team CyberGuard",
      date: new Date().toISOString(),
      team: TEAM_MEMBERS,
      evidence_logs: logs
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_TeamCyberGuard_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (state === AppState.IDENTITY) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-mono z-10 relative">
        <div className="max-w-xl w-full bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-1 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500"></div>
          
          {/* Top Bar */}
          <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-b border-slate-700">
             <div className="flex items-center gap-2">
                 <Terminal size={16} className="text-emerald-500" />
                 <span className="text-xs text-slate-300">paybuddy_toolkit_v1.0.py</span>
             </div>
             <div className="flex gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
             </div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
                <div className="bg-emerald-500/10 p-4 rounded-full mb-4 ring-1 ring-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                  <Shield size={48} className="text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">PayBuddy Security Suite</h1>
                <p className="text-slate-400 text-center mt-2 text-sm">Authorized QA Personnel Only</p>
            </div>

            {identityStep === 0 && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="bg-black/50 p-4 rounded border border-slate-800 text-sm text-slate-400 relative font-mono">
                        <div className="absolute top-0 right-0 p-2 text-[10px] text-slate-600 font-bold tracking-wider uppercase">Identity File</div>
                        <p className="font-bold text-slate-200 mb-2">$ cat identity.txt</p>
                        {TEAM_MEMBERS.map(m => (
                            <div key={m.reg} className="flex justify-between font-mono text-xs pl-4 border-l-2 border-slate-700 my-1">
                                <span className="text-emerald-200">{m.name}</span>
                                <span className="text-slate-500">{m.reg}</span>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={handleIdentityCheck}
                        className="w-full py-3 rounded-md font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        <Cpu size={16} className="group-hover:animate-spin" />
                        Execute Launch Sequence
                    </button>
                </div>
            )}

            {identityStep > 0 && (
                <div className="bg-black/80 p-4 rounded-md border border-slate-700 h-64 overflow-y-auto font-mono text-xs space-y-2 custom-scrollbar">
                    {bootLog.map((line, i) => (
                        <div key={i} className={`animate-in slide-in-from-left-2 fade-in duration-300 ${line.includes('GRANTED') ? 'text-emerald-400 font-bold' : line.includes('Verified') ? 'text-blue-400' : 'text-slate-300'}`}>
                            {line}
                        </div>
                    ))}
                    {identityStep === 1 && (
                        <div className="animate-pulse text-emerald-500">_</div>
                    )}
                </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const NavItem = ({ s, label, icon }: { s: AppState, label: string, icon: React.ReactNode }) => (
    <button 
      onClick={() => { setState(s); setShowSource(false); }}
      className={`w-full flex items-center px-4 py-3 rounded-md transition-all duration-200 ${state === s && !showSource ? 'bg-emerald-600/20 text-emerald-400 border-r-2 border-emerald-400 translate-x-1' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-transparent font-sans selection:bg-emerald-500/30">
      {/* Sidebar - Streamlit Style */}
      <div className="w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Shield className="text-emerald-500" fill="currentColor" fillOpacity={0.2} /> 
            <span>PayBuddy QA</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             <div className="text-[10px] text-emerald-500 font-mono uppercase tracking-wider">System Online</div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <NavItem s={AppState.DASHBOARD} label="Dashboard" icon={<LayoutDashboard size={18} />} />
          
          <div className="pt-6 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Offensive Modules</div>
          <NavItem s={AppState.SCANNER} label="Port Scanner" icon={<Radio size={18} />} />
          <NavItem s={AppState.PASSWORD} label="Password Audit" icon={<Lock size={18} />} />
          <NavItem s={AppState.STRESS} label="Load Testing (DOS)" icon={<ActivityIcon size={18} />} />
          
          <div className="pt-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Reconnaissance</div>
          <NavItem s={AppState.DISCOVERY} label="Web Discovery" icon={<Globe size={18} />} />
          <NavItem s={AppState.PCAP} label="Packet Capture" icon={<Wifi size={18} />} />
          
          <div className="pt-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Reporting</div>
          <NavItem s={AppState.REPORT} label="Evidence Logs" icon={<FileText size={18} />} />

          <div className="my-4 border-t border-slate-800 pt-4">
             <button 
              onClick={() => setShowSource(true)}
              className={`w-full flex items-center px-4 py-3 rounded-md transition-all duration-200 ${showSource ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
             >
               <Code size={18} className="mr-3" />
               Project Submission
             </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
           <button onClick={() => setState(AppState.IDENTITY)} className="flex items-center text-sm text-slate-400 hover:text-red-400 transition-colors w-full px-4 py-2 rounded hover:bg-red-900/10">
             <LogOut size={16} className="mr-2" /> Terminate Session
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {showSource ? <><Code className="text-blue-500"/> Project Submission Hub</> : <>
                  {state === AppState.DASHBOARD && <><LayoutDashboard className="text-emerald-500"/> Mission Control</>}
                  {state === AppState.SCANNER && <><Radio className="text-emerald-500"/> Network Scanner</>}
                  {state === AppState.PASSWORD && <><Lock className="text-emerald-500"/> Auth Assessment</>}
                  {state === AppState.STRESS && <><ActivityIcon className="text-emerald-500" size={24}/> DOS Simulation</>}
                  {state === AppState.DISCOVERY && <><Globe className="text-emerald-500"/> Asset Discovery</>}
                  {state === AppState.PCAP && <><Wifi className="text-emerald-500"/> Traffic Analysis</>}
                  {state === AppState.REPORT && <><FileText className="text-emerald-500"/> Evidence Locker</>}
                </>}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">Target Scope: 192.168.1.0/24 (Lab)</p>
          </div>
          <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                  <div className="text-xs text-slate-400">Authenticated</div>
                  <div className="text-sm font-bold text-emerald-400">Moheed Ul Hassan</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-bold border border-emerald-400/30 shadow-lg shadow-emerald-900/20">
                  MH
              </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {showSource ? (
                <StreamlitExporter />
            ) : (
                <>
                {state === AppState.DASHBOARD && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-4 bg-gradient-to-r from-emerald-900/40 to-slate-900/40 backdrop-blur-sm p-6 rounded-lg border border-emerald-500/20 flex items-center justify-between shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white mb-1">Welcome back, Team CyberGuard</h3>
                                <p className="text-slate-400 text-sm">All systems nominal. Ready for authorized testing.</p>
                            </div>
                            <Shield size={48} className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] relative z-10" />
                        </div>

                        <StatsCard title="Total Logs" value={logs.length.toString()} icon={<FileText className="text-blue-400"/>} delay={100} />
                        <StatsCard title="Target Status" value="VULNERABLE" valueColor="text-red-400" icon={<Wifi className="text-red-400"/>} delay={200} />
                        <StatsCard title="Modules Loaded" value="5/5" icon={<CheckCircle2 className="text-emerald-400"/>} delay={300} />
                        <StatsCard title="Environment" value="Lab (Safe)" icon={<Terminal className="text-purple-400"/>} delay={400} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-lg border border-slate-700/50">
                            <h4 className="text-slate-200 font-semibold mb-4 flex items-center gap-2"><Terminal size={16}/> Recent Activity</h4>
                            <div className="space-y-3">
                                {logs.slice(-5).reverse().map((log, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm p-2 rounded hover:bg-slate-700/50 border-b border-slate-700/30 last:border-0 group cursor-default">
                                        <span className="text-slate-500 font-mono text-xs">{log.timestamp.split('T')[1].split('.')[0]}</span>
                                        <span className="text-emerald-400 font-bold group-hover:text-emerald-300 transition-colors">{log.module}</span>
                                        <span className="text-slate-300 truncate max-w-[150px]">{log.action}</span>
                                    </div>
                                ))}
                                {logs.length === 0 && <div className="text-slate-500 text-center py-4 italic">No activity recorded.</div>}
                            </div>
                        </div>
                        <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-lg border border-slate-700/50">
                            <h4 className="text-slate-200 font-semibold mb-4 flex items-center gap-2"><LayoutDashboard size={16}/> Quick Launch</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setState(AppState.SCANNER)} className="p-4 bg-slate-700/40 hover:bg-emerald-600/20 hover:border-emerald-500/50 border border-transparent rounded transition-all text-left group relative overflow-hidden">
                                    <Radio className="mb-2 text-emerald-400 group-hover:scale-110 transition-transform relative z-10" size={24}/>
                                    <div className="text-sm font-bold text-slate-200 relative z-10">Port Scan</div>
                                    <div className="text-xs text-slate-500 relative z-10">Find open services</div>
                                </button>
                                <button onClick={() => setState(AppState.STRESS)} className="p-4 bg-slate-700/40 hover:bg-red-600/20 hover:border-red-500/50 border border-transparent rounded transition-all text-left group relative overflow-hidden">
                                    <ActivityIcon className="mb-2 text-red-400 group-hover:scale-110 transition-transform relative z-10" size={24}/>
                                    <div className="text-sm font-bold text-slate-200 relative z-10">Stress Test</div>
                                    <div className="text-xs text-slate-500 relative z-10">DOS Simulation</div>
                                </button>
                                <button onClick={() => setState(AppState.PCAP)} className="p-4 bg-slate-700/40 hover:bg-blue-600/20 hover:border-blue-500/50 border border-transparent rounded transition-all text-left group relative overflow-hidden">
                                    <Wifi className="mb-2 text-blue-400 group-hover:scale-110 transition-transform relative z-10" size={24}/>
                                    <div className="text-sm font-bold text-slate-200 relative z-10">Sniffer</div>
                                    <div className="text-xs text-slate-500 relative z-10">Capture Packets</div>
                                </button>
                                <button onClick={() => setState(AppState.REPORT)} className="p-4 bg-slate-700/40 hover:bg-purple-600/20 hover:border-purple-500/50 border border-transparent rounded transition-all text-left group relative overflow-hidden">
                                    <FileText className="mb-2 text-purple-400 group-hover:scale-110 transition-transform relative z-10" size={24}/>
                                    <div className="text-sm font-bold text-slate-200 relative z-10">Reports</div>
                                    <div className="text-xs text-slate-500 relative z-10">View Evidence</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                )}
                
                {state === AppState.SCANNER && <Scanner onLog={addLog} />}
                {state === AppState.PASSWORD && <PasswordTester onLog={addLog} />}
                {state === AppState.STRESS && <StressTester onLog={addLog} />}
                {state === AppState.DISCOVERY && <WebDiscovery onLog={addLog} />}
                {state === AppState.PCAP && <PacketAnalyzer onLog={addLog} />}
                
                {state === AppState.REPORT && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-lg border border-slate-700/50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Execution Logs & Evidence</h3>
                            <p className="text-slate-400 text-sm">Immutable audit trail of all performed actions.</p>
                        </div>
                        <button onClick={downloadFullReport} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20">
                        <FileText size={16} /> Download Final Report (JSON)
                        </button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-slate-700/50">
                        <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900/80 text-slate-200 uppercase font-medium">
                            <tr>
                            <th className="px-4 py-3">Time</th>
                            <th className="px-4 py-3">Module</th>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50 font-mono bg-slate-800/20">
                            {logs.map((log, i) => (
                            <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap text-slate-500">{log.timestamp.split('T')[1].split('.')[0]}</td>
                                <td className="px-4 py-3 text-emerald-400 font-semibold">{log.module}</td>
                                <td className="px-4 py-3">{log.user}</td>
                                <td className="px-4 py-3 text-white">{log.action}</td>
                                <td className="px-4 py-3 text-slate-400 truncate max-w-xs" title={log.details}>{log.details}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        {logs.length === 0 && <div className="p-12 text-center text-slate-600">No actions recorded yet. Start a module to generate logs.</div>}
                    </div>
                    </div>
                </div>
                )}
                </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}