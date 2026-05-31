## 📚 REFERENCE LIBRARY: HOME-LAB-BLUEPRINTS
<a id="reference-library-home-lab-blueprints"></a>

# Home Lab Blueprints: Step-by-Step Hands-On Scaffolding
## Build Verifiable Skills on a Budget (Under $20/Month or Free)

---

## 🏛️ Blueprint 1: The Active Directory (AD) Enterprise Lab
**Best For**: Aspiring SOC Analysts, Pen Testers, and Security Engineers.
**Objective**: Build a miniature corporate domain to understand AD architecture, group policies, authentication protocols (Kerberos, NTLM), and lateral movement.

### Hypervisor Selection
Choose one (both are free):
- **Option A: VirtualBox** (Easiest for local laptops with 16GB+ RAM).
- **Option B: Proxmox VE** (Best for a dedicated old PC/server).

### Network Architecture (Isolated Sandbox)
Configure a Host-Only adapter or an isolated virtual switch to prevent traffic from leaking to your home network:
- **Subnet**: `10.0.0.0/24`
- **Domain Name**: `windomain.local`
- **Active Directory / DNS Server (DC)**: `10.0.0.10`
- **Windows Client Workstation**: `10.0.0.20`

---

### Step-by-Step Deployment

#### Step 1: Deploy the Windows Server Domain Controller (DC)
1. Download the **Windows Server 2022 Evaluation ISO** (free for 180 days).
2. Create a VM: 2 vCPUs, 4GB RAM, 50GB Disk. Set Network to Host-Only.
3. Install Windows Server (Desktop Experience).
4. Assign a Static IP:
   - IP: `10.0.0.10`
   - Subnet Mask: `255.255.255.0`
   - Gateway: Leave blank or set to virtual gateway.
   - DNS: `127.0.0.1` (DNS will run on the DC itself).
5. Open Server Manager → **Add Roles and Features** → Select **Active Directory Domain Services (AD DS)** and **DNS Server**.
6. Promote the server to a Domain Controller:
   - Select "Add a new forest".
   - Root domain name: `windomain.local`.
   - Complete installation and reboot.

#### Step 2: Deploy the Windows Client Workstation
1. Download the **Windows 10/11 Enterprise Evaluation ISO** (free for 90 days).
2. Create a VM: 2 vCPUs, 4GB RAM, 40GB Disk. Set Network to Host-Only.
3. Assign static IP configurations:
   - IP: `10.0.0.20`
   - DNS: `10.0.0.10` (Must point to the DC).
4. Join the Workstation to the Domain:
   - System Settings → Rename this PC (advanced) → Change member of domain to `windomain.local`.
   - Authenticate with the Domain Administrator credentials. Reboot.

#### Step 3: Populate AD with Realistic Data
Do not create users one by one. Use automation to make the lab look like a real company:
1. Open PowerShell on the Domain Controller.
2. Download and run the **BadBlood** tool (GitHub: `davidpsec/BadBlood`):
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process
   Import-Module .\BadBlood.ps1
   Invoke-BadBlood
   ```
3. This script will populate Active Directory with 2,500+ users, groups, computers, ACLs, and nested permissions, creating a realistic, vulnerable AD structure.

---

## 🛡️ Blueprint 2: The Blue Team SIEM & Log Analysis Lab
**Best For**: SOC Analysts (L1-L3), Detection Engineers, Incident Responders.
**Objective**: Ingest logs, write detection rules, and analyze alerts in a central dashboard.

### Infrastructure Selection
- **The SIEM Engine**: **Wazuh** (Free, open-source, combines HIDS, SIEM, and vulnerability detection).
- **The Aggregator VM**: Ubuntu Server 22.04 LTS (2 vCPUs, 6GB RAM, 80GB Disk).

---

### Step-by-Step Deployment

#### Step 1: Install the Wazuh Manager
On your Ubuntu VM, run the Wazuh automated installation script:
```bash
curl -sO https://packages.wazuh.com/4.x/wazuh-install.sh && sudo bash wazuh-install.sh -a
```
*Note down the admin username and password generated at the end of the script. Log into `https://<Ubuntu-IP>` on your host browser.*

#### Step 2: Deploy Windows Sysmon (System Monitor)
To get deep visibility into process creation, network connections, and memory injection, you must install Sysmon on the Windows workstation VM (`10.0.0.20`):
1. Download Sysmon from Microsoft Sysinternals.
2. Download a production-ready configuration file, such as **SwiftOnSecurity's sysmon-config** (GitHub: `SwiftOnSecurity/sysmon-config`).
3. Install Sysmon via administrative cmd/PowerShell:
   ```cmd
   sysmon64.exe -accepteula -i sysmonconfig-export.xml
   ```
4. Verify logs are appearing in Windows Event Viewer under: `Applications and Services Logs -> Microsoft -> Windows -> Sysmon -> Operational`.

#### Step 3: Configure Wazuh Agent on Windows Client
1. Log into the Wazuh Web UI. Click **Deploy New Agent** → Select Windows.
2. Enter the Ubuntu VM IP as the Manager IP.
3. Run the generated PowerShell command on the Windows client VM to install and register the agent.
4. Modify the Windows agent configuration file (`C:\Program Files (x86)\ossec-agent\ossec.conf`) to ingest Sysmon logs:
   ```xml
   <localfile>
     <location>Microsoft-Windows-Sysmon/Operational</location>
     <log_format>eventchannel</log_format>
   </localfile>
   ```
5. Restart the Wazuh service on Windows:
   ```powershell
   Restart-Service -Name Wazuh
   ```

#### Step 4: Run a Detection Test using Atomic Red Team
1. On the Windows client VM, open PowerShell as administrator and install **Atomic Red Team** (GitHub: `redcanaryco/atomic-red-team`):
   ```powershell
   IEX (New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/redcanaryco/invoke-atomicredteam/layout/install-atomicredteam.ps1')
   Install-AtomicRedTeam -InstallPath "C:\AtomicRedTeam"
   ```
2. Detonate a test technique: **T1059.001** (PowerShell execution):
   ```powershell
   Invoke-AtomicTest T1059.001 -TestNumbers 1,2
   ```
3. Open the Wazuh dashboard, search for Event ID 1 (Process Creation) and look for the Atomic execution alerts to verify the telemetry pipeline.

---

## 🗡️ Blueprint 3: The AppSec & Web Security Laboratory
**Best For**: Application Security Engineers, Web Pen Testers, and Bug Hunters.
**Objective**: Set up a local intercepting proxy pipeline and test targets safely.

### Technical Stack
- **Target OS**: Linux VM (Ubuntu) with **Docker** installed.
- **Intercepting Tool**: **Burp Suite Community Edition** (Installed on host computer).

---

### Step-by-Step Deployment

#### Step 1: Deploy Vulnerable Targets via Docker
On your Linux VM, run Docker commands to start isolated web application playgrounds:

1.  **OWASP Juice Shop** (Modern Javascript Single Page Application):
    ```bash
    docker run -d --name juiceshop -p 3000:3000 bkimminich/juice-shop
    ```
2.  **DVWA (Damn Vulnerable Web Application)** (Traditional PHP app):
    ```bash
    docker run -d --name dvwa -p 8080:80 -e MYSQL_USER=root -e MYSQL_PASSWORD=password vulnerables/web-dvwa
    ```
3.  Verify they are accessible by browsing to `http://<Linux-IP>:3000` (Juice Shop) and `http://<Linux-IP>:8080` (DVWA).

#### Step 2: Configure Burp Suite Interception
1. Launch Burp Suite Community Edition on your host machine.
2. In Burp, go to **Proxy** → **Proxy Settings** → verify listener is running on `127.0.0.1:8080`.
3. Configure your browser to route traffic through Burp. *Recommended*: Install the browser extension **FoxyProxy Standard** and configure it to route HTTP/HTTPS traffic to `127.0.0.1` port `8080`.
4. Import Burp's CA Certificate to avoid SSL errors:
   - While routing browser traffic through Burp, browse to `http://burp`.
   - Click **CA Certificate** to download the file.
   - Import this certificate into your browser's Trust Store (search "certificates" in settings -> import authorities).
5. In Burp, toggle **Intercept is ON** under Proxy → Intercept. Try browsing to Juice Shop, inspect the HTTP requests, modify inputs, and forward.

---

## 🔬 Blueprint 4: The Isolated Malware Analysis Sandbox
**Best For**: Malware Analysts, DFIR Analysts, Reverse Engineers.
**Objective**: Build a dual-VM setup to safely detonate and study Windows malware behavior without exposing your host machine or network.

### Isolated Network Design
Ensure both VMs are connected to a dedicated **Host-Only Virtual Network Adapter** with DHCP disabled.
- **VM 1: Flare VM** (Windows-based analysis machine) — `10.0.9.10`
- **VM 2: REMnux** (Linux-based gateway & network simulator) — `10.0.9.2`

---

### Step-by-Step Deployment

#### Step 1: Deploy the REMnux Gateway
1. Download the **REMnux Virtual Appliance** (OVF format) from `remnux.org`.
2. Import the OVF into your hypervisor. Attach network to the Host-Only adapter.
3. Configure static IP:
   - IP: `10.0.9.2`
   - Subnet Mask: `255.255.255.0`
4. Start **INetSim** (Internet Simulation suite) and **fakedns** to trick malware into thinking the VM has internet access:
   ```bash
   sudo systemctl start inetsim
   sudo fakedns &
   ```
   *INetSim will answer all HTTP, DNS, SMTP, and SSL requests with mock files, logging all outbound calls from the malware.*

#### Step 2: Deploy the Flare VM Analysis Box
1. Create a VM with a clean installation of Windows 10 (Evaluation ISO). Allocate 4GB RAM, 60GB disk. Set Network to Host-Only.
2. Configure static IP:
   - IP: `10.0.9.10`
   - Subnet Mask: `255.255.255.0`
   - Gateway: `10.0.9.2` (Routes all gateway traffic to REMnux)
   - DNS: `10.0.9.2` (Forces DNS resolution through REMnux DNS)
3. Download the Flare VM installer script (GitHub: `mandiant/flare-vm`).
4. Disable Windows Defender and all AV components (use tools like *Defeat-Defender* or group policies).
5. Run the Flare VM installation script in administrative PowerShell.
   *This script downloads and installs 100+ malware analysis utilities (x64dbg, Ghidra, PEview, Wireshark, Process Hacker, Regshot). The installation takes 1–3 hours and requires multiple reboots.*
6. **CRITICAL**: Once the installation completes, take a **VM Snapshot** named `CLEAN_STATE`. You will roll back to this snapshot after analyzing every malware sample.

#### Step 3: Run a Safe Detonation Triage Test
1. Set Flare VM and REMnux to run concurrently.
2. Open **Wireshark** on REMnux, capturing traffic on the Host-Only interface.
3. On Flare VM, download a benign malware simulation sample, like the **EICAR anti-malware test file**.
4. Run **Process Monitor (ProcMon)** and **Regshot** on Flare VM. Take a first registry snapshot (1st shot).
5. Detonate the file. Take a second registry snapshot (2nd shot) and compare them.
6. Verify in ProcMon what process spawned the EICAR execution, what registry keys changed, and verify in REMnux's Wireshark what DNS or HTTP queries the target attempted.
7. Roll back Flare VM to the `CLEAN_STATE` snapshot.


---

