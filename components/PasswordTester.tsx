import React, { useState } from 'react';
import { Lock, ShieldCheck, Download, AlertTriangle } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { LogEntry } from '../types';

interface PasswordTesterProps {
  onLog: (entry: LogEntry) => void;
}

export const PasswordTester: React.FC<PasswordTesterProps> = ({ onLog }) => {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<{
    score: number;
    crackTime: string;
    suggestions: string[];
    entropy: number;
    hash: string;
  } | null>(null);

  const calculateStrength = () => {
    let score = 0;
    const suggestions: string[] = [];
    
    if (password.length > 8) score += 20;
    else suggestions.push("Use at least 8 characters.");
    
    if (/[A-Z]/.test(password)) score += 20;
    else suggestions.push("Include uppercase letters.");
    
    if (/[0-9]/.test(password)) score += 20;
    else suggestions.push("Include numbers.");
    
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    else suggestions.push("Include special characters.");

    if (password.length > 12) score += 20;

    // Simulate Hash
    let hashVal = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hashVal = ((hashVal << 5) - hashVal) + char;
        hashVal = hashVal & hashVal; 
    }
    const hexHash = Math.abs(hashVal).toString(16).padStart(8, '0') + "..." + Date.now().toString(16);

    // Simulate crack time based on length
    let crackTime = "Instantly";
    if (score > 80) crackTime = "Centuries";
    else if (score > 60) crackTime = "Years";
    else if (score > 40) crackTime = "Days";
    else if (score > 20) crackTime = "Minutes";

    const entropy = password.length * Math.log2(94); // rough calc

    setResult({
      score,
      crackTime,
      suggestions,
      entropy: Math.floor(entropy),
      hash: "SHA-256 (Simulated): " + hexHash
    });

    onLog({
      timestamp: new Date().toISOString(),
      module: 'Password Audit',
      action: 'Check Performed',
      details: `Tested password length: ${password.length}. Score: ${score}/100`,
      user: '22I-2291'
    });
  };

  const downloadReport = () => {
    if (!result) return;
    const dataStr = JSON.stringify({ ...result, tested_at: new Date() }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `password_audit_22I-2291.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Policy Checker" className="h-fit">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Test Password / Hash</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter string to test..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                />
                <Button onClick={calculateStrength} icon={<ShieldCheck size={16}/>}>
                  Test
                </Button>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700 text-sm text-slate-400">
              <h4 className="font-semibold text-emerald-400 mb-2">Corporate Policy:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Min 12 characters</li>
                <li>At least 1 Uppercase & 1 Lowercase</li>
                <li>At least 1 Number & 1 Special Char</li>
                <li>No dictionary words</li>
              </ul>
            </div>
          </div>
        </Card>

        {result && (
          <Card title="Analysis Result">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-300">Strength Score</span>
                  <span className={`text-sm font-bold ${result.score > 60 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {result.score} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${result.score > 60 ? 'bg-emerald-500' : result.score > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    style={{ width: `${result.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 p-3 rounded border border-slate-700">
                  <div className="text-xs text-slate-500 uppercase">Est. Crack Time</div>
                  <div className="text-lg font-mono text-white">{result.crackTime}</div>
                </div>
                <div className="bg-slate-700/30 p-3 rounded border border-slate-700">
                  <div className="text-xs text-slate-500 uppercase">Entropy</div>
                  <div className="text-lg font-mono text-white">{result.entropy} bits</div>
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded border border-slate-800 font-mono text-xs text-slate-400 break-all">
                {result.hash}
              </div>

              {result.suggestions.length > 0 && (
                <div className="bg-yellow-900/20 p-3 rounded border border-yellow-900/50">
                  <div className="flex items-center gap-2 text-yellow-500 mb-2 font-semibold text-sm">
                    <AlertTriangle size={14} /> Recommendations
                  </div>
                  <ul className="text-sm text-yellow-200/80 list-disc list-inside">
                    {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={downloadReport} icon={<Download size={16} />}>
                  Download Analysis
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};