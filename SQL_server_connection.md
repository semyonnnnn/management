# FreeTDS Connection Setup Guide

This document details the step-by-step process used to configure a FreeTDS server alias and establish a connection to a legacy Microsoft SQL Server 2005 instance.

---

## Files & Directories Created

| Action     | Created Item            | Full File System Path                            | Scope / Lifetime                                        |
| :--------- | :---------------------- | :----------------------------------------------- | :------------------------------------------------------ |
| **Step 1** | Configuration File      | `/tmp/eris.conf`                                 | Temporary staging file; cleared on system reboot.       |
| **Step 2** | Connection Verification | _N/A (In-Memory execution)_                      | Reads `/tmp/eris.conf` to query the database via STDIN. |
| **Step 3** | User Config File        | `/home/<user>/.freetds.conf` (`~/.freetds.conf`) | Permanent hidden file; persists per user session.       |

---

## Target Legacy Environment

- **Target OS/RDBMS:** Microsoft SQL Server 2005 - 9.00.5057.00 (X64)
- **Protocol Requirement:** FreeTDS TDS version `7.2` (specifically required for SQL Server 2005/2008 compatibility)
- **Encryption Settings:** Disabled (`encryption = off`) due to legacy TLS/SSL limitations on SQL Server 2005

---

## Overview of Commands Executed

```bash
# 1. Create the temporary configuration file for legacy SQL Server 2005
cat > /tmp/eris.conf <<'EOF'
[eris]
    host = 10.166.20.49
    port = 1433
    tds version = 7.2
    encryption = off
EOF

# 2. Test the configuration inline against SQL Server 2005
printf 'SELECT @@VERSION\nGO\n' | FREETDSCONF=/tmp/eris.conf tsql -S eris -U sql_server_username -P 'sql_server_password'

# 3. Promote to permanent user configuration
cp /tmp/eris.conf ~/.freetds.conf
```
