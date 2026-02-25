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
                        def status = sh(
                            script: "${scannerHome}/bin/sonar-scanner",
                            returnStatus: true
                        )
                        echo "Sonar exit code: ${status}"
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t mi-imagen:latest .'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'docker push mi-imagen:latest'
            }
        }
    }
}
