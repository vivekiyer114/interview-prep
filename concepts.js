// Concept data for Prep Desk.
// Each tab has categories; each concept is a [title, description] pair.
// A concept's done state is keyed on its tab and title, so renaming a title resets that one card.
window.CONCEPTS = [
  {
    id: "fundamentals",
    label: "Fundamentals",
    title: "The {n} concepts behind three years at Khyaal.",
    intro: "Everything here comes from the platform, payments, web and infrastructure work at Khyaal, or sits right next to it. Read the one-liner, go deep on your own, then mark it done.",
    categories: [
      {
        name: "Security",
        blurb: "Who can do what, how requests prove they're genuine, and how abuse is kept out.",
        items: [
          ["Authentication vs Authorization", "Authentication proves who you are; authorization decides what you're allowed to do once you're known."],
          ["Role-Based Access Control (RBAC)", "Users get roles, roles carry permission grants, and every action checks the grant instead of hard-coding who may do it."],
          ["Attribute-Based Access Control (ABAC)", "Access is decided from attributes of the user, the resource and the request context, not just a fixed role."],
          ["Broken Object-Level Authorization (IDOR)", "Fetching or editing a record by ID without checking the caller may access that specific object. The top API security risk."],
          ["Tenant Isolation", "Every query is scoped to the caller's tenant, so one customer can never read or change another customer's data."],
          ["Fail-Closed vs Fail-Open", "When a check or dependency fails, fail-closed denies access and fail-open allows it. Security paths should fail closed."],
          ["JSON Web Tokens (JWT)", "A signed, base64-encoded token carrying claims. Anyone can read it, so it proves integrity, not secrecy; keep claims minimal."],
          ["Access & Refresh Tokens", "Short-lived access tokens call APIs; a longer-lived refresh token quietly gets new ones, so sessions last without long-lived credentials."],
          ["Delegated Token Validation", "A service checks a user's token by asking the central identity service, instead of issuing or storing credentials itself."],
          ["OAuth 2.0 & OpenID Connect", "OAuth delegates access to APIs; OpenID Connect adds a signed ID token so apps can sign users in with providers like Google."],
          ["API Key Authentication", "A static secret sent in a header to identify a calling service. Simple for server-to-server calls, but must be scoped and rotated."],
          ["Cookie Flags (HttpOnly, Secure, SameSite)", "HttpOnly hides a cookie from JavaScript, Secure sends it only over HTTPS, and SameSite limits sending it on cross-site requests."],
          ["Storing Tokens in the Browser", "URLs and localStorage are readable by scripts and leak easily; httpOnly cookies keep tokens out of reach of injected code."],
          ["Cross-Site Request Forgery (CSRF)", "A malicious site makes the victim's browser send an authenticated request. Stopped by SameSite cookies and anti-CSRF tokens."],
          ["Cross-Site Scripting (XSS)", "Attacker-controlled script runs inside your page and can steal data. Prevented by escaping output, sanitising input and a CSP."],
          ["Content Security Policy & Security Headers", "Headers such as CSP, HSTS, X-Frame-Options and nosniff tell browsers to block injected scripts, framing and downgrades."],
          ["CORS", "A browser rule that blocks cross-origin requests unless the server explicitly allows the calling origin, methods and headers."],
          ["Open Redirects", "Letting user input choose a redirect target lets attackers bounce victims to phishing sites. Allow-list destinations instead."],
          ["HMAC Request Signing", "The client signs request fields and a timestamp with a shared secret; the server recomputes the hash to prove origin and integrity."],
          ["Replay Attacks & Time Windows", "Resending a captured valid request. Timestamps, short validity windows and nonces make old requests useless."],
          ["Timing-Safe Comparison", "Comparing secrets in constant time, so attackers can't guess them byte by byte from how fast a mismatch is rejected."],
          ["Hashing vs Encryption vs Signing", "Hashing is one-way, encryption is reversible with a key, and signing proves who produced data and that it wasn't changed."],
          ["Symmetric vs Asymmetric Encryption", "Symmetric uses one shared key and is fast; asymmetric uses a public/private key pair and solves key exchange, but is slow."],
          ["AES-GCM", "A fast symmetric cipher mode that both encrypts and authenticates data, so any tampering is detected on decryption."],
          ["RSA-OAEP", "RSA public-key encryption with randomised padding that resists chosen-ciphertext attacks; only suits small payloads like keys."],
          ["Hybrid Encryption", "Encrypt the data with a fresh symmetric key, then encrypt that key with the recipient's public key: fast and easy to share."],
          ["OTP Security & SMS Pumping", "One-time passcodes need limits on sends and attempts, or bots trigger mass SMS to premium numbers and brute-force codes."],
          ["Rate Limiting", "Capping requests per key over time windows. Fixed window, sliding window and token bucket trade accuracy against cost."],
          ["Progressive Blocking & Lockouts", "Repeat offenders are blocked for longer each time, and accounts lock after failed attempts, with automatic expiry."],
          ["Bot Detection (reCAPTCHA)", "Invisible scoring flags likely bots and escalates to a challenge only when the score is low, verified on the server."],
          ["Secrets Management", "Credentials belong in a secret store or encrypted Secrets, never in code, plain config or images, and should be rotatable."],
          ["Least-Privilege IAM", "Give each service only the permissions it needs, like put and get on one bucket, so a leak can do limited damage."],
          ["Keeping Secrets out of Logs & Tokens", "Logs and JWT claims are widely readable, so strip credentials and personal data before they are written or signed."],
          ["Audit Logging", "An append-only record of who changed what, when and from where, used for accountability and incident forensics."],
          ["Dependency Vulnerabilities (CVEs)", "Known flaws in libraries you depend on. Track advisories, prioritise by severity and exposure, and upgrade promptly."]
        ]
      },
      {
        name: "Databases",
        blurb: "How data is modelled, indexed, queried and changed safely in production.",
        items: [
          ["SQL vs NoSQL", "Relational databases enforce schemas, joins and transactions; document stores trade some of that for flexible shapes and easier scaling."],
          ["Document Modelling", "Design documents around how the app reads data, so the common query fetches one document instead of joining many."],
          ["Embedding vs Referencing", "Embed data that's read together and bounded in size; reference it by ID when it's shared, large or grows without limit."],
          ["Normalisation vs Denormalisation", "Normalised data stores each fact once; denormalised data copies it for faster reads, at the cost of keeping copies in sync."],
          ["Mongoose ODM", "A MongoDB library for Node.js that adds schemas, validation, middleware hooks and model methods on top of the driver."],
          ["B-Tree Indexes", "A sorted tree that lets the database find documents by key in a few steps instead of scanning the whole collection."],
          ["Compound Indexes & the ESR Rule", "Order multi-field indexes Equality, then Sort, then Range; an index only helps queries that use its leading fields."],
          ["Partial Unique Indexes", "A unique constraint that applies only to documents matching a filter, e.g. one pending order per user, not one order ever."],
          ["Adding Unique Indexes to Live Data", "Building a unique index fails if duplicates already exist, so find and clean them up first, then build the index."],
          ["TTL Indexes", "An index that makes the database delete documents automatically once a date field is older than a set age."],
          ["Reading explain() Plans", "explain() shows the chosen plan, the index used and documents examined vs returned; COLLSCAN means a full scan."],
          ["Unbounded Queries", "A query with no filter or limit can load millions of documents into memory and crash the process. Always bound reads."],
          ["lean() vs Hydrated Documents", "Hydrated ORM documents carry getters, change tracking and methods; lean() returns plain objects and uses far less memory."],
          ["Aggregation Pipelines", "A series of stages ($match, $group, $project and more) that filter, reshape and summarise data on the database server."],
          ["$lookup Joins", "An aggregation stage that joins documents from another collection. Handy, but expensive without an index on the joined field."],
          ["Offset vs Cursor Pagination", "skip/limit slows down and shifts as data changes; cursor pagination continues from the last seen key with a stable sort."],
          ["Atomic Conditional Updates", "Put the precondition in the update filter, so the check and the write happen as one step and racing transitions can't both win."],
          ["Field-Level Updates ($set)", "Update only named or dotted fields, so concurrent writers to the same document don't overwrite each other's changes."],
          ["Optimistic Concurrency Control", "Each record carries a version; an update succeeds only if the version is unchanged, otherwise the caller retries."],
          ["Multi-Document Transactions", "Group writes to several documents so they all commit or none do. Correct, but slower, so use them sparingly."],
          ["Replica Sets & Read Preference", "A primary takes writes and secondaries copy it for failover; read preference decides whether reads may hit secondaries."],
          ["Read & Write Concern", "Settings for how many replicas must acknowledge a write, and how durable the data a read returns must be."],
          ["Sharding & Shard Keys", "Splitting a collection across servers by a shard key. A good key spreads writes evenly and keeps common queries targeted."],
          ["Connection Pooling", "Reusing a fixed set of open database connections per process; total connections are pool size times replicas."],
          ["Time-Series Collections", "Collections optimised for timestamped events, bucketed by time and a low-cardinality meta field for cheap storage and queries."],
          ["Effective-Dated Records", "Keep history by closing the current row with an end date and inserting a new one, so past prices or rules stay queryable."],
          ["Soft Deletes", "Mark records deleted instead of removing them. Keeps references and history, but every query must remember the filter."],
          ["Schema Migrations", "Versioned, repeatable scripts that change data shapes and move existing records, run in order like code deployments."],
          ["Idempotent Dry-Run Migrations", "Migrations that are safe to rerun, preview their changes before writing, and log every change for audit and undo."],
          ["Expand-and-Contract Backfills", "Add the new shape, write both, backfill old data, switch reads, then remove the old shape, all without downtime."],
          ["App-Enforced Invariants", "When the database has no constraint for a rule, application code must enforce it, which is weaker under concurrency."]
        ]
      },
      {
        name: "Distributed Systems & Resilience",
        blurb: "Keeping data correct when calls fail, retry, race or arrive twice.",
        items: [
          ["Idempotency Keys", "A unique key per logical operation lets the server spot a retried request and return the original result instead of repeating it."],
          ["Check-Then-Act Races", "State can change between reading a condition and acting on it. Fix with atomic operations, locks or unique constraints."],
          ["At-Least-Once vs Exactly-Once", "Most systems deliver messages at least once, so duplicates happen; exactly-once is built from idempotent processing."],
          ["Exactly-Once Side Effects", "Claim an atomic marker before sending an email or granting access, so retries and duplicates can't trigger it twice."],
          ["Sagas & Compensating Actions", "A multi-step operation across services where each step has an undo that runs if a later step fails, instead of one global transaction."],
          ["Single Source of Truth", "Decide which system owns each fact, so conflicting reports, like client vs payment gateway, resolve the same way every time."],
          ["Isolating Side Effects", "Run secondary effects like notifications so their failure can't fail or roll back the main operation, e.g. Promise.allSettled."],
          ["Retries with Backoff & Jitter", "Retry transient failures with growing, randomised delays, so clients don't hammer a struggling service in sync."],
          ["Timeouts", "Every remote call needs a deadline, or one slow dependency ties up threads, connections and users indefinitely."],
          ["Bounded Concurrency", "Cap how many operations run in parallel to protect downstream APIs, rate limits and memory during bulk work."],
          ["Request Coalescing (Single-Flight)", "Concurrent callers needing the same thing share one in-flight request, e.g. one token refresh instead of ten."],
          ["Graceful Degradation", "When a dependency fails, keep the core experience working with reduced features instead of failing the whole request."],
          ["Fail-Safe Defaults", "When a lookup or config fails, fall back to a known-good path rather than erroring or doing something unsafe."],
          ["Circuit Breakers", "After repeated failures, stop calling a dependency for a while and fail fast, then probe to see whether it has recovered."],
          ["Dual Writes & the Outbox Pattern", "Writing to a database and a queue separately can leave them inconsistent; an outbox table publishes events reliably."],
          ["Eventual Consistency", "Replicas or services may disagree briefly but converge once updates propagate. Design reads and UX to tolerate the lag."],
          ["CAP Theorem", "During a network partition, a distributed store must choose between staying consistent and staying available."],
          ["Distributed Locks", "A lock held in a shared store such as Redis so only one worker does a job; it needs expiry and fencing to be safe."],
          ["Stateless Services", "Keep no session or job state in process memory, so any replica can serve any request and restarts lose nothing."]
        ]
      },
      {
        name: "Caching",
        blurb: "Serving data faster without serving it wrong.",
        items: [
          ["Cache-Aside", "The app checks the cache first, falls back to the database on a miss, and writes the result into the cache for next time."],
          ["TTL Caching", "Entries expire after a set time, trading a bounded window of stale data for far fewer expensive lookups."],
          ["In-Process vs Shared Cache", "A per-process memory cache is fastest but replicas drift apart; a shared cache like Redis gives every replica the same view."],
          ["Redis Data Structures", "Strings, hashes, lists, sets, sorted sets and counters with atomic operations and expiry, used for caches, limits and locks."],
          ["Cache Invalidation", "Removing or refreshing entries when the source changes, by TTL, explicit delete or a broadcast to every node."],
          ["Cache-Key Versioning", "Changing the key prefix or version invalidates every old entry at once, without any migration code."],
          ["Cache Warming & Scheduled Refresh", "Precompute expensive data on a schedule, and validate it so a partial fetch never overwrites good data."],
          ["Stale Reads After Writes", "Acting on cached data right after a write can use old state; use the write's returned result instead."],
          ["Cache Stampede", "When a hot key expires, many requests rebuild it at once. Prevent it with locks, request coalescing or early refresh."],
          ["Eviction Policies (LRU)", "When the cache is full, something must go: the least recently used, least frequently used or soonest to expire."],
          ["HTTP Caching Headers", "Cache-Control, ETag and Vary tell browsers and proxies how long to keep a response and when it can be reused."],
          ["CDN Caching", "Edge servers near users store copies of responses; s-maxage sets shared-cache lifetime and the cache key decides reuse."],
          ["Cache Poisoning", "Tricking a shared cache into storing a malicious or wrong response, which it then serves to every other user."],
          ["On-Demand Revalidation", "Purge or regenerate cached pages by tag or path the moment content changes, instead of waiting for a timer."]
        ]
      },
      {
        name: "Messaging & Queues",
        blurb: "Moving work off the request path and delivering events reliably.",
        items: [
          ["Queues vs Pub/Sub", "A queue hands each message to one consumer; pub/sub gives every subscriber its own copy of each message."],
          ["Event-Driven Architecture", "Services publish facts about what happened and others react, so producers don't need to know or wait for consumers."],
          ["SNS → SQS Fan-Out", "Publish once to an SNS topic and each subscribed SQS queue gets its own copy to process and retry independently."],
          ["NATS", "A lightweight, fast messaging system for pub/sub and request-reply, often used as a transport between microservices."],
          ["Choosing a Broker (SQS vs Kafka vs NATS)", "SQS is a managed work queue, Kafka a replayable ordered log for streams, NATS a low-latency message bus."],
          ["Dead-Letter Queues", "Messages that keep failing move to a side queue after N attempts, so they don't block others and can be inspected."],
          ["FIFO Queues & Message Groups", "FIFO queues keep order and drop duplicates within a message group, at lower throughput than standard queues."],
          ["Visibility Timeout", "A received message is hidden while it's processed and reappears if not deleted in time, which causes redelivery."],
          ["Idempotent Consumers", "Consumers must handle the same message twice safely, because queues and webhooks deliver at least once."],
          ["Backpressure", "Slowing or rejecting incoming work when consumers can't keep up, instead of letting queues and memory grow without limit."],
          ["Offloading Slow Work", "Put vendor calls such as SMS, email or WhatsApp on a queue, so they can't slow down or fail the user's request."],
          ["Async Jobs with Polling", "Accept a long task, return a job ID straight away, process it in the background and let the client poll for status."],
          ["Cron & Scheduled Jobs", "Work that runs on a timetable. Watch for time zones, overlapping runs, multiple replicas and silently missed schedules."],
          ["Multi-Channel Notification Fan-Out", "One event triggers email, push, WhatsApp and Slack, each isolated so one channel failing doesn't block the others."],
          ["WhatsApp Template Messages", "Pre-approved WhatsApp Business templates with variables and optional headers, needed to message users outside a chat window."]
        ]
      },
      {
        name: "Networking & APIs",
        blurb: "How requests travel and how to design the contract between services.",
        items: [
          ["HTTP Method Semantics", "GET reads, POST creates, PUT replaces, PATCH updates part, DELETE removes; GET, PUT and DELETE should be idempotent."],
          ["HTTP Status Codes", "2xx success, 3xx redirect, 4xx client error, 5xx server error. 409 Conflict means the request clashes with current state."],
          ["TLS & HTTPS", "TLS encrypts traffic and proves the server's identity with a certificate, so data can't be read or altered in transit."],
          ["Keep-Alive & Connection Reuse", "Reusing one TCP and TLS connection for many requests avoids repeated handshakes and cuts latency."],
          ["REST API Design", "Resources as nouns in URLs, HTTP verbs as actions, and consistent conventions for errors, pagination and filtering."],
          ["RPC vs REST", "RPC calls named actions on a service; REST manipulates resources. Microservice frameworks often use RPC internally."],
          ["API Versioning", "Version APIs, e.g. /v1, so breaking changes can ship alongside the old contract while clients migrate."],
          ["Backward-Compatible API Changes", "Add optional fields, never remove or rename, and deploy servers before clients, so old and new versions both work."],
          ["API Gateway", "A single entry point that routes requests to services and handles auth, rate limits and logging in one place."],
          ["Backend-for-Frontend (BFF)", "A thin server layer for one frontend that holds secrets, adds auth headers and shapes backend calls for that UI."],
          ["Webhooks", "A provider calls your HTTP endpoint when something happens; expect retries, duplicates and out-of-order delivery."],
          ["Webhook Signature Verification", "Recompute the HMAC of the raw request body with the shared secret and compare it, so forged webhooks are rejected."],
          ["WebSockets", "A persistent two-way connection upgraded from HTTP, letting the server push messages with low latency."],
          ["Socket.IO", "A library over WebSockets that adds events, acknowledgements, rooms, reconnection and a polling fallback."],
          ["Polling vs SSE vs WebSockets", "Polling repeats requests, SSE streams one way from the server, WebSockets go both ways. Pick the simplest that fits."],
          ["Server-Sent Events & Chunked Streaming", "One long HTTP response sends data in chunks as it's ready, so clients render progress before the response ends."],
          ["Proxy Buffering", "Proxies and compression may hold streamed chunks until the end; specific headers turn buffering off for real-time output."],
          ["Sticky Sessions", "The load balancer keeps a client on one backend, needed when a session or handshake spans several requests."],
          ["Layer-7 Load Balancing", "An HTTP-aware load balancer routes by host, path or headers to different services, e.g. through Kubernetes Ingress rules."],
          ["HTTP Client Interceptors", "Hooks on an HTTP client that add auth headers, refresh tokens or handle 401s and errors in one place."],
          ["Tolerant Reader", "Parse only the fields you need and accept variations in shape, so a provider's changes don't break your client."],
          ["Wrapping Third-Party APIs", "Hide a vendor's auth, token refresh, retries and error mapping behind one internal client with your own types."],
          ["Route Matching Order", "Routers match in registration order, so a broad pattern like /{id} can shadow a more specific route registered later."]
        ]
      },
      {
        name: "Infrastructure & Cloud",
        blurb: "Where the code runs: containers, Kubernetes, serverless and cloud storage.",
        items: [
          ["Containers & Images", "An image packages an app with its runtime and dependencies; a container is a running, isolated instance of it."],
          ["Container Registries (ECR)", "Private storage for versioned images, tagged by release, that clusters pull from at deploy time."],
          ["Kubernetes Building Blocks", "Pods run containers, Deployments keep N replicas running and roll out updates, and Services give pods a stable address."],
          ["Ingress", "Rules that route external HTTP traffic by host and path to Services, implemented by a load balancer controller."],
          ["Amazon EKS", "Managed Kubernetes on AWS: AWS runs the control plane while you run your workloads on worker nodes."],
          ["ConfigMaps & Environment Config", "Non-secret settings injected into pods as environment variables or files, so one image runs in every environment."],
          ["Resource Requests & Limits", "Requests reserve CPU and memory for scheduling; limits cap them, and a pod over its memory limit is killed."],
          ["Liveness & Readiness Probes", "Readiness decides whether a pod receives traffic; liveness decides whether it should be restarted."],
          ["Kubernetes Naming Rules", "Resource names must be lowercase letters, digits and hyphens (DNS-1035), so names with capitals are rejected."],
          ["One Image, Many Deployments", "The same image runs as several deployments, with config choosing which services each pod hosts and how it scales."],
          ["Helm Charts", "Templated, versioned Kubernetes manifests with values files, packaging an app's resources for install and upgrade."],
          ["Kustomize Overlays", "A base set of manifests plus per-environment patches for replicas, images and config, with no templating."],
          ["Infrastructure as Code (Terraform)", "Declare cloud resources in code, review the plan, then apply, so infrastructure is versioned and repeatable."],
          ["Terraform State & Locking", "Terraform tracks real resources in a state file, kept remotely with a lock so two applies can't run at once."],
          ["AWS Lambda", "Functions that run on events with no servers to manage, billed per invocation, with limits on duration and memory."],
          ["AWS SAM & CloudFormation", "Templates that define Lambdas, queues, topics and schedules as one stack, deployed and rolled back together."],
          ["Lambda Layers", "Shared code or dependencies packaged once and attached to many Lambda functions."],
          ["Amazon S3", "Object storage for files of any size, with buckets, keys, lifecycle rules and fine-grained access policies."],
          ["Presigned URLs", "Short-lived signed links that let a browser upload or download a private object directly, without your credentials."],
          ["Managed Web Hosting (Amplify)", "A managed service that builds and hosts web apps, including server-rendered ones, with branch previews."],
          ["Static Hosting (Firebase, Cloudflare Pages)", "Serve prebuilt files from a global CDN with no servers, deployed straight from a Git branch."],
          ["Edge Geo-Routing", "Route or rewrite requests by the visitor's country at the CDN edge, before they reach your origin."],
          ["ARM (Graviton) Instances", "ARM-based cloud CPUs that are cheaper for the same performance; images must be built for the arm64 architecture."]
        ]
      },
      {
        name: "Reliability & SRE",
        blurb: "Keeping production healthy, and recovering well when it isn't.",
        items: [
          ["SLIs, SLOs & Error Budgets", "An SLI measures service health, an SLO sets its target, and the error budget is how much failure you can afford."],
          ["Incident Response", "Detect, triage, mitigate first, communicate status, then find the root cause once users are safe."],
          ["Root-Cause Analysis", "Test hypotheses against real evidence such as logs, data and traces to find why something failed, not just what failed."],
          ["Blast Radius", "How many users, records or systems a failure or change affects; size it before choosing how to fix and remediate."],
          ["OOM Kills & Crash Loops", "A process that exceeds its memory limit is killed and restarted, again and again, until the memory-heavy path is fixed."],
          ["Node.js Memory Leaks", "Objects kept alive by globals, caches, closures or listeners grow the heap until the process runs out of memory."],
          ["Silent Failures", "Errors hidden behind success responses, swallowed exceptions or jobs that quietly never run. Make failures visible."],
          ["Graceful Shutdown", "On SIGTERM, stop taking new work, finish in-flight requests and close connections before the process exits."],
          ["Rollback vs Fix-Forward", "Revert to the last good version to stop the damage quickly, or ship a fix on top when a rollback is riskier."],
          ["Kill Switches", "A runtime flag that turns off a new code path instantly, without a deploy."],
          ["Data Remediation", "After a bug, find every affected record and repair it with a reviewed, logged and rerunnable script."],
          ["Postmortems & Lessons Learned", "A blameless write-up of what happened, why, and what changes so it can't happen the same way again."],
          ["Runbooks & Ops Scripts", "Written, versioned procedures and scripts for routine and emergency operations, so anyone can run them safely."],
          ["DORA Metrics", "Deploy frequency, lead time for changes, change failure rate and time to restore: four measures of delivery health."]
        ]
      },
      {
        name: "Scaling & Performance",
        blurb: "Handling more load without falling over or overspending.",
        items: [
          ["Vertical vs Horizontal Scaling", "Vertical means a bigger machine; horizontal means more replicas, which needs stateless services and shared stores."],
          ["Horizontal Pod Autoscaler", "Kubernetes adds or removes pod replicas, between set bounds, based on CPU, memory or custom metrics."],
          ["Connection Budgets Under Autoscaling", "Total database connections are replicas times pool size, so cap both to stay under the database's connection limit."],
          ["The Node.js Event Loop", "Node runs JavaScript on one thread; async I/O keeps it free, but CPU-heavy code blocks every other request."],
          ["CPU-Bound Work & Worker Threads", "Move heavy computation to worker threads, child processes or separate services to keep the event loop responsive."],
          ["N+1 Queries", "One query per item inside a loop instead of one batched query; it gets slower with every row returned."],
          ["Parallelising Independent Calls", "Run calls that don't depend on each other at the same time, e.g. Promise.all, so latency is the slowest call, not the sum."],
          ["Batch Endpoints", "One request that returns data for many items, replacing many per-item calls from clients."],
          ["Throughput vs Latency", "Throughput is work done per second; latency is time per request. Queueing makes latency climb as load nears capacity."],
          ["Load Testing", "Simulate realistic traffic to find capacity limits and bottlenecks before real users do."]
        ]
      },
      {
        name: "Observability",
        blurb: "Seeing what production is doing, and why.",
        items: [
          ["Logs, Metrics & Traces", "Logs record events, metrics count and time things cheaply, and traces follow one request across services."],
          ["Structured Logging", "Log machine-readable fields (JSON) instead of free text, so logs can be filtered, grouped and alerted on."],
          ["OpenTelemetry", "A vendor-neutral standard and set of SDKs for emitting traces, metrics and logs to any backend."],
          ["Distributed Tracing", "Each request carries a trace ID across services, and each hop records a timed span, showing where the time goes."],
          ["Correlation IDs", "A shared ID attached to every log and event for one request or job, so you can follow it end to end."],
          ["Prometheus & PromQL", "A pull-based metrics database and its query language for rates, ratios and percentiles over time."],
          ["RED & USE Methods", "RED tracks Rate, Errors and Duration for services; USE tracks Utilisation, Saturation and Errors for resources."],
          ["Latency Percentiles", "p50, p95 and p99 show typical and tail latency; averages hide the slow requests users actually notice."],
          ["Metric Cardinality", "Every unique label combination is a separate time series, so labels like user ID can explode cost and memory."],
          ["Dashboards as Code", "Keep dashboard definitions in version control, so they're reviewed, reproducible and restorable."],
          ["Error Tracking (Sentry)", "Captures exceptions with stack traces, release, user and request context, grouped into issues across client and server."],
          ["Alerting", "Alert on user-facing symptoms, with clear owners and runbooks; noisy alerts get ignored."],
          ["Query Attribution", "Tag database connections or queries with the calling app or service, so slow queries can be traced to their source."]
        ]
      },
      {
        name: "DevOps & Delivery",
        blurb: "Getting code from a merge to production safely and often.",
        items: [
          ["CI/CD Pipelines", "Automated workflows, e.g. GitHub Actions, that build, test, tag and deploy on every push or merge."],
          ["CI Test Gates", "A failing test suite blocks the build or deploy automatically, so broken code can't reach production."],
          ["Pre-Commit Hooks", "Git hooks that lint, format or test changes before a commit is accepted."],
          ["GitOps", "Git holds the desired state of every environment and a controller syncs the cluster to it, so a merge is a deploy."],
          ["ArgoCD & App-of-Apps", "ArgoCD syncs Kubernetes to Git; an app-of-apps is one parent app that manages all of an environment's apps."],
          ["Blue-Green Deployments", "Run the new version beside the old behind a preview service, test it, then switch all traffic over at once."],
          ["Canary Releases", "Send a small share of traffic to the new version, watch metrics, then increase it step by step or roll back."],
          ["Branching Strategies", "Git Flow uses develop, release and hotfix branches; trunk-based development merges small changes to main often."],
          ["Release Trains & Versioning", "Cut release branches on a regular cadence and tag versions, e.g. semantic versioning, so each release is traceable."],
          ["Hotfixes & Cherry-Picks", "Ship an urgent fix, or only verified commits, to production without promoting everything on the development branch."],
          ["Environment Promotion", "The same build artifact moves from dev to staging to production, changing only config, never the build."],
          ["Cross-Repo Deploy Ordering", "Deploy providers before consumers, e.g. backend before frontend, so no client calls an API that doesn't exist yet."],
          ["Feature Flags", "Runtime switches that turn features on per user, tenant or region, separating deploy from release."],
          ["Shadow Mode", "Run new logic beside the old on real traffic, compare results without acting on them, then cut over."],
          ["Multi-Stage Docker Builds", "Build in one stage with full tooling, then copy only the output into a slim runtime stage for smaller, safer images."],
          ["Docker Layer Caching", "Each instruction is a cached layer; install dependencies before copying code, and reuse the cache in CI."],
          ["SWC vs tsc", "SWC is a Rust transpiler that strips types very fast without checking them; run tsc separately for type checks."],
          ["Native ARM Runners vs QEMU", "Building arm64 images on arm64 machines avoids slow, memory-hungry CPU emulation."],
          ["Reproducible Builds & Lockfiles", "Pin the runtime and exact dependency versions, so every build produces the same output."]
        ]
      },
      {
        name: "Payments & Billing",
        blurb: "Taking money correctly, granting access exactly once, and proving the numbers add up.",
        items: [
          ["Payment Lifecycle", "Create an order, the customer authorises payment, the gateway captures it, and your server verifies before fulfilling."],
          ["Orders vs Subscriptions", "An order is a one-off charge; a subscription is a gateway-managed plan that charges automatically each cycle."],
          ["Recurring Mandates & Autopay", "The customer authorises future debits once, by card, UPI AutoPay or e-mandate, within limits set by regulation."],
          ["Payment Signature Verification", "Verify the gateway's HMAC over the order and payment IDs on your server before trusting a payment the client reports."],
          ["Webhooks as Source of Truth", "Grant access from verified server-to-server payment events, not from client redirects that can be lost or faked."],
          ["Idempotent Webhook Handling", "Gateways resend events, so processing must be safe to repeat: mark events processed and guard state changes."],
          ["Entitlement Provisioning", "Granting what was paid for, like a membership or credits, as a separate atomic step tied to the confirmed payment."],
          ["Grace Periods", "Keep access for a short window after a renewal is due, while the asynchronous charge is still being processed."],
          ["Trials, Upgrades & Plan Changes", "Free trials, mid-cycle upgrades and downgrades need clear rules for proration, start dates and what's granted."],
          ["Failed Payments & Dunning", "Retry failed renewals on a schedule, notify the customer, and decide when access lapses."],
          ["Refunds", "Full or partial refunds go through the gateway's API, and the refund status must flow back into your records."],
          ["Representing Money (Minor Units & Decimals)", "Store amounts as integers in the smallest unit, like paise or cents; floating point loses precision on money and quantities."],
          ["Hosted Checkout", "Redirect to a payment page hosted by the provider, e.g. Stripe Checkout, so card data never touches your servers."],
          ["Native Payment Sheets", "Provider SDKs in mobile apps that collect payment natively and feed the same server-side confirmation flow."],
          ["PCI DSS Scope", "Card-data security rules. Hosted checkouts and tokenisation keep raw card numbers out of your systems and your scope."],
          ["Payment Provider Abstraction", "One internal interface over several gateways, so callers don't care whether Razorpay, Stripe or PayU handled a payment."],
          ["Multi-Merchant Routing", "Choose the right merchant account for each transaction, so money settles to the correct legal entity or brand."],
          ["Payment Metadata & Attribution", "Attach notes like source, campaign and plan to orders for reconciliation and channel attribution, within gateway limits."],
          ["Request Hashing for Hosted Checkout", "The server computes a salted hash of the payment parameters so the gateway detects tampering; the salt never reaches browsers."],
          ["Loyalty Points Ledgers", "Points earned and spent are recorded as ledger entries with balance checks, rather than as a single mutable number."],
          ["Double-Spend Prevention", "Make sure a credit, coupon or reward can be granted or used only once, even under retries and concurrent requests."],
          ["Payment Reconciliation", "Match internal records against the gateway's payments, settlements and refunds to find anything missed or misrecorded."],
          ["KYC Verification", "Verifying a customer's identity documents before offering regulated products like investments or prepaid cards."],
          ["Pricing as Pure Functions", "Compute prices, discounts and member benefits in side-effect-free functions that are easy to test and reuse."]
        ]
      },
      {
        name: "Architecture & Design",
        blurb: "How services, modules and rules are structured so the system can keep changing.",
        items: [
          ["Monolith vs Microservices", "One deployable unit is simpler to build and debug; microservices scale and deploy independently but add network and ops cost."],
          ["Moleculer Services (Actions, Events, Mixins)", "A Node.js microservice framework: services expose actions and events, share behaviour through mixins and talk over a transport."],
          ["Shared Database vs Service API", "Reading another service's database is fast but couples you to its schema; calling its API keeps ownership clear."],
          ["Multi-Tenancy Models", "Tenants can share tables with a tenant ID, have separate schemas, or have separate databases, trading isolation against cost."],
          ["Cross-Tenant Sharing", "Letting one tenant read another's data under explicit rules, while writes always stay with the acting tenant."],
          ["Policy Engines", "A central evaluator that applies declarative allow and deny rules with clear precedence, and explains each decision."],
          ["Strategy Pattern", "One interface with interchangeable implementations chosen at runtime, e.g. one per payment provider."],
          ["Repository Pattern", "Data access sits behind an interface, so business logic doesn't depend on the database or ORM."],
          ["Ports & Adapters", "The core defines interfaces (ports) and infrastructure plugs in as adapters, real or stubbed. Also called hexagonal architecture."],
          ["Vertical Slices", "Organise code by feature end to end (route, logic and data) rather than by technical layer."],
          ["State Machines", "Model an entity's lifecycle as named states and allowed transitions, and reject every other move."],
          ["Request Context (AsyncLocalStorage)", "Carry request data like the tenant or user ID through async calls without passing it through every function."],
          ["Config-Driven Features", "Describe new instances, like events, forms or plans, as data, so launching one needs config rather than new code."],
          ["Headless CMS", "Content is authored as structured blocks in a CMS and delivered by API to any frontend that renders it."],
          ["Plugin Architecture", "Extend a system through modules that register against a stable interface, without changing its core."],
          ["Content as Data", "Keep content in data files or a store that can be published independently of application deploys."],
          ["Dry-Run Then Apply", "Build the full change plan, let someone review it, then execute exactly that plan."],
          ["Strangler Fig", "Replace a legacy system piece by piece behind the same entry point, instead of a risky big-bang rewrite."],
          ["Build vs Buy", "Weigh a vendor or open-source product against building in-house on cost, time to market, control and fit."],
          ["Multi-Region Design", "Serve several regions from one codebase, with currency, payment provider and rules chosen from one region config."],
          ["Cloning Entities Safely", "When copying a record, regenerate every identity field (IDs, slugs, unique keys) so the copy can't collide with the original."],
          ["Prototype as Spec", "Treat a proof of concept as a description of behaviour and rebuild it to production standards, rather than shipping its code."]
        ]
      },
      {
        name: "Frontend & Web",
        blurb: "Rendering, state and forms in React and Next.js apps.",
        items: [
          ["App Router vs Pages Router", "Next.js's App Router adds layouts, server components and route handlers; the Pages Router uses pages/ files and data functions."],
          ["React Server Components", "Components that render only on the server, fetch data directly and ship no JavaScript to the browser."],
          ["SSR vs SSG vs ISR", "Render per request, at build time, or statically with periodic regeneration, trading freshness against speed and cost."],
          ["Hydration", "React attaches event handlers to server-rendered HTML; if the first client render differs, you get mismatches and flicker."],
          ["Next.js Middleware", "Code that runs before a route renders, to redirect, rewrite, add headers or refresh auth."],
          ["Build-Time Environment Variables", "Bundlers inline public env vars at build time, so dynamic lookups like process.env[key] come back undefined in the browser."],
          ["Client-Side Navigation", "Framework links swap pages without a full reload; external URLs need plain anchors."],
          ["Server State vs Client State", "Server state is a cached copy of remote data with its own staleness rules; client state is UI-only. Manage them separately."],
          ["TanStack Query", "Caches, deduplicates, refetches and invalidates server data through React hooks, with loading and error states."],
          ["Redux Toolkit & RTK Query", "Opinionated Redux with slices and safe immutable updates, plus a built-in data-fetching and caching layer."],
          ["Redux-Saga", "Redux middleware that runs async side effects as generator functions, suited to complex flows like sockets."],
          ["Persisted Client State (Zustand)", "A small state store that can persist to storage; stale persisted data needs versioning or exclusions."],
          ["Forms with react-hook-form & Zod", "Fast, uncontrolled form state plus schema validation that also produces TypeScript types."],
          ["Multi-Step Forms", "A long form split into steps that share state, validated per step, with a clear path back and forward."],
          ["Config-Driven Forms", "Render fields from a declarative config, so new form variants need data, not new components."],
          ["Derived State", "Compute values during render (useMemo if expensive) instead of syncing copies into state with useEffect."],
          ["Stale State in Long-Lived Components", "Components that never unmount keep old state between uses unless you reset it explicitly."],
          ["Optimistic UI", "Show the user's action instantly, then reconcile with the server's response or roll back if it fails."],
          ["Custom Hooks & Presentational Components", "Put logic in hooks and pure functions and keep display components simple, so each part is easy to test."],
          ["Error Boundaries", "Components that catch rendering errors in their subtree and show a fallback instead of a blank page."],
          ["Debounce & Throttle", "Debounce waits until input stops; throttle limits how often a handler runs. Both cut wasted work and requests."],
          ["Code Splitting & Lazy Loading", "Load each route or heavy component only when it's needed, to shrink the initial JavaScript bundle."],
          ["Core Web Vitals", "LCP for loading, INP for responsiveness and CLS for layout stability: Google's user-centred page performance metrics."],
          ["Accessibility", "Semantic HTML, labels, contrast, focus order and large touch targets, so everyone, including older users, can use the app."],
          ["SEO Metadata & Open Graph", "Titles, descriptions, canonical URLs and Open Graph tags control how pages appear in search and link previews."],
          ["Autosave & Dirty Tracking", "Track unsaved changes and save automatically after a pause, without losing edits or saving too often."],
          ["Schema-Driven UI", "One component schema drives both the editor's controls and the renderer, so a new block needs only a schema."],
          ["iframes & postMessage", "Embedded pages on another origin talk to their parent through postMessage events, checking the origin every time."],
          ["Web Audio API", "Low-level browser audio: decode, schedule and play buffers precisely for gapless playback."],
          ["Scroll-Driven Animation", "Animations tied to scroll position, e.g. GSAP ScrollTrigger, simplified on mobile and for reduced-motion users."],
          ["Server-Side Image Rendering", "Generate images such as cards or certificates on the server, with a headless browser or a canvas library."],
          ["Admin Frameworks (AdminJS)", "Admin panels generated from data models, extended with custom pages, actions and permissions."]
        ]
      },
      {
        name: "Mobile & WebViews",
        blurb: "Web code running inside native apps, and getting users in and out of them.",
        items: [
          ["WebViews in Native Apps", "A native app embeds a browser view to show web pages, so features can ship as web code inside the app."],
          ["Native ↔ WebView JS Bridge", "A message channel between the page's JavaScript and native code, through handlers injected on iOS and Android."],
          ["Detecting the WebView", "Check for the native bridge first, with a user-agent fallback, before switching to in-app behaviour."],
          ["Shipping Features via WebViews", "In-app screens built as web pages update on web release cycles, without waiting for app-store review."],
          ["App-Version Gating", "The server changes behaviour or permissions based on the app version, so older installs keep working."],
          ["Passing Auth into WebViews", "Hand the session token from native code to the page explicitly, since the app and WebView don't share login state by default."],
          ["WebView Cookie Isolation", "System browsers opened from a WebView don't share its cookies, which breaks cookie-based auth for downloads and links."],
          ["Single-Use Tokens", "Short-lived tokens that work once, used to hand a session to another context, like a browser, without exposing the main token."],
          ["Native Payment Handoff", "The page asks native code to run the payment SDK, then receives the result back through the bridge."],
          ["In-App File Capture Pitfalls", "Camera and file pickers inside WebViews can produce empty or odd files, so check the actual bytes before uploading."],
          ["Deep Links & Custom URL Schemes", "App-registered URIs like myapp://screen that open specific in-app screens from links or QR codes."],
          ["Universal Links & App Links", "HTTPS links that open the app if it's installed and the website otherwise, verified by files hosted on your domain."],
          ["Deferred Deep Links", "Links that remember their destination through an app install, then open the right screen on first launch."],
          ["Returning from Browser to App", "Providers only accept https return URLs, so a bounce page hands the user back to the app's custom scheme."],
          ["Push Notifications (FCM)", "Firebase Cloud Messaging delivers notifications to devices by token; tokens expire and delivery isn't guaranteed."]
        ]
      },
      {
        name: "Testing & Quality",
        blurb: "Proving changes work, and keeping them working.",
        items: [
          ["Testing Pyramid", "Many fast unit tests, fewer integration tests, and a handful of slow end-to-end tests."],
          ["Contract Testing", "Check that a provider and its consumers agree on request and response shapes, without running both together."],
          ["Coverage & Patch Coverage", "Coverage shows which code tests execute; patch coverage checks just the lines a change touches."],
          ["Code Review & Merge Gates", "Required reviews and passing checks before merging catch defects and spread knowledge across the team."],
          ["Unit Testing with Jest", "Fast tests for functions and modules with mocks, spies and assertions; SWC can transform the TypeScript."],
          ["Vitest & Testing Library", "A fast Vite-based test runner, plus helpers that test components the way users use them, by text and role."],
          ["Mock Service Worker", "Intercepts requests at the network layer to mock APIs in tests, without stubbing your own code."],
          ["Playwright End-to-End", "Drives real browsers through full user flows, with auto-waiting and network mocking."],
          ["Characterization Tests", "Capture what legacy code does today before refactoring, so any change in behaviour is caught."],
          ["Parity Tests", "Run the old and new implementations on the same inputs and compare outputs before switching over."],
          ["Hermetic Tests", "Tests that don't depend on the network, real services or the environment, so they pass the same everywhere."],
          ["Test Data Seeding", "Load known personas and records into a test database, with guards so the script can never touch production."],
          ["API Tests with Mocked HTTP", "Call routes in-process with a test client and stub outbound HTTP, so API tests are fast and deterministic."]
        ]
      },
      {
        name: "Data & Analytics",
        blurb: "Tracking what users do and turning events into answers.",
        items: [
          ["OLTP vs OLAP", "OLTP databases handle many small transactional reads and writes; OLAP warehouses scan huge datasets for analysis."],
          ["Customer Data Platforms", "A central store of each user's events and profile across channels, used for analytics, segments and messaging."],
          ["Event Tracking Plans", "A typed catalogue of event names and properties, agreed up front so every client tracks the funnel the same way."],
          ["Analytics Abstraction Layer", "One tracking API in the app that sends each event to several analytics vendors through a single mapping."],
          ["Super Properties & Cross-App Leakage", "Properties an SDK attaches to every event persist in storage and can leak into other apps on the same domain."],
          ["Funnel Analysis", "Measure conversion step by step through a flow to see exactly where users drop off."],
          ["UTM & Attribution", "Capture campaign parameters on landing and carry them through to sign-up and payment to credit the right channel."],
          ["Cohort Retention", "Group users by start date and track how many are still active or paying in each later period."],
          ["Medallion Architecture", "Data flows through bronze (raw), silver (cleaned) and gold (aggregated) layers, often as Parquet files in a lake."],
          ["Airflow DAGs", "Data pipelines defined as directed acyclic graphs of tasks, with dependencies, schedules, retries and trigger rules."],
          ["BigQuery External Tables & Materialized Views", "Query files in cloud storage directly, and precompute aggregates that are fast but only answer queries at their grain."],
          ["Partitioned Tables & Time Zones", "Date partitions make scans cheap, but a local-time day spans two UTC partitions, so widen the scan, then trim."],
          ["Bulk CSV Imports", "Import spreadsheets with validation, a dry-run preview and per-row results, so non-engineers can load data safely."]
        ]
      }
    ]
  },
  {
    id: "ai",
    label: "AI Engineering",
    title: "The {n} AI engineering concepts from building assistants and agents.",
    intro: "LLM basics, retrieval, agents, guardrails and evaluation, drawn from the AI assistant, the support agent, the voice sales agent and the team's coding-agent skills at Khyaal.",
    categories: [
      {
        name: "LLM Foundations",
        blurb: "How language models behave, and how to get reliable output from them.",
        items: [
          ["Tokens & Context Windows", "Models read and write tokens, which are word pieces; the context window caps how much prompt, history and output fit in one call."],
          ["Sampling & Temperature", "Temperature and top-p control randomness: low for consistent, factual output, higher for varied, creative output."],
          ["System Prompts & Prompt Design", "Instructions, role, examples and constraints given up front shape the model's behaviour across the whole conversation."],
          ["Embeddings", "Vectors that represent the meaning of text, so similar meanings sit close together and can be searched."],
          ["Structured Output", "Constrain the model to return JSON that matches a schema, so code can parse and validate its answers."],
          ["Function Calling", "The model picks from declared tools and returns structured arguments; your code runs the tool and sends back the result."],
          ["Hallucination & Grounding", "Models invent plausible facts; grounding answers in retrieved or tool data, with citations, reduces it."],
          ["Model Fallbacks", "Fall back to another model, a cached answer or a stub when the primary model fails, times out or isn't configured."],
          ["When Not to Use an LLM", "Use deterministic code when output must be exact, auditable or verbatim, such as legal text or calculations."],
          ["LLM Latency & Cost", "Cost and latency grow with tokens and model size; caching, smaller models and shorter prompts cut both."]
        ]
      },
      {
        name: "RAG & Retrieval",
        blurb: "Giving models the right knowledge at question time.",
        items: [
          ["Retrieval-Augmented Generation", "Retrieve documents relevant to a question and put them in the prompt, so answers use your data, not just training data."],
          ["Document Ingestion & Chunking", "Parse PDFs, docs and pages, then split them along their structure into tagged, overlapping chunks for retrieval."],
          ["Metadata Filtering", "Filter candidates by tag, tenant, date or type before or during vector search, to keep results relevant and allowed."],
          ["Vector Databases", "Stores built to index embeddings and find nearest neighbours fast, such as Qdrant, Pinecone or pgvector."],
          ["Atlas Vector Search", "MongoDB's built-in vector index, queried with a $vectorSearch aggregation stage next to your operational data."],
          ["Similarity Metrics", "Cosine similarity, dot product or Euclidean distance measure how close two embeddings are."],
          ["ANN Indexes (HNSW)", "Approximate nearest-neighbour graphs trade a little recall for much faster search over millions of vectors."],
          ["Hybrid Search", "Combine keyword search (exact terms and IDs) with vector search (meaning) to get the strengths of both."],
          ["Reciprocal Rank Fusion", "Merge ranked lists by summing 1/(k + rank) for each item, so scores from different systems needn't be normalised."],
          ["Re-Ranking", "A slower, more accurate model rescores the top retrieved candidates before they go into the prompt."]
        ]
      },
      {
        name: "Agents & Tool Calling",
        blurb: "Letting models take steps and use tools, safely.",
        items: [
          ["Agent Loops (ReAct)", "The model reasons, picks a tool, observes the result and repeats until it can answer or hits a step limit."],
          ["LangGraph & Sub-Agents", "Build LLM workflows as graphs of nodes with shared state, handing focused tasks to specialised sub-agents."],
          ["Multi-Agent Routing", "A router or supervisor sends each request to the right specialist agent and combines their results."],
          ["Tool Design for LLMs", "A few well-named tools with clear descriptions, typed parameters and compact, explicit results work best."],
          ["APIs as Agent Tools", "Expose scoped, authenticated endpoints an agent can call to look things up, instead of giving it raw database access."],
          ["Model Context Protocol (MCP)", "An open protocol for exposing tools, data and prompts to AI clients through a standard server interface."],
          ["MCP vs Direct HTTP Tools", "MCP suits tools shared across many clients; a direct HTTP tool is simpler for a single consumer, with no extra hop."],
          ["Server-Owned Chat Sessions", "The backend creates and stores the conversation session; clients just send messages to it and stream the replies."],
          ["Conversation Memory & Summaries", "Keep long chats within the context window by summarising older turns and storing key facts."]
        ]
      },
      {
        name: "Safety & Guardrails",
        blurb: "Keeping AI actions safe, private and under human control.",
        items: [
          ["Human-in-the-Loop Approval", "The AI proposes an action, but a person must approve it before anything changes in production."],
          ["Allow-Listed Actions", "The model can only choose from a fixed list of actions; code owns the endpoints and validates every parameter."],
          ["Sandboxed Data Tools", "Limit model-written queries to safe operators, approved collections, read-only access and capped results."],
          ["Auditing Agent Actions", "Log every proposal, approval and execution, with before and after snapshots."],
          ["PII Redaction", "Mask identifiers like ID numbers, cards and phone numbers before data is sent to a third-party model."],
          ["Prompt Injection", "Instructions hidden in user input or retrieved content try to hijack the model. Treat them as data and limit what tools can do."],
          ["Absence Signals", "Tell the model explicitly when a lookup returned nothing, so 'no rows found' isn't read as 'it never happened'."],
          ["Rate Limiting LLM Endpoints", "Per-user limits on AI endpoints control cost and abuse, since every request spends real tokens."]
        ]
      },
      {
        name: "Evaluation & Quality",
        blurb: "Knowing whether the AI is actually helping.",
        items: [
          ["Containment Rate", "The share of conversations the assistant resolves without handing off to a human."],
          ["Escalation & Human Handoff", "Detect when the AI should hand a user to a person, and measure how often and why it does."],
          ["User Feedback Signals", "Thumbs up and down, follow-up questions and abandonment show answer quality from the user's side."],
          ["Offline Evals & Golden Sets", "A fixed set of questions with expected answers, run on every prompt or model change to catch regressions."],
          ["LLM-as-Judge", "A model grades outputs against a rubric at scale, checked regularly against human judgement."],
          ["Tracing LLM Calls", "Record prompts, tool calls, tokens, latency and cost for each step, to debug and optimise AI flows."],
          ["Post-Call Analysis & Lead Scoring", "After each call an LLM reads the transcript and returns the intent, a summary and a hot or cold lead score for the sales team."],
          ["Call Outcome Metrics", "Connect rate, talk time, completion and conversion show whether a voice agent is reaching people and actually selling."]
        ]
      },
      {
        name: "Streaming & Conversational UX",
        blurb: "Making AI responses feel fast and natural.",
        items: [
          ["Token Streaming in the Browser", "Read the response body stream chunk by chunk and render text as it arrives, instead of waiting for the full answer."],
          ["Time to First Token", "The delay before the first token appears; it shapes how fast a chat feels more than total generation time does."],
          ["Streaming Partial JSON", "Parse incomplete JSON as it streams in, so structured fields render before generation finishes."],
          ["Generative UI", "The model returns typed objects that render as cards, lists and buttons instead of plain text."],
          ["Idle Timeouts & Session Closure", "Close and summarise a conversation after inactivity or when the page is hidden, for analytics and memory."],
          ["Progressive TTS Chunking", "Synthesise speech in small chunks first, then larger ones, so audio starts quickly without too many calls."]
        ]
      },
      {
        name: "Voice Agents & Telephony",
        blurb: "AI agents that hold real phone conversations.",
        items: [
          ["Voice Agent Pipelines (STT → LLM → TTS)", "Speech-to-text, an LLM and text-to-speech run as one streaming chain, so the agent listens, thinks and speaks in near real time."],
          ["Pipecat & Frame-Based Pipelines", "Pipecat passes audio, text and control frames through a chain of processors, so speech services, LLMs and transports plug together."],
          ["Telephony APIs & Call Webhooks", "Providers like Plivo, Exotel and Twilio place calls through an API and report answer, recording and hangup events to your webhooks."],
          ["Media Streams over WebSockets", "The phone provider streams live call audio to your server over a WebSocket, and the agent streams its speech back the same way."],
          ["Turn-Taking, VAD & Barge-In", "Voice activity detection decides when the caller has finished speaking; barge-in lets them interrupt the agent mid-sentence."],
          ["Voice Latency Budgets", "Callers notice gaps of about a second, so STT, LLM and TTS time must be budgeted and streamed rather than run one after another."],
          ["Speech Models for Indian Languages", "STT and TTS models tuned for Hindi, other Indian languages and Hinglish, such as Sarvam, handle local accents and mixed speech better."],
          ["Language Detection & Code-Switching", "Detect the caller's language from their first reply, then switch prompts and voice, including mixed Hindi-English speech."],
          ["Outbound Call Orchestration", "A queue-driven worker takes leads, places calls, schedules retries and records every outcome, so campaigns run without manual dialling."],
          ["Call Concurrency Limits", "A semaphore caps simultaneous calls to fit provider and model limits; releasing it reliably on hangup prevents stuck capacity."],
          ["Voicemail & No-Answer Handling", "Classify unanswered, busy and voicemail outcomes, so the agent hangs up quickly and retries at a better time."],
          ["Call Recording & Consent", "Record calls only with notice or consent, store recordings securely and keep them only as long as policy allows."]
        ]
      },
      {
        name: "AI-Assisted Development",
        blurb: "Using coding agents as part of the engineering workflow.",
        items: [
          ["Coding-Agent Skills", "Packaged instructions with triggers, steps and known pitfalls that let a coding agent repeat a workflow reliably."],
          ["Agent Instruction Files (CLAUDE.md)", "Repo-level docs that teach coding agents the project's conventions, commands and gotchas."],
          ["Agentic Workflow Automation", "An agent runs a multi-step operational task end to end, such as cutting a release and writing its changelog."],
          ["Design-to-Code Agent Workflows", "An agent reads a design file and produces matching components and a pull request for human review."],
          ["Reviewing AI-Generated Code", "Treat agent output like a pull request from a new teammate: check logic, edge cases, security and tests before merging."]
        ]
      }
    ]
  }
];
