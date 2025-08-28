Below is a simple and easy demo script tailored to your SJM setup, incorporating the architecture diagram, Git workflow, namespace ingress, and the cross-cluster flow (including the PROD synthetics from CAC-UAT due to NSG resolution issues). This script is designed for a 15-20 minute session, keeping it concise and beginner-friendly. Use live demos or screen shares with your architecture diagram and New Relic dashboard screenshots (when provided) to engage the team.

Demo Script: SJM Synthetic Monitoring Overview
Duration: 15-20 minutes Tools: Git client, kubectl, New Relic UI, slide deck with architecture diagram Audience: Team members (app teams, ops)
1. Introduction (2-3 minutes)
	•	What to Say: “Hi everyone! Today, I’ll show you our SJM setup for monitoring DEV, UAT, and PROD environments across CAC PROD, UAT, and DEV clusters. SJM runs synthetic checks from private locations, and we use a Git repo to add endpoints safely. Our diagram [point to slide] shows the flow: DEV from CAC PROD to CAC DEV, UAT from CAC PROD to CAC UAT, and PROD from CAC UAT to CAC PROD. This works because of some network setup challenges we’ll touch on.”
	•	Visual: Show the architecture diagram. Highlight the three flows (2a/2b for DEV, 1a/1b for UAT, 3a/3b for PROD) and the yellow “Synthetic for” boxes.
	•	Why It Matters: “This helps us catch issues early while keeping things secure and organized.”
2. Adding an Endpoint to Git (3-4 minutes)
	•	What to Say: “First, app teams add endpoints to our sjmrepo in Git. This is the starting point before creating monitors.”
	•	Live Demo:
	◦	Clone the repo: git clone /sjmrepo.git
	◦	Open endpoints.yaml and add: endpoints:
	◦	  - host: dev-app.example.internal
	◦	    path: /api/health
	◦	    namespace: tenant-namespace
	◦	    cluster: cac-dev
	◦	  - host: uat-app.example.internal
	◦	    path: /api/health
	◦	    namespace: tenant-namespace
	◦	    cluster: cac-uat
	◦	  - host: prod-app.example.internal
	◦	    path: /api/health
	◦	    namespace: tenant-namespace
	◦	    cluster: cac-prod
	◦	
	◦	Commit: git add . && git commit -m "Add demo endpoints" && git push
	•	What to Say Next: “This tells SJM where to check. It’s reviewed via PR for safety.”
	•	Visual: Show the Git UI or a diff of endpoints.yaml.
3. Setting Up Ingress Access (4-5 minutes)
	•	What to Say: “Next, we allow SJM to reach these endpoints by whitelisting its IP in each namespace’s ingress. For example, PROD uses CAC-UAT’s IP because of some network security issues in CAC PROD.”
	•	Live Demo (example for CAC DEV):
	◦	Switch context: kubectl config use-context cac-dev
	◦	Edit ingress: kubectl edit ingress -n tenant-namespace
	▪	Add: nginx.ingress.kubernetes.io/whitelist-source-range: "/32"
	◦	For CAC UAT: Use .
	◦	For CAC PROD: Use (since PROD synthetics come from CAC UAT).
	•	What to Say Next: “We had network security group issues in CAC PROD, so running PROD checks from CAC UAT and allowing its subnet fixes that. This keeps everything secure.”
	•	Visual: Show an Ingress YAML diff. Trace the flow on the diagram (e.g., 3a/3b for PROD).
4. Creating Monitors in New Relic (3-4 minutes)
	•	What to Say: “Now, let’s create monitors in New Relic and link them to the right cluster.”
	•	Live Demo:
	◦	Go to one.newrelic.com > Synthetics > Create monitor.
	▪	DEV: Ping https://dev-app.example.internal/api/health, assign to CAC DEV location.
	▪	UAT: Ping https://uat-app.example.internal/api/health, assign to CAC UAT location.
	▪	PROD: Ping https://prod-app.example.internal/api/health, assign to CAC PROD location.
	◦	Set frequency to 5 minutes, save, and enable.
	•	What to Say Next: “These run from the private locations shown in our diagram.”
	•	Visual: Screen share the UI.
5. Checking Results (3-4 minutes)
	•	What to Say: “Finally, let’s see the results. SJM runs the checks and reports back.”
	•	Live Demo:
	◦	Check logs (e.g., kubectl logs -n tenant-namespace on CAC DEV): Look for “Executing monitor for dev-app”.
	◦	In New Relic: Synthetics > Monitor summary.
	▪	Show DEV (CAC DEV), UAT (CAC UAT), and PROD (CAC PROD) statuses.
	•	What to Say Next: “Here’s where we see if everything’s working. [Placeholder: Show dashboard screenshots when available] The PROD check from CAC UAT works because we allowed its subnet.”
	•	Visual: [Placeholder] Insert New Relic dashboard screenshots here. Highlight success rates and response times.
6. Wrap-Up and Q&A (2 minutes)
	•	What to Say: “That’s it! We use Git for endpoints, ingress for security, and SJM for monitoring across clusters. The PROD setup from CAC UAT solves our network issues. Any questions? App teams, start by adding to sjmrepo!”
	•	Handouts: Share the diagram, repo README, and New Relic docs link.

Tips
	•	Practice: Run this in a test env first. Pre-add one endpoint to save time.
	•	Simplify: If live setup lags, use screenshots for ingress or monitor creation.
	•	Engage: Ask, “What endpoints would you monitor?” to involve the team.
This script keeps it straightforward, focusing on the key steps and explaining the PROD-CAC-UAT workaround briefly. Once you share the dashboard screenshots, I’ll update the results section with specific callouts! Let me know if you need adjustments.




SJM runs checks from private locations, ensuring we monitor internal apps without public exposure. Our workflow adds security: App teams add endpoints to our Git sjmrepo first, then we whitelist ingress IPs in the namespace, before creating monitors in New Relic.