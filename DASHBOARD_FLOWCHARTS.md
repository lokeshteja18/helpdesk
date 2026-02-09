# Help Desk IBM - Dashboard Flowcharts

## 1. USER DASHBOARD FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER LOGIN                             │
│              (Email: user@gmail.com, Pass: user123)             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VALIDATE CREDENTIALS                         │
│          ✓ Verify email & password in database                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               GENERATE JWT TOKEN (24h validity)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   USER DASHBOARD LOADED                         │
│                     (Welcome Screen)                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌─────────┐      ┌──────────┐    ┌──────────┐
   │ VIEW    │      │ CREATE   │    │ PROFILE  │
   │ TICKETS │      │ TICKET   │    │ UPDATE   │
   └────┬────┘      └──────┬───┘    └────┬─────┘
        │                  │             │
        │                  │             │
        ▼                  ▼             ▼
   ┌─────────────┐   ┌──────────────┐  ┌──────────┐
   │DISPLAY STATS│   │FORM VALIDATION│  │EDIT INFO │
   │- Total      │   │- Title       │  │- Name    │
   │- Open       │   │- Description │  │- Phone   │
   │- Closed     │   │- Category    │  │- Dept    │
   │- InProgress │   │- Priority    │  └────┬─────┘
   └────┬────────┘   └──────┬───────┘       │
        │                   │                │
        ▼                   ▼                ▼
   ┌─────────────┐   ┌──────────────┐  ┌──────────┐
   │ FETCH FROM  │   │ SAVE TO      │  │ UPDATE   │
   │ GET /tickets│   │ POST /tickets│  │ DB       │
   └────┬────────┘   └──────┬───────┘  └──────┬───┘
        │                   │                  │
        ▼                   ▼                  ▼
   ┌─────────────┐   ┌──────────────┐  ┌──────────┐
   │RENDER CARDS │   │SHOW SUCCESS  │  │ REFRESH  │
   │& CHARTS     │   │MESSAGE       │  │ PROFILE  │
   └─────────────┘   └──────────────┘  └──────────┘


### USER DASHBOARD DATA FLOW

┌──────────────────┐
│   User Session   │
│  (JWT Token)     │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Fetch User Metrics (GET /tickets)  │
│                                     │
│  Backend Calculation:               │
│  - totalTickets = all user tickets  │
│  - openTickets = status = 'open'    │
│  - closedTickets = status = 'closed'│
│  - inProgress = status = 'in-prog'  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Display Dashboard Cards           │
│   ┌─────────────────────────────┐   │
│   │ Total Tickets: 12           │   │
│   ├─────────────────────────────┤   │
│   │ Open Tickets: 5             │   │
│   ├─────────────────────────────┤   │
│   │ Closed Tickets: 7           │   │
│   ├─────────────────────────────┤   │
│   │ In Progress: 0              │   │
│   └─────────────────────────────┘   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Navigation Menu Options            │
│  ✓ View All Tickets                 │
│  ✓ Create New Ticket                │
│  ✓ View Profile                     │
│  ✓ Logout                           │
└─────────────────────────────────────┘

```

---

## 2. AGENT DASHBOARD FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                         AGENT LOGIN                             │
│            (Email: agent@gmail.com, Pass: agent123)             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                VALIDATE CREDENTIALS & ROLE                      │
│        Verify: role = 'agent' | 'admin'                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               GENERATE JWT TOKEN (24h validity)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  AGENT DASHBOARD LOADED                         │
│         (Performance & Productivity Metrics)                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬────────────────┐
        │                │                │                │
        ▼                ▼                ▼                ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │VIEW      │   │UPDATE    │   │ADD NOTES │   │PROFILE   │
   │ASSIGNED  │   │TICKET    │   │TO TICKET │   │UPDATE    │
   │TICKETS   │   │STATUS    │   │          │   │          │
   └────┬─────┘   └──────┬───┘   └────┬─────┘   └────┬─────┘
        │                │            │              │
        ▼                ▼            ▼              ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │FETCH FROM│   │VALIDATE  │   │VALIDATE  │   │EDIT      │
   │GET /agents│  │STATUS    │   │NOTE TEXT │   │PROFILE   │
   │/assigned │  │UPDATE    │   │SAVE NOTE │   │SAVE      │
   └────┬─────┘   └──────┬───┘   └────┬─────┘   └────┬─────┘
        │                │            │              │
        ▼                ▼            ▼              ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │DISPLAY   │   │SHOW      │   │ADD TO    │   │REFRESH   │
   │- 5 Total │   │SUCCESS   │   │TICKET    │   │PROFILE   │
   │- 3 Done  │   │SENT TO   │   │NOTES     │   │DATA      │
   │- 2 Pend  │   │DB        │   │ARRAY     │   │          │
   └──────────┘   └──────────┘   └──────────┘   └──────────┘


### AGENT DASHBOARD WORKFLOW

1. TICKET QUEUE MANAGEMENT
   ┌──────────────────────┐
   │ Assigned Tickets     │
   │ (Filter by agentId)  │
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────────────────────────┐
   │ FOR EACH TICKET:                         │
   │ Display:                                 │
   │ • Ticket ID & Title                     │
   │ • Priority (High/Medium/Low)            │
   │ • Current Status                        │
   │ • User Name                             │
   │ • Created Date                          │
   │ • Action Buttons:                       │
   │   - View Details                        │
   │   - Update Status                       │
   │   - Add Notes                           │
   │   - Assign to Another Agent             │
   └──────────┬───────────────────────────────┘
              │
              ▼
   ┌──────────────────────────────────────────┐
   │ TICKET STATUS FLOW:                      │
   │                                          │
   │ open → in-progress → closed              │
   │        ↓                                 │
   │     on-hold → in-progress → closed       │
   └──────────────────────────────────────────┘

2. PERFORMANCE METRICS
   ┌──────────────────────────────────────────┐
   │ Assigned Tickets:      5                 │
   │ Resolved This Month:   3                 │
   │ Pending Tickets:       2                 │
   │ Avg Resolution Time:   4.5 hours         │
   │ Quality Score:         4.7/5.0           │
   └──────────────────────────────────────────┘

3. DAILY TASK PRIORITY
   High Priority (Critical) 
        ↓
   Medium Priority
        ↓
   Low Priority
        ↓
   [Agent processes in order]

```

---

## 3. ADMIN DASHBOARD FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN LOGIN                              │
│             (Email: admin@gmail.com, Pass: admin123)            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               VALIDATE CREDENTIALS & ROLE                       │
│         Verify: role = 'admin' | 'superadmin'                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              GENERATE JWT TOKEN (24h validity)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ADMIN DASHBOARD LOADED                         │
│        (System Overview & Ticket Management Center)             │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────┬───────┼────────┬────────────┬──────────┐
        │        │       │        │            │          │
        ▼        ▼       ▼        ▼            ▼          ▼
   ┌────────┐┌─────┐┌────────┐┌────────┐┌─────────┐┌─────────┐
   │VIEW ALL││ASSIGN││GENERATE││UPDATE  ││MONITOR  ││PROFILE  │
   │TICKETS ││AGENTS││REPORTS ││STATUS  ││AGENTS   ││SETTINGS │
   └───┬────┘└──┬───┘└───┬────┘└───┬────┘└────┬────┘└────┬────┘
       │         │        │         │          │          │
       ▼         ▼        ▼         ▼          ▼          ▼
   ┌────────┐┌──────┐┌──────────┐┌────────┐┌────────┐┌────────┐
   │FETCH   ││SELECT││CALCULATE ││VALIDATE││FETCH   ││EDIT    │
   │ALL     ││AGENT ││METRICS   ││STATUS  ││AGENTS  ││SETTINGS│
   │TICKETS ││FROM  ││PULL FROM ││UPDATE  ││DATA    ││DATA    │
   │FROM DB ││DB    ││DB        ││DB      ││FROM DB ││SAVE    │
   └───┬────┘└──┬───┘└───┬──────┘└───┬────┘└───┬────┘└────┬───┘
       │         │        │          │         │          │
       ▼         ▼        ▼          ▼         ▼          ▼
   ┌────────┐┌──────┐┌──────────┐┌────────┐┌────────┐┌────────┐
   │RENDER  ││SEND  ││DISPLAY   ││NOTIFY  ││RENDER  ││CONFIRM│
   │TABLE   ││API   ││REPORTS   ││USER &  ││AGENT   ││SAVED  │
   │WITH    ││UPD   ││CHARTS    ││AGENT   ││LIST    ││       │
   │FILTER  ││      ││          ││        ││        ││       │
   └────────┘└──────┘└──────────┘└────────┘└────────┘└────────┘


### ADMIN DASHBOARD DATA FLOW

┌──────────────────────────────────────────────────────────┐
│            SYSTEM OVERVIEW SECTION                       │
│                                                          │
│  ┌────────────────┐  ┌────────────────┐                │
│  │ Total Tickets  │  │ Open Tickets   │                │
│  │      20        │  │       8        │                │
│  ├────────────────┤  ├────────────────┤                │
│  │ [Load from DB] │  │ [Filter by     │                │
│  │ COUNT all      │  │  status:open]  │                │
│  └────────────────┘  └────────────────┘                │
│                                                          │
│  ┌────────────────┐  ┌────────────────┐                │
│  │ Closed Today   │  │ Response Time  │                │
│  │      12        │  │    3.2 hours   │                │
│  ├────────────────┤  ├────────────────┤                │
│  │ [Filter by     │  │ [Calculate avg │                │
│  │  status:closed]│  │  resolution]   │                │
│  └────────────────┘  └────────────────┘                │
│                                                          │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│         AGENT PERFORMANCE SECTION                        │
│                                                          │
│  Agent Name    │ Assigned │ Resolved │ Pending           │
│  ──────────────┼──────────┼──────────┼────────           │
│  John Agent    │    5     │    3     │   2               │
│  Jane Agent    │    4     │    4     │   0               │
│  Mike Agent    │    6     │    2     │   4               │
│                                                          │
│  [Fetch agents with role='agent']                       │
│  [Count assigned/resolved tickets per agent]            │
│                                                          │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│         TICKET MANAGEMENT SECTION                        │
│                                                          │
│  [View Full Ticket List]                                │
│  [Filter by Status/Priority]                            │
│  [Assign Unassigned Tickets]                            │
│  [Close/Resolve Tickets]                                │
│                                                          │
│  ASSIGNMENT WORKFLOW:                                   │
│  1. Select unassigned ticket                            │
│  2. Choose agent from dropdown                          │
│  3. Send PUT /admin/ticket/:id/assign                   │
│  4. Update assignedTo field in DB                       │
│  5. Show success notification                           │
│                                                          │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│         REPORTS SECTION                                  │
│                                                          │
│  By Status:                                              │
│  • Open: 8 (40%)                                        │
│  • In-Progress: 7 (35%)                                 │
│  • Closed: 5 (25%)                                      │
│                                                          │
│  By Priority:                                            │
│  • High: 5                                              │
│  • Medium: 10                                           │
│  • Low: 5                                               │
│                                                          │
│  By Category:                                            │
│  • Account: 8                                           │
│  • Technical: 7                                         │
│  • Security: 3                                          │
│  • Billing: 2                                           │
│                                                          │
└──────────────────────────────────────────────────────────┘

```

---

## 4. SUPER ADMIN DASHBOARD FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUPER ADMIN LOGIN                            │
│        (Email: superadmin@gmail.com, Pass: superadmin123)       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               VALIDATE CREDENTIALS & ROLE                       │
│            Verify: role = 'superadmin'                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              GENERATE JWT TOKEN (24h validity)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               SUPER ADMIN DASHBOARD LOADED                      │
│      (System-Wide Control Panel & User Management)              │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬────────────────┐
        │                │                │                │
        ▼                ▼                ▼                ▼
   ┌──────────┐   ┌────────────┐   ┌────────────┐   ┌──────────┐
   │MANAGE    │   │VIEW SYSTEM │   │CONFIGURE  │   │PROFILE   │
   │USERS     │   │OVERVIEW    │   │SETTINGS   │   │SETTINGS  │
   │(CRUD)    │   │ANALYTICS   │   │POLICIES   │   │          │
   └────┬─────┘   └──────┬─────┘   └────┬──────┘   └────┬─────┘
        │                │              │               │
        ▼                ▼              ▼               ▼
   ┌──────────┐   ┌────────────┐   ┌──────────┐   ┌──────────┐
   │VALIDATE  │   │FETCH ALL   │   │FETCH     │   │EDIT ALL  │
   │USER DATA │   │STATS       │   │SETTINGS  │   │SETTINGS  │
   │CRUD OPS  │   │BREAKDOWN   │   │CONFIG    │   │SAVE      │
   └────┬─────┘   └──────┬─────┘   └────┬─────┘   └────┬─────┘
        │                │              │               │
        ▼                ▼              ▼               ▼
   ┌──────────┐   ┌────────────┐   ┌──────────┐   ┌──────────┐
   │SEND      │   │DISPLAY     │   │RENDER    │   │CONFIRM   │
   │API CALL  │   │DASHBOARD   │   │SETTINGS  │   │SETTINGS  │
   │(CREATE/  │   │CARDS       │   │FORM      │   │SAVED     │
   │UPDATE/   │   └────────────┘   └──────────┘   └──────────┘
   │DELETE)   │
   └──────────┘


### SUPER ADMIN DASHBOARD DATA FLOW

┌───────────────────────────────────────────────────────────┐
│         SYSTEM OVERVIEW - TOP METRICS                     │
│                                                           │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │ Total Users     │  │ Staff Members   │               │
│  │      10         │  │       3         │               │
│  ├─────────────────┤  ├─────────────────┤               │
│  │[COUNT all       │  │[COUNT role !=   │               │
│  │ users]          │  │ 'user']         │               │
│  └─────────────────┘  └─────────────────┘               │
│                                                           │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │ Total Tickets   │  │ Open Tickets    │               │
│  │     120         │  │      15         │               │
│  ├─────────────────┤  ├─────────────────┤               │
│  │[COUNT all       │  │[COUNT status=   │               │
│  │ tickets]        │  │ 'open']         │               │
│  └─────────────────┘  └─────────────────┘               │
│                                                           │
└───────────────────────────────────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────────┐
│         USER ROLE BREAKDOWN                              │
│                                                           │
│  ┌──────────────────────────────────┐                   │
│  │ Regular Users:        7           │                   │
│  │ Agents:               2           │                   │
│  │ Admins:               1           │                   │
│  │ Super Admins:         1           │                   │
│  │                                   │                   │
│  │ [Fetch all users & filter by role]│                   │
│  └──────────────────────────────────┘                   │
│                                                           │
└───────────────────────────────────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────────┐
│         USER MANAGEMENT SECTION                          │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ User List:                                          │ │
│  ├──────────┬─────────┬──────────┬────────┬───────────┤ │
│  │Name      │Email    │Role      │Status  │Actions    │ │
│  ├──────────┼─────────┼──────────┼────────┼───────────┤ │
│  │John Doe  │john@..  │user      │Active  │Edit|Delete│ │
│  │Jane Smith│jane@..  │agent     │Active  │Edit|Delete│ │
│  │Mike Ops  │mike@..  │admin     │Active  │Edit|Delete│ │
│  └──────────┴─────────┴──────────┴────────┴───────────┘ │
│                                                           │
│  CRUD OPERATIONS:                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ CREATE:                                          │  │
│  │ • Provide: Name, Email, Password, Role           │  │
│  │ • API: POST /superadmin/users                    │  │
│  │ • DB: Add to users array                         │  │
│  │                                                  │  │
│  │ READ:                                            │  │
│  │ • API: GET /superadmin/users                     │  │
│  │ • Display: All users list                        │  │
│  │                                                  │  │
│  │ UPDATE:                                          │  │
│  │ • Edit: Name, Role, Status, Department, Phone   │  │
│  │ • API: PUT /superadmin/users/:userId             │  │
│  │ • DB: Update user record                         │  │
│  │                                                  │  │
│  │ DELETE:                                          │  │
│  │ • Confirm deletion (cannot undo)                 │  │
│  │ • API: DELETE /superadmin/users/:userId          │  │
│  │ • DB: Remove user from array                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                           │
└───────────────────────────────────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────────┐
│         SYSTEM SETTINGS SECTION                          │
│                                                           │
│  Configure:                                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Ticket Priorities:                               │   │
│  │  □ Low  □ Medium  □ High  □ Critical             │   │
│  │                                                  │   │
│  │ Ticket Statuses:                                 │   │
│  │  □ Open  □ In-Progress  □ Closed  □ On-Hold      │   │
│  │                                                  │   │
│  │ Ticket Categories:                               │   │
│  │  □ Account  □ Technical  □ Security  □ Billing   │   │
│  │                                                  │   │
│  │ SLA (Service Level Agreement):                   │   │
│  │  Low Priority:      72 hours                      │   │
│  │  Medium Priority:   48 hours                      │   │
│  │  High Priority:     24 hours                      │   │
│  │  Critical:          4 hours                       │   │
│  │                                                  │   │
│  │ Max Tickets Per Agent:  10                        │   │
│  │                                                  │   │
│  │ [Save Settings Button]                           │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
└───────────────────────────────────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────────┐
│         ANALYTICS & REPORTS SECTION                      │
│                                                           │
│  System Health:                                           │
│  ├─ Total Users:           10                            │
│  ├─ Active Users:          9                             │
│  ├─ Inactive Users:        1                             │
│  │                                                       │
│  ├─ Total Tickets:        120                            │
│  ├─ Open Tickets:         15                             │
│  ├─ Avg Resolution Time:  5 hours                        │
│  └─ Customer Satisfaction: 87%                           │
│                                                           │
│  Growth Metrics:                                          │
│  ├─ Users (This Month):    +2                            │
│  ├─ Tickets (This Month):  +35                           │
│  └─ Staff (This Month):    +1                            │
│                                                           │
└───────────────────────────────────────────────────────────┘

```

---

## 5. COMPLETE SYSTEM FLOW DIAGRAM

```
                          ┌──────────────────┐
                          │  USER REGISTRY   │
                          │  (Database)      │
                          └────────┬─────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │  LOGIN PAGE  │ │ REGISTER     │ │ FORGOT PASS  │
            │ (Auth)       │ │ (Register)   │ │ (Reset)      │
            └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
                   │                │               │
                   │ JWT Token      │ Create User   │ Token
                   │ Generated      │ Generated     │ Sent
                   │                │               │
                   ▼                ▼               ▼
            ┌──────────────────────────────────────────────┐
            │         ROLE-BASED ROUTING                   │
            │                                              │
            ├─► role = 'user'     ──► USER DASHBOARD      │
            ├─► role = 'agent'    ──► AGENT DASHBOARD     │
            ├─► role = 'admin'    ──► ADMIN DASHBOARD     │
            └─► role = 'superadmin' ──► SUPERADMIN DASH   │
            └──────────────────────────────────────────────┘
                   │
                   ▼
            ┌──────────────────────────────────────────────┐
            │    DASHBOARD-SPECIFIC OPERATIONS             │
            │                                              │
            │ USER:                                        │
            │  • View Tickets (mine only)                 │
            │  • Create Ticket                            │
            │  • View Status                              │
            │                                              │
            │ AGENT:                                       │
            │  • View Assigned Tickets                    │
            │  • Update Status                            │
            │  • Add Notes                                │
            │                                              │
            │ ADMIN:                                       │
            │  • View All Tickets                         │
            │  • Assign to Agents                         │
            │  • View Reports                             │
            │  • Manage Agents                            │
            │                                              │
            │ SUPERADMIN:                                  │
            │  • Manage All Users                         │
            │  • View System Analytics                    │
            │  • Configure Settings                       │
            │  • System Administration                    │
            └──────────────────────────────────────────────┘
                   │
                   ▼
            ┌──────────────────────────────────────────────┐
            │    DATA PERSISTENCE & UPDATES                │
            │                                              │
            │ Backend Database Operations:                 │
            │ • Fetch operations (GET)                     │
            │ • Create operations (POST)                   │
            │ • Update operations (PUT)                    │
            │ • Delete operations (DELETE)                 │
            │                                              │
            │ Ticket Lifecycle:                            │
            │ Create → Open → Assign → In-Progress → Close│
            └──────────────────────────────────────────────┘

```

---

## KEY FEATURES BY ROLE

### User Dashboard
- ✅ View personal tickets
- ✅ Create new tickets
- ✅ Track ticket status
- ✅ View profile
- ❌ Cannot assign or close tickets
- ❌ Cannot view other users' tickets

### Agent Dashboard
- ✅ View assigned tickets
- ✅ Update ticket status
- ✅ Add notes to tickets
- ✅ View performance metrics
- ❌ Cannot create tickets (users do)
- ❌ Cannot assign tickets (admin does)

### Admin Dashboard
- ✅ View all tickets
- ✅ Assign tickets to agents
- ✅ Close tickets
- ✅ View agent performance
- ✅ Generate reports
- ❌ Cannot manage users (superadmin does)

### Super Admin Dashboard
- ✅ Manage all users (CRUD)
- ✅ View system analytics
- ✅ Configure system settings
- ✅ View all operations
- ✅ Full system control
- ✅ Can perform admin tasks

---

## AUTHENTICATION FLOW (All Roles)

```
┌─────────────────┐
│ User Input      │
│ (email/password)│
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ POST /api/auth/login     │
│ Validate credentials     │
└────────┬─────────────────┘
         │
         ▼
    ✓ Valid?
    │         │
    ▼         ▼
  YES       NO
   │         └──► Error 401
   │              "Invalid credentials"
   ▼
┌──────────────────────────┐
│ Generate JWT Token       │
│ Claims: {id, email,      │
│         role, name}      │
│ Expires: 24 hours        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Return Token + User Data │
│ {token, user}            │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Store Token in           │
│ localStorage             │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Redirect to              │
│ Role-based Dashboard     │
└──────────────────────────┘

All Protected Routes:
Authorization: Bearer <token>
                ↓
         Verify Token
         (JWT Middleware)
                ↓
         Grant/Deny Access
```

---

## DATABASE SCHEMA (Summary)

### Users Table
```
{
  id: number,
  name: string,
  email: string (unique),
  password: string (hashed in production),
  role: 'user' | 'agent' | 'admin' | 'superadmin',
  createdAt: date,
  isActive: boolean,
  department: string,
  phone: string
}
```

### Tickets Table
```
{
  id: number,
  userId: number (references Users),
  title: string,
  description: string,
  status: 'open' | 'in-progress' | 'closed' | 'on-hold',
  priority: 'low' | 'medium' | 'high' | 'critical',
  category: string,
  createdAt: date,
  updatedAt: date,
  assignedTo: number (agent id, nullable),
  notes: array,
  resolutionNotes: string
}
```

---

This comprehensive flowchart documentation covers all dashboard flows, user journeys, and system interactions for the Help Desk IBM application.
