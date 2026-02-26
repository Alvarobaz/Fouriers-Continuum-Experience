pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
        nodejs 'node16'
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

        stage('Build Frontend (Node 16)') {
            steps {
                dir('Front-End') {
                    sh 'node -v'
                    sh 'npm ci --legacy-peer-deps'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend (Maven)') {
            steps {
                dir('Back-End') {   // ⚠️ Cambia el nombre si tu carpeta es diferente
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completada correctamente"
        }
        failure {
            echo "❌ Algo falló en la pipeline"
        }
    }
}
