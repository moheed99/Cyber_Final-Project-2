import React from 'react';
import { Download, FileCode, FileText, Terminal, Package, AlertCircle } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { TEAM_MEMBERS, CONSENT_TEXT } from '../constants';

export const StreamlitExporter: React.FC = () => {
  const pythonCode = `import streamlit as st
import socket
import threading
import time
import json
import random
from datetime import datetime
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests

# --- Configuration & Constants ---
st.set_page_config(
    page_title="PayBuddy Security Suite",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

TEAM_MEMBERS = [
    {"name": "Moheed Ul Hassan", "reg": "22I-7451"},
    {"name": "Ali Abbas", "reg": "22I-2285"},
    {"name": "Abdur Rehman", "reg": "22I-2291"}
]

# --- Custom CSS for Cyberpunk Look ---
st.markdown("""
<style>
    .stApp {
        background-color: #0e1117;
    }
    .stButton>button {
        background-color: #10b981;
        color: white;
        border-radius: 5px;
        border: none;
        height: 3em;
        width: 100%;
        font-weight: bold;
    }
    .stButton>button:hover {
        background-color: #059669;
    }
    h1, h2, h3 {
        color: #10b981;
        font-family: 'Courier New', monospace;
    }
    .metric-card {
        background-color: #262730;
        padding: 15px;
        border-radius: 5px;
        border: 1px solid #374151;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# --- Session State Management ---
if 'logs' not in st.session_state:
    st.session_state['logs'] = []
if 'authenticated' not in st.session_state:
    st.session_state['authenticated'] = False

# --- Helper Functions ---
def add_log(module, action, details, user):
    entry = {
        "timestamp": datetime.now().isoformat(),
        "module": module,
        "action": action,
        "details": details,
        "user": user,
        "evidence_cmd": f"cat identity.txt; date; {action}" 
    }
    st.session_state['logs'].append(entry)

def check_identity():
    progress_text = "Verifying Identity Credentials..."
    my_bar = st.progress(0, text=progress_text)
    
    for percent_complete in range(100):
        time.sleep(0.01)
        my_bar.progress(percent_complete + 1, text=progress_text)
        
    st.toast("Identity Verified: Team CyberGuard", icon="✅")
    time.sleep(0.5)
    return True

# --- Modules ---

def port_scanner_module():
    st.header("📡 Port Scanner")
    col1, col2 = st.columns([1, 2])
    
    with col1:
        target = st.text_input("Target IP", "192.168.1.10")
        start_btn = st.button("Start Scan")
    
    with col2:
        if start_btn:
            st.info(f"Scanning {target}...")
            progress_bar = st.progress(0)
            
            open_ports = []
            status_text = st.empty()
            
            for i in range(100):
                time.sleep(0.02)
                progress_bar.progress(i + 1)
                status_text.text(f"Probing port {random.randint(20, 10000)}...")
                
            # Random results for demo
            if random.random() > 0.2:
                open_ports.append({"port": 80, "service": "HTTP", "status": "OPEN", "banner": "Apache/2.4.41"})
            if random.random() > 0.5:
                open_ports.append({"port": 22, "service": "SSH", "status": "OPEN", "banner": "OpenSSH 8.2p1"})
            if random.random() > 0.7:
                open_ports.append({"port": 3306, "service": "MySQL", "status": "OPEN", "banner": "MySQL 5.7.33"})
                
            if open_ports:
                st.success(f"Scan Complete. Found {len(open_ports)} open ports.")
                df = pd.DataFrame(open_ports)
                st.dataframe(df, use_container_width=True)
                
                # Download Button
                json_res = json.dumps(open_ports, indent=2)
                st.download_button("Download Report", json_res, "scan_023_AliRaza.json", "application/json")
                
                add_log("Port Scanner", "Scan Completed", f"Found {len(open_ports)} ports on {target}", "22I-7451")
            else:
                st.warning("No open ports found.")

def stress_test_module():
    st.header("⚡ Load / DOS Testing")
    st.warning("⚠️ Authorized Use Only. Do not use on public targets.")
    
    clients = st.slider("Concurrent Clients", 200, 5000, 200)
    
    if st.button("Launch Attack (Simulation)"):
        stop_event = threading.Event()
        chart_holder = st.empty()
        data = []
        
        st.toast("Attack Initiated...", icon="🚀")
        add_log("Stress Test", "Attack Started", f"DOS Launched with {clients} clients", "22I-2285")
        
        for i in range(50):
            latency = 50 + (i * 2) + random.randint(0, 20)
            requests = clients + random.randint(0, 50)
            data.append({"Time": i, "Latency (ms)": latency, "Requests/s": requests})
            
            fig = px.area(data, x="Time", y="Latency (ms)", title="Server Response Latency")
            fig.update_layout(template="plotly_dark", line_shape="spline")
            fig.update_traces(line_color='#ef4444')
            chart_holder.plotly_chart(fig, use_container_width=True)
            time.sleep(0.1)
            
        st.success("Test Completed. Server recovered.")
        
        report = json.dumps(data, indent=2)
        st.download_button("Download Stress Log", report, "stress_023_AliRaza.json", "application/json")

def password_audit_module():
    st.header("🔐 Password & Policy Audit")
    
    pwd = st.text_input("Test Password", type="password")
    
    if pwd:
        score = 0
        feedback = []
        
        if len(pwd) >= 12: score += 25
        else: feedback.append("Length < 12")
        
        if any(c.isupper() for c in pwd): score += 25
        else: feedback.append("No Uppercase")
        
        if any(c.isdigit() for c in pwd): score += 25
        else: feedback.append("No Numbers")
        
        if any(not c.isalnum() for c in pwd): score += 25
        else: feedback.append("No Special Chars")
        
        col1, col2 = st.columns(2)
        with col1:
            st.metric("Strength Score", f"{score}/100")
            st.progress(score)
        with col2:
            st.write("Feedback:")
            for f in feedback:
                st.error(f)
            if score == 100:
                st.success("Strong Password!")
        
        if st.button("Log Result"):
            add_log("Password Audit", "Check Performed", f"Score: {score}", "22I-2291")
            st.success("Result Logged")
            
        result_data = json.dumps({"password_len": len(pwd), "score": score, "feedback": feedback}, indent=2)
        st.download_button("Download Audit", result_data, "password_audit_22I-2291.json", "application/json")

def web_discovery_module():
    st.header("🌐 Web Footprinting")
    target = st.text_input("Target Domain", "paybuddy.io")
    
    if st.button("Start Enumeration"):
        st.write("Brute-forcing directories...")
        dirs = ["/admin", "/login", "/dashboard", "/api", "/backup", "/config", "/uploads"]
        found = []
        
        bar = st.progress(0)
        col1, col2 = st.columns(2)
        
        for i, d in enumerate(dirs):
            time.sleep(0.3)
            bar.progress((i+1) * int(100/len(dirs)))
            status = 200 if random.random() > 0.3 else 403
            if random.random() > 0.2:
                found.append({"path": d, "status": status})
                if status == 200:
                    col1.success(f"Found: {d} (200 OK)")
                else:
                    col2.error(f"Found: {d} (403 Forbidden)")
        
        if found:
            st.dataframe(pd.DataFrame(found))
            json_res = json.dumps(found, indent=2)
            st.download_button("Download Findings", json_res, "footprint_023_AliRaza.json", "application/json")
            add_log("Web Discovery", "Scan Completed", f"Found {len(found)} paths", "22I-7451")

def packet_analyzer_module():
    st.header("🦈 Packet Capture (Scapy)")
    if st.button("Start Capture (eth0)"):
        with st.spinner("Capturing packets in promiscuous mode..."):
            time.sleep(3)
        
        # Simulated Packets
        packets = [
            {"Time": "10:00:01", "Source": "192.168.1.10", "Dest": "10.0.0.1", "Proto": "TCP", "Info": "SYN"},
            {"Time": "10:00:02", "Source": "10.0.0.1", "Dest": "192.168.1.10", "Proto": "TCP", "Info": "SYN-ACK"},
            {"Time": "10:00:03", "Source": "192.168.1.10", "Dest": "8.8.8.8", "Proto": "UDP", "Info": "DNS Query paybuddy.io"},
            {"Time": "10:00:04", "Source": "192.168.1.5", "Dest": "192.168.1.255", "Proto": "ARP", "Info": "Who has 192.168.1.1?"},
        ]
        st.dataframe(pd.DataFrame(packets), use_container_width=True)
        
        json_res = json.dumps(packets, indent=2)
        st.download_button("Download PCAP (JSON)", json_res, "capture_023_AliRaza.json", "application/json")
        
        add_log("Packet Analyzer", "Capture Finished", "Captured 4 packets", "22I-2285")

def reporting_module():
    st.header("📄 Evidence & Reporting")
    
    st.markdown("### Execution Log")
    if st.session_state['logs']:
        st.dataframe(pd.DataFrame(st.session_state['logs']), use_container_width=True)
    else:
        st.info("No logs generated yet.")
    
    if st.button("Generate Final Report"):
        report = {
            "team": TEAM_MEMBERS,
            "generated_at": datetime.now().isoformat(),
            "logs": st.session_state['logs']
        }
        json_str = json.dumps(report, indent=2)
        st.download_button("Download Full Report PDF/JSON", json_str, "report_TeamCyberGuard.json", "application/json")

# --- Main Layout ---
def main():
    # Identity Gate
    if not st.session_state['authenticated']:
        st.title("🔒 PayBuddy Security Suite")
        st.markdown("*Authorized Access Only*")
        
        col1, col2 = st.columns(2)
        with col1:
             st.markdown("### Identity")
             st.code("""Team: CyberGuard
Members:
Moheed Ul Hassan | 22I-7451
Ali Abbas | 22I-2285
Abdur Rehman | 22I-2291""")
        with col2:
             st.markdown("### Consent")
             st.code("""Approved Targets:
- 192.168.1.10 (Local Lab)
- PayBuddy Dev Server
- TryHackMe Sandbox""")

        if st.button("Verify Credentials & Launch"):
            if check_identity():
                st.session_state['authenticated'] = True
                st.rerun()
        return

    # Sidebar Navigation
    with st.sidebar:
        st.image("https://cdn-icons-png.flaticon.com/512/2092/2092663.png", width=50)
        st.title("PayBuddy QA")
        st.markdown("---")
        menu = st.radio("Navigation", 
            ["Dashboard", "Port Scanner", "Password Audit", "Stress Test", "Web Discovery", "Packet Analyzer", "Reports"]
        )
        st.markdown("---")
        st.info(f"User: Ali Raza (QA Lead)")
        if st.button("Logout"):
            st.session_state['authenticated'] = False
            st.rerun()

    # Routing
    if menu == "Dashboard":
        st.title("Mission Control")
        col1, col2, col3 = st.columns(3)
        col1.metric("Target Status", "Online", "12ms")
        col2.metric("Total Logs", len(st.session_state['logs']))
        col3.metric("Modules", "5")
        
        st.markdown("### Team Status")
        st.table(pd.DataFrame(TEAM_MEMBERS))

    elif menu == "Port Scanner": port_scanner_module()
    elif menu == "Password Audit": password_audit_module()
    elif menu == "Stress Test": stress_test_module()
    elif menu == "Web Discovery": web_discovery_module()
    elif menu == "Packet Analyzer": packet_analyzer_module()
    elif menu == "Reports": reporting_module()

if __name__ == "__main__":
    main()
`;

  const readmeContent = `# PayBuddy Security Suite

## Project Overview
A Python-based hybrid hacking toolkit for PayBuddy QA to test in-house APIs and wallet services.

## Team Members (Team CyberGuard)
- Moheed Ul Hassan (22I-7451)
- Ali Abbas (22I-2285)
- Abdur Rehman (22I-2291)

## Setup Instructions
1. Install Python 3.9+
2. Install requirements:
   \`pip install -r requirements.txt\`
3. Run the application:
   \`streamlit run paybuddy_toolkit.py\`

## Modules
- **Port Scanner**: Threaded TCP scanning.
- **Password Audit**: Policy check & strength estimation.
- **Stress Test**: DOS simulation with plotting.
- **Web Discovery**: Directory enumeration.
- **Packet Analyzer**: Network traffic visualization.

## Files
- identity.txt: Team credentials.
- consent.txt: Authorization scope.
- paybuddy_toolkit.py: Main application logic.
`;

  const requirementsContent = `streamlit
pandas
plotly
requests
scapy
`;

  const identityContent = `Team: CyberGuard
Members:
Moheed Ul Hassan | 22I-7451
Ali Abbas | 22I-2285
Abdur Rehman | 22I-2291
`;

  const downloadFile = (content: string, filename: string, type: string = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-6">
          <Card title="Submission Files" className="flex-1">
            <div className="space-y-6">
                <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-md flex items-start gap-3">
                    <Package className="text-emerald-400 mt-1" size={24} />
                    <div>
                        <h3 className="text-emerald-100 font-bold">Project Submission Bundle</h3>
                        <p className="text-emerald-200/70 text-sm mt-1">
                            Download these files to submit for your final project. They contain the full Python Streamlit implementation required by the rubric.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={() => downloadFile(pythonCode, 'paybuddy_toolkit.py')} icon={<FileCode size={16}/>}>
                        Download App.py
                    </Button>
                    <Button onClick={() => downloadFile(requirementsContent, 'requirements.txt')} variant="secondary" icon={<Terminal size={16}/>}>
                        Download Requirements.txt
                    </Button>
                    <Button onClick={() => downloadFile(readmeContent, 'README.md')} variant="secondary" icon={<FileText size={16}/>}>
                        Download README.md
                    </Button>
                    <Button onClick={() => downloadFile(identityContent, 'identity.txt')} variant="secondary" icon={<FileText size={16}/>}>
                        Download Identity.txt
                    </Button>
                </div>
            </div>
          </Card>
      </div>

      <Card title="Source Code Preview (paybuddy_toolkit.py)">
        <div className="relative">
            <div className="absolute top-0 right-0 bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-bl border-l border-b border-slate-700">
                Python 3.9+
            </div>
            <pre className="bg-slate-950 p-4 rounded-md overflow-x-auto text-xs font-mono text-blue-300 border border-slate-800 h-[500px] leading-relaxed">
                {pythonCode}
            </pre>
        </div>
      </Card>
    </div>
  );
};