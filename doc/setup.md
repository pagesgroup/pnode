# Setup

1. Install NodeJS
1. Install MS-SQL Express server
1. Install Polymac PNode `npm i @pagesgroup/pnode`






# MS-SQL Server

1. Download SQL Server 2019 https://www.microsoft.com/en-us/download/details.aspx?id=101064
1. ODBC 19 https://learn.microsoft.com/en-us/sql/connect/oledb/download-oledb-driver-for-sql-server?view=sql-server-ver17
1. [https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170)
1. [https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170)
1. X86   	
1. X86   [https://aka.ms/vs/17/release/vc_redist.x86.exe](https://aka.ms/vs/17/release/vc_redist.x86.exe)	
1. X64   [https://aka.ms/vs/17/release/vc_redist.x64.exe](https://aka.ms/vs/17/release/vc_redist.x64.exe)	

1. Bij problemen verwijderen oude ODBC drivers met Apps & onderdelen (of `appwiz.cpl`)

1. Installeer ook MSSMS
1. Login bij server `localhost\sqlexpress`
1. Server > Properties > Security > (x) SQL Server and Windows Authentication mode
1. [OK]
1. Start > Alles > Microsoft SQL Server 2019 > SQL Server 2019 Configuration Manager
1. SQL Server 2019 Configuration Manager (Local)
    1. SQL Server Network Configuration
        1. Protocols for SQLEXPRESS
            1. TCP/IP
                1. Eigenschappen
                    1. Protocol
                        1. Enabled: `Yes`
                    1. IP Adresses
                        1. IPAll > TCP Port: 1433
    1. SQL Server Services
        1. SQL Server Browser
            1. Eigenschappen > Service > Start mode: `Automatic`
        1. SQL Server (SQLEXPRESS) > Restart




