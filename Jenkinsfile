#!/usr/bin/env groovy
pipeline {
    agent {
        label '!windows'
    }
    stages {
        stage('Get info git') {
            steps {
                script {
                
              def author_name = sh(script: "git log -n 1 ${env.GIT_COMMIT} --format=%aN", returnStdout: true).trim()
              def committer_name = sh(script: "git log -n 1 ${env.GIT_COMMIT} --format=%cN", returnStdout: true).trim()
              def commit_message = sh(script: "git log -1 --format=%B ${GIT_COMMIT}", returnStdout: true).trim()
              env.COMMIT_NAME  = committer_name  
              env.COMIT_MESSAGE  = commit_message 
              env.AUTHOR_NAME  = author_name 
            
              env.REMOTEDIR="~/Work/koc-megaone-web"
              env.PM2NAME="koc-web"
              env.TARNAME="koc-web"
              env.DOMAIN = "phongnv-koc.mpoint.vn"
                }
            }
        }

        stage('deploy') {
            steps {
                sh "echo deploy ...."
                sshagent (['ssh-private-key']) {
                     sh 'ssh -o StrictHostKeyChecking=no -l root 178.128.122.82 "pwd && cd ${REMOTEDIR} && git pull origin main && yarn && rm -rf .next && yarn build && pm2 reload ${PM2NAME}"'
                   
                }
            }
        } 
    }

      post {
    success {
            sh 'curl -s -X POST https://api.telegram.org/bot1933840335:AAETvo_BwVykDzddqrfV95hZhlU9sk53lWo/sendMessage -d chat_id=-552451392 -d parse_mode="html" -d text="✅ <b>koc megaone web </b> \n<b>Status:</b> Triển khai thành công \n<b>Commit:</b> ${COMIT_MESSAGE}\n<b>Author:</b> ${AUTHOR_NAME}\n<b>Committer:</b> ${COMMIT_NAME}\n<b>Domain:</b><a>https://${DOMAIN}</a>"'
        }
    failure {
           sh 'curl -s -X POST https://api.telegram.org/bot1933840335:AAETvo_BwVykDzddqrfV95hZhlU9sk53lWo/sendMessage -d chat_id=-552451392 -d parse_mode="html" -d text="❌ <b>koc megaone web</b> \n<b>Status:</b> Triển khai thất bại thật rồi \n<b>Commit:</b> ${COMIT_MESSAGE}\n<b>Author:</b> ${AUTHOR_NAME}\n<b>Committer:</b> ${COMMIT_NAME}\n<b>Domain:</b><a>https://${DOMAIN}</a>"'
        }

	}
 
}
