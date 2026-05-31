## 📚 REFERENCE LIBRARY: SCRIPTING-CHALLENGES
<a id="reference-library-scripting-challenges"></a>

# Practical Security Scripting Challenges
## Interview Prep & Skill Validation for Python, PowerShell, and Bash

This document provides realistic scripting challenges commonly encountered during security engineering and analyst technical interviews. Each challenge includes the **Scenario**, **Code Template**, **Target Output**, and **Complete Reference Solution**.

---

## 🐍 Challenge 1: Python Log Parser & Threat Intel API Lookup
* **Target Role**: SOC Analyst L2 / Security Engineer
* **Objective**: Parse a raw web server access log, extract unique client IP addresses, query a Threat Intelligence API for their reputation, and generate a structured JSON alert for high-risk IPs.

### 📋 The Scenario
You are given a web server log file (`access.log`) in Common Log Format:
`127.0.0.1 - - [22/May/2026:10:15:30 +0530] "GET /admin/config.php HTTP/1.1" 404 2316`

Write a Python script that:
1. Opens and reads `access.log`.
2. Extracts all unique IP addresses using regular expressions.
3. Simulates a Threat Intelligence API lookup (e.g., VirusTotal or AbuseIPDB) via an HTTP GET request (mocked in the solution).
4. If the IP has a malicious score greater than 5 (out of 10), output a JSON alert containing: `ip_address`, `request_count`, `malicious_score`, and `threat_category`.

### 💻 Reference Solution
```python
import re
import json
import urllib.request
import urllib.error

# Regex to match IPv4 addresses
IP_REGEX = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'

# Mock Threat Intelligence API URL (returns dummy data for test IPs)
# In a real interview, you would use requests or urllib to query an API like:
# f"https://api.abuseipdb.com/api/v2/check?ipAddress={ip}"
def query_threat_intel(ip):
    # Simulating API response based on IP subnet
    # In reality, this would make an HTTP request with an API key header
    last_octet = int(ip.split('.')[-1])
    if last_octet % 7 == 0:
        return {"malicious_score": 8, "category": "Botnet C2"}
    elif last_octet % 5 == 0:
        return {"malicious_score": 6, "category": "Web Scanner"}
    else:
        return {"malicious_score": 0, "category": "Clean"}

def parse_logs(log_file_path):
    ip_counts = {}
    
    # Read and aggregate IP request counts
    try:
        with open(log_file_path, 'r') as file:
            for line in file:
                match = re.search(IP_REGEX, line)
                if match:
                    ip = match.group(0)
                    ip_counts[ip] = ip_counts.get(ip, 0) + 1
    except FileNotFoundError:
        print(f"Error: File '{log_file_path}' not found.")
        return
        
    alerts = []
    
    # Query intel and build alerts
    for ip, count in ip_counts.items():
        intel = query_threat_intel(ip)
        if intel["malicious_score"] > 5:
            alert = {
                "ip_address": ip,
                "request_count": count,
                "malicious_score": intel["malicious_score"],
                "threat_category": intel["category"]
            }
            alerts.append(alert)
            
    # Output structured JSON alerts
    print(json.dumps(alerts, indent=4))

# Execution
if __name__ == "__main__":
    # Create temporary access.log for testing if it doesn't exist
    sample_log = """
    192.168.1.14 - - [22/May/2026:10:00:00] "GET /index.html HTTP/1.1" 200 4048
    185.220.101.35 - - [22/May/2026:10:01:05] "GET /wp-login.php HTTP/1.1" 401 1024
    185.220.101.35 - - [22/May/2026:10:01:10] "POST /wp-login.php HTTP/1.1" 401 1024
    8.8.8.8 - - [22/May/2026:10:02:15] "GET /images/logo.png HTTP/1.1" 200 12500
    198.51.100.21 - - [22/May/2026:10:03:00] "GET /shell.jsp HTTP/1.1" 404 350
    """
    with open("access.log", "w") as f:
        f.write(sample_log.strip())
        
    parse_logs("access.log")
```

---

## 🟦 Challenge 2: PowerShell Active Directory Logon Auditor
* **Target Role**: Windows Security Administrator / Blue Team Analyst
* **Objective**: Audit Windows Event logs on a local system or domain controller for RDP logons (Logon Type 10) that occur outside standard working hours.

### 📋 The Scenario
Attackers often use compromised credentials via RDP outside standard hours to avoid detection.
Write a PowerShell script that:
1. Queries the local Windows Security Event log for **Event ID 4624** (Successful Logon).
2. Filters for **Logon Type 10** (RemoteInteractive - RDP).
3. Evaluates if the event timestamp is outside standard hours (Standard: Monday to Friday, 8:00 AM to 6:00 PM).
4. Outputs a table containing `TimeCreated`, `TargetUserName`, `IpAddress`, and `HourOfDay`.

### 💻 Reference Solution
```powershell
# Windows Security Event Audit Script
# Run with administrative permissions to read Security logs.

function Audit-RdpLogons {
    [CmdletBinding()]
    param(
        [int]$DaysToAudit = 7,
        [int]$StartHour = 8,  # 8 AM
        [int]$EndHour = 18    # 6 PM
    )

    Write-Host "Querying security event log for RDP logons in the last $DaysToAudit days..." -ForegroundColor Cyan
    
    # Filter XML pattern for performance rather than piping Get-EventLog (which is slow)
    $FilterXml = @"
<QueryList>
  <Query Id="0" Path="Security">
    <Select Path="Security">
      *[System[(EventID=4624) and TimeCreated[timediff(@SystemTime) &lt;= $( $DaysToAudit * 24 * 60 * 60 * 1000 )]]]
    </Select>
  </Query>
</QueryList>
"@

    try {
        $Events = Get-WinEvent -FilterXml $FilterXml -ErrorAction Stop
    } catch {
        Write-Warning "No Event ID 4624 found or access denied."
        return
    }

    $AnomalousLogons = [System.Collections.Generic.List[Object]]::new()

    foreach ($Event in $Events) {
        # Parse XML payload to extract logon type and IP address
        $Xml = [xml]$Event.ToXml()
        
        # LogonType is EventData Parameter 8, IpAddress is Parameter 18
        $LogonType = $Xml.Event.EventData.Data | Where-Object { $_.Name -eq "LogonType" } | Select-Object -ExpandProperty "#text"
        $IpAddress = $Xml.Event.EventData.Data | Where-Object { $_.Name -eq "IpAddress" } | Select-Object -ExpandProperty "#text"
        $UserName = $Xml.Event.EventData.Data | Where-Object { $_.Name -eq "TargetUserName" } | Select-Object -ExpandProperty "#text"

        # Logon Type 10 = RDP (Remote Interactive)
        if ($LogonType -eq "10") {
            $Time = $Event.TimeCreated
            $Day = $Time.DayOfWeek
            $Hour = $Time.Hour

            # Check if outside working hours (Monday=1, Sunday=7, etc.)
            $IsWeekend = ($Day -eq "Saturday") -or ($Day -eq "Sunday")
            $IsOffHours = ($Hour -lt $StartHour) -or ($Hour -ge $EndHour)

            if ($IsWeekend -or $IsOffHours) {
                $LogonRecord = [PSCustomObject]@{
                    TimeCreated    = $Time
                    TargetUserName = $UserName
                    IpAddress      = $IpAddress
                    DayOfWeek      = $Day
                    HourOfDay      = $Hour
                }
                $null = $AnomalousLogons.Add($LogonRecord)
            }
        }
    }

    if ($AnomalousLogons.Count -eq 0) {
        Write-Host "No off-hours RDP logons detected." -ForegroundColor Green
    } else {
        Write-Host "ALERT: Detected $($AnomalousLogons.Count) Off-Hours RDP Logons!" -ForegroundColor Red
        $AnomalousLogons | Out-String | Write-Host -ForegroundColor Yellow
    }
}

# Example execution:
# Audit-RdpLogons -DaysToAudit 14
```

---

## 🐚 Challenge 3: Bash Automated Scanner Detection & Blocking
* **Target Role**: Linux System Administrator / Security Operator
* **Objective**: Scan Nginx server logs for automated scanning tools (e.g., `sqlmap`, `nikto`, `dirbuster`), extract the offending source IPs, and generate `iptables` rules to drop their traffic.

### 📋 The Scenario
Your server is experiencing high traffic from automated vulnerability tools. You need a script that can run on a cron job every 5 minutes to automatically shield the server.

Write a Bash script that:
1. Reads `nginx_access.log`.
2. Searches for User-Agent patterns matching: `sqlmap`, `nikto`, `dirbuster`, `nmap`, `masscan`.
3. Extracts the unique IP addresses of those requests.
4. Generates a shell commands list to block those IPs using `iptables -A INPUT -s [IP] -j DROP` (checking first to ensure the rule isn't already active).

### 💻 Reference Solution
```bash
#!/bin/bash

# Automated Attacker IP Blacklister
# Must be executed as root to apply firewall rules.

LOG_FILE="/var/log/nginx/access.log"
MOCK_LOG="nginx_access.log"

# Fallback to local file for testing/interview purposes
if [ ! -f "$LOG_FILE" ]; then
    LOG_FILE=$MOCK_LOG
fi

# Ensure log file exists
if [ ! -f "$LOG_FILE" ]; then
    echo "Creating mock nginx log for test..."
    echo '192.168.4.15 - - [22/May/2026:10:00:00] "GET / HTTP/1.1" 200 4048 "sqlmap/1.4"' > "$LOG_FILE"
    echo '203.0.113.88 - - [22/May/2026:10:01:00] "GET /admin HTTP/1.1" 404 150 "Nikto/2.1.5"' >> "$LOG_FILE"
    echo '192.168.4.15 - - [22/May/2026:10:02:00] "GET /about.html HTTP/1.1" 200 4048 "Mozilla/5.0"' >> "$LOG_FILE"
fi

# Define scanner signatures (case-insensitive)
SCANNER_PATTERN="sqlmap|nikto|dirbuster|nmap|masscan"

echo "[+] Analyzing logs for automated scanners..."

# Extract unique IPs targeting the server with scanner signatures
OFFENDING_IPS=$(grep -E -i "$SCANNER_PATTERN" "$LOG_FILE" | awk '{print $1}' | sort -u)

if [ -z "$OFFENDING_IPS" ]; then
    echo "[+] No automated scanners detected."
    exit 0
fi

for IP in $OFFENDING_IPS; do
    # Check if the IP is already blocked in iptables
    if iptables -C INPUT -s "$IP" -j DROP &>/dev/null; then
        echo "[*] IP $IP is already blocked."
    else
        echo "[!] BLOCKING IP: $IP (Scanner signature detected)"
        # To actually block, uncomment the following line in production:
        # iptables -A INPUT -s "$IP" -j DROP
        echo "Command executed: iptables -A INPUT -s $IP -j DROP"
    fi
done
```


---

