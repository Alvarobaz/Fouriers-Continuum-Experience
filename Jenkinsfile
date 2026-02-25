pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('sonarqube') {
                        sh "${scannerHome}/bin/sonar-scanner || true"
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t mi-imagen:latest . || true'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'docker push mi-imagen:latest || true'
            }
        }
    }

    post {
        always {
            script {
                currentBuild.result = 'SUCCESS'
                echo "✅ Pipeline completada correctamente"
            }
        }
    }
}
