export interface TeamMember {
  name: string;
  reg: string;
}

export interface LogEntry {
  timestamp: string;
  module: string;
  action: string;
  details: string;
  user: string;
}

export interface PortResult {
  port: number;
  service: string;
  status: 'OPEN' | 'CLOSED' | 'FILTERED';
  banner: string;
}

export interface PacketData {
  id: number;
  time: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
}

export interface DiscoveryResult {
  type: 'Directory' | 'Subdomain';
  path: string;
  status: number;
}

export enum AppState {
  IDENTITY,
  DASHBOARD,
  SCANNER,
  PASSWORD,
  STRESS,
  DISCOVERY,
  PCAP,
  REPORT
}