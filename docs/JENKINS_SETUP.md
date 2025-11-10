# Jenkins CI/CD Setup Guide for Lotus Platform

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Phase 1: Jenkins Installation](#phase-1-jenkins-installation)
3. [Phase 2: Initial Configuration](#phase-2-initial-configuration)
4. [Phase 3: GitHub Integration](#phase-3-github-integration)
5. [Phase 4: Pipeline Setup](#phase-4-pipeline-setup)
6. [Phase 5: Webhook Configuration](#phase-5-webhook-configuration)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- ✅ Docker Desktop installed and running
- ✅ Git installed
- ✅ GitHub account with repository access
- ✅ Ports 8080 and 50000 available on your machine

---

## Phase 1: Jenkins Installation

### Step 1: Run the Setup Script

**For Windows (PowerShell):**
```powershell
cd C:\Users\Tharindu\Desktop\DEVOPS\lotus-video-platform
.\jenkins-setup.ps1
```

**For Linux/Mac:**
```bash
cd /path/to/lotus-video-platform
chmod +x jenkins-setup.sh
./jenkins-setup.sh
```

### Step 2: Save Your Initial Password

The script will display your Jenkins initial admin password. **Save this password!**

Example output:
```
================================================
🔑 Jenkins Initial Administrator Password:
================================================
a1b2c3d4e5f6g7h8i9j0
================================================
```

### Manual Docker Command (Alternative)

If you prefer to run Docker manually:

```bash
# Create volume
docker volume create jenkins_home

# Run Jenkins container
docker run -d \
  --name jenkins-lotus \
  --restart unless-stopped \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts-jdk11

# Get initial password
docker exec jenkins-lotus cat /var/jenkins_home/secrets/initialAdminPassword
```

---

## Phase 2: Initial Configuration

### Step 1: Access Jenkins

1. Open your browser and navigate to: **http://localhost:8080**

2. You'll see the "Unlock Jenkins" page

### Step 2: Unlock Jenkins

1. Paste the initial admin password you saved earlier
2. Click **Continue**

### Step 3: Install Plugins

1. Select **"Install suggested plugins"**
2. Wait for plugin installation to complete (5-10 minutes)

Suggested plugins include:
- Git plugin
- Pipeline plugin
- Docker plugin
- GitHub Integration plugin
- Credentials Binding plugin

### Step 4: Create Admin User

Fill in the form:
- **Username:** `admin` (or your preferred username)
- **Password:** Choose a strong password
- **Confirm password:** Re-enter password
- **Full name:** Your name
- **Email:** Your email address

Click **Save and Continue**

### Step 5: Jenkins URL

Keep the default: `http://localhost:8080/`

Click **Save and Finish**

### Step 6: Start Using Jenkins

Click **Start using Jenkins**

---

## Phase 3: GitHub Integration

### Step 1: Create GitHub Personal Access Token (PAT)

1. Go to GitHub: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in the form:
   - **Note:** `Jenkins Lotus CI/CD`
   - **Expiration:** Select your preferred duration (90 days recommended)
   - **Select scopes:**
     - ✅ `repo` (Full control of private repositories)
     - ✅ `admin:repo_hook` (Full control of repository hooks)

4. Click **Generate token**
5. **Copy the token immediately** (you won't see it again!)

Example token format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Add GitHub Credentials to Jenkins

1. In Jenkins, go to: **Dashboard** → **Manage Jenkins** → **Credentials**

2. Click on **(global)** under "Stores scoped to Jenkins"

3. Click **Add Credentials** (left sidebar)

4. Fill in the form:
   - **Kind:** `Secret text`
   - **Scope:** `Global`
   - **Secret:** Paste your GitHub PAT
   - **ID:** `github-lotus-pat`
   - **Description:** `GitHub Personal Access Token for Lotus Project`

5. Click **Create**

### Step 3: Install Additional Plugins (if needed)

1. Go to **Manage Jenkins** → **Plugins** → **Available plugins**
2. Search and install:
   - ✅ GitHub Integration Plugin
   - ✅ Docker Pipeline Plugin
   - ✅ Pipeline: Stage View Plugin

3. Click **Install** (no restart required)

---

## Phase 4: Pipeline Setup

### Step 1: Create New Pipeline Job

1. From Jenkins Dashboard, click **New Item**

2. Fill in the form:
   - **Enter an item name:** `lotus-platform-main-pipeline`
   - **Select:** `Pipeline`
   - Click **OK**

### Step 2: Configure Pipeline

#### General Section:
- **Description:** `CI/CD pipeline for Lotus video platform`
- ✅ Check **GitHub project**
- **Project url:** `https://github.com/WTDperera/DevOPs-Project/`

#### Build Triggers:
- ✅ Check **GitHub hook trigger for GITScm polling**

#### Pipeline Section:

**Definition:** `Pipeline script from SCM`

**SCM:** `Git`

**Repository URL:** `https://github.com/WTDperera/DevOPs-Project.git`

**Credentials:** Select `github-lotus-pat`

**Branches to build:**
- **Branch Specifier:** `*/main`

**Script Path:** `Jenkinsfile`

**Lightweight checkout:** ✅ Checked (optional, for performance)

### Step 3: Save Configuration

Click **Save**

---

## Phase 5: Webhook Configuration

### Option A: Using ngrok (For Local Development)

Since Jenkins is running on localhost, GitHub can't reach it. Use ngrok to create a public URL:

#### Step 1: Install ngrok
```bash
# Download from: https://ngrok.com/download
# Or install via package manager
```

#### Step 2: Start ngrok tunnel
```bash
ngrok http 8080
```

This will display:
```
Forwarding  https://xxxx-xxxx-xxxx.ngrok-free.app -> http://localhost:8080
```

**Copy the https URL**

#### Step 3: Configure GitHub Webhook

1. Go to your GitHub repository: https://github.com/WTDperera/DevOPs-Project

2. Navigate to **Settings** → **Webhooks** → **Add webhook**

3. Fill in the form:
   - **Payload URL:** `https://your-ngrok-url.ngrok-free.app/github-webhook/`
     - Example: `https://a1b2-c3d4-e5f6.ngrok-free.app/github-webhook/`
     - ⚠️ **Don't forget the trailing slash `/`**
   
   - **Content type:** `application/json`
   
   - **Secret:** Leave empty (or add if you want extra security)
   
   - **Which events would you like to trigger this webhook?**
     - ○ Select **"Just the push event"**
   
   - ✅ **Active**

4. Click **Add webhook**

5. GitHub will send a test ping. Check for a green checkmark ✅

### Option B: Using Public Server (Production)

If Jenkins is on a public server:

**Payload URL:** `http://your-server-ip:8080/github-webhook/`

---

## Phase 6: Testing the Pipeline

### Step 1: Manual Trigger (First Run)

1. Go to your pipeline: **Dashboard** → **lotus-platform-main-pipeline**

2. Click **Build Now** (left sidebar)

3. Watch the build in **Build History**

4. Click on **#1** to see build details

5. Click **Console Output** to see live logs

### Step 2: Automatic Trigger (Push to GitHub)

1. Make a small change to your project:

```bash
cd lotus-video-platform

# Make a small change
echo "# Jenkins CI/CD Test" >> test.txt

# Commit and push
git add test.txt
git commit -m "test: Trigger Jenkins build"
git push origin main
```

2. Watch Jenkins automatically start a new build!

3. Check the **Stage View** to see each stage's progress

---

## Pipeline Stages Explained

Your Jenkinsfile includes these stages:

1. **Checkout Code** ✅
   - Pulls latest code from GitHub
   - Displays commit information

2. **Environment Check** 🔍
   - Verifies Docker installation
   - Cleans up old containers

3. **Build Docker Images** 🐳
   - Builds backend, frontend, and nginx images
   - Uses docker-compose.yml

4. **Run Backend Tests** 🧪
   - Starts MongoDB
   - Runs npm tests
   - Cleans up test containers

5. **Run Frontend Tests** 🧪
   - Validates frontend build
   - Checks for build errors

6. **Integration Tests** 🔗
   - Starts all services
   - Tests API health endpoints
   - Verifies container health

7. **Security Scan** 🔒
   - Runs npm audit on dependencies
   - Checks for vulnerabilities

8. **Tag & Push Images** 🏷️
   - Tags images with build number
   - Ready for Docker registry push

9. **Deploy to Staging** 🚀
   - Restarts services with new images
   - Verifies deployment

---

## Monitoring Builds

### View Build Status

1. **Dashboard View:** See all builds at a glance
2. **Blue Ocean:** Modern UI (`http://localhost:8080/blue`)
3. **Stage View:** See each stage's duration and status

### Build Notifications

Configure email/Slack notifications:

1. **Manage Jenkins** → **Configure System**
2. Scroll to **E-mail Notification** or **Slack Notifications**
3. Configure your SMTP/Slack settings

---

## Useful Jenkins Commands

### Check Jenkins Logs
```bash
docker logs -f jenkins-lotus
```

### Restart Jenkins
```bash
docker restart jenkins-lotus
```

### Stop Jenkins
```bash
docker stop jenkins-lotus
```

### Start Jenkins
```bash
docker start jenkins-lotus
```

### Remove Jenkins (⚠️ Deletes data!)
```bash
docker stop jenkins-lotus
docker rm jenkins-lotus
docker volume rm jenkins_home
```

### Backup Jenkins Data
```bash
docker run --rm \
  -v jenkins_home:/source \
  -v $(pwd):/backup \
  alpine tar czf /backup/jenkins-backup-$(date +%Y%m%d).tar.gz -C /source .
```

### Restore Jenkins Data
```bash
docker run --rm \
  -v jenkins_home:/target \
  -v $(pwd):/backup \
  alpine tar xzf /backup/jenkins-backup-YYYYMMDD.tar.gz -C /target
```

---

## Troubleshooting

### Issue: Cannot access Jenkins at localhost:8080

**Solution:**
```bash
# Check if container is running
docker ps | grep jenkins-lotus

# Check logs
docker logs jenkins-lotus

# Ensure port is not in use
netstat -ano | findstr :8080  # Windows
lsof -i :8080                  # Linux/Mac
```

### Issue: GitHub webhook not triggering builds

**Checklist:**
- ✅ Webhook URL is correct with `/github-webhook/`
- ✅ ngrok tunnel is active (if using localhost)
- ✅ "GitHub hook trigger" is enabled in job
- ✅ GitHub webhook shows recent delivery with 200 response

**Debug:**
1. Check webhook deliveries in GitHub Settings
2. Look for "Recent Deliveries" and expand them
3. Check response code (should be 200)

### Issue: Docker permission denied in Jenkins

**Solution:**
```bash
# Give Jenkins access to Docker socket
docker exec -u root jenkins-lotus chmod 666 /var/run/docker.sock
```

### Issue: Build fails at Docker build stage

**Solution:**
```bash
# Check if docker-compose files exist
ls -la docker-compose*.yml

# Manually test docker-compose build
docker-compose -f docker-compose.yml build
```

### Issue: Tests fail in pipeline

**Debug:**
1. Check console output for specific error
2. Run tests locally: `npm test`
3. Check if MongoDB is accessible
4. Verify environment variables

---

## Best Practices

### Security
- 🔒 Use credentials manager for all secrets
- 🔒 Never commit tokens/passwords
- 🔒 Enable CSRF protection
- 🔒 Use HTTPS in production

### Performance
- ⚡ Use Docker layer caching
- ⚡ Clean up old builds (already configured)
- ⚡ Run tests in parallel when possible

### Reliability
- 📊 Set build timeout (already set to 30 min)
- 📊 Archive build artifacts
- 📊 Send notifications on failures
- 📊 Keep build history (last 10 builds)

---

## Next Steps

After successful setup:

1. ✅ Configure email notifications
2. ✅ Set up Slack integration
3. ✅ Add deployment to production stage
4. ✅ Configure Docker registry push
5. ✅ Add code quality checks (SonarQube)
6. ✅ Set up automated security scanning
7. ✅ Create staging/production branches

---

## Support

For issues:
- Check Jenkins logs: `docker logs jenkins-lotus`
- Review console output of failed builds
- Check GitHub webhook deliveries
- Verify Docker is running: `docker ps`

---

## Summary

You now have:
- ✅ Jenkins running in Docker
- ✅ GitHub integration with webhooks
- ✅ Automated CI/CD pipeline
- ✅ Multi-stage build process
- ✅ Automated testing
- ✅ Security scanning
- ✅ Automatic deployment

**Jenkins Dashboard:** http://localhost:8080
**Your Application:** http://localhost (after build)

Happy CI/CD! 🚀
