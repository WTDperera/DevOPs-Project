# Jenkins CI/CD - Quick Reference

## 🚀 Quick Start Commands

### Start Jenkins
```powershell
# Windows
.\jenkins-setup.ps1

# Linux/Mac
./jenkins-setup.sh
```

### Get Initial Password
```bash
docker exec jenkins-lotus cat /var/jenkins_home/secrets/initialAdminPassword
```

### View Jenkins Logs
```bash
docker logs -f jenkins-lotus
```

## 📋 Jenkins URLs

- **Dashboard:** http://localhost:8080
- **Blue Ocean:** http://localhost:8080/blue
- **API:** http://localhost:8080/api/

## 🔑 GitHub Setup Checklist

- [ ] Create GitHub Personal Access Token
  - Scopes: `repo`, `admin:repo_hook`
  - Save token securely
  
- [ ] Add credentials in Jenkins
  - ID: `github-lotus-pat`
  - Type: Secret text

- [ ] Configure webhook in GitHub
  - URL: `https://your-ngrok-url/github-webhook/`
  - Content type: `application/json`
  - Events: Push events

## 🔧 Common Jenkins Commands

```bash
# Start/Stop/Restart Jenkins
docker start jenkins-lotus
docker stop jenkins-lotus
docker restart jenkins-lotus

# View container status
docker ps | grep jenkins

# Execute command in Jenkins container
docker exec jenkins-lotus [command]

# Backup Jenkins data
docker run --rm -v jenkins_home:/source -v $(pwd):/backup alpine tar czf /backup/jenkins-backup.tar.gz -C /source .

# Restore Jenkins data
docker run --rm -v jenkins_home:/target -v $(pwd):/backup alpine tar xzf /backup/jenkins-backup.tar.gz -C /target
```

## 🐛 Quick Troubleshooting

### Jenkins won't start
```bash
docker logs jenkins-lotus
docker restart jenkins-lotus
```

### Port 8080 in use
```powershell
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Webhook not working
1. Check ngrok is running: `ngrok http 8080`
2. Verify webhook URL ends with `/github-webhook/`
3. Check GitHub webhook deliveries
4. Ensure "GitHub hook trigger" is enabled in Jenkins job

### Docker permission denied
```bash
docker exec -u root jenkins-lotus chmod 666 /var/run/docker.sock
docker restart jenkins-lotus
```

## 📊 Pipeline Stages Overview

```
1. Checkout Code          → Pull from GitHub
2. Environment Check      → Verify Docker
3. Build Docker Images    → Build all containers
4. Run Backend Tests      → Test Node.js API
5. Run Frontend Tests     → Validate React build
6. Integration Tests      → Test full stack
7. Security Scan          → npm audit
8. Tag & Push Images      → Tag with build number
9. Deploy to Staging      → Update containers
```

## 📝 Useful Jenkins Groovy Script Console Commands

Access at: **Manage Jenkins** → **Script Console**

```groovy
// List all jobs
Jenkins.instance.getAllItems(Job.class).each { job ->
    println job.fullName
}

// Get Jenkins version
println Jenkins.instance.getVersion()

// List installed plugins
Jenkins.instance.pluginManager.plugins.each {
    println "${it.getShortName()}: ${it.getVersion()}"
}
```

## 🔐 Security Best Practices

- ✅ Change default admin password immediately
- ✅ Enable "Prevent Cross Site Request Forgery exploits"
- ✅ Use credentials plugin for all secrets
- ✅ Limit build permissions
- ✅ Enable audit logging
- ✅ Keep Jenkins and plugins updated
- ✅ Use HTTPS in production (via reverse proxy)

## 📱 Monitoring & Notifications

### Email Notifications
1. **Manage Jenkins** → **Configure System**
2. Scroll to **E-mail Notification**
3. Configure SMTP server
4. Add to Jenkinsfile:
```groovy
post {
    failure {
        emailext (
            to: 'team@example.com',
            subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: "Check console output at ${env.BUILD_URL}"
        )
    }
}
```

### Slack Notifications
1. Install Slack Notification plugin
2. Get Slack webhook URL
3. **Manage Jenkins** → **Configure System** → **Slack**
4. Add to Jenkinsfile:
```groovy
post {
    success {
        slackSend color: 'good', message: "Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    }
}
```

## 🎯 Next Steps After Setup

1. [ ] Configure email/Slack notifications
2. [ ] Set up Docker registry push
3. [ ] Add SonarQube code quality checks
4. [ ] Configure production deployment
5. [ ] Set up backup automation
6. [ ] Create develop/staging branches
7. [ ] Add performance testing stage
8. [ ] Configure automated rollback

## 📚 Additional Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Docker Plugin](https://plugins.jenkins.io/docker-plugin/)
- [GitHub Integration](https://plugins.jenkins.io/github/)

## 💡 Pro Tips

- Use Blue Ocean UI for better visualization
- Enable "Discard old builds" to save space
- Use shared libraries for reusable pipeline code
- Tag Docker images with Git commit SHA
- Run tests in parallel to speed up builds
- Use Jenkins agents for distributed builds
- Monitor disk space (Jenkins can fill up fast!)
- Regular backup of jenkins_home volume

---

**Quick Access Links:**
- Jenkins: http://localhost:8080
- Application: http://localhost
- GitHub Repo: https://github.com/WTDperera/DevOPs-Project
