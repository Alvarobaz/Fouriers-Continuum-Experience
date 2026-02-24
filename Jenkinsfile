pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
        nodejs 'node10'        // Node 10 para legacy
    }

    stages {

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build Legacy (Node 10)') {
            steps {
                script {
                    echo "Usando Node 10 para build legacy"
                    dir('Front-End') {
                        sh 'node -v'
                        sh 'npm ci'
                        sh 'npm run build:legacy'
                    }
                }
            }
        }

        stage('Build Modern (Node 18)') {
            tools {
                nodejs 'node18'      // Node 18 para modern
            }
            steps {
                script {
                    echo "Usando Node 18 para build moderno"
                    dir('Front-End') {
                        sh 'node -v'
                        sh 'npm ci'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            tools {
                nodejs 'node18'      // Node 18 para Sonar
            }
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('sonarqube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline finalizado correctamente"
        }
        failure {
            echo "❌ Algo falló en la pipeline"
        }
    }
}
