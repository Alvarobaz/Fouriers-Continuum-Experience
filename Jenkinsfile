pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    stages {

        stage('Build Backend') {
            steps {
                dir('Back-End') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean compile'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Front-End') {
                    sh 'npm install --legacy-peer-deps'
                    sh 'npm run build'
                }
            }
        }
    }
}
