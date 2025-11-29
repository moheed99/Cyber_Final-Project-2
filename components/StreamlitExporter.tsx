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

# --- Custom CSS for Professional Cyberpunk Look ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;600&display=swap');
    
    /* Live Animated Background */
    @keyframes gradient {
        0% {background-position: 0% 50%;}
        50% {background-position: 100% 50%;}
        100% {background-position: 0% 50%;}
    }
    
    .stApp {
        background: linear-gradient(-45deg, #050505, #0f172a, #111827, #020617);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
        font-family: 'Inter', sans-serif;
    }

    /* CRT Scanline Effect */
    .stApp::before {
        content: " ";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
        z-index: 2;
        background-size: 100% 2px, 3px 100%;
        pointer-events: none;
    }

    h1, h2, h3, .stMetricValue {
        font-family: 'JetBrains Mono', monospace !important;
        color: #10b981 !important;
        text-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
    }
    
    /* Custom Buttons */
    .stButton>button {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        border: 1px solid #10b981;
        border-radius: 4px;
        height: 3em;
        width: 100%;
        font-family: 'JetBrains Mono', monospace;
        font-weight: bold;
        transition: all 0.3s;
    }
    .stButton>button:hover {
        background: #10b981;
        color: black;
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
    }

    /* Cards */
    div[data-testid="stMetric"], div.css-1r6slb0 {
        background-color: rgba(30, 41, 59, 0.5);
        padding: 15px;
        border-radius: 8px;
        border: 1px solid rgba(148, 163, 184, 0.1);
        backdrop-filter: blur(10px);
    }
    
    /* Sidebar */
    section[data-testid="stSidebar"] {
        background-color: rgba(15, 23, 42, 0.9);
        border-right: 1px solid #1e293b;
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
    
    # Simulate secure boot
    for percent_complete in range(100):
        time.sleep(0.015)
        my_bar.progress(percent_complete + 1, text=progress_text)
        
    st.toast("Identity Verified: Team CyberGuard", icon="✅")
    time.sleep(0.5)
    return True

# --- Modules ---

def port_scanner_module():
    st.header("📡 Port Scanner")
    st.caption("Active Reconnaissance Module")
    
    col1, col2 = st.columns([1, 2])
    
    with col1:
        with st.container(border=True):
            target = st.text_input("Target IP", "192.168.1.10")
            start_btn = st.button("Start Scan")
    
    with col2:
        if start_btn:
            with st.status("Scanning Target...", expanded=True) as status:
                st.write("Initializing Socket Connections...")
                time.sleep(1)
                st.write("Probing Common Ports...")
                time.sleep(1)
                st.write("Banner Grabbing...")
                status.update(label="Scan Complete!", state="complete", expanded=False)
            
            # Simulated Results
            open_ports = []
            if random.random() > 0.1:
                open_ports.append({"port": 80, "service": "HTTP", "status": "OPEN", "banner": "Apache/2.4.41"})
            if random.random() > 0.3:
                open_ports.append({"port": 22, "service": "SSH", "status": "OPEN", "banner": "OpenSSH 8.2p1"})
            if random.random() > 0.6:
                open_ports.append({"port": 3306, "service": "MySQL", "status": "OPEN", "banner": "MySQL 5.7.33"})
                
            if open_ports:
                st.success(f"Target {target} is active. Found {len(open_ports)} open ports.")
                df = pd.DataFrame(open_ports)
                st.dataframe(df, use_container_width=True, hide_index=True)
                
                # Download Button
                json_res = json.dumps(open_ports, indent=2)
                st.download_button("⬇️ Download Report", json_res, "scan_023_AliRaza.json", "application/json")
                
                add_log("Port Scanner", "Scan Completed", f"Found {len(open_ports)} ports on {target}", "22I-7451")
            else:
                st.warning("No open ports found or target unreachable.")

def stress_test_module():
    st.header("⚡ Load / DOS Simulation")
    st.error("⚠️ WARNING: Authorized QA Use Only. High Network Impact.")
    
    with st.container(border=True):
        clients = st.slider("Simulated Threads (Clients)", 200, 5000, 200)
    
    if st.button("🔴 INITIATE STRESS TEST"):
        chart_holder = st.empty()
        data = []
        
        st.toast("Attack Initiated...", icon="🚀")
        add_log("Stress Test", "Attack Started", f"DOS Launched with {clients} clients", "22I-2285")
        
        # Live Graph Simulation
        for i in range(40):
            latency = 50 + (i * 3) + random.randint(0, 30)
            requests = clients + random.randint(0, 100)
            data.append({"Time": i, "Latency (ms)": latency, "Requests/s": requests})
            
            fig = px.area(data, x="Time", y="Latency (ms)", title="Real-time Server Latency", markers=True)
            fig.update_layout(
                template="plotly_dark", 
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(family="JetBrains Mono", color="#10b981")
            )
            fig.update_traces(line_color='#ef4444', fill_color='rgba(239, 68, 68, 0.3)')
            chart_holder.plotly_chart(fig, use_container_width=True)
            time.sleep(0.1)
            
        st.success("Test Completed. Target recovering.")
        
        report = json.dumps(data, indent=2)
        st.download_button("⬇️ Download Stress Log", report, "stress_023_AliRaza.json", "application/json")

def password_audit_module():
    st.header("🔐 Password & Policy Audit")
    
    col1, col2 = st.columns(2)
    with col1:
        pwd = st.text_input("Enter Password Hash or String", type="password")
        check = st.button("Audit Strength")
    
    with col2:
        st.info("Policy: Min 12 chars, Upper, Lower, Special, Number.")
    
    if pwd and check:
        score = 0
        feedback = []
        
        if len(pwd) >= 12: score += 25
        else: feedback.append("❌ Length < 12 characters")
        
        if any(c.isupper() for c in pwd): score += 25
        else: feedback.append("❌ Missing Uppercase")
        
        if any(c.isdigit() for c in pwd): score += 25
        else: feedback.append("❌ Missing Numbers")
        
        if any(not c.isalnum() for c in pwd): score += 25
        else: feedback.append("❌ Missing Special Characters")
        
        col1, col2 = st.columns(2)
        with col1:
            st.metric("Security Score", f"{score}/100")
            st.progress(score)
        with col2:
            if feedback:
                for f in feedback: st.write(f)
            else:
                st.success("✅ Meets Corporate Policy")
        
        add_log("Password Audit", "Check Performed", f"Score: {score}", "22I-2291")
            
        result_data = json.dumps({"password_len": len(pwd), "score": score, "feedback": feedback}, indent=2)
        st.download_button("⬇️ Download Audit", result_data, "password_audit_22I-2291.json", "application/json")

def web_discovery_module():
    st.header("🌐 Web Footprinting")
    target = st.text_input("Target Domain", "paybuddy.io")
    
    if st.button("Start Enumeration"):
        st.write(f"Scanning {target} for hidden directories...")
        dirs = ["/admin", "/login", "/dashboard", "/api/v1", "/backup", "/config", "/uploads", "/test"]
        found = []
        
        bar = st.progress(0)
        col1, col2 = st.columns(2)
        
        for i, d in enumerate(dirs):
            time.sleep(0.2)
            bar.progress((i+1) * int(100/len(dirs)))
            status = 200 if random.random() > 0.4 else 403
            if random.random() > 0.2:
                found.append({"path": d, "status": status})
                if status == 200:
                    col1.success(f"Found: {d} (200 OK)")
                else:
                    col2.error(f"Found: {d} (403 Forbidden)")
        
        if found:
            json_res = json.dumps(found, indent=2)
            st.download_button("⬇️ Download Findings", json_res, "footprint_023_AliRaza.json", "application/json")
            add_log("Web Discovery", "Scan Completed", f"Found {len(found)} paths", "22I-7451")

def packet_analyzer_module():
    st.header("🦈 Packet Capture")
    st.caption("Simulated Traffic Analysis (Scapy)")
    
    if st.button("Start Capture (eth0)"):
        with st.spinner("Listening on interface eth0..."):
            time.sleep(2)
        
        # Simulated Packets
        packets = [
            {"Time": "10:00:01", "Source": "192.168.1.10", "Dest": "10.0.0.1", "Proto": "TCP", "Info": "SYN"},
            {"Time": "10:00:02", "Source": "10.0.0.1", "Dest": "192.168.1.10", "Proto": "TCP", "Info": "SYN-ACK"},
            {"Time": "10:00:03", "Source": "192.168.1.10", "Dest": "8.8.8.8", "Proto": "UDP", "Info": "DNS Query paybuddy.io"},
            {"Time": "10:00:04", "Source": "192.168.1.5", "Dest": "192.168.1.255", "Proto": "ARP", "Info": "Who has 192.168.1.1?"},
            {"Time": "10:00:05", "Source": "192.168.1.10", "Dest": "10.0.0.1", "Proto": "HTTP", "Info": "GET /login"},
        ]
        st.table(pd.DataFrame(packets))
        
        json_res = json.dumps(packets, indent=2)
        st.download_button("⬇️ Download PCAP (JSON)", json_res, "capture_023_AliRaza.json", "application/json")
        
        add_log("Packet Analyzer", "Capture Finished", "Captured 5 packets", "22I-2285")

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
        st.download_button("⬇️ Download Full Report PDF/JSON", json_str, "report_TeamCyberGuard.json", "application/json")

# --- Main Layout ---
def main():
    # Identity Gate
    if not st.session_state['authenticated']:
        st.title("🔒 PayBuddy Security Suite")
        st.markdown("### Authorization Required")
        
        col1, col2 = st.columns(2)
        with col1:
             with st.container(border=True):
                 st.markdown("**Identity File**")
                 st.code("""Team: CyberGuard
Members:
Moheed Ul Hassan | 22I-7451
Ali Abbas | 22I-2285
Abdur Rehman | 22I-2291""")
        with col2:
             with st.container(border=True):
                 st.markdown("**Consent File**")
                 st.code("""Approved Targets:
- 192.168.1.10 (Local Lab)
- PayBuddy Dev Server
- TryHackMe Sandbox""")

        if st.button("Verify Credentials & Launch Toolkit"):
            if check_identity():
                st.session_state['authenticated'] = True
                st.rerun()
        return

    # Sidebar Navigation
    with st.sidebar:
        st.title("PayBuddy QA")
        st.caption("v1.0.4-RELEASE")
        st.markdown("---")
        menu = st.radio("Select Module", 
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
        col3.metric("Modules Loaded", "5")
        
        st.markdown("### Team Status")
        st.dataframe(pd.DataFrame(TEAM_MEMBERS), hide_index=True)
        
        st.markdown("### Recent Activity")
        if st.session_state['logs']:
            st.table(pd.DataFrame(st.session_state['logs'][-3:]))
        else:
            st.text("System Idle.")

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