import { TeamMember } from './types';

export const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Moheed Ul Hassan', reg: '22I-7451' },
  { name: 'Ali Abbas', reg: '22I-2285' },
  { name: 'Abdur Rehman', reg: '22I-2291' }
];

export const CONSENT_TEXT = `Approved Targets:
- 192.168.1.10 (Local Lab)
- PayBuddy Dev Server
- TryHackMe Sandbox

Approved By: CISO PayBuddy
Date: 2024-05-20`;

export const COMMON_PORTS = [
  { port: 21, service: 'FTP' },
  { port: 22, service: 'SSH' },
  { port: 23, service: 'Telnet' },
  { port: 25, service: 'SMTP' },
  { port: 53, service: 'DNS' },
  { port: 80, service: 'HTTP' },
  { port: 110, service: 'POP3' },
  { port: 443, service: 'HTTPS' },
  { port: 3306, service: 'MySQL' },
  { port: 8080, service: 'HTTP-Alt' },
];

export const WORDLIST = [
  'admin', 'login', 'dashboard', 'config', 'uploads', 'images', 'js', 'css', 'api', 'v1', 'test', 'backup'
];